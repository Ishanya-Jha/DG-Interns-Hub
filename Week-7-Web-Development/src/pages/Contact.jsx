import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail, MessageCircle, Send, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", subject: location.state?.jobTitle || "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      setError("Please enter a message with at least 10 characters.");
      return;
    }
    setSent(true);
  }

  return (
    <section className="contact-page section-pad">
      <div className="container contact-layout">
        <div className="contact-copy">
          <span className="eyebrow">WE’RE HERE TO HELP</span>
          <h1>Let’s make<br /><span>things happen.</span></h1>
          <p>Questions about the platform or an opportunity? Send a message using the form. We’d love to hear from you.</p>
          <div className="contact-info-card"><div className="contact-info-icon"><Mail size={19} /></div><div><b>General enquiries</b><span>Use the form to share your question.</span></div></div>
          <div className="contact-info-card"><div className="contact-info-icon"><MessageCircle size={19} /></div><div><b>Opportunity support</b><span>Include the role title if your enquiry is about an internship.</span></div></div>
          <div className="contact-side-note">A thoughtful question can be the beginning of a great next step. <ArrowUpRight size={16} /></div>
        </div>
        <div className="contact-form-wrap">
          {sent ? (
            <div className="form-success"><div className="success-icon"><CheckCircle2 size={30} /></div><span className="eyebrow">MESSAGE READY</span><h2>Thanks, {form.name}.</h2><p>Your demo form has been submitted successfully on this page.</p><button className="button button-primary" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>Send another message</button></div>
          ) : (
            <>
              <div className="form-heading"><span className="eyebrow">GET IN TOUCH</span><h2>Send us a message</h2><p>Complete the details below and we’ll take it from there.</p></div>
              <form onSubmit={submit} className="contact-form">
                <label htmlFor="name">Your name</label><input id="name" name="name" value={form.name} onChange={update} placeholder="e.g. Alex Morgan" required minLength="2" />
                <label htmlFor="email">Email address</label><input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required />
                <label htmlFor="subject">Subject / role of interest</label><input id="subject" name="subject" value={form.subject} onChange={update} placeholder="What would you like to discuss?" required />
                <label htmlFor="message">Your message</label><textarea id="message" name="message" value={form.message} onChange={update} placeholder="Tell us a little more..." rows="5" required />
                {error && <p className="form-error">{error}</p>}
                <button className="button button-primary submit-button" type="submit">Submit message <Send size={16} /></button>
                <p className="form-disclaimer">Demo form only. Messages are not sent to or stored on a backend server.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}