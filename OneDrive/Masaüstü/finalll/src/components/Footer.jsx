import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} megumi. AI-Powered Cybersecurity Learning.</p>
      </div>
    </footer>
  );
}
