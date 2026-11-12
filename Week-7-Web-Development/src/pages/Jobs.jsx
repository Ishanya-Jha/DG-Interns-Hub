import React from "react";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, BriefcaseBusiness } from "lucide-react";
import { jobs } from "../data/jobs";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("All");
  const [sort, setSort] = useState("featured");
  const [savedOnly, setSavedOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = jobs.filter((job) => {
      const text = `${job.title} ${job.category} ${job.description} ${job.skills.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) &&
        (category === "All" || job.category === category) &&
        (mode === "All" || job.mode === mode);
    });
    if (savedOnly) {
      const saved = JSON.parse(localStorage.getItem("dgih-saved-jobs") || "[]");
      result = result.filter((job) => saved.includes(job.id));
    }
    if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "featured") result.sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [query, category, mode, sort, savedOnly]);

  function resetFilters() {
    setQuery(""); setCategory("All"); setMode("All"); setSort("featured"); setSavedOnly(false);
  }

  return (
    <section className="jobs-page section-pad">
      <div className="container">
        <div className="jobs-intro">
          <span className="eyebrow">FIND YOUR FIT</span>
          <h1>Opportunities for<br /><span>what comes next.</span></h1>
          <p>Search roles, explore different fields and find an opportunity that matches your interests.</p>
          <div className="jobs-count"><BriefcaseBusiness size={17} /> <b>{jobs.length}</b> sample opportunities to explore</div>
        </div>
        <div className="jobs-toolbar">
          <div className="search-box"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by role, skill or keyword..." aria-label="Search internships" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}</div>
          <div className="filter-controls">
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"><option value="All">All categories</option><option>Development</option><option>Cybersecurity</option><option>Design</option><option>Data</option><option>Marketing</option></select>
            <select value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Filter by work mode"><option value="All">All work modes</option><option>Remote</option><option>Hybrid</option></select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort opportunities"><option value="featured">Featured first</option><option value="az">Title A–Z</option></select>
          </div>
        </div>
        <div className="listing-toolbar">
          <span><SlidersHorizontal size={15} /> Showing <b>{filtered.length}</b> opportunities</span>
          <div className="listing-actions"><button className={`saved-filter ${savedOnly ? "active" : ""}`} onClick={() => setSavedOnly(!savedOnly)}>♡ Saved jobs</button><button className="clear-filter" onClick={resetFilters}>Reset filters</button></div>
        </div>
        {filtered.length ? <div className="job-grid">{filtered.map((job) => <JobCard job={job} key={job.id} />)}</div> : <div className="no-results"><div className="no-results-icon"><Search size={25} /></div><h3>No opportunities found</h3><p>Try changing your search or filters.</p><button className="button button-primary" onClick={resetFilters}>Clear all filters</button></div>}
        <p className="demo-disclaimer">Note: These are sample listings created for this website demonstration. They do not represent confirmed active vacancies.</p>
      </div>
    </section>
  );
}