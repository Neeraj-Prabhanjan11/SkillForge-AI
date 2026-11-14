# SkillBridge AI

A responsive, dependency-free career and skills dashboard with a guided AI Mentor.

## Run locally

Serve this folder with Python:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). No install or build step is required.

## Publish on Google Firebase Hosting

1. Create a project in the [Firebase Console](https://console.firebase.google.com/) and make sure Firebase Hosting is enabled.
2. Install the Firebase CLI with `npm install -g firebase-tools`, then sign in with `firebase login`.
3. From this repository folder, run `firebase use --add` and select your Firebase project.
4. Publish the site with `firebase deploy --only hosting`. Firebase prints the public website URL when deployment finishes.

The repository includes `firebase.json` configured to publish the static site from its root; no build step is required. The selected project is saved in `.firebaserc` locally by the Firebase CLI.

## Features

- Vertical navigation for the dashboard, user profile, skill analysis, career matches, learning recommendations, progress, AI Mentor, and settings.
- Persistent light/dark appearance and notification preferences.
- A required six-question Level 1 baseline on first visit, so the dashboard can start with evidence about every career skill. After the baseline, learners can choose any skill and take focused or advanced assessments.
- Editable learner skills, certifications, projects, and career goals saved in the browser.
- Randomized, multi-level assessments with per-skill and per-level question history, harder questions at each level, and scored explanations. Learners can test all career skills or select an individual skill/language and a specific level. The Full Stack bank has 64 questions across Python, SQL, HTML/CSS, JavaScript, React, and Node.js; question and answer order are randomized, and questions rotate before they repeat.
- Goal-specific career matches and learning resources that adapt to assessment performance.
- A persistent recent-assessment log on the Progress Tracking page, with score bars and comparisons against the previous matching skill/level attempt (saved locally in the browser).
- A visible four-specialist collaboration (Skill Analyst, Career Matcher, Learning Architect, and Progress Coach), plus a guided interactive AI Mentor.
- Responsive layouts, keyboard-friendly controls, and reduced-motion support.

The specialist agents and mentor responses are deterministic, client-side demo logic; no external AI service or API key is required.
