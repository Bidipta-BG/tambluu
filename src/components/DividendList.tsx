"use client";

import { useState } from "react";

const generateTicket = (markedNumbers: number[] | "ALL", layoutIndex: number = 0) => {
  const layouts = [
    [
      [null, 2, null, 7, 15, null, 23, null, 30],
      [38, null, 42, null, 51, 57, null, 64, null],
      [71, null, null, null, 78, 82, 86, null, 90],
    ],
    [
      [null, 1, null, 9, 18, null, 24, null, 33],
      [39, null, 47, null, 52, 59, null, 66, null],
      [72, null, null, null, 80, 83, 88, null, 89],
    ],
    [
      [null, 4, null, 10, 19, null, 28, null, 34],
      [41, null, 49, null, 53, 61, null, 67, null],
      [73, null, null, null, 79, 84, 87, null, 90],
    ],
    [
      [null, 6, null, 11, 21, null, 29, null, 35],
      [43, null, 50, null, 54, 62, null, 68, null],
      [74, null, null, null, 81, 85, null, null, 89], 
    ]
  ];

  const baseLayout = layouts[layoutIndex % layouts.length];
  
  return baseLayout.map((row) =>
    row.map((val) => {
      let isMarked = false;
      if (val !== null) {
        if (markedNumbers === "ALL") isMarked = true;
        else if (markedNumbers.includes(val)) isMarked = true;
      }
      return { value: val, marked: isMarked };
    })
  );
};

const DIVIDENDS_DATA = [
  {
    id: "Top Line",
    name: "Top Line",
    description: "The first ticket which has full marking in first row is considered as a top line winner.",
    tickets: [generateTicket([2, 7, 15, 23, 30])]
  },
  {
    id: "Middle Line",
    name: "Middle Line",
    description: "The first ticket which has full marking in second row is considered as a middle line winner.",
    tickets: [generateTicket([38, 42, 51, 57, 64])]
  },
  {
    id: "Bottom Line",
    name: "Bottom Line",
    description: "The first ticket which has full marking in third row is considered as a bottom line winner.",
    tickets: [generateTicket([71, 78, 82, 86, 90])]
  },
  {
    id: "Full House",
    name: "Full House",
    description: "All number get marked",
    tickets: [generateTicket("ALL")]
  },
  {
    id: "Star",
    name: "Star",
    description: "Ticket with all corner numbers are marked along with third number of second row are also marked is considered as star bonus winner.",
    tickets: [generateTicket([2, 30, 71, 90, 51])]
  },
  {
    id: "Corner",
    name: "Corner",
    description: "The ticket which has all corner number get marked is considered as a corner winner.",
    tickets: [generateTicket([2, 30, 71, 90])]
  },
  {
    id: "Early 5",
    name: "Early 5",
    description: "The first ticket which get any five number mark is considered as a early 5 winner.",
    tickets: [generateTicket([2, 30, 51, 71, 90])]
  },
  {
    id: "Box Bonus",
    name: "Box Bonus",
    description: "The first ticket which has atleast two marked in each line is considered as box bonus winner.",
    tickets: [generateTicket([7, 30, 42, 51, 71, 82])]
  },
  {
    id: "Haftsheet Bonus",
    name: "Haftsheet Bonus",
    description: "Haftsheet tickets are set of three tickets in serial within the sheet. That are 1-3,2-4,3-5,4-6 7-9,8-11,9-12,10-13 so on. The set which has atleast two marked in each tickets is considered as haftsheet winner.",
    tickets: [
      generateTicket([15, 64], 0),
      generateTicket([18, 72], 1),
      generateTicket([41, 87], 2),
    ]
  },
  {
    id: "Fullsheet Bonus",
    name: "Fullsheet Bonus",
    description: "Fullsheet tickets is a set of six tickets in serial. Example 1-6,7-13,14-19...(n-6,n). The first set which has each ticket get atleast two marked is considered as fullsheet bonus winner.",
    tickets: [
      generateTicket([15, 64], 0),
      generateTicket([18, 72], 1),
      generateTicket([41, 87], 2),
      generateTicket([6, 43], 3),
      generateTicket([10, 61], 2), // Reusing layouts
      generateTicket([9, 88], 1),
    ]
  },
  {
    id: "Quick 7",
    name: "Quick 7",
    description: "The first ticket which get any seven number mark is considered as a quick 7 winner.",
    tickets: [generateTicket([2, 15, 38, 42, 51, 57, 86])]
  },
];

function TicketView({ data }: { data: { value: number | null; marked: boolean }[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border-2 border-black bg-black p-0.5">
      <div className="grid gap-[2px] bg-black">
        {data.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-9 gap-[2px]">
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                className={`flex h-8 items-center justify-center text-sm font-bold sm:h-10 sm:text-base ${
                  cell.value === null
                    ? "bg-gray-100"
                    : cell.marked
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {cell.value || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DividendList() {
  const [selectedRule, setSelectedRule] = useState<typeof DIVIDENDS_DATA[0] | null>(null);

  // Close modal on background click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSelectedRule(null);
  };

  return (
    <section className="bg-dark-bg py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Dividend List
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIVIDENDS_DATA.map((dividend) => (
            <div
              key={dividend.id}
              className="flex items-center gap-2 rounded-xl border border-white/10 p-2 transition-colors hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex flex-1 items-center justify-center rounded-lg bg-white/5 px-4 py-3 text-sm font-semibold text-white shadow-sm">
                {dividend.name}
              </div>
              <button
                onClick={() => setSelectedRule(dividend)}
                className="flex h-full items-center justify-center rounded-lg bg-white/5 px-4 py-3 text-xs font-bold leading-tight text-gray-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                View
                <br />
                Rule
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedRule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#1e1e1e] p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setSelectedRule(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-2 text-center">
              <h3 className="mb-4 text-2xl font-bold text-white">{selectedRule.name}</h3>
              <p className="mb-8 text-sm font-medium text-gray-300 sm:text-base">
                {selectedRule.description}
              </p>

              <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {selectedRule.tickets && selectedRule.tickets.length > 0 ? (
                  selectedRule.tickets.map((ticketData, idx) => (
                    <TicketView key={idx} data={ticketData} />
                  ))
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-gray-400">
                    Rule visualization not yet provided.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
