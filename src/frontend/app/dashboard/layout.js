// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <section className="min-h-screen w-full bg-white text-[#252525]">
      {children}
    </section>
  );
}