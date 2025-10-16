import { ArrowKey } from '../../shared/types/arrows';

const ArrowKeys: ArrowKey[] = ['up', 'down', 'left', 'right'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generates a random task array of ArrowKeys
export function getNewTask(min: number, max: number): ArrowKey[] {
  const elemCount = randomInt(min, max);
  const result: ArrowKey[] = new Array(elemCount);

  for (let index = 0; index < elemCount; index++) {
    result[index] = ArrowKeys[randomInt(0, ArrowKeys.length - 1)]!;
  }

  return result;
}
