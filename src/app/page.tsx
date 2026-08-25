import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import DividendList from "@/components/DividendList";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";

// ─── Page metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "GetTambola — Run Your Own Tambola Game Like a Pro",
  description:
    "Get your own branded website, sell tickets, run games, manage agents and announce winners automatically. All in one simple platform.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────



const FEATURES = [
  {
    title: "Your Own Website",
    description: "Get your own branded website with a custom domain name.",
    icon: (
      <svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: "Ticket Management",
    description: "Manage ticket requests, approvals and bookings in one place.",
    icon: (
      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    title: "Agent Management",
    description: "Create agents, set commission and track their performance.",
    icon: (
      <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Automated Game",
    description: "Numbers called automatically and winners detected instantly.",
    icon: (
      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Winner Declaration",
    description: "Winners are declared automatically with prize details.",
    icon: (
      <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: "Reports & Analytics",
    description: "Detailed reports of sales, winners, agents and game history.",
    icon: (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    title: "Choose a Theme",
    description: "Select a design for your Tambola website.",
    icon: "🎨",
  },
  {
    title: "Fill Details",
    description: "Enter your details and website information.",
    icon: "📋",
  },
  {
    title: "Choose Plan",
    description: "Select monthly or yearly subscription.",
    icon: "💳",
  },
  {
    title: "Make Payment",
    description: "Complete secure payment via Cashfree.",
    icon: "💳",
  },
  {
    title: "Start Your Game",
    description: "Get your links and start running games.",
    icon: "🎉",
  },
];

const THEMES = [
  { id: "festival-glow", name: "FESTIVAL GLOW", src: "/images/1festivalglow.jpg" },
  { id: "northeast-essence", name: "NORTHEAST ESSENCE", src: "/images/2northeastessence.jpg" },
  { id: "royal-tambola", name: "ROYAL TAMBOLA", src: "/images/3royaltambola.jpg" },
  { id: "neon-night", name: "NEON NIGHT", src: "/images/4neonnight.jpg" },
  { id: "color-splash", name: "COLOR SPLASH", src: "/images/5colorsplash.jpg" },
];

const FAQS = [
  { q: "Do players pay through the platform?", a: "Players can pay through various methods integrated into your platform or manually to your agents." },
  { q: "How are winners selected?", a: "Winners are selected automatically by our system when their ticket numbers match the winning pattern." },
  { q: "Can I use my own domain name?", a: "Yes, you can use your custom domain name. Our team will help you set it up." },
  { q: "Do you collect ticket money from players?", a: "No, ticket money goes directly to you or your agents. We only charge the subscription fee." },
  { q: "Can I have agents to sell tickets?", a: "Yes, our agent management system allows you to create agents and track their sales." },
  { q: "What happens after payment?", a: "Your website is set up within 24 hours, and you will receive your admin, player, and agent links." },
];

// ─── Components ───────────────────────────────────────────────────────────────



function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark-bg pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/10 blur-[100px]" />
      
      <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6">
            #1 Tambola Platform for Organizers
          </span>
          
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Run Your Own <br />
            <span className="text-accent">Tambola Game</span> <br />
            Like a Pro
          </h1>
          
          <p className="text-lg leading-relaxed text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
            Get your own branded website, sell tickets, run games, manage agents and announce winners automatically. All in one simple platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
            <Link
              href="/themes"
              className="w-full sm:w-auto rounded bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover"
            >
              Get Your Tambola Website ↗
            </Link>
          </div>
          

        </div>
        
        <div className="flex-1 w-full max-w-2xl lg:max-w-none flex justify-center lg:justify-end">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}



function FeatureList() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase">Powerful Features</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Run Successful Tambola Games
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase">Easy Steps</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How GetTambola Works?
          </h2>
          <p className="mt-4 text-gray-600">Get started in just a few simple steps</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gray-200 -z-10" />
          
          {STEPS.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center text-center w-full lg:w-1/5 relative bg-gray-50">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-50 text-3xl shadow-sm text-accent">
                {step.icon}
              </div>
              <h3 className="mb-2 font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600 px-2">{step.description}</p>
              
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute right-[-10px] top-10 text-gray-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Themes() {
  return (
    <section id="themes" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-accent uppercase">Beautiful Themes</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Professional Themes for Your Website
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {THEMES.map((theme) => (
            <div key={theme.id} className="overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-[9/16] w-full bg-gray-900">
                <Image 
                  src={theme.src} 
                  alt={theme.name} 
                  fill 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
              <div className="bg-gray-50 p-4 text-center">
                <p className="font-bold text-gray-900">{theme.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-dark-bg py-20 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Simple Pricing, No Hidden Charges
            </h2>
            <p className="text-gray-400">
              Choose the plan that works best for you.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full">
            {/* Monthly Card */}
            <div className="flex-1 rounded-2xl bg-white p-8 text-gray-900 shadow-lg">
              <h3 className="text-lg font-bold">Monthly Plan</h3>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">₹4,500</span>
                <span className="mb-1 text-sm text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Billed monthly</p>
              <Link
                href="/themes?plan=monthly"
                className="mt-8 block w-full rounded border border-gray-300 py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                View Details
              </Link>
            </div>
            
            {/* Yearly Card */}
            <div className="flex-1 rounded-2xl bg-white p-8 text-gray-900 shadow-lg relative border-2 border-accent">
              <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                Save 53%
              </span>
              <h3 className="text-lg font-bold">Yearly Plan</h3>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">₹25,200</span>
                <span className="mb-1 text-sm text-gray-500">/year</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Billed yearly</p>
              <Link
                href="/themes?plan=yearly"
                className="mt-8 block w-full rounded border border-gray-300 py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



function BottomCTA() {
  return (
    <section className="bg-gradient-to-r from-red-600 to-red-700 py-12 text-white">
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
            👨‍💼
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ready to Start Your Tambola Game?</h2>
            <p className="mt-1 text-red-100">Join 1000+ successful organizers.</p>
          </div>
        </div>
        <Link
          href="/themes"
          className="whitespace-nowrap rounded bg-white px-8 py-4 text-sm font-bold text-red-600 shadow-md transition-colors hover:bg-gray-50"
        >
          Get Started Now ↗
        </Link>
      </div>
    </section>
  );
}

function SystemYouGet() {
  return (
    <section className="bg-dark-bg py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-16 text-2xl font-bold tracking-tight text-white uppercase text-center">
          SYSTEM YOU GET
        </h2>
        
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          
          {/* Game Link */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mx-auto w-[280px] h-[580px] rounded-[3rem] border-[12px] border-gray-900 bg-red-800 shadow-2xl overflow-hidden mb-8">
               <div className="bg-white px-4 py-2 text-xs font-bold flex justify-between items-center text-black">
                 <span>20:45</span>
                 <div className="flex gap-1">
                   <div className="w-4 h-3 bg-black rounded-sm"></div>
                   <div className="w-4 h-3 bg-black rounded-sm"></div>
                 </div>
               </div>
               <div className="p-4 text-white text-sm font-bold border-b border-red-900">Total booked:11 out of 600</div>
               <div className="p-4 space-y-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="bg-white rounded-lg p-2 shadow">
                     <div className="flex justify-between items-center mb-2">
                       <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">{i}</span>
                       <span className="text-black text-xs font-bold">By. test</span>
                       <span className="bg-red-200 text-red-800 text-[10px] px-2 py-1 rounded font-bold uppercase">Booked</span>
                     </div>
                     <div className="grid grid-cols-9 gap-[1px] bg-gray-300 border border-gray-300">
                       {Array(27).fill(0).map((_, j) => <div key={j} className="bg-white h-4"></div>)}
                     </div>
                   </div>
                 ))}
               </div>
               <div className="absolute bottom-0 w-full bg-white h-12 flex items-center justify-around px-4 border-t border-gray-300">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
               </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase">Game Link</h3>
            <p className="text-sm text-gray-300 leading-relaxed text-justify">
              "You'll receive a game link with a variety of design options to choose from. Through this link, players can easily book tickets and participate in the game. Automated number calling and marking create a completely hassle-free experience – players just sit back, watch, and enjoy. With ultra-realistic voice calling, the game captures players' attention and keeps them engaged like never before."
            </p>
          </div>

          {/* Admin Link */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mx-auto w-[280px] h-[580px] rounded-[3rem] border-[12px] border-gray-900 bg-blue-900 shadow-2xl overflow-hidden mb-8">
               <div className="bg-white px-4 py-2 text-xs font-bold flex justify-between items-center text-black">
                 <span>20:45</span>
                 <div className="flex gap-1">
                   <div className="w-4 h-3 bg-black rounded-sm"></div>
                 </div>
               </div>
               <div className="bg-blue-800 p-3 text-center text-white font-bold text-[10px] uppercase tracking-widest">Admin Dashboard</div>
               <div className="p-4 bg-[#1a237e] h-full">
                 <div className="text-center text-white font-bold text-sm mb-4">regular admin link</div>
                 <div className="bg-white rounded p-1 mb-4 flex justify-between items-center">
                   <span className="text-[10px] text-black font-semibold ml-1">Time Zone</span>
                   <span className="text-[10px] text-gray-500 mr-1">India - Asia/Kolkata</span>
                 </div>
                 <div className="text-center text-white font-bold text-sm mb-2 uppercase">Game Settings</div>
                 <div className="bg-white rounded overflow-hidden">
                    <div className="grid grid-cols-2 bg-black text-white text-[10px] p-2 font-bold uppercase">
                      <div>Settings type</div><div>Settings value</div>
                    </div>
                    {[
                      ['Game date-time', '30-03-2026 11:41 PM'],
                      ['Total ticket', '600'],
                      ['Ticket price', '300'],
                      ['Agent commission', '60'],
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-2 text-[10px] p-2 border-b border-gray-200 text-black">
                        <div className="font-semibold">{row[0]}</div><div>{row[1]}</div>
                      </div>
                    ))}
                    <div className="p-2 flex justify-end">
                      <div className="bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded">SAVE GAME SETTINGS</div>
                    </div>
                 </div>
               </div>
               <div className="absolute bottom-0 w-full bg-white h-12 flex items-center justify-around px-4 border-t border-gray-300">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
               </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase">Admin Link</h3>
            <p className="text-sm text-gray-300 leading-relaxed text-justify">
              "You'll receive an admin link that allows you to set up games, define prizes, and manage ticket bookings with ease. Designed to be simple and intuitive, the admin panel makes organizing online Tambola effortless. Control and manage everything seamlessly from a single dashboard."
            </p>
          </div>

          {/* Agent Link */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mx-auto w-[280px] h-[580px] rounded-[3rem] border-[12px] border-gray-900 bg-blue-900 shadow-2xl overflow-hidden mb-8">
               <div className="bg-white px-4 py-2 text-xs font-bold flex justify-between items-center text-black">
                 <span>20:59</span>
                 <div className="flex gap-1">
                   <div className="w-4 h-3 bg-black rounded-sm"></div>
                 </div>
               </div>
               <div className="bg-blue-800 p-3 text-center text-white font-bold text-[10px] uppercase tracking-widest">Agent Dashboard</div>
               <div className="p-4 bg-[#1a237e] h-full flex flex-col items-center">
                 <div className="w-full bg-yellow-400 text-center py-2 font-bold text-black text-sm uppercase mb-2">Total Earning</div>
                 <div className="w-full bg-red-600 text-center py-6 font-bold text-white text-xl mb-6 rounded">0 INR</div>
                 
                 <div className="w-full text-center text-white font-bold text-sm mb-2 uppercase">Business Info</div>
                 <div className="w-full bg-white rounded overflow-hidden">
                    <div className="grid grid-cols-2 bg-black text-white text-[10px] p-2 font-bold uppercase">
                      <div>Settings type</div><div>Settings value</div>
                    </div>
                    {[
                      ['Total ticket', '600'],
                      ['Sold ticket', '0'],
                      ['Ticket left', '600'],
                      ['Ticket price', '300 INR'],
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-2 text-[10px] p-2 border-b border-gray-200 text-black">
                        <div className="font-semibold">{row[0]}</div><div>{row[1]}</div>
                      </div>
                    ))}
                 </div>
               </div>
               <div className="absolute bottom-0 w-full bg-white h-12 flex items-center justify-around px-4 border-t border-gray-300">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
               </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase">Agent Link</h3>
            <p className="text-sm text-gray-300 leading-relaxed text-justify">
              "You'll receive an agent link that can be shared with your hired employees, allowing them to book tickets on your behalf. This system empowers organizers to scale their games to a larger audience effortlessly. With the agent system, you gain true mastery over game management."
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}




// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GetTambola",
    "operatingSystem": "Web",
    "applicationCategory": "GameApplication",
    "offers": {
      "@type": "Offer",
      "price": "4500",
      "priceCurrency": "INR"
    },
    "description": "GetTambola is the ultimate platform for Tambola organizers to launch their own branded website, sell tickets, and run automated games.",
    "url": "https://gettambola.in"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <main className="flex-1">
        <Hero />
        <FeatureList />
        <DividendList />
        <HowItWorks />
        <Themes />
        <Pricing />
        <SystemYouGet />
        <BottomCTA />
      </main>
      <Footer />
    </>
  );
}
