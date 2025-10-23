import { useMemo, useState } from 'react';
import { Rocket } from 'lucide-react';
import AvatarCluster from './AvatarCluster';

const difficultyColor = (d) => {
  switch (d) {
    case 'Easy':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'Medium':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'Hard':
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
};

export default function RoomList({ rooms = [], onJoin }) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return rooms;
    return rooms.filter((r) => r.difficulty === filter);
  }, [rooms, filter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Open Rooms</h3>
          <p className="text-slate-400 text-sm">Select a room to preview players and tags</p>
        </div>
        <div className="flex items-center gap-2">
          {['All','Easy','Medium','Hard'].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1.5 rounded-md border text-sm transition ${filter===d ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >{d}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => (
          <button
            key={room.id}
            onClick={() => onJoin?.(room)}
            className="group text-left rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 transition p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-cyan-500/20 grid place-items-center text-cyan-300">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{room.name}</div>
                  <div className="text-xs text-slate-400">{room.users.length} waiting</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-md border text-xs ${difficultyColor(room.difficulty)}`}>{room.difficulty}</span>
            </div>

            <div className="flex items-center justify-between">
              <AvatarCluster emojis={room.users} size="sm" />
              <div className="flex gap-1">
                {room.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">#{t}</span>
                ))}
              </div>
            </div>

            <div className="mt-1 text-xs text-slate-400">Click to join room</div>
          </button>
        ))}
      </div>
    </div>
  );
}
