import { useState } from 'react';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim().toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search ticker (e.g. AAPL)"
        className="glass flex-1 rounded-lg px-4 py-2 text-text placeholder:text-text-dim outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-2 font-medium hover:opacity-90 transition"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;