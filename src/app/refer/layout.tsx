import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ReferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-dark-bg text-white">
      <NavBar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
