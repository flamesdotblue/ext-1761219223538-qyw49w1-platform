import { useEffect, useMemo, useRef, useState } from 'react';
import { TimerReset, ArrowLeft, Flag } from 'lucide-react';

const DIFF_TEXT = {
  Easy: 'Speed boosts help drivers fly past the city lights. Keep your hands relaxed and let the rhythm guide your typing.',
  Medium: 'Precision matters as engines hum in harmony. Maintain accuracy while the track curves through neon reflections.',
  Hard: 'Under the roaring floodlights, every millisecond counts. Your focus becomes the throttle and the keyboard your track.'
};

const YOU = { id: 'you', name: 'You', emoji: '🧑‍💻' };

function wordsPerMinute(chars, ms) {
  if (!ms) return 0;
  const minutes = ms / 60000;
  return Math.max(0, Math.round((chars / 5) / minutes));
}

export default function RaceRoom({ room, onExit }) {
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef(null);
  const botsRef = useRef([]);
  const raceOverRef = useRef(false);

  const text = useMemo(() => DIFF_TEXT[room?.difficulty] || DIFF_TEXT.Medium, [room]);
  const target = text;

  const competitors = useMemo(() => {
    const bots = (room?.users || []).map((e, i) => ({ id: 'bot-'+i, emoji: e, name: 'Racer '+(i+1) }));
    return [YOU, ...bots];
  }, [room]);

  useEffect(() => {
    setCountdown(3);
    setStarted(false);
    setFinished(false);
    setInput('');
    setStartTime(null);
    setElapsed(0);
    raceOverRef.current = false;

    const cd = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(cd);
          setStarted(true);
          setStartTime(Date.now());
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(cd);
  }, [room?.id]);

  useEffect(() => {
    if (!started) return;

    // Initialize bots with a speed profile based on difficulty
    const diff = room?.difficulty || 'Medium';
    const ranges = {
      Easy: [30, 45],
      Medium: [45, 70],
      Hard: [65, 100],
    };
    const [min, max] = ranges[diff] || [40, 60];

    botsRef.current = competitors.filter(c => c.id !== 'you').map((b) => ({
      ...b,
      progress: 0, // 0..1
      wpm: Math.round(min + Math.random() * (max - min)),
      variance: (Math.random() * 0.4) + 0.8,
      done: false,
    }));

    const startedAt = Date.now();

    tickRef.current = setInterval(() => {
      const now = Date.now();
      setElapsed(now - startedAt);

      // advance bots
      botsRef.current = botsRef.current.map((bot) => {
        if (bot.done) return bot;
        const minutes = (now - startedAt) / 60000;
        const estChars = bot.wpm * 5 * minutes * bot.variance;
        const progress = Math.min(1, estChars / target.length);
        return { ...bot, progress, done: progress >= 1 };
      });

      // end race if all finished
      const allBotsDone = botsRef.current.every(b => b.done);
      const youDone = input.length >= target.length;
      if (!raceOverRef.current && (allBotsDone && youDone)) {
        raceOverRef.current = true;
        clearInterval(tickRef.current);
      }
    }, 120);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [started, competitors, target.length, room?.difficulty, input.length]);

  useEffect(() => {
    if (!started) return;
    if (input.length >= target.length && !finished) {
      setFinished(true);
    }
  }, [input, started, target.length, finished]);

  const accuracy = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) correct++;
    }
    return input.length ? Math.round((correct / input.length) * 100) : 100;
  }, [input, target]);

  const youProgress = Math.min(1, input.length / target.length);
  const youWpm = started && startTime ? wordsPerMinute(input.length, elapsed || (Date.now() - startTime)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to rooms
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Room: {room.name}</span>
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Difficulty: {room.difficulty}</span>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        {!started && (
          <div className="text-center py-10">
            <div className="text-6xl font-bold tracking-tighter">{countdown}</div>
            <p className="text-slate-400 mt-2">Get ready to race</p>
          </div>
        )}

        {started && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">⏱️ {Math.floor((elapsed/1000))}s</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">🏁 {Math.round(youProgress*100)}%</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">⚙️ {accuracy}% acc</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">🚀 {youWpm} WPM</span>
            </div>

            <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
              <p className="text-slate-300 leading-relaxed select-none">
                {target.split('').map((ch, i) => {
                  const typed = input[i];
                  const state = typed == null ? 'pending' : typed === ch ? 'correct' : 'wrong';
                  const cls = state === 'correct' ? 'text-emerald-300' : state === 'wrong' ? 'text-rose-300 bg-rose-500/10 rounded' : 'text-slate-400';
                  return <span key={i} className={cls}>{ch}</span>;
                })}
              </p>
            </div>

            <input
              autoFocus
              disabled={finished}
              className="w-full rounded-md bg-slate-800 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the text above as fast as you can..."
            />

            <div className="space-y-2">
              {[YOU, ...botsRef.current].map((racer, idx) => {
                const progress = racer.id === 'you' ? youProgress : (racer.progress ?? 0);
                return (
                  <div key={racer.id} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/10 grid place-items-center border border-white/10 text-lg">{racer.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{racer.name}</span>
                        <span>{Math.round(progress*100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${racer.id==='you' ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500' : 'bg-white/40'}`} style={{ width: `${Math.min(100, progress*100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {finished && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-emerald-300 font-medium"><Flag className="h-4 w-4"/> Finished!</div>
                <div className="text-sm text-emerald-200 mt-1">WPM {youWpm} • Accuracy {accuracy}% • Time {Math.floor((elapsed/1000))}s</div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"><TimerReset className="h-4 w-4"/> Restart App</button>
                  <button onClick={onExit} className="px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">Leave Room</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
