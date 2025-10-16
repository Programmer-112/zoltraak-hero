import { useEffect, useState } from 'react';

export function Leaderboard() {
  const [scores, setScores] = useState<{ userId: string; score: number }[]>([]);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch('/api/leaderboard'); // Devvit server endpoint
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error(err);
      }
    }
    void fetchScores();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
      <ul>
        {scores.map((entry, i) => (
          <li key={i}>
            {entry.userId}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
