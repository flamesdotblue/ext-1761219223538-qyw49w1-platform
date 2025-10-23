import { useMemo, useState } from 'react';
import Hero from './components/Hero';
import RoomList from './components/RoomList';
import RaceRoom from './components/RaceRoom';

const SAMPLE_ROOMS = [
  {
    id: 'room-quick-1',
    name: 'Quick Sprint',
    difficulty: 'Easy',
    tags: ['casual', 'warmup'],
    users: ['🚗','🛵','🚲','🛼'],
  },
  {
    id: 'room-city-2',
    name: 'City Circuit',
    difficulty: 'Medium',
    tags: ['focus', 'balanced'],
    users: ['🏎️','🚕','🚙'],
  },
  {
    id: 'room-pro-3',
    name: 'Pro Grand Prix',
    difficulty: 'Hard',
    tags: ['competitive', 'fast'],
    users: ['🏎️','🚓','🚒','🚐','🚌'],
  },
];

export default function App() {
  const [activeRoom, setActiveRoom] = useState(null);

  const rooms = useMemo(() => SAMPLE_ROOMS, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 grid place-items-center text-xl">⚡</div>
            <div>
              <h1 className="text-lg font-semibold">TypeRacer Live</h1>
              <p className="text-xs text-slate-400">Join a room and race in real-time</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-300 text-sm">
            <span className="px-2 py-1 rounded-md bg-white/5">Guest</span>
            <span className="px-2 py-1 rounded-md bg-white/5">🧑‍💻 You</span>
          </div>
        </div>
      </header>

      {!activeRoom && (
        <>
          <section className="relative h-[380px] w-full">
            <Hero />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-6xl mx-auto w-full px-4 pb-8">
                <div className="backdrop-blur bg-slate-900/40 border border-white/10 rounded-xl p-4 sm:p-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold">Join a live racing room</h2>
                  <p className="text-slate-300 mt-1">Pick a difficulty, see who\'s queued, and start typing!</p>
                </div>
              </div>
            </div>
          </section>

          <main className="max-w-6xl mx-auto px-4 py-8">
            <RoomList rooms={rooms} onJoin={(room) => setActiveRoom(room)} />
          </main>
        </>
      )}

      {activeRoom && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          <RaceRoom room={activeRoom} onExit={() => setActiveRoom(null)} />
        </main>
      )}

      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} TypeRacer Live • Mock multiplayer demo</span>
          <span>Made with React + Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
