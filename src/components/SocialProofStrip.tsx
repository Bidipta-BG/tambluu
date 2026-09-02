interface LiveGame {
  label: string;
  url: string;
}

interface SocialProofStripProps {
  games: LiveGame[];
}

export default function SocialProofStrip({ games }: SocialProofStripProps) {
  return (
    <section className="bg-dark-bg border-t border-white/5 border-b border-white/5 py-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="text-3xl font-bold text-white leading-none">100+</p>
              <p className="text-sm text-gray-400 mt-0.5">Organizers Already Live</p>
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <span className="text-3xl">🎟️</span>
            <div>
              <p className="text-3xl font-bold text-white leading-none">500+</p>
              <p className="text-sm text-gray-400 mt-0.5">Games Played So Far</p>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold tracking-widest text-accent uppercase">
            See It Live
          </span>
          <h3 className="mt-1 text-lg font-bold text-white">
            Real games running right now
          </h3>
        </div>

        {/* Live game cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {games.map((game) => (
            <a
              key={game.url}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-accent/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-2xl">
                🎮
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {game.label}
                </p>
                <p className="text-xs text-gray-400 truncate">{game.url}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Pulsing green dot */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-bold text-green-400 uppercase tracking-wide">
                  Live
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
