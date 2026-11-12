import React from "react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="not-found container"><span className="eyebrow">404 ERROR</span><h1>That page took a different path.</h1><p>The page you’re looking for could not be found.</p><Link className="button button-primary" to="/">Back to home</Link></section>;
}