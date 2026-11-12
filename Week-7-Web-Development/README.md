# DG Interns Hub | Job & Internship Portal

A responsive React internship discovery website built with Vite, React Router and CSS.

## Features
- Home, Jobs and Contact pages with React Router
- Internship cards with category, work mode, duration and skills
- Search by role, description or skill
- Category, work-mode and sorting filters
- Save/bookmark opportunities using localStorage
- Apply buttons route to the contact form with the selected role prefilled
- Responsive desktop, tablet and mobile layout
- Contact form validation and demo success state

> The listings are demonstration data, not verified current vacancies. The contact form is frontend-only and does not send messages to a server.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually http://localhost:5173.

## Production build
```bash
npm run build
npm run preview
```

## Deploy
Import the GitHub repository into Vercel. Use the Vite preset, build command `npm run build`, and output directory `dist`. `vercel.json` is included for React Router refresh support.

## Tech stack
React, Vite, React Router, Lucide React, CSS and localStorage.
