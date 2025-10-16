export default function TimerBar({ progress }: { progress: number }) {
  return (
    <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
      <div className="h-full bg-green-400 transition-all" style={{ width: `${progress}%` }} />
    </div>
  );
}
