export default function Footer() {
  return (
    <footer className="bg-[#8B7355] text-white py-6 mt-16">
      <div className="max-w-7xl mx-auto text-center text-sm">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
}