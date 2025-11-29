import { Facebook,Instagram } from "lucide-react";
import { Link } from "react-router-dom";



export default function Footer() {
  return (
    <footer className="w-full border-t bg-background text-muted-foreground">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 p-6">

        {/* Left section */}
        <div>
          <h2 className="text-xl font-bold text-foreground">TransitBee</h2>
          <p className="text-sm mt-2">
            Moving made easy. Reliable service for every customer.
          </p>
        </div>

        {/* Middle menu */}
        <nav className="flex flex-col gap-2 text-sm">
          {/* <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/services" className="hover:text-primary">Services</Link>
          <Link to="/login" className="hover:text-primary">Join Us</Link> */}
        </nav>

        {/* Right social icons */}
        <div className="flex gap-4 items-start">
          <a href="#" className="hover:text-primary"><Facebook /></a>
          <a href="#" className="hover:text-primary"><Instagram /></a>
          
        </div>

      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Movers. All rights reserved.
      </div>
    </footer>
  );
}
