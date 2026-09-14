import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-bg text-gray-400 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-xs font-bold text-black">
              GT
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              GetTambola
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs mb-6">
            The all-in-one platform for Tambola organizers to manage games, tickets, agents and winners effortlessly.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">Demo</Link></li>
            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/#themes" className="hover:text-white transition-colors">Themes</Link></li>
            <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Legal</h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Company</h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><a href="https://api.whatsapp.com/send?phone=919606914772&text=Hi%20GetTambola%20team!%20I%20have%20a%20question." target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 py-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} GetTambola.in. All rights reserved.</p>
      </div>
    </footer>
  );
}
