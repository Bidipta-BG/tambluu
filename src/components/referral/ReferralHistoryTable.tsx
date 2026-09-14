export default function ReferralHistoryTable({ referrals }: { referrals: any[] }) {
  if (!referrals || referrals.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <span className="text-4xl mb-3 block">🚀</span>
        <h4 className="text-base font-medium text-gray-900 mb-1">No referrals yet</h4>
        <p className="text-sm text-gray-500">Share your link to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Plan</th>
            <th scope="col" className="px-6 py-3">Amount</th>
            <th scope="col" className="px-6 py-3">Points</th>
            <th scope="col" className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((ref, idx) => (
            <tr key={idx} className="bg-white border-b border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {ref.customerFirstName}
              </td>
              <td className="px-6 py-4">
                {new Date(ref.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 capitalize">
                {ref.plan}
              </td>
              <td className="px-6 py-4">
                ₹{ref.amountPaid.toLocaleString()}
              </td>
              <td className="px-6 py-4 font-medium text-accent">
                +{ref.pointsEarned}
              </td>
              <td className="px-6 py-4">
                {ref.status === "successful" && (
                  <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Successful
                  </span>
                )}
                {ref.status === "pending" && (
                  <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                    Pending
                  </span>
                )}
                {ref.status === "failed" && (
                  <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    Failed
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
