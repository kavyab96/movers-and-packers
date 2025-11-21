import React from 'react'
import { Link } from "react-router-dom";
const Header = () => {
 return (
    <header className="w-full border-b bg-background">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Movers
        </Link>

        {/* Menu items */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/about" className="hover:text-primary transition">About</Link>
          <Link to="/services" className="hover:text-primary transition">Services</Link>
        </nav>

         <Link to="/" className="text-2xl font-bold">
          Join Us
        </Link>

      </div>
    </header>
  );
}

export default Header