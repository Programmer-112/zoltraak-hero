import { redis } from '@devvit/web/server';

const LEADERBOARD_KEY = 'game:leaderboard';

export async function submitScore(userId: string, score: number) {
  await redis.zAdd(LEADERBOARD_KEY, { score, member: userId });
}

export async function getTopScores(limit = 10) {
  const scores = await redis.zRange(LEADERBOARD_KEY, 0, limit - 1);
  return scores;
}
