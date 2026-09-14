export default function ReferralProgress({ stats }: { stats: any }) {
  const points = stats.totalPoints || 0;
  const progressToNext = points % 10;
  const nextMilestone = points + (10 - progressToNext);
  const percentComplete = (progressToNext / 10) * 100;
  const newlyEarned = progressToNext === 0 && points > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Your Progress</h3>
        <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {points} Total Points
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="text-center bg-gray-50 rounded-lg px-4 py-3 flex-1 border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{stats.freeMonthsEarned}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Earned</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg px-4 py-3 flex-1 border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{stats.freeMonthsUsed}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Used</div>
          </div>
          <div className="text-center bg-accent/5 rounded-lg px-4 py-3 flex-1 border border-accent/20">
            <div className="text-2xl font-bold text-accent">{stats.freeMonthsEarned - stats.freeMonthsUsed}</div>
            <div className="text-xs text-accent uppercase tracking-wide mt-1">Available</div>
          </div>
        </div>

        {newlyEarned && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-xl">🎉</div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-green-800">Congratulations!</h3>
                <div className="mt-1 text-sm text-green-700">
                  You've unlocked 1 FREE month of GetTambola. Our team will contact you within 24 hours on WhatsApp.
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to next free month</span>
            <span className="text-sm font-medium text-gray-900">{progressToNext} / 10 points</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-accent h-3 rounded-full transition-all duration-500" 
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <p className="mt-3 text-xs text-gray-500 text-center">
            Refer {10 - progressToNext} more monthly customers (or 1 yearly) to unlock your next FREE month!
          </p>
        </div>
      </div>
    </div>
  );
}
