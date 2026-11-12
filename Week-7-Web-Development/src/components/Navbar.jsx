import React from "react";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, BriefcaseBusiness, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark"><BriefcaseBusiness size={19} /></span>
          <span>DG <b>Interns Hub</b></span>
        </Link>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <div className={`nav-links ${open ? "nav-open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/jobs" onClick={close}>Explore Jobs</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <Link to="/jobs" className="nav-cta" onClick={close}>Find opportunities <ArrowUpRight size={16} /></Link>
        </div>
      </nav>
    </header>
  );
}