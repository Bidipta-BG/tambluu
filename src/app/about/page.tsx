import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — GetTambola",
  description: "Learn more about XOM Digital Web designer and the team behind GetTambola.",
};

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 bg-black py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-3xl font-bold text-red-500 mb-8">
            About XOM Digital Web designer
          </h1>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            XOM Digital is a web design team founded by professionals from Bangalore India. We specialize in creating visually appealing websites, web applications, and digital platforms that combine creativity, usability, and technology.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-10">
            Our mission is to help communities establish a strong digital presence through professionally designed web solutions.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                What We Do
              </h2>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 mb-4 ml-2">
                <li>Website Design & Development</li>
                <li>Professionally Designed Website Themes</li>
                <li>Custom Web Applications</li>
                <li>User Interface (UI) Design</li>
                <li>Hosting & Deployment Solutions</li>
                <li>Website Maintenance & Technical Support</li>
              </ul>
              <p className="text-gray-300 text-sm leading-relaxed">
                We focus on delivering reliable, responsive, and user-friendly digital experiences that work across desktop and mobile devices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Design First Approach
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Great software starts with great design. Our team places strong emphasis on visual quality, simplicity, and user experience.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Through our collection of professionally designed themes, we help clients launch attractive websites quickly while maintaining a polished and modern appearance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Art, Culture & Technology
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                We believe technology should reflect creativity and cultural identity.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Inspired by the diverse cultures of India, we bring artistic thinking into our design process, creating interfaces that are both functional and visually expressive.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Service Scope
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                gettambola.in operates as a web design and development service. Our primary focus is providing beautifully designed websites through our collection of professionally designed themes and web technologies.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                We provide website design, development, deployment, maintenance, and related technical services. We do not provide payment processing, wallet services, betting, gambling services, prize distribution, or any form of monetary transaction facility.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                We act solely as a technology and web services provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Let's Connect
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                We enjoy collaborating with clients, understanding their ideas, and transforming them into professional digital products.
              </p>
              
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>✉️</span>
                  <span>Email:</span>
                  <a href="mailto:xomdigital@gmail.com" className="text-red-500 hover:underline">
                    xomdigital@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>💬</span>
                  <span>WhatsApp:</span>
                  <a href="https://wa.me/919606914772" target="_blank" rel="noreferrer" className="text-red-500 hover:underline">
                    +91 96069 14772
                  </a>
                </div>
              </div>

              <a 
                href="https://wa.me/919606914772"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Chat on WhatsApp
              </a>
            </section>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
