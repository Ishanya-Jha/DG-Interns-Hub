import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Bookmark, Clock3, MapPin, Sparkles } from "lucide-react";
import { getSavedJobs, toggleSavedJob } from "../utils/storage";

export default function JobCard({ job }) {
  const [saved, setSaved] = useState(() => getSavedJobs().includes(job.id));

  function handleSave() {
    const updated = toggleSavedJob(job.id);
    setSaved(updated.includes(job.id));
  }

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-avatar">DG</div>
        <div className="job-card-top-right">
          {job.featured && <span className="featured-tag"><Sparkles size={12} /> Featured</span>}
          <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={handleSave} aria-label={saved ? "Remove saved job" : "Save job"}>
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <div className="job-card-heading">
        <span className="job-category">{job.category}</span>
        <h3>{job.title}</h3>
        <p className="company-name">{job.company}</p>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-meta">
        <span><MapPin size={14} /> {job.mode}</span>
        <span><Clock3 size={14} /> {job.duration}</span>
      </div>
      <div className="skill-list">
        {job.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      <div className="job-card-bottom">
        <span className="level-label">{job.level}</span>
        <Link to="/contact" state={{ jobTitle: job.title }} className="apply-link">
          Apply <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}