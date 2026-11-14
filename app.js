(() => {
  const views = [...document.querySelectorAll(".view")];
  const navItems = [...document.querySelectorAll(".nav-item[data-view]")];
  const currentPage = document.getElementById("current-page");
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const backdrop = document.getElementById("mobile-backdrop");
  const toast = document.getElementById("toast");
  let toastTimer;

  const readStored = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn(`Could not read ${key} from local storage.`, error);
      return fallback;
    }
  };

  const saveStored = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not save ${key} to local storage.`, error);
    }
  };

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
  };

  const defaultProfile = {
    name: "Jordan Davis",
    role: "Student · Learning online",
    goal: "Full Stack Developer",
    about: "I have a foundation in Python, SQL, and HTML. I’m building the skills to create complete web applications from front end to back end.",
    skills: "Python, SQL, HTML",
    certifications: "",
    projects: "",
    portfolio: ""
  };
  const savedProfile = readStored("skillbridge-profile", {});
  const profile = Object.fromEntries(
    Object.entries(defaultProfile).map(([key, fallback]) => [
      key,
      savedProfile && typeof savedProfile[key] === "string" ? savedProfile[key] : fallback
    ])
  );
  profile.goal = /designer|design/i.test(profile.goal) ? "Product Designer" : "Full Stack Developer";
  const profileDialog = document.getElementById("profile-dialog");
  const profileForm = document.getElementById("profile-form");
  const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "JD";
  const renderProfile = () => {
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("sidebar-profile-name").textContent = profile.name;
    document.getElementById("greeting-name").textContent = profile.name.trim().split(/\s+/)[0] || "there";
    document.getElementById("profile-role").textContent = profile.role;
    document.getElementById("profile-career-goal").textContent = profile.goal;
    document.getElementById("profile-about-text").textContent = profile.about;
    document.querySelectorAll(".avatar, .top-avatar").forEach((avatar) => { avatar.textContent = initials(profile.name); });
    document.getElementById("profile-skills").replaceChildren(...profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => {
      const chip = document.createElement("span");
      chip.textContent = skill;
      return chip;
    }));
    document.getElementById("profile-certifications").textContent = profile.certifications.trim() || "Add certifications to strengthen your profile.";
    document.getElementById("profile-projects").textContent = profile.projects.trim() || "Add projects to show what you can build.";
    const mentorWelcome = document.getElementById("mentor-welcome");
    if (mentorWelcome) mentorWelcome.textContent = `Hey ${profile.name.trim().split(/\s+/)[0] || "there"}! Your goal is ${track().label}. Your current skills and assessment results shape the advice I give you. What would you like to work on today?`;
    const portfolioButton = document.getElementById("portfolio-action");
    const portfolioStatus = document.getElementById("portfolio-status");
    const completionScore = document.querySelector(".completion-score");
    const completionMeter = document.querySelector(".completion-progress span");
    portfolioButton.innerHTML = profile.portfolio
      ? 'Portfolio link added <span aria-hidden="true">✓</span>'
      : 'Add portfolio link <span aria-hidden="true">→</span>';
    if (profile.portfolio) {
      portfolioStatus.innerHTML = '<span aria-hidden="true">✓</span> Portfolio link added';
      portfolioStatus.classList.remove("incomplete");
      completionScore.innerHTML = "90<span>%</span>";
      completionMeter.style.width = "90%";
    } else {
      portfolioStatus.innerHTML = '<span aria-hidden="true">○</span> Add a portfolio link';
      portfolioStatus.classList.add("incomplete");
      completionScore.innerHTML = "82<span>%</span>";
      completionMeter.style.width = "82%";
    }
  };
  const tracks = {
    fullstack: {
      label: "Full Stack Developer",
      skills: [
        { name: "Python", score: 72, description: "Use Python to write clear, reusable program logic.", icon: "Py", color: "icon-lilac" },
        { name: "SQL", score: 64, description: "Query and shape relational data for an application.", icon: "DB", color: "icon-blue" },
        { name: "HTML & CSS", score: 38, description: "Build accessible, responsive pages from semantic markup.", icon: "H", color: "icon-orange" },
        { name: "JavaScript", score: 22, description: "Add behavior and connect the browser to application data.", icon: "JS", color: "icon-green" },
        { name: "React", score: 12, description: "Compose interactive interfaces from reusable components.", icon: "R", color: "icon-blue" },
        { name: "Node.js", score: 8, description: "Build APIs and services that power a web application.", icon: "N", color: "icon-lilac" }
      ],
      careers: [
        { title: "Full Stack Developer", symbol: "⌘", growth: "high", pay: "$85k–$130k", description: "Build complete web experiences from responsive interfaces to reliable APIs.", skills: ["JavaScript", "React", "Node.js"] },
        { title: "Front-end Developer", symbol: "◫", growth: "high", pay: "$78k–$120k", description: "Turn designs into accessible, fast, and polished browser experiences.", skills: ["HTML & CSS", "JavaScript", "React"] },
        { title: "Back-end Developer", symbol: "▣", growth: "medium", pay: "$90k–$140k", description: "Design APIs, data models, and services that support useful products.", skills: ["Python", "SQL", "Node.js"] }
      ],
      resources: {
        "JavaScript": [
          ["js-foundations", "JavaScript Foundations", "Variables, functions, arrays, and DOM events through short coding challenges.", "4 hours", "Beginner", "Hands-on"],
          ["js-project", "Build an Interactive Web App", "Practice state, events, and browser storage in a small project.", "5 hours", "Beginner", "Project"]
        ],
        "React": [
          ["react-components", "React: Components to State", "Build reusable components and manage UI state with React.", "5 hours", "Beginner", "Hands-on"],
          ["react-project", "Create a React Dashboard", "Connect components, forms, and API data in a portfolio project.", "6 hours", "Intermediate", "Project"]
        ],
        "Node.js": [
          ["node-apis", "Node.js APIs in Practice", "Create REST endpoints, validate input, and handle errors.", "5 hours", "Beginner", "Project"],
          ["node-data", "Connect an API to a Database", "Build a small service with SQL persistence and clear data models.", "4 hours", "Intermediate", "Workshop"]
        ],
        "HTML & CSS": [
          ["web-foundations", "Responsive Web Foundations", "Use semantic HTML, accessible forms, and flexible CSS layouts.", "3 hours", "Beginner", "Hands-on"],
          ["web-project", "Recreate a Responsive Interface", "Turn a reference into a mobile-friendly page with clean markup.", "4 hours", "Beginner", "Project"]
        ],
        "SQL": [
          ["sql-practice", "SQL Joins and Data Modeling", "Practice joins, relationships, and queries against sample data.", "3 hours", "Beginner", "Practice"]
        ],
        "Python": [
          ["python-practice", "Python for Web Applications", "Strengthen functions, modules, and request handling.", "3 hours", "Intermediate", "Practice"]
        ]
      }
    },
    design: {
      label: "Product Designer",
      skills: [
        { name: "Product thinking", score: 86, description: "Connect customer needs to measurable product outcomes.", icon: "✦", color: "icon-lilac" },
        { name: "UX research", score: 72, description: "Find patterns in user behavior, interviews, and feedback.", icon: "◎", color: "icon-blue" },
        { name: "Data storytelling", score: 54, description: "Turn product metrics into clear, useful narratives.", icon: "◉", color: "icon-orange" },
        { name: "Prototyping", score: 41, description: "Make ideas tangible and test what works with users.", icon: "◇", color: "icon-green" },
        { name: "Accessibility", score: 36, description: "Design inclusive experiences for different abilities.", icon: "A", color: "icon-blue" },
        { name: "Design systems", score: 28, description: "Create consistent components and reusable patterns.", icon: "D", color: "icon-lilac" }
      ],
      careers: [
        { title: "Product Designer", symbol: "✳", growth: "high", pay: "$95k–$135k", description: "Shape intuitive product experiences from first idea to final detail.", skills: ["Product thinking", "UX research", "Prototyping"] },
        { title: "UX Researcher", symbol: "◎", growth: "high", pay: "$88k–$124k", description: "Help teams make confident decisions grounded in real people.", skills: ["UX research", "Data storytelling", "Product thinking"] },
        { title: "Design Systems Designer", symbol: "◇", growth: "medium", pay: "$92k–$132k", description: "Build accessible design foundations that help teams move faster.", skills: ["Design systems", "Accessibility", "Prototyping"] }
      ],
      resources: {
        "Prototyping": [
          ["prototype-foundations", "Prototyping for Product Teams", "Build and validate ideas with confidence through a guided project.", "4.5 hours", "Beginner", "Project"],
          ["prototype-project", "From User Flow to Clickable Prototype", "Turn a real user problem into a testable interactive concept.", "5 hours", "Intermediate", "Project"]
        ],
        "Accessibility": [
          ["accessibility-basics", "Accessibility in Everyday Design", "Make inclusive design part of your research and design process.", "2 hours", "All levels", "Self-paced"],
          ["accessibility-audit", "Run an Accessibility Design Audit", "Identify barriers and improve a real interface with a checklist.", "3 hours", "Intermediate", "Workshop"]
        ],
        "Design systems": [
          ["design-systems", "Design Systems: Components and Patterns", "Build a reusable component library with clear usage guidance.", "4 hours", "Intermediate", "Project"]
        ],
        "Data storytelling": [
          ["data-stories", "Data Storytelling for Designers", "Turn product metrics into insights people remember.", "3 hours", "Intermediate", "Workshop"]
        ],
        "UX research": [
          ["ux-research", "Practical UX Research", "Plan a study, talk with users, and share actionable findings.", "3.5 hours", "Beginner", "Practice"]
        ],
        "Product thinking": [
          ["product-thinking", "Product Thinking for Designers", "Connect user problems, product strategy, and measurable outcomes.", "3 hours", "Intermediate", "Workshop"]
        ]
      }
    }
  };
  const savedSkillState = readStored("skillbridge-skill-state", {});
  const persistedSkills = savedSkillState && typeof savedSkillState === "object" && !Array.isArray(savedSkillState) ? savedSkillState : {};
  const savedAssessmentState = readStored("skillbridge-assessment-results", {});
  const assessmentResults = savedAssessmentState && typeof savedAssessmentState === "object" && !Array.isArray(savedAssessmentState) ? savedAssessmentState : {};
  const savedAssessmentHistory = readStored("skillbridge-assessment-history", []);
  const assessmentHistory = Array.isArray(savedAssessmentHistory) ? savedAssessmentHistory.filter((attempt) => (
    attempt && typeof attempt === "object" && typeof attempt.kind === "string" &&
    typeof attempt.skill === "string" && typeof attempt.level === "string" &&
    Number.isFinite(attempt.score) && Number.isFinite(attempt.correct) &&
    Number.isFinite(attempt.total) && typeof attempt.date === "string"
  )) : [];
  const trackType = () => /designer|design/i.test(profile.goal) ? "design" : "fullstack";
  const track = () => tracks[trackType()];
  const currentSkills = () => {
    const active = track();
    const saved = persistedSkills[trackType()] || {};
    const declared = profile.skills.toLowerCase().split(",").map((skill) => skill.trim());
    const aliases = { "HTML & CSS": ["html", "css"], JavaScript: ["javascript", "js"], "Data storytelling": ["data", "storytelling"] };
    return active.skills.map((skill) => {
      const explicitlyListed = [skill.name.toLowerCase(), ...(aliases[skill.name] || [])].some((name) => declared.includes(name.toLowerCase()));
      const baseline = explicitlyListed ? Math.max(skill.score, 45) : skill.score;
      return { ...skill, score: Number.isFinite(saved[skill.name]) ? saved[skill.name] : baseline };
    });
  };
  const readiness = () => {
    const skills = currentSkills();
    return Math.round(skills.reduce((total, skill) => total + skill.score, 0) / skills.length);
  };
  const levelFor = (score) => score >= 75 ? ["Strong", "state-strong"] : score >= 55 ? ["Growing", "state-growing"] : score >= 35 ? ["In progress", "state-progress"] : ["Opportunity", "state-opportunity"];
  const weakestSkill = () => [...currentSkills()].sort((a, b) => a.score - b.score)[0];
  const savedCourses = () => {
    const value = readStored("skillbridge-learning-plan", []);
    return Array.isArray(value) ? value : [];
  };
  const learningFocus = () => {
    const priority = trackType() === "fullstack"
      ? ["JavaScript", "React", "Node.js", "HTML & CSS", "SQL", "Python"]
      : ["Prototyping", "Accessibility", "Design systems", "Data storytelling", "UX research", "Product thinking"];
    return priority.map((name) => currentSkills().find((skill) => skill.name === name)).find((skill) => skill && skill.score < 70) || weakestSkill();
  };
  const lastResult = () => assessmentResults[trackType()] || null;
  const renderAssessmentHistory = () => {
    const container = document.getElementById("assessment-history-list");
    if (!container) return;
    const recent = assessmentHistory.slice(0, 5);
    if (recent.length === 0) {
      container.innerHTML = '<div class="assessment-history-empty"><strong>Your first assessment is waiting.</strong><p>Choose a skill and level to create a baseline. Future results will show how your confidence changes over time.</p><button class="button button-secondary" type="button" data-start-assessment>Take your first assessment</button></div>';
      container.querySelector("[data-start-assessment]").addEventListener("click", () => startAssessment());
      return;
    }
    container.innerHTML = recent.map((attempt) => {
      const previous = assessmentHistory.slice(assessmentHistory.indexOf(attempt) + 1).find((candidate) => (
        candidate.kind === attempt.kind && candidate.skill === attempt.skill && candidate.level === attempt.level
      ));
      const change = previous
        ? `${attempt.score - previous.score > 0 ? "+" : ""}${attempt.score - previous.score} pts vs. previous`
        : "First attempt";
      const scope = attempt.skill === "all" ? "All skills" : attempt.skill;
      const level = attempt.level === "all" ? "All levels" : `Level ${attempt.level}`;
      const date = new Date(attempt.date);
      const dateLabel = Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
      return `<article class="assessment-history-item"><div class="assessment-history-copy"><strong>${escapeHtml(scope)}</strong><span>${escapeHtml(tracks[attempt.kind]?.label || attempt.kind)} · ${level} · ${dateLabel}</span></div><div class="assessment-history-score"><strong>${attempt.score}%</strong><span>${escapeHtml(change)}</span></div><div class="assessment-history-meter" role="img" aria-label="${attempt.score}% score"><span style="width:${Math.max(0, Math.min(100, attempt.score))}%"></span></div></article>`;
    }).join("");
  };
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  const renderSkills = () => {
    const skills = currentSkills();
    const readinessValue = readiness();
    const lowest = learningFocus();
    document.getElementById("dashboard-skills").innerHTML = skills.slice(0, 4).map((skill, index) => {
      const [level] = levelFor(skill.score);
      return `<div class="skill-row"><div class="skill-name"><span class="skill-bullet skill-${["purple", "blue", "orange", "green"][index]}"></span><span>${escapeHtml(skill.name)}</span></div><div class="skill-bar"><span style="width:${skill.score}%"></span></div><strong>${skill.score}%</strong><span class="skill-level">${level}</span></div>`;
    }).join("");
    const growthOnly = document.querySelector('[data-career-filter="growth"].selected') !== null;
    document.querySelectorAll(".career-result").forEach((card) => {
      card.hidden = growthOnly && card.dataset.growth !== "high";
    });
    const topSkill = [...skills].sort((a, b) => b.score - a.score)[0];
    document.querySelector("#skill-insight p").innerHTML = `<strong>Your next opportunity:</strong> ${escapeHtml(lowest.name)} is at ${lowest.score}%. Build on your ${escapeHtml(topSkill.name)} strength to move toward ${escapeHtml(track().label)}.`;
    document.getElementById("skills-detail-grid").innerHTML = skills.map((skill) => {
      const [level, state] = levelFor(skill.score);
      return `<article class="panel detail-skill"><div class="detail-skill-head"><span class="detail-icon ${skill.color}">${escapeHtml(skill.icon)}</span><span class="skill-state ${state}">${level.toUpperCase()}</span></div><h3>${escapeHtml(skill.name)}</h3><p>${escapeHtml(skill.description)}</p><div class="detail-meter ${skill.color.replace("icon-", "")}-meter"><span style="width:${skill.score}%"></span></div><div class="meter-foot"><span>${skill.score}% proficiency</span><span>${level}</span></div></article>`;
    }).join("");
    document.getElementById("readiness-value").textContent = readinessValue;
    document.getElementById("skills-readiness").textContent = readinessValue;
    document.getElementById("readiness-ring-value").textContent = `${readinessValue}%`;
    document.querySelector(".ring-progress").style.strokeDashoffset = String(358 - (358 * readinessValue / 100));
    document.querySelector(".readiness-ring").setAttribute("aria-label", `${readinessValue} percent career readiness`);
    document.querySelector(".mini-progress span").style.width = `${readinessValue}%`;
    const result = lastResult();
    document.getElementById("readiness-description").textContent = result && result.score < 50
      ? `Your last assessment found ${lowest.name} needs a little more practice. We've adjusted your learning path to start with the fundamentals.`
      : `Your skills are mapped to ${track().label}. Focus on ${lowest.name} to close your biggest gap.`;
  };

  const renderCareers = () => {
    const careerData = track().careers;
    const score = Math.min(96, Math.max(50, Math.round(43 + readiness() * .57)));
    const top = careerData[0];
    document.getElementById("top-career-title").textContent = top.title;
    document.getElementById("top-career-score").textContent = `${score}% match`;
    document.getElementById("top-career-description").textContent = `Your current skills are a ${score}% match for ${top.title}. Build ${learningFocus().name} to close your most important gap.`;
    document.getElementById("top-career-meta").innerHTML = `<span><i class="meta-icon">↗</i> High demand</span><span><i class="meta-icon">$</i> ${top.pay}</span>`;
    const alignedCount = top.skills.filter((name) => currentSkills().some((skill) => skill.name === name && skill.score >= 50)).length;
    document.getElementById("match-avatars").innerHTML = (trackType() === "fullstack" ? ["FS", "FE", "BE"] : ["UX", "PD", "DS"]).map((label) => `<span>${label}</span>`).join("");
    document.getElementById("match-caption").textContent = `${alignedCount} skills aligned`;
    document.getElementById("career-results").innerHTML = careerData.map((career, index) => {
      const roleScore = Math.min(97, Math.max(48, score - index * 6 + (index ? 5 : 0)));
      const aligned = career.skills.filter((name) => currentSkills().some((skill) => skill.name === name && skill.score >= 50)).length;
      return `<article class="panel career-result" data-growth="${career.growth}"><div class="career-result-icon result-${["purple", "blue", "orange"][index]}">${career.symbol}</div><div class="career-result-main"><div class="career-title-line"><h2>${escapeHtml(career.title)}</h2><span class="match-score">${roleScore}% match</span></div><p>${escapeHtml(career.description)}</p><div class="career-result-tags">${career.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div><div class="career-meta"><span>↗ &nbsp;${career.growth === "high" ? "High demand" : "Growing field"}</span><span>${career.pay}</span><span>${aligned} skills aligned</span></div></div><button class="button button-outline career-explore" type="button" data-career="${escapeHtml(career.title)}">Explore role <span>→</span></button></article>`;
    }).join("");
  };

  const learningPlan = () => {
    const last = lastResult();
    const weak = learningFocus();
    const options = track().resources[weak.name] || track().resources[track().skills[0].name];
    const remedial = last && last.score < 50;
    const first = remedial || weak.score < 45 ? options[0] : options[options.length - 1];
    const rest = track().skills.filter((skill) => skill.name !== weak.name).sort((a, b) => a.score - b.score).slice(0, 2)
      .map((skill) => (track().resources[skill.name] || [])[0]).filter(Boolean);
    return [first, ...rest];
  };

  const renderLearning = () => {
    const courses = learningPlan();
    const weak = learningFocus();
    const remedial = lastResult() && lastResult().score < 50;
    document.querySelector(".learning-path-banner h2").textContent = remedial ? `Rebuild your ${weak.name} foundation` : `Build your ${weak.name} confidence`;
    document.querySelector(".learning-path-banner p").textContent = remedial
      ? `Your assessment showed this skill needs more practice. Start with a guided refresher, then apply it in a small project.`
      : `Practice ${weak.name} with a focused resource and a project that supports your ${track().label} goal.`;
    document.getElementById("recommendation-list").innerHTML = courses.map((course, index) => {
      const [id, title, description, duration, level, format] = course;
      const added = savedCourses().includes(id);
      const coverLabel = course[1].split(" ").slice(0, 2).map(escapeHtml).join("<br>");
      return `<article class="panel recommendation-card"><div class="recommendation-number">0${index + 1}</div><div class="course-cover course-cover-${["peach", "blue", "green"][index]}"><span class="course-cover-label">${coverLabel}</span><span class="course-cover-shape"></span></div><div class="recommendation-info"><span class="course-tag">${index === 0 ? (remedial ? "ASSESSMENT FOCUS" : "TOP SKILL GAP") : "NEXT IN YOUR PATH"} · ${escapeHtml(index === 0 ? weak.name : "CAREER SKILL").toUpperCase()}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><div class="recommendation-meta"><span>◷ &nbsp;${duration}</span><span>${level}</span><span>${format}</span></div></div><button class="button button-outline add-plan-button${added ? " added" : ""}" type="button" data-add-course="${escapeHtml(id)}">${added ? "Added" : "Add to plan"} <span>${added ? "✓" : "+"}</span></button></article>`;
    }).join("");
    const [id, title, description, duration, level] = courses[0];
    const coverLabel = weak.name.split(" ").slice(0, 2).map(escapeHtml).join("<br>");
    const added = savedCourses().includes(id);
    document.getElementById("dashboard-course").innerHTML = `<div class="course-cover course-cover-lilac"><span class="course-cover-label">${coverLabel}</span><span class="course-cover-shape"></span></div><div class="course-info"><span class="course-tag">PERSONALIZED · ${escapeHtml(weak.name.toUpperCase())}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><div class="course-foot"><span>◷ &nbsp;${duration}</span><span>·</span><span>${level}</span><button class="course-add${added ? " added" : ""}" type="button" data-add-course="${escapeHtml(id)}">${added ? "Added" : "Add to plan"} <span>${added ? "✓" : "+"}</span></button></div></div>`;
  };

  const renderAgents = () => {
    const lowest = learningFocus();
    const last = lastResult();
    const match = Math.min(96, Math.max(50, Math.round(43 + readiness() * .57)));
    const entries = [
      ["✦", "Skill Analyst", `${lowest.name} is the biggest gap at ${lowest.score}%.`],
      ["◎", "Career Matcher", `${match}% alignment with ${track().label}; strongest skills are compared to role needs.`],
      ["◇", "Learning Architect", last && last.score < 50 ? `Assessment was ${last.score}%. Switching to guided ${lowest.name} practice.` : `Prioritizing a project to build ${lowest.name}.`],
      ["↗", "Progress Coach", last ? `Latest assessment: ${last.score}%. ${last.score >= 50 ? "Keep building momentum." : "Let's strengthen the fundamentals."}` : "Ready to adapt the plan as soon as you take an assessment."]
    ];
    document.getElementById("agent-grid").innerHTML = entries.map(([icon, name, summary]) => `<article class="agent-card"><div class="agent-card-head"><span class="agent-icon">${icon}</span><strong>${name}</strong></div><p>${summary}</p></article>`).join("");
    document.getElementById("dashboard-mentor-note").textContent = last && last.score < 50
      ? `“Your last assessment gave us useful clues. Let's strengthen ${lowest.name} with a small, focused practice step.”`
      : `“Your next step is ${lowest.name}. I can help you turn it into a project for your ${track().label} path.”`;
  };

  const renderPersonalization = () => {
    renderSkills();
    renderCareers();
    renderLearning();
    renderAgents();
    renderAssessmentHistory();
  };
  renderPersonalization();
  renderProfile();

  const questionBanks = {
    fullstack: [
      { id: "html-semantic", level: 1, skill: "HTML & CSS", question: "Which element is the best semantic choice for a button that submits a form?", choices: ["<div>", "<button type=\"submit\">", "<span>", "<label>"], answer: 1, explain: "A button with type=\"submit\" communicates its action to browsers and assistive technology." },
      { id: "js-const", level: 1, skill: "JavaScript", question: "Which declaration should you use for a value you do not plan to reassign?", choices: ["var", "let", "const", "static"], answer: 2, explain: "Use const when the binding will not be reassigned; it makes intent clear and avoids accidental reassignment." },
      { id: "sql-filter", level: 1, skill: "SQL", question: "Which SQL clause filters rows before they are returned?", choices: ["ORDER BY", "WHERE", "GROUP BY", "LIMIT"], answer: 1, explain: "WHERE filters individual rows; ORDER BY sorts the result." },
      { id: "python-list", level: 1, skill: "Python", question: "What does items.append(\"tea\") do to a Python list named items?", choices: ["Adds \"tea\" to the end of the list", "Sorts the list", "Returns a new list without changing items", "Removes the last value"], answer: 0, explain: "append adds one value to the end of the existing list." },
      { id: "http-get", level: 1, skill: "Node.js", question: "Which HTTP method is conventionally used to retrieve a resource without changing it?", choices: ["POST", "PATCH", "GET", "DELETE"], answer: 2, explain: "GET retrieves a resource. It should not create or modify server state." },
      { id: "node-http-server", level: 1, skill: "Node.js", question: "Which built-in Node.js module provides HTTP server primitives?", choices: ["node:http", "node:fs", "node:path", "node:crypto"], answer: 0, explain: "Node.js includes the node:http module for creating HTTP servers and clients." },
      { id: "css-box", level: 1, skill: "HTML & CSS", question: "In the default CSS box model, what does an element's declared width describe?", choices: ["Content only", "Content plus padding", "Content, padding, and border", "The margin box"], answer: 0, explain: "With content-box, width describes the content area; padding and borders are added outside it." },
      { id: "html-label", level: 1, skill: "HTML & CSS", question: "How should a text label be connected to an input for accessible forms?", choices: ["Put the label after the form", "Match label for to the input id", "Use a placeholder only", "Add a title to the page"], answer: 1, explain: "A label's for attribute should match the input's id so assistive technology can identify it." },
      { id: "js-array", level: 1, skill: "JavaScript", question: "Which array method creates a new array containing only items that pass a test?", choices: ["map()", "filter()", "push()", "join()"], answer: 1, explain: "filter returns a new array with only the values whose callback returns true." },
      { id: "react-component", level: 1, skill: "React", question: "What is a React component primarily used for?", choices: ["Describing a reusable part of the user interface", "Storing a database password", "Replacing every HTML element with SQL", "Starting a web server"], answer: 0, explain: "Components let you build interfaces from reusable, composable pieces." },
      { id: "react-props", level: 2, skill: "React", question: "A parent renders <Profile name=\"Sam\" />. How should Profile read that value?", choices: ["From props.name", "From window.name", "From document.name", "From a global variable"], answer: 0, explain: "React passes attributes to the component as props, so the component reads props.name." },
      { id: "sql-join", level: 2, skill: "SQL", question: "You need each order together with its customer's name. What is the usual approach when the tables share customer_id?", choices: ["Join orders to customers on customer_id", "Sort both tables alphabetically", "Use DISTINCT on orders", "Rename customer_id in one table"], answer: 0, explain: "A join combines related rows using their shared key." },
      { id: "js-async", level: 2, skill: "JavaScript", question: "Inside an async function, what does await do with a Promise?", choices: ["Waits for it to settle before continuing that function", "Runs it synchronously on the server", "Cancels it if it takes too long", "Converts it to a callback"], answer: 0, explain: "await pauses that async function until the Promise settles, then returns its fulfilled value or throws its rejection." },
      { id: "node-route", level: 2, skill: "Node.js", question: "An API receives POST /users with a new user's data. What should the route generally do first?", choices: ["Validate the input before creating a user", "Trust every submitted field", "Return the database password", "Convert the request to GET"], answer: 0, explain: "Validate and constrain untrusted input before using it or writing it to a database." },
      { id: "http-404", level: 2, skill: "Node.js", question: "An API cannot find the requested record. Which status is the clearest response?", choices: ["200 OK", "201 Created", "404 Not Found", "500 Internal Server Error"], answer: 2, explain: "404 accurately communicates that the requested resource was not found." },
      { id: "js-filter", level: 2, skill: "JavaScript", question: "You have an array of products and need only items priced below 20. Which operation fits best?", choices: ["products.map(p => p.price < 20)", "products.filter(p => p.price < 20)", "products.push(p => p.price < 20)", "products.join(p => p.price < 20)"], answer: 1, explain: "filter keeps the original product objects that meet the price condition." },
      { id: "css-flex", level: 2, skill: "HTML & CSS", question: "A row of cards should wrap onto new lines as space runs out. Which flex setting enables that?", choices: ["flex-wrap: wrap", "flex-direction: fixed", "align-items: wrap", "position: wrap"], answer: 0, explain: "flex-wrap: wrap allows flex items to move onto additional lines." },
      { id: "python-dict", level: 2, skill: "Python", question: "A Python dictionary stores user records under unique IDs. What is a direct lookup by user_id?", choices: ["users[user_id]", "users.append(user_id)", "users.sort(user_id)", "users.join(user_id)"], answer: 0, explain: "Dictionary keys support direct lookup with square brackets (or .get for a safe optional lookup)." },
      { id: "python-generator", level: 3, skill: "Python", question: "A Python service processes a file too large to fit in memory and needs one record at a time. Which approach is most memory-efficient?", choices: ["Read every line into a list before processing", "Yield records from an iterator as they are read", "Copy the entire file into a second string", "Convert each line into a separate process"], answer: 1, explain: "An iterator or generator yields records incrementally instead of keeping the entire file in memory." },
      { id: "react-state", level: 3, skill: "React", question: "A component's count is state. Why should you use the setter from useState instead of assigning count directly?", choices: ["The setter schedules a render with the new state", "Direct assignment is saved to SQL", "The setter makes count global", "Direct assignment reloads the browser"], answer: 0, explain: "React state setters update the state value and schedule the component to render again." },
      { id: "sql-injection", level: 3, skill: "SQL", question: "Which approach best prevents user input from changing the meaning of a SQL query?", choices: ["Concatenate it after removing spaces", "Use a parameterized query", "Hide the query in a frontend bundle", "Reject every apostrophe"], answer: 1, explain: "Parameterized queries keep input separate from SQL syntax and are the standard defense against injection." },
      { id: "api-idempotent", level: 3, skill: "Node.js", question: "A client retries a request after a timeout. Which design most safely avoids creating duplicate payments?", choices: ["Accept an idempotency key and reuse the original result", "Generate a new payment on every retry", "Disable all error responses", "Store the card number in browser storage"], answer: 0, explain: "An idempotency key lets the server recognize retries and return the original result instead of repeating the side effect." },
      { id: "react-effect", level: 3, skill: "React", question: "An effect fetches a record for userId. Which dependency is needed so it refreshes when the selected user changes?", choices: ["No dependencies", "[userId]", "[setState]", "[document]"], answer: 1, explain: "Including userId in the dependency list reruns the effect when that value changes." },
      { id: "node-errors", level: 3, skill: "Node.js", question: "A database call in an async route can reject. What is the safest general response strategy?", choices: ["Handle the rejection and return an appropriate error without exposing internals", "Ignore it and report success", "Send the stack trace to the client", "Retry forever"], answer: 0, explain: "Handle failures explicitly, log useful server-side detail, and return a safe error response." },
      { id: "xss-output", level: 3, skill: "JavaScript", question: "An app displays user-submitted text. Which practice best reduces cross-site scripting risk?", choices: ["Insert it with textContent or context-aware escaping", "Insert it as raw innerHTML", "Assume client input is trusted", "Hide the text with CSS"], answer: 0, explain: "Treat user input as data and escape it for the output context rather than injecting raw markup." },
      { id: "db-transaction", level: 3, skill: "SQL", question: "A transfer must debit one account and credit another. Why use a database transaction?", choices: ["Both updates succeed together or roll back together", "It makes SQL run in the browser", "It removes the need to validate amounts", "It automatically encrypts every column"], answer: 0, explain: "A transaction preserves consistency by committing all related changes together or rolling them all back." },
      { id: "api-cors", level: 3, skill: "Node.js", question: "A browser blocks a cross-origin API call. Which response addresses the browser's CORS check?", choices: ["Return the appropriate Access-Control-Allow-Origin header", "Rename the JSON fields", "Add a CSS reset", "Change the database index"], answer: 0, explain: "The server must explicitly allow the requesting origin through the relevant CORS headers." },
      { id: "css-specificity", level: 3, skill: "HTML & CSS", question: "Two normal author CSS rules target the same element. Which selector usually has greater specificity?", choices: [".card.active", "#app .card", "A selector with one element name", "They are always equal"], answer: 1, explain: "An ID selector contributes more specificity than class selectors, so #app .card wins in this comparison."},
      { id: "py-slice", level: 1, skill: "Python", question: "Given values = [3, 6, 9, 12], what does values[1:3] return?", choices: ["[3, 6, 9]", "[6, 9]", "[6, 9, 12]", "[1, 3]"], answer: 1, explain: "A Python slice includes the start index and excludes the end index, so indices 1 and 2 are returned." },
      { id: "py-boolean", level: 1, skill: "Python", question: "Which value represents the Boolean result of a successful equality comparison in Python?", choices: ["\"True\"", "1.0", "True", "None"], answer: 2, explain: "Python's Boolean literals are True and False, with initial capital letters." },
      { id: "sql-count", level: 1, skill: "SQL", question: "Which aggregate returns the number of rows in a result?", choices: ["COUNT(*)", "SUM(*)", "ROWS(*)", "TOTAL(*)"], answer: 0, explain: "COUNT(*) counts the rows returned by the query." },
      { id: "sql-order", level: 1, skill: "SQL", question: "Which clause sorts query results by a column?", choices: ["WHERE", "ORDER BY", "VALUES", "ALTER"], answer: 1, explain: "ORDER BY sorts returned rows by one or more expressions." },
      { id: "html-alt", level: 1, skill: "HTML & CSS", question: "What should meaningful content images include so their information is available to screen-reader users?", choices: ["Useful alternative text", "A larger border", "A CSS animation", "A title on the page"], answer: 0, explain: "Alternative text conveys the purpose or information of a meaningful image." },
      { id: "css-display", level: 1, skill: "HTML & CSS", question: "Which CSS declaration creates a one-dimensional flex layout for an element's children?", choices: ["display: flex", "position: flex", "layout: grid-row", "float: flex"], answer: 0, explain: "display: flex establishes a flex formatting context for the element's children." },
      { id: "js-equality", level: 1, skill: "JavaScript", question: "Which operator checks equality without coercing the two operand types?", choices: ["=", "==", "===", "!="], answer: 2, explain: "Strict equality (===) compares values without converting between types." },
      { id: "js-template", level: 1, skill: "JavaScript", question: "Which syntax inserts a variable named city inside a JavaScript template literal?", choices: ["${city}", "%city%", "{{city}}", "&city;"], answer: 0, explain: "Template literals use ${expression} interpolation inside backticks." },
      { id: "react-jsx", level: 1, skill: "React", question: "In JSX, how do you pass a JavaScript expression into an element attribute?", choices: ["Wrap it in curly braces", "Put it in an HTML comment", "Prefix it with SQL", "Add it after the closing tag"], answer: 0, explain: "Curly braces embed JavaScript expressions in JSX." },
      { id: "react-key", level: 1, skill: "React", question: "Why should elements rendered from a list have a stable key?", choices: ["It helps React identify items when the list changes", "It encrypts the item's text", "It makes the item a route", "It adds a database index"], answer: 0, explain: "Stable keys help React match items between renders, especially when items are inserted, removed, or reordered." },
      { id: "node-npm", level: 1, skill: "Node.js", question: "Which file commonly declares a Node.js project's scripts and package dependencies?", choices: ["package.json", "index.html", "tsconfig.lock", "README.css"], answer: 0, explain: "package.json records project metadata, scripts, and dependency declarations." },
      { id: "node-env", level: 1, skill: "Node.js", question: "In Node.js, how does code usually read an environment variable named PORT?", choices: ["process.env.PORT", "window.PORT", "document.env.PORT", "require.env.PORT"], answer: 0, explain: "Node.js exposes environment variables through process.env." },
      { id: "py-comprehension", level: 2, skill: "Python", question: "Given values = [1, 2, 3], which expression creates [2, 4, 6]?", choices: ["[value * 2 for value in values]", "{value * 2 in values}", "values.map(value * 2)", "values.append(value * 2)"], answer: 0, explain: "A list comprehension iterates over values and evaluates an expression for each one." },
      { id: "py-exception", level: 2, skill: "Python", question: "A function converts user input to an integer, and invalid input is expected. Which approach handles that failure cleanly?", choices: ["Wrap conversion in try/except ValueError", "Use assert to disable the conversion", "Catch every BaseException and ignore it", "Convert the input twice"], answer: 0, explain: "Handle the expected ValueError narrowly and give the caller a useful response." },
      { id: "sql-group", level: 2, skill: "SQL", question: "You need the number of orders for each customer. Which query structure is appropriate?", choices: ["GROUP BY customer_id with COUNT(*)", "ORDER BY customer_id with SUM(*)", "WHERE customer_id with LIMIT", "ALTER TABLE with COUNT(*)"], answer: 0, explain: "GROUP BY collects rows for each customer so COUNT(*) can aggregate each group." },
      { id: "sql-null", level: 2, skill: "SQL", question: "A nullable shipped_at column should be filtered to records with no shipping date. Which predicate is correct?", choices: ["shipped_at = NULL", "shipped_at IS NULL", "shipped_at == None", "shipped_at EMPTY"], answer: 1, explain: "SQL tests for NULL using IS NULL, not equality." },
      { id: "html-form", level: 2, skill: "HTML & CSS", question: "A required email input should provide a native hint to browsers. Which attribute is appropriate?", choices: ["required", "mandatory=true", "validate-on-server-only", "aria-hidden=true"], answer: 0, explain: "The required attribute communicates that a value must be provided before form submission." },
      { id: "css-grid", level: 2, skill: "HTML & CSS", question: "A layout needs three equal-width columns. Which CSS declaration is a direct Grid solution?", choices: ["grid-template-columns: repeat(3, 1fr)", "flex-direction: three", "columns: 3fr", "grid-flow: equal"], answer: 0, explain: "repeat(3, 1fr) creates three equal flexible grid tracks." },
      { id: "js-reduce", level: 2, skill: "JavaScript", question: "You need the sum of an array of numbers. Which array method is designed to combine items into one accumulated value?", choices: ["reduce()", "filter()", "findIndex()", "concat()"], answer: 0, explain: "reduce applies an accumulator function across the array to produce a single value." },
      { id: "js-destructure", level: 2, skill: "JavaScript", question: "Given const user = { name: \"Ari\" }, which statement extracts name into a variable?", choices: ["const { name } = user;", "const [name] = user;", "const name = user[];", "const => name user;"], answer: 0, explain: "Object destructuring uses braces to bind a variable to a matching property." },
      { id: "react-render", level: 2, skill: "React", question: "A parent passes a new title prop to a child component. How does the child normally show the updated title?", choices: ["Render the value from its props", "Mutate the old DOM node directly", "Reload the whole browser", "Read the title from localStorage automatically"], answer: 0, explain: "React re-renders components with updated props and applies the resulting UI." },
      { id: "react-form", level: 2, skill: "React", question: "A form input's value is controlled by React state. What should its onChange handler do?", choices: ["Update the state from the input event", "Mutate props directly", "Remove the input from the DOM", "Write to the server on every keystroke without a request"], answer: 0, explain: "A controlled input stays in sync when its change handler updates the state used for value." },
      { id: "node-module", level: 2, skill: "Node.js", question: "An ES module needs a function from another local file. Which syntax is appropriate?", choices: ["import { helper } from \"./helper.js\"", "SELECT helper FROM \"./helper.js\"", "style { helper } from file", "document.load(\"./helper.js\")"], answer: 0, explain: "ES modules import exported bindings from another module using import syntax." },
      { id: "node-status", level: 2, skill: "Node.js", question: "A server successfully creates a new resource. Which HTTP status most clearly signals creation?", choices: ["201 Created", "204 No Content", "301 Moved Permanently", "503 Service Unavailable"], answer: 0, explain: "201 Created indicates a request successfully created a resource." },
      { id: "py-mutability", level: 3, skill: "Python", question: "A function's default argument is a list, and each call appends to it. Later calls unexpectedly see earlier items. What is the best fix?", choices: ["Use None as the default and create a fresh list inside the function", "Make the list global", "Sort the default list before each call", "Catch TypeError around append"], answer: 0, explain: "Default values are evaluated once. Use a None sentinel and initialize a new mutable value per call." },
      { id: "py-context", level: 3, skill: "Python", question: "A program opens a file and may raise while processing it. Which pattern reliably closes the file?", choices: ["Use a with open(...) context manager", "Call close only after all processing succeeds", "Store the file in a global variable", "Catch and suppress every exception"], answer: 0, explain: "A context manager runs cleanup when control leaves the block, including when an exception occurs." },
      { id: "sql-index", level: 3, skill: "SQL", question: "A large table is frequently filtered by account_id and sorted by created_at. What should be evaluated first to improve this query?", choices: ["An index that supports the filter and ordering, checked against the query plan", "Adding an index to every column", "Removing the WHERE condition", "Loading the entire table into application memory"], answer: 0, explain: "Use query plans and workload evidence to evaluate a suitable composite index; indexes also have write and storage costs." },
      { id: "sql-window", level: 3, skill: "SQL", question: "You need each order row plus that customer's total spend without collapsing individual orders. Which SQL feature fits?", choices: ["A window aggregate partitioned by customer", "GROUP BY customer_id alone", "DISTINCT on every column", "A DELETE with RETURNING"], answer: 0, explain: "A window aggregate computes a partition-level result while retaining each input row." },
      { id: "css-containment", level: 3, skill: "HTML & CSS", question: "A component must remain readable between narrow and wide layouts without adding many breakpoints. Which technique is most resilient?", choices: ["Flexible Grid or Flex sizing with minmax and min-width constraints", "Absolute-position every child", "Fix every width in pixels", "Disable wrapping at all viewport sizes"], answer: 0, explain: "Intrinsic and flexible sizing adapts to available space and content more robustly than fixed positioning." },
      { id: "css-cascade", level: 3, skill: "HTML & CSS", question: "A component stylesheet is difficult to override because many selectors are chained with IDs. What is the best long-term improvement?", choices: ["Reduce selector specificity and use clear component-level classes", "Add more IDs to every rule", "Mark every declaration !important", "Move all styles to inline attributes"], answer: 0, explain: "Low, intentional specificity makes styles easier to compose and override without escalating the cascade." },
      { id: "js-promise-all", level: 3, skill: "JavaScript", question: "Two independent API requests must both succeed before rendering a combined result. Which pattern waits for both and rejects if either fails?", choices: ["Promise.all([requestA(), requestB()])", "Promise.race([requestA(), requestB()])", "requestA() || requestB()", "setTimeout(requestA, requestB)"], answer: 0, explain: "Promise.all fulfills when every input fulfills and rejects if any input rejects." },
      { id: "js-stale-async", level: 3, skill: "JavaScript", question: "A search request for \"ca\" finishes after the newer request for \"cat\" and overwrites its results. What is a robust fix?", choices: ["Cancel or ignore stale requests using an AbortController or request identifier", "Delay every request by the same fixed amount", "Sort the response alphabetically", "Disable the submit button permanently"], answer: 0, explain: "Cancellation or request identity prevents an older response from replacing newer search results." },
      { id: "react-stale-state", level: 3, skill: "React", question: "Several state increments are queued based on the previous value. Which update avoids reading a stale captured count?", choices: ["setCount(current => current + 1)", "count = count + 1", "setCount(count++)", "document.count += 1"], answer: 0, explain: "The functional updater receives the latest queued state, so it is safe for updates derived from the previous value." },
      { id: "react-effect-cleanup", level: 3, skill: "React", question: "A component subscribes to a browser event inside an effect. What prevents a leaked listener after the component unmounts?", choices: ["Return a cleanup function that removes the listener", "Set the state to an empty string", "Add a second listener on every render", "Move the handler into JSX text"], answer: 0, explain: "Effects can return cleanup functions that React runs before re-running the effect and when it unmounts." },
      { id: "node-stream", level: 3, skill: "Node.js", question: "An API must return a very large file without buffering the whole file in memory. Which approach is appropriate?", choices: ["Pipe a readable stream to the response and handle stream errors", "Read the entire file into one string first", "Create one promise per byte", "Convert the file to a large JSON array"], answer: 0, explain: "Streaming processes bounded chunks and avoids holding the entire file in memory." },
      { id: "node-shutdown", level: 3, skill: "Node.js", question: "A Node.js service receives SIGTERM during deployment. What should graceful shutdown generally do?", choices: ["Stop accepting new work, finish or time out active requests, then close dependencies", "Immediately report success for every request", "Delete all temporary directories recursively", "Ignore the signal and start another server"], answer: 0, explain: "Graceful shutdown drains in-flight work and closes resources before the process exits."}
    ],
    design: [
      { id: "ux-goal", level: 1, skill: "UX research", question: "What is the best first step before choosing a design solution for a user problem?", choices: ["Understand the people and context behind the problem", "Pick the trendiest color palette", "Build the final interface", "Ask only the project sponsor"], answer: 0, explain: "Start by understanding user needs and context; solutions come after the problem is clear." },
      { id: "design-contrast", level: 1, skill: "Accessibility", question: "Which text treatment is easiest to read on a white page?", choices: ["Light gray text with low contrast", "Dark text with strong contrast", "Tiny text with decorative shadows", "Text placed only inside an image"], answer: 1, explain: "Strong contrast improves legibility for many people and supports accessibility." },
      { id: "design-flow", level: 1, skill: "Prototyping", question: "What is a wireframe most useful for early in a project?", choices: ["Exploring structure and content before visual polish", "Measuring production performance", "Replacing user feedback", "Choosing database tables"], answer: 0, explain: "Wireframes help teams explore hierarchy and layout while changes are still inexpensive." },
      { id: "research-question", level: 1, skill: "UX research", question: "Which interview question is least leading?", choices: ["Don't you love the new checkout?", "Wouldn't you use this every day?", "Tell me about the last time you checked out online", "Is this the best design?"], answer: 2, explain: "Asking about a real past experience invites specific, less biased evidence." },
      { id: "design-affordance", level: 1, skill: "Product thinking", question: "A control should look clickable and clearly communicate its action. This is most closely related to:", choices: ["Affordance and signifiers", "Database normalization", "Color temperature", "Network latency"], answer: 0, explain: "Affordances and signifiers help people understand what actions are possible." },
      { id: "design-button", level: 1, skill: "Accessibility", question: "Why is a real button preferable to a clickable div for an action?", choices: ["It provides built-in keyboard and assistive technology behavior", "It is always visually larger", "It needs no label", "It prevents all errors"], answer: 0, explain: "Native buttons support keyboard activation and expose the correct semantics by default." },
      { id: "design-hierarchy", level: 1, skill: "Product thinking", question: "What is visual hierarchy intended to help a person do?", choices: ["Notice and understand the most important information first", "Make every element equally prominent", "Use more colors on every screen", "Avoid writing labels"], answer: 0, explain: "Hierarchy guides attention so people can understand what matters and what to do next." },
      { id: "design-feedback", level: 1, skill: "Prototyping", question: "After a person submits a form, what should the interface provide?", choices: ["Clear feedback about whether the submission worked", "No response", "A different page title only", "A hidden keyboard shortcut"], answer: 0, explain: "Timely feedback helps users understand the result of their action." },
      { id: "research-metric", level: 2, skill: "UX research", question: "In a usability test, which observation is most useful for finding a navigation problem?", choices: ["Where participants hesitate or take an unexpected route", "Which participant likes the brand color", "How many screens are in the prototype", "The designer's preferred menu label"], answer: 0, explain: "Behavior and friction reveal where an interface is not matching users' expectations." },
      { id: "a-b-test", level: 2, skill: "Data storytelling", question: "An A/B test shows a small lift after one day with very few users. What should the team do?", choices: ["Wait for sufficient data and check the test design before deciding", "Declare a winner immediately", "Change both variants each hour", "Ignore the original success metric"], answer: 0, explain: "Small samples and short durations can produce misleading results; use a sound test plan and enough data." },
      { id: "design-system", level: 2, skill: "Design systems", question: "What is a useful reason to define design tokens for color and spacing?", choices: ["Consistent updates can be shared across components", "Tokens prevent all accessibility issues", "They replace component documentation", "They make user research unnecessary"], answer: 0, explain: "Tokens centralize shared values, making consistency and future changes easier." },
      { id: "research-sample", level: 2, skill: "UX research", question: "You are evaluating a feature for older adults but recruited only your design team. What is the main risk?", choices: ["The sample may not reflect the people who will use the feature", "The prototype will load too slowly", "The font will change automatically", "The research has too many metrics"], answer: 0, explain: "Recruit participants who reflect the target audience to avoid drawing conclusions from an unrepresentative sample." },
      { id: "responsive", level: 2, skill: "Prototyping", question: "A mobile layout has crowded controls. What is the best next step?", choices: ["Test priority and interaction at the small breakpoint, then revise layout", "Scale every desktop element down equally", "Remove labels from all controls", "Disable zoom"], answer: 0, explain: "Responsive design should preserve priorities and usable interactions at each viewport." },
      { id: "measure-task", level: 2, skill: "Data storytelling", question: "Which measure most directly shows whether users can complete a key task?", choices: ["Task completion rate", "Number of brand colors", "Team meeting length", "Total page count"], answer: 0, explain: "Task completion is a direct outcome measure for usability." },
      { id: "prototype-fidelity", level: 2, skill: "Prototyping", question: "When is a low-fidelity prototype especially useful?", choices: ["When the team needs to compare concepts quickly", "When measuring final production latency", "After every decision is locked", "When user feedback is not wanted"], answer: 0, explain: "Low-fidelity prototypes make it cheap to explore and compare ideas early." },
      { id: "progressive-disclosure", level: 2, skill: "Product thinking", question: "A settings screen overwhelms new users with rarely used options. Which design pattern can reduce the initial cognitive load?", choices: ["Progressive disclosure of advanced options", "Show every option expanded by default", "Remove all labels", "Use a different color for each option"], answer: 0, explain: "Progressive disclosure keeps essential choices visible while making advanced controls available when needed." },
      { id: "experiment-confound", level: 3, skill: "Data storytelling", question: "A redesign and a marketing campaign launch together, then sign-ups rise. What limits the conclusion that the redesign caused the lift?", choices: ["The campaign is a confounding change", "The metric is quantitative", "The page has a headline", "The test used a prototype"], answer: 0, explain: "Because two changes happened together, the team cannot isolate which caused the change." },
      { id: "accessibility-keyboard", level: 3, skill: "Accessibility", question: "A custom dialog opens visually but keyboard users can tab to controls behind it. What should be addressed?", choices: ["Move focus into the dialog and keep navigation within it until closed", "Change the dialog's border radius", "Hide the close button", "Add more animations"], answer: 0, explain: "A modal dialog should manage focus so keyboard users stay in its context and can exit deliberately." },
      { id: "research-triangulation", level: 3, skill: "UX research", question: "Interviewees say they want a feature, but product analytics show little related behavior. What is the strongest next research move?", choices: ["Triangulate methods and investigate the context behind stated needs and behavior", "Ignore interviews and analytics", "Ship the feature without testing", "Ask the same yes/no question again"], answer: 0, explain: "Combining methods helps explain why stated preferences and observed behavior differ." },
      { id: "roadmap-outcome", level: 3, skill: "Product thinking", question: "Which roadmap item is strongest?", choices: ["Improve onboarding completion for first-time users", "Build a carousel because a competitor has one", "Add 12 settings screens", "Use the latest animation library"], answer: 0, explain: "Outcome-oriented work connects a user problem to a measurable result." },
      { id: "metric-guardrail", level: 3, skill: "Data storytelling", question: "A change increases clicks but also increases accidental submissions. What should the team do?", choices: ["Review a guardrail metric and balance the outcome before rollout", "Optimize clicks alone", "Hide the error rate", "Stop collecting user feedback"], answer: 0, explain: "Guardrail metrics detect harm or regressions while optimizing a primary outcome." },
      { id: "design-ethics", level: 3, skill: "Product thinking", question: "A team proposes a confusing cancellation flow to reduce churn. What should a designer advocate for?", choices: ["A clear, fair cancellation path and measurement of genuine user value", "More hidden steps", "Removing cancellation information", "Dark patterns that make exit difficult"], answer: 0, explain: "Ethical design makes meaningful choices clear and earns retention through value rather than obstruction." },
      { id: "design-variance", level: 3, skill: "Design systems", question: "A component has many one-off variants. What is the best way to decide whether to add another system variant?", choices: ["Check for a recurring need, clear semantics, and documented usage", "Add one for every individual request", "Remove all component documentation", "Use color alone to distinguish states"], answer: 0, explain: "A design system should encode repeatable patterns with clear meaning, not accumulate arbitrary exceptions." },
      { id: "research-prioritize", level: 3, skill: "UX research", question: "Two usability issues compete for attention. Which is the better first priority?", choices: ["The one that blocks a critical task for more users", "The one that is easiest to discuss", "The one the designer noticed first", "The one with the newest visual style"], answer: 0, explain: "Prioritize by user impact, task criticality, and how broadly the issue affects people." }
    ]
  };

  const assessmentDialog = document.getElementById("assessment-dialog");
  const assessmentContent = document.getElementById("assessment-content");
  let baselineComplete = readStored("skillbridge-baseline-complete", false) === true;
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  let assessmentSession = null;
  const startAssessment = (options = {}) => {
    const kind = trackType();
    const requiredBaseline = options.requiredBaseline === true;
    assessmentSession = {
      kind,
      selectedSkill: requiredBaseline ? "all" : learningFocus().name,
      selectedLevel: requiredBaseline ? "1" : "all",
      requiredBaseline,
      questions: [],
      index: 0,
      correct: 0,
      answers: []
    };
    document.getElementById("assessment-title").textContent = requiredBaseline ? "Your quick skills check" : `${track().label} assessment`;
    document.getElementById("close-assessment").hidden = requiredBaseline;
    renderAssessmentIntro();
    assessmentDialog.showModal();
  };

  const prepareAssessmentQuestions = () => {
    const savedHistory = readStored("skillbridge-question-history", {});
    const historyByTrack = savedHistory && typeof savedHistory === "object" && !Array.isArray(savedHistory) ? { ...savedHistory } : {};
    const storedTrackHistory = historyByTrack[assessmentSession.kind];
    const trackHistory = storedTrackHistory && typeof storedTrackHistory === "object" && !Array.isArray(storedTrackHistory)
      ? { ...storedTrackHistory }
      : {};
    const selected = [];
    const skills = assessmentSession.selectedSkill === "all"
      ? tracks[assessmentSession.kind].skills
      : tracks[assessmentSession.kind].skills.filter((skill) => skill.name === assessmentSession.selectedSkill);
    const levels = assessmentSession.selectedLevel === "all"
      ? [1, 2, 3]
      : [Number(assessmentSession.selectedLevel)];
    for (const level of levels) {
      for (const skill of skills) {
        const key = `${level}:${skill.name}`;
        const pool = questionBanks[assessmentSession.kind].filter((question) => question.level === level && question.skill === skill.name);
        const used = new Set(Array.isArray(trackHistory[key]) ? trackHistory[key] : []);
        const questionCount = Math.min(assessmentSession.selectedSkill === "all" ? 1 : 2, pool.length);
        let available = shuffle(pool.filter((question) => !used.has(question.id)));
        let questions = available.slice(0, questionCount);
        if (questions.length < questionCount) {
          const selectedIds = new Set(questions.map((question) => question.id));
          used.clear();
          const recycled = shuffle(pool.filter((question) => !selectedIds.has(question.id)));
          questions = questions.concat(recycled.slice(0, questionCount - questions.length));
        }
        if (questions.length === 0) throw new Error(`No level ${level} assessment questions are available for ${skill.name}.`);
        selected.push(...questions);
        questions.forEach((question) => used.add(question.id));
        trackHistory[key] = [...used];
      }
    }
    historyByTrack[assessmentSession.kind] = trackHistory;
    saveStored("skillbridge-question-history", historyByTrack);
    assessmentSession.questions = selected;
    assessmentSession.index = 0;
    assessmentSession.correct = 0;
    assessmentSession.answers = [];
    renderQuestion();
  };

  const renderAssessmentIntro = () => {
    const skills = tracks[assessmentSession.kind].skills;
    const selectedSkill = assessmentSession.selectedSkill;
    const selectedLevel = assessmentSession.selectedLevel;
    const numberOfSkills = selectedSkill === "all" ? skills.length : 1;
    const numberOfLevels = selectedLevel === "all" ? 3 : 1;
    const questionCount = numberOfSkills * (selectedSkill === "all" ? 1 : 2) * numberOfLevels;
    const subjectLabel = selectedSkill === "all" ? `all ${skills.length} ${escapeHtml(tracks[assessmentSession.kind].label)} skills` : escapeHtml(selectedSkill);
    const levelLabel = selectedLevel === "all" ? "all three levels" : `Level ${selectedLevel}`;
    const selectors = assessmentSession.requiredBaseline ? "" : `<div class="assessment-selectors"><label for="assessment-skill-select">Skill or language<select id="assessment-skill-select"><option value="all"${selectedSkill === "all" ? " selected" : ""}>All skills · ${escapeHtml(tracks[assessmentSession.kind].label)}</option>${skills.map((skill) => `<option value="${escapeHtml(skill.name)}"${skill.name === selectedSkill ? " selected" : ""}>${escapeHtml(skill.name)}</option>`).join("")}</select></label><label for="assessment-level-select">Difficulty level<select id="assessment-level-select"><option value="all"${selectedLevel === "all" ? " selected" : ""}>All levels · 1 to 3</option><option value="1"${selectedLevel === "1" ? " selected" : ""}>Level 1 · Foundations</option><option value="2"${selectedLevel === "2" ? " selected" : ""}>Level 2 · Applied</option><option value="3"${selectedLevel === "3" ? " selected" : ""}>Level 3 · Advanced</option></select></label></div>`;
    const intro = assessmentSession.requiredBaseline
      ? `<p>Welcome to SkillBridge AI. Complete this quick baseline before continuing so we can personalize your dashboard. It takes about two minutes: one randomized foundation question for each of your ${skills.length} career skills.</p>`
      : `<p>Choose what you want to study and assess. Each level gets harder: Level 1 checks foundations, Level 2 applies concepts, and Level 3 tests deeper reasoning. Questions and answer choices are randomized and rotate before they repeat.</p>`;
    const guidance = assessmentSession.requiredBaseline
      ? "<li>Your dashboard unlocks as soon as you finish all six questions.</li><li>You can take focused skill and advanced level tests any time afterward.</li>"
      : "<li>Each selected skill is tested at the difficulty you choose.</li><li>Every answer includes an explanation; your results update skill confidence and recommendations.</li>";
    assessmentContent.innerHTML = `<div class="assessment-intro">${intro}${selectors}<ul>${guidance}</ul><div class="assessment-footer"><span class="assessment-count" id="assessment-selection-summary">${questionCount} questions · ${subjectLabel} · ${levelLabel}</span><button class="button button-primary" type="button" id="begin-assessment">${assessmentSession.requiredBaseline ? "Start quick check" : "Start test"} <span>→</span></button></div></div>`;
    if (assessmentSession.requiredBaseline) {
      document.getElementById("begin-assessment").addEventListener("click", prepareAssessmentQuestions);
      return;
    }
    const skillSelect = document.getElementById("assessment-skill-select");
    const levelSelect = document.getElementById("assessment-level-select");
    const updateSelection = () => {
      assessmentSession.selectedSkill = skillSelect.value;
      assessmentSession.selectedLevel = levelSelect.value;
      const numberOfSkills = assessmentSession.selectedSkill === "all" ? skills.length : 1;
      const numberOfLevels = assessmentSession.selectedLevel === "all" ? 3 : 1;
      const questionCount = numberOfSkills * (assessmentSession.selectedSkill === "all" ? 1 : 2) * numberOfLevels;
      const subjectLabel = assessmentSession.selectedSkill === "all"
        ? `all ${skills.length} ${tracks[assessmentSession.kind].label} skills`
        : assessmentSession.selectedSkill;
      const levelLabel = assessmentSession.selectedLevel === "all" ? "all three levels" : `Level ${assessmentSession.selectedLevel}`;
      document.getElementById("assessment-selection-summary").textContent = `${questionCount} questions · ${subjectLabel} · ${levelLabel}`;
    };
    skillSelect.addEventListener("change", updateSelection);
    levelSelect.addEventListener("change", updateSelection);
    document.getElementById("begin-assessment").addEventListener("click", prepareAssessmentQuestions);
  };

  const renderQuestion = () => {
    const question = assessmentSession.questions[assessmentSession.index];
    const choices = shuffle(question.choices.map((text, index) => ({ text, correct: index === question.answer })));
    assessmentSession.currentChoices = choices;
    const index = assessmentSession.index;
    assessmentContent.innerHTML = `<div class="assessment-progress"><span class="assessment-level">LEVEL ${question.level} / 3</span><div class="assessment-progress-track"><span style="width:${((index + 1) / assessmentSession.questions.length) * 100}%"></span></div><span class="assessment-count">${index + 1} of ${assessmentSession.questions.length}</span></div><span class="assessment-skill">${escapeHtml(question.skill)}</span><h3 class="assessment-question">${escapeHtml(question.question)}</h3><div class="assessment-choices">${choices.map((choice, choiceIndex) => `<button class="assessment-choice" type="button" data-choice="${choiceIndex}"><span class="choice-letter">${String.fromCharCode(65 + choiceIndex)}</span><span>${escapeHtml(choice.text)}</span></button>`).join("")}</div><div id="assessment-feedback"></div><div class="assessment-footer"><span class="assessment-count">Difficulty increases at every level.</span><button class="button button-primary" type="button" id="next-question" hidden>${index === assessmentSession.questions.length - 1 ? "See results" : "Next question"} <span>→</span></button></div>`;
    assessmentContent.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = choices[Number(button.dataset.choice)];
        const correct = selected.correct;
        if (correct) assessmentSession.correct += 1;
        assessmentSession.answers.push({ skill: question.skill, correct });
        assessmentContent.querySelectorAll("[data-choice]").forEach((choiceButton) => {
          const option = choices[Number(choiceButton.dataset.choice)];
          choiceButton.disabled = true;
          if (option.correct) choiceButton.classList.add("correct");
          else if (choiceButton === button) choiceButton.classList.add("incorrect");
        });
        document.getElementById("assessment-feedback").innerHTML = `<div class="assessment-feedback"><strong>${correct ? "That's right." : "Not quite."}</strong> ${escapeHtml(question.explain)}</div>`;
        document.getElementById("next-question").hidden = false;
        document.getElementById("next-question").focus();
      });
    });
    document.getElementById("next-question").addEventListener("click", () => {
      if (assessmentSession.index === assessmentSession.questions.length - 1) finishAssessment();
      else {
        assessmentSession.index += 1;
        renderQuestion();
      }
    });
  };

  const finishAssessment = () => {
    const percentage = Math.round(assessmentSession.correct / assessmentSession.questions.length * 100);
    const savedSkillsForTrack = persistedSkills[assessmentSession.kind];
    const skills = savedSkillsForTrack && typeof savedSkillsForTrack === "object" && !Array.isArray(savedSkillsForTrack) ? savedSkillsForTrack : {};
    const grouped = {};
    assessmentSession.answers.forEach(({ skill, correct }) => {
      if (!grouped[skill]) grouped[skill] = { correct: 0, total: 0 };
      grouped[skill].total += 1;
      if (correct) grouped[skill].correct += 1;
    });
    Object.entries(grouped).forEach(([name, result]) => {
      const original = tracks[assessmentSession.kind].skills.find((skill) => skill.name === name).score;
      const existing = Number.isFinite(skills[name]) ? skills[name] : original;
      const delta = result.correct === result.total ? 4 : result.correct === 0 ? -5 : 0;
      skills[name] = Math.max(0, Math.min(100, existing + delta));
    });
    persistedSkills[assessmentSession.kind] = skills;
    saveStored("skillbridge-skill-state", persistedSkills);
    assessmentResults[assessmentSession.kind] = {
      score: percentage,
      correct: assessmentSession.correct,
      total: assessmentSession.questions.length,
      date: new Date().toISOString()
    };
    saveStored("skillbridge-assessment-results", assessmentResults);
    assessmentHistory.unshift({
      kind: assessmentSession.kind,
      skill: assessmentSession.selectedSkill,
      level: assessmentSession.selectedLevel,
      score: percentage,
      correct: assessmentSession.correct,
      total: assessmentSession.questions.length,
      date: new Date().toISOString()
    });
    assessmentHistory.splice(20);
    saveStored("skillbridge-assessment-history", assessmentHistory);
    if (assessmentSession.requiredBaseline) {
      baselineComplete = true;
      saveStored("skillbridge-baseline-complete", true);
      document.getElementById("close-assessment").hidden = false;
    }
    renderPersonalization();
    const lowest = learningFocus();
    document.getElementById("improved-count").textContent = Object.keys(grouped).length;
    document.getElementById("path-completion").innerHTML = `${Math.min(90, 25 + Object.keys(assessmentResults).length * 10)}<small>%</small>`;
    const outcome = percentage < 50
      ? `Your team spotted an opportunity to strengthen ${lowest.name}. The Learning Architect has moved a foundation resource to the top of your plan.`
      : `Strong work. Your team updated skill confidence and prioritized ${lowest.name} as your next growth opportunity.`;
    const assessedLevels = [...new Set(assessmentSession.questions.map((question) => question.level))].sort();
    const levelSummary = assessedLevels.map((level) => `Level ${level}`).join(", ");
    const subjectSummary = assessmentSession.selectedSkill === "all"
      ? `${tracks[assessmentSession.kind].label} skills`
      : assessmentSession.selectedSkill;
    assessmentContent.innerHTML = `<div class="assessment-result"><p class="eyebrow eyebrow-muted">${assessmentSession.requiredBaseline ? "BASELINE COMPLETE · DASHBOARD UNLOCKED" : "YOUR TEAM'S JOINT ASSESSMENT"}</p><div class="assessment-result-score">${percentage}<span>%</span></div><p>You answered ${assessmentSession.correct} of ${assessmentSession.questions.length} questions correctly for ${escapeHtml(subjectSummary)} (${levelSummary}).</p><p class="agent-result-note">${outcome}<br><br><strong>Skill Analyst</strong> updated your skill evidence. <strong>Career Matcher</strong> recalculated role fit. <strong>Learning Architect</strong> reprioritized your resources. <strong>Progress Coach</strong> recorded this milestone.</p><div class="assessment-footer"><button class="button button-secondary" type="button" id="close-assessment-result">Done</button><button class="button button-primary" type="button" id="view-adaptive-plan">View my updated plan <span>→</span></button></div></div>`;
    document.getElementById("close-assessment-result").addEventListener("click", () => assessmentDialog.close());
    document.getElementById("view-adaptive-plan").addEventListener("click", () => {
      assessmentDialog.close();
      navigate("learning");
    });
  };

  document.querySelectorAll("[data-start-assessment]").forEach((button) => button.addEventListener("click", startAssessment));
  document.getElementById("close-assessment").addEventListener("click", () => {
    if (!baselineComplete) return;
    assessmentDialog.close();
  });
  assessmentDialog.addEventListener("cancel", (event) => {
    if (!baselineComplete) event.preventDefault();
  });

  const closeMenu = () => {
    sidebar.classList.remove("mobile-open");
    backdrop.classList.remove("visible");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const navigate = (viewName) => {
    const target = document.getElementById(`view-${viewName}`);
    if (!target) return;
    views.forEach((view) => view.classList.toggle("active", view === target));
    navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
    currentPage.textContent = target.dataset.pageTitle;
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.querySelectorAll("[data-view]").forEach((control) => {
    control.addEventListener("click", () => navigate(control.dataset.view));
  });
  document.querySelectorAll("[data-view-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.dataset.viewLink);
    });
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("mobile-open");
    backdrop.classList.toggle("visible", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  backdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const storedTheme = readStored("skillbridge-theme", "light");
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
    });
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#151720" : "#f6f7fb";
    saveStored("skillbridge-theme", theme);
  };
  setTheme(storedTheme === "dark" ? "dark" : "light");
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
  });

  const notificationDefaults = {
    learningReminders: true,
    careerMatches: true,
    progressUpdates: false,
    mentorTips: true
  };
  const notificationSettings = { ...notificationDefaults, ...readStored("skillbridge-notifications", {}) };
  document.querySelectorAll("[data-setting]").forEach((input) => {
    const setting = input.dataset.setting;
    input.checked = Boolean(notificationSettings[setting]);
    input.addEventListener("change", () => {
      notificationSettings[setting] = input.checked;
      saveStored("skillbridge-notifications", notificationSettings);
      const status = document.getElementById("notification-saved");
      status.textContent = "Your preferences are saved.";
      clearTimeout(status.timeout);
      status.timeout = setTimeout(() => { status.textContent = ""; }, 2200);
    });
  });

  const addCourseToPlan = (button) => {
    const courseId = button.dataset.addCourse;
    const savedPlan = readStored("skillbridge-learning-plan", []);
    const plan = Array.isArray(savedPlan) ? savedPlan : [];
    if (plan.includes(courseId)) {
      showToast("This course is already in your plan.");
      return;
    }
    plan.push(courseId);
    saveStored("skillbridge-learning-plan", plan);
    renderLearning();
    showToast("Added to your learning plan.");
  };
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-course]");
    if (button) addCourseToPlan(button);
  });

  document.querySelectorAll("[data-career-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-career-filter]").forEach((filter) => filter.classList.toggle("selected", filter === button));
      document.querySelectorAll(".career-result").forEach((card) => {
        card.hidden = button.dataset.careerFilter === "growth" && card.dataset.growth !== "high";
      });
    });
  });

  document.getElementById("career-results").addEventListener("click", (event) => {
    const button = event.target.closest("[data-career]");
    if (!button) return;
    const role = button.dataset.career;
    showToast(`${role}: your profile is a strong match. Ask your AI mentor how to prepare.`);
  });

  const openProfileEditor = () => {
    profileForm.elements.name.value = profile.name;
    profileForm.elements.role.value = profile.role;
    profileForm.elements.goal.value = profile.goal;
    profileForm.elements.about.value = profile.about;
    profileForm.elements.skills.value = profile.skills;
    profileForm.elements.certifications.value = profile.certifications;
    profileForm.elements.projects.value = profile.projects;
    profileForm.elements.portfolio.value = profile.portfolio;
    profileDialog.showModal();
  };
  document.getElementById("edit-profile").addEventListener("click", openProfileEditor);
  document.getElementById("portfolio-action").addEventListener("click", openProfileEditor);
  document.getElementById("close-profile-dialog").addEventListener("click", () => profileDialog.close());
  document.getElementById("cancel-profile-dialog").addEventListener("click", () => profileDialog.close());
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    profile.name = profileForm.elements.name.value.trim() || defaultProfile.name;
    profile.role = profileForm.elements.role.value.trim() || defaultProfile.role;
    profile.goal = profileForm.elements.goal.value.trim() || defaultProfile.goal;
    profile.about = profileForm.elements.about.value.trim() || defaultProfile.about;
    profile.skills = profileForm.elements.skills.value.trim() || defaultProfile.skills;
    profile.certifications = profileForm.elements.certifications.value.trim();
    profile.projects = profileForm.elements.projects.value.trim();
    profile.portfolio = profileForm.elements.portfolio.value.trim();
    saveStored("skillbridge-profile", profile);
    renderProfile();
    renderPersonalization();
    profileDialog.close();
    showToast(`Your profile and ${track().label} learning path have been updated.`);
  });

  const chatMessages = document.getElementById("chat-messages");
  const mentorInput = document.getElementById("mentor-input");
  const sendButton = document.querySelector(".send-button");
  const form = document.getElementById("mentor-form");
  const setComposerState = () => {
    sendButton.disabled = mentorInput.value.trim().length === 0;
    mentorInput.style.height = "auto";
    mentorInput.style.height = `${Math.min(mentorInput.scrollHeight, 120)}px`;
  };
  mentorInput.addEventListener("input", setComposerState);
  mentorInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!sendButton.disabled) form.requestSubmit();
    }
  });

  const mentorReply = (message) => {
    const text = message.toLowerCase();
    const goal = track().label;
    const focus = learningFocus().name;
    const isDeveloper = trackType() === "fullstack";
    const latest = lastResult();
    if (latest && latest.score < 50 && /skill|learn|practice|stuck|plan|week/.test(text)) {
      return `Your last assessment showed that a little more practice would help. Let's make it manageable: start with ${focus}, use the first guided resource in your plan, and build one tiny example. Your ${goal} path has been adjusted around that result. What part would you like to practice together?`;
    }
    if (/portfolio|project|case study/.test(text)) {
      return isDeveloper
        ? `Let's make your ${goal} skills visible. Build a small full-stack app: a React interface, a Node.js API, and a simple SQL data model. Start with one user flow, make the smallest working version, then document the trade-offs and what you'd improve next. Your current focus is ${focus}. Want to sketch the first feature together?`
        : `Let's make your product thinking visible. Choose a small problem, talk to 3 people who experience it, sketch a few solutions, then build a clickable prototype and write a short case study about what you learned. That process—not just polished screens—will make your portfolio stand out. Want to pick a problem together?`;
    }
    if (/week|plan|focus|priorit/.test(text)) {
      return isDeveloper
        ? `Let's keep this week doable: (1) practice ${focus} for 30 minutes, (2) add one small feature to a project, and (3) explain what you learned in a few notes. Your path prioritizes the foundations before moving on to React and Node.js. Which day feels easiest to start?`
        : `Let's keep this week doable: (1) spend 30 minutes exploring a prototyping tool, (2) sketch one flow for a real problem, and (3) ask someone for feedback. Small, specific steps beat a perfect plan you can't fit in. Which day feels easiest to start?`;
    }
    if (/interview|resume|job|apply/.test(text)) {
      return isDeveloper
        ? `For a ${goal} interview, prepare to explain a project from browser to database: the user problem, how your UI talks to your API, how you modeled the data, and one trade-off you made. You don't need to know everything—show how you reason and learn. What kind of project have you worked on so far?`
        : "For your next interview, prepare one example that shows how you used research to change a design decision. Explain the context, your contribution, and what improved. Then bring a thoughtful question about how the team learns from users. What kind of role are you preparing for?";
    }
    if (/stuck|lost|unsure|overwhelm|anxious|confidence/.test(text)) {
      return "It’s completely normal to feel that way when you’re figuring out what’s next. You don’t need to solve your whole career today. Let’s make it smaller: what’s one part of your current work that gives you energy, and one thing you wish you could do more often? We can use those clues to find a next step that feels like yours.";
    }
    if (/skill|learn|prototyp|practice|improv/.test(text)) {
      return isDeveloper
        ? `Based on your goal, ${focus} is the best next skill to work on. Try a tiny exercise: build one feature, test it with a sample input, and write down what surprised you. Then add that feature to a small project. You will learn more from a complete, small loop than from watching a long tutorial. Want a practice prompt for ${focus}?`
        : `Based on your goals, ${focus} is a great skill to build next. Try this: take one user problem, sketch a solution in 10 minutes, then make a simple clickable version and ask one person to try it. You'll learn more from that small experiment than from waiting until you feel like an expert. Want me to help you choose a project?`;
    }
    if (/career|role|product designer|direction|next step/.test(text)) {
      return isDeveloper
        ? `Your Python and SQL foundations are a useful start toward ${goal}. The biggest gaps are JavaScript, React, and Node.js, so your path builds them in sequence. A small project that connects a React interface to an API is a good way to show those skills. Which part sounds most interesting?`
        : `Your product thinking and UX research line up well with ${goal}. To grow, focus on showing how you guide decisions, bring teammates along, and measure outcomes. A small portfolio project can demonstrate all three. Which part would you like to work on first?`;
    }
    return `Thanks for sharing that with me. From what I know about your goals, you're working toward ${goal}, and your next growth area is ${focus}. We can break things down together—would it help to talk through a career decision, make a learning plan, or practice for an interview?`;
  };

  const appendMessage = (message, isUser) => {
    const wrapper = document.createElement("div");
    wrapper.className = `message ${isUser ? "user-message" : "mentor-message"}`;
    if (!isUser) {
      const avatar = document.createElement("div");
      avatar.className = "message-avatar";
      avatar.textContent = "✦";
      wrapper.appendChild(avatar);
    }
    const content = document.createElement("div");
    content.className = "message-content";
    const sender = document.createElement("span");
    sender.className = "message-sender";
    sender.textContent = isUser ? "YOU" : "YOUR AI MENTOR";
    const time = document.createElement("time");
    time.textContent = "JUST NOW";
    sender.appendChild(time);
    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    bubble.appendChild(paragraph);
    content.append(sender, bubble);
    wrapper.appendChild(content);
    chatMessages.appendChild(wrapper);
    wrapper.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = mentorInput.value.trim();
    if (!message) return;
    appendMessage(message, true);
    mentorInput.value = "";
    setComposerState();
    document.getElementById("mentor-suggestions").hidden = true;
    sendButton.disabled = true;
    setTimeout(() => appendMessage(mentorReply(message), false), 450);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prompt]");
    if (button) {
      navigate("mentor");
      mentorInput.value = button.dataset.prompt;
      setComposerState();
      mentorInput.focus();
    }
  });

  document.getElementById("clear-chat").addEventListener("click", () => {
    chatMessages.replaceChildren();
    const welcome = document.createElement("div");
    welcome.className = "message mentor-message";
    welcome.innerHTML = '<div class="message-avatar">✦</div><div class="message-content"><span class="message-sender">YOUR AI MENTOR <time>JUST NOW</time></span><div class="message-bubble" id="mentor-welcome"></div></div>';
    chatMessages.appendChild(welcome);
    document.getElementById("mentor-welcome").textContent = `Fresh start, ${profile.name.trim().split(/\s+/)[0] || "there"}. What would you like to work through for your ${track().label} goal?`;
    const suggestions = document.createElement("div");
    suggestions.className = "mentor-suggestions";
    suggestions.id = "mentor-suggestions";
    const suggestionLabel = document.createElement("span");
    suggestionLabel.textContent = "Not sure where to start?";
    const suggestionButtons = document.createElement("div");
    [
      ["How can I build a portfolio project?", "Build a portfolio project"],
      ["What should I focus on this week?", "Plan my week"],
      ["How can I prepare for an interview?", "Prep for an interview"]
    ].forEach(([prompt, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-chip";
      button.dataset.prompt = prompt;
      button.textContent = label;
      suggestionButtons.appendChild(button);
    });
    suggestions.append(suggestionLabel, suggestionButtons);
    chatMessages.appendChild(suggestions);
    showToast("Started a fresh conversation.");
  });

  if (!baselineComplete) startAssessment({ requiredBaseline: true });
})();
