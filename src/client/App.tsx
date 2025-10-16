import { memo, useEffect, useRef, useState } from 'react';
import TimerBar from './components/timerBar';
import { useTimer } from './hooks/useTimer';
import IsOverScreen from './components/isOverScreen';
import { ArrowKey } from '../shared/types/arrows';
import { getNewTask } from './utils/taskGenerator';
import LoadingScreen from './components/loadingScreen';

export function App() {
  const minTaskCount = 3;
  const startingMaxCount = 5;
  const maxTaskCount = 20;
  const mainAnimationDuration = 500; //ms
  const loadTime = 2000; //ms
  const buttonClickSoundEffect = useRef(new Audio('/button-click.mp3')).current;
  const beamSoundEffect = useRef(new Audio('/magic-spell.mp3')).current;
  const bgm = useRef(new Audio('/background.mp3')).current;

  const currMaxTaskCount = useRef<number>(startingMaxCount);
  const [active, setActive] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [task, setTask] = useState<ArrowKey[]>(getNewTask(minTaskCount, startingMaxCount));
  const [score, setScore] = useState<number>(0);
  const { progress, isTimedOut, resetTimer } = useTimer(7000);
  const [currIndex, setCurrIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstGame, setIsFirstGame] = useState<boolean>(true);

  const handleGameStart = () => {
    if (isFirstGame) {
      setIsFirstGame(false);
      bgm.loop = true;
      bgm.volume = 0.3;
      bgm.play().catch((err) => console.warn('Autoplay blocked:', err));
    }
    resetTimer();
    setTask(getNewTask(minTaskCount, startingMaxCount));
    setScore(0);
    setCurrIndex(0);
  };

  const playSound = async (sound: HTMLAudioElement) => {
    sound.currentTime = 0;
    await sound.play();
  };

  const handlePress = async (dir: ArrowKey) => {
    //prevent interaction if game over, resume after game restart
    if (isTimedOut) return;
    setActive(dir);
    setIsCorrect(null);
    await playSound(buttonClickSoundEffect);

    if (task[currIndex] == dir) {
      setIsCorrect(true);

      //If level is finished
      if (currIndex == task.length - 1) {
        //play animation
        setIsAnimating(false);
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setTimeout(() => {
            setIsAnimating(false);
          }, mainAnimationDuration);
        });
        //play sound effect
        await playSound(beamSoundEffect);
        //update difficulty
        if (currMaxTaskCount.current < maxTaskCount) {
          currMaxTaskCount.current = currMaxTaskCount.current + 1;
        }
        //complete level
        setTask(getNewTask(minTaskCount, currMaxTaskCount.current));
        setCurrIndex(0);
        setScore(score + 100);

        //reset timer
        resetTimer();
      } else {
        setCurrIndex(currIndex + 1);
      }
    } else {
      requestAnimationFrame(() => setIsCorrect(false));
      //reset level progress
      setCurrIndex(0);
    }
    setTimeout(() => setActive(null), 200);
  };

  const arrowMap: Record<ArrowKey, string> = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
  };

  const baseArrowStyle =
    'flex items-center justify-center w-16 h-16 rounded-xl text-2xl font-bold transition-colors duration-150 bg-gray-800/50';

  //Inject keyboard input for desktop
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          await handlePress('left');
          break;
        case 'ArrowUp':
          await handlePress('up');
          break;
        case 'ArrowDown':
          await handlePress('down');
          break;
        case 'ArrowRight':
          await handlePress('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  //load screen
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, loadTime);
  });

  useEffect(() => {
    [buttonClickSoundEffect, beamSoundEffect, bgm].forEach((a) => {
      a.preload = 'auto';
    });
  });

  const ArrowButton = memo(
    ({
      dir,
      onClick,
      active,
    }: {
      dir: ArrowKey;
      onClick: (dir: ArrowKey) => Promise<void>;
      active: string | null;
    }) => {
      const getClass = (dir: string) =>
        `${baseArrowStyle} ${active === dir ? 'bg-white text-black' : 'bg-gray-400 text-black'}`;

      return (
        <button className={getClass(dir)} onClick={() => onClick(dir)}>
          {arrowMap[dir]}
        </button>
      );
    }
  );

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="relative w-screen h-screen">
          {/* Background image */}
          <div className="absolute left-1/2 -translate-x-1/2 bg-center bg-cover bg-no-repeat top-bg" />

          {/* Content on top */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full py-8">
            {/* Timer & Score */}
            <div className="flex flex-col items-center">
              <TimerBar progress={progress} />
              <div
                className="mt-2 flex flex-col items-center bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg"
                style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
              >
                <span className="text-2xl font-bold transition-transform duration-200 transform scale-105">
                  {score}
                </span>
              </div>
            </div>

            {/* Character animations */}
            <div className="flex justify-center items-center">
              <span className={`element ${isAnimating ? 'animate' : ''}`}></span>
              <span className={`beam ${isAnimating ? 'animate-beam' : ''}`}></span>
              <span className={`slime ${isAnimating ? 'animate-slime' : ''}`}></span>
            </div>

            {/* Main Arrow Display */}
            <div className="w-full flex items-center justify-center">
              <div className="w-4/5 max-w-[300px] flex justify-start gap-3">
                {/* Current Arrow */}
                <div
                  className={`text-white ${baseArrowStyle} ${
                    isCorrect === false ? 'shake bg-red-500/50' : ''
                  }`}
                >
                  <span>{arrowMap[task[currIndex]!]}</span>
                </div>

                {/* Remaining Arrows */}
                {task.slice(currIndex + 1, currIndex + 4).map((dir, idx) => (
                  <div key={idx} className={baseArrowStyle}>
                    {arrowMap[dir]}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <ArrowButton dir="left" onClick={handlePress} active={active} />
              <ArrowButton dir="up" onClick={handlePress} active={active} />
              <ArrowButton dir="down" onClick={handlePress} active={active} />
              <ArrowButton dir="right" onClick={handlePress} active={active} />
            </div>

            {/* Overlay */}
            <IsOverScreen
              score={score}
              visible={isTimedOut || isFirstGame}
              onRestart={handleGameStart}
            />
          </div>
        </div>
      )}
    </>
  );
}
