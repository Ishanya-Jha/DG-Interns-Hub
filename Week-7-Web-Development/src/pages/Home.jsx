import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, Code2, Compass, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { jobs } from "../data/jobs";
import JobCard from "../components/JobCard";
import SectionTitle from "../components/SectionTitle";

const benefits = [
  { icon: <Compass />, title: "Explore your path", text: "Discover roles across technology, design, data and more." },
  { icon: <Code2 />, title: "Build practical skills", text: "Focus on hands-on learning and project-based experience." },
  { icon: <Zap />, title: "Take the next step", text: "Find opportunities that help you move forward with confidence." }
];

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-dot" /> OPPORTUNITY STARTS HERE</div>
            <h1>Make your next move a <span>career move.</span></h1>
            <p className="hero-lead">Discover internship opportunities, develop in-demand skills and turn what you learn into what you can do.</p>
            <div className="hero-actions">
              <Link to="/jobs" className="button button-primary">Explore opportunities <ArrowUpRight size={17} /></Link>
              <Link to="/contact" className="button button-ghost">Talk to us <ArrowRight size={16} /></Link>
            </div>
            <div className="hero-trust">
              <span><CheckCircle2 size={15} /> Skill-focused learning</span>
              <span><CheckCircle2 size={15} /> Career exploration</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art-glow" />
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <div className="opportunity-panel">
              <div className="panel-top"><span className="panel-label">YOUR CAREER DASHBOARD</span><span className="panel-live"><i /> OPEN</span></div>
              <div className="panel-icon"><BriefcaseIcon /></div>
              <p className="panel-small">THE NEXT CHAPTER</p>
              <h2>Find work that<br /><em>moves you forward.</em></h2>
              <div className="panel-divider" />
              <div className="panel-bottom"><span>Explore. Learn. Grow.</span><span className="panel-arrow">↗</span></div>
            </div>
            <div className="float-chip chip-top"><Sparkles size={15} /> Discover your potential</div>
            <div className="float-chip chip-bottom"><ShieldCheck size={16} /> Learn with purpose</div>
          </div>
        </div>
        <div className="hero-bottom-line"><div className="container"><span>BUILT FOR THE NEXT GENERATION OF PROFESSIONALS</span><span>SCROLL TO EXPLORE ↓</span></div></div>
      </section>

      <section className="benefits-section section-pad">
        <div className="container">
          <SectionTitle eyebrow="MORE THAN A LISTING" title="A starting point for what’s next." description="Explore possibilities, build confidence and take meaningful steps toward your professional goals." />
          <div className="benefit-grid">
            {benefits.map((item, i) => <article className="benefit-card" key={item.title}><div className="benefit-icon">{item.icon}</div><span className="benefit-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="featured-section section-pad">
        <div className="container">
          <div className="section-row">
            <SectionTitle eyebrow="EXPLORE OPPORTUNITIES" title="Find a role to get started." description="A selection of sample internship listings across different fields." />
            <Link to="/jobs" className="text-action">View all opportunities <ArrowUpRight size={17} /></Link>
          </div>
          <div className="job-grid">{jobs.filter((job) => job.featured).map((job) => <JobCard job={job} key={job.id} />)}</div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-content">
          <div><span className="eyebrow eyebrow-light">YOUR JOURNEY STARTS WITH ONE STEP</span><h2>Curiosity is a good<br />place to start.</h2><p>Explore the opportunities and find a direction worth pursuing.</p></div>
          <Link to="/jobs" className="button button-light">Browse internships <ArrowUpRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}

function BriefcaseIcon() {
  return <div className="briefcase-symbol"><BriefcaseBusinessIcon /></div>;
}
function BriefcaseBusinessIcon() {
  return <Users size={29} strokeWidth={1.5} />;
}