function Navbar() {
  return (
    <nav className="glass sticky top-0 z-10 flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-semibold tracking-tight">
        Stock<span className="text-accent">Sight</span>
      </h1>
      <div className="text-sm text-text-dim">v1.0</div>
    </nav>
  );
}

export default Navbar;