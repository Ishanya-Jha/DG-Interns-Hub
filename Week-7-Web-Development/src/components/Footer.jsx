import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-main">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark"><BriefcaseBusiness size={18} /></span>
            <span>DG <b>Interns Hub</b></span>
          </Link>
          <p>Discover opportunities. Build practical skills. Move your career forward.</p>
        </div>
        <div className="footer-nav">
          <span className="footer-label">EXPLORE</span>
          <Link to="/">Home</Link>
          <Link to="/jobs">Internships</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-note">
          <span className="footer-label">YOUR NEXT STEP</span>
          <p>Small steps today. Stronger skills tomorrow.</p>
          <Link to="/jobs">Browse opportunities <ArrowUpRight size={15} /></Link>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DG Interns Hub. Website project demo.</span>
          <span>Built with React</span>
        </div>
      </div>
    </footer>
  );
}