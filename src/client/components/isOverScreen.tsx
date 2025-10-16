// IsOverScreen.tsx
type Props = {
  visible: boolean;
  score: number;
  onRestart?: () => void;
};

export default function IsOverScreen({ visible, score, onRestart }: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 cursor-pointer"
      onClick={onRestart}
    >
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2">Time’s Up!</h1>
        <p className="text-lg">Score: {score}</p>
        <p className="text-lg">Click to restart</p>
      </div>
    </div>
  );
}
