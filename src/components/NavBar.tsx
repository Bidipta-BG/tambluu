"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "https://api.whatsapp.com/send?phone=+9196096914772&text=Hi%20StartTambola%20team!%20I%20have%20a%20question." },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSimpleMode = pathname.startsWith('/themes') || pathname.startsWith('/register');
  const visibleLinks = NAV_LINKS.filter(link => !isSimpleMode || link.label === 'Contact Us');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-dark-bg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-lg font-bold text-black">
            ST
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            StartTambola
          </span>
        </Link>
        
        {/* Desktop Nav */}
        {!isSimpleMode && (
          <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => {
              const isExternal = link.href.startsWith("http");
              const isActive = pathname === link.href;
              const className = `text-xs sm:text-sm font-medium transition-colors hover:text-white ${isActive ? "text-accent border-b-2 border-accent pb-1" : "text-gray-300"}`;
              
              return isExternal ? (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={className}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {/* Simple Mode: Contact Us on the far right */}
          {isSimpleMode && (
            <a 
              href="https://api.whatsapp.com/send?phone=+9196096914772&text=Hi%20StartTambola%20team!%20I%20have%20a%20question." 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs sm:text-sm font-medium transition-colors hover:text-white text-gray-300"
            >
              Contact Us
            </a>
          )}

          {!isSimpleMode && (
            <Link
              href="/themes"
              className="hidden sm:flex rounded bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Get Started
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          {!isSimpleMode && (
            <button 
              className="lg:hidden p-2 text-white z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {!isSimpleMode && mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-dark-bg border-b border-white/10 shadow-xl flex flex-col p-4 space-y-4">
          {visibleLinks.map((link) => {
            const isExternal = link.href.startsWith("http");
            const isActive = pathname === link.href;
            const className = `block text-base font-medium p-2 rounded transition-colors hover:bg-white/5 ${isActive ? "text-accent" : "text-gray-300"}`;
            
            return isExternal ? (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={className} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={className} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/themes"
            className="w-full text-center rounded bg-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
