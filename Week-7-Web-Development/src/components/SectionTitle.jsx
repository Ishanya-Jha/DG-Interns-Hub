import React from "react";
export default function SectionTitle({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`section-title align-${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}