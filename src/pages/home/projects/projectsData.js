/* ═══════════════════════════════════════════════
   PROJECT DATA — single source of truth
   ───────────────────────────────────────────────
   The projects list, the letter hover previews and the case-study
   panel are all rendered from this file. To update a project, edit
   this data only.

   ▸ Live link   → `liveUrl`
   ▸ Repository  → `githubUrl`
   ▸ Screenshots → add files under /public/projects/<id>/ and list
     them under `cover` / `gallery`. Anything left empty falls back to
   a styled "coming soon" state, so nothing ever shows a broken image.
   ▸ Hover previews → `previews`: screenshot crops ({ src }) or short
     text tiles ({ tile }). `format` is "square" or "portrait" (4:5).
   ═══════════════════════════════════════════════ */

export const PROJECTS = [
  {
    id: "lendi-zone",
    index: "01",
    name: "lendi zone",
    title: "Lendi Zone",
    technologies: ["ReactJS", "TypeScript", "Tailwind CSS", "MongoDB", "PostgreSQL"],
    cover: "/projects/lendi-zone/cover.webp",
    gallery: [],
    liveUrl: "https://lendi-zone-liet.vercel.app/auth",
    previews: [
      { src: "/projects/lendi-zone/previews/lendi-01-square.webp", format: "square" },
      { tile: { en: "Realtime attendance", fr: "Présences en temps réel" }, format: "portrait" },
      { src: "/projects/lendi-zone/previews/lendi-02-portrait.webp", format: "portrait" },
      { src: "/projects/lendi-zone/previews/lendi-03-square.webp", format: "square" },
      { tile: { en: "Role dashboards", fr: "Tableaux par rôle" }, format: "square" },
      { src: "/projects/lendi-zone/previews/lendi-04-portrait.webp", format: "portrait" },
    ],
    en: {
      category: "College ERP / LMS",
      status: "Live Product",
      tagline:
        "A role-based ERP and learning management platform actively used by students and faculty.",
      overview:
        "Lendi Zone is a comprehensive, role-based ERP/LMS platform built to run the day-to-day academic operations of a college — real-time attendance, student data, automated timetables and complex academic workflows — from a single interface. It is deployed and actively used by students and faculty.",
      purpose:
        "Academic operations were spread across disconnected registers, spreadsheets and notice boards. Lendi Zone brings attendance, records, timetables, approvals and communication into one role-aware system.",
      highlights: [
        "Role-based dashboards for Principal, HOD, Faculty & Students",
        "Realtime attendance, chat groups and live data sync",
        "AI-powered analytics with Excel bulk import",
      ],
      features: [
        {
          title: "Academic Operations",
          items: [
            "Real-time attendance management",
            "Centralised student data management",
            "Automated timetables",
            "Multi-tier leave approval workflows",
          ],
        },
        {
          title: "Roles & Access",
          items: [
            "Secure authentication with MongoDB Auth",
            "Dynamic dashboards for Principal, HOD, Faculty and Students",
            "Role-based access across every module",
          ],
        },
        {
          title: "Realtime & Communication",
          items: [
            "Real-time communication and chat groups",
            "Live dashboards kept in sync through MongoDB realtime channels",
          ],
        },
        {
          title: "Data & Reporting",
          items: [
            "AI-powered analytics",
            "Robust Excel bulk-import modules",
            "Interactive reporting features",
            "Scalable PostgreSQL backend",
          ],
        },
      ],
      recognition:
        "Deployed and actively used by students and faculty for real-time academic management, communication and analytics.",
      coverAlt: "Lendi Zone sign-in screen: the Lendi Zone logo, feature shortcuts and the login form",
    },
    fr: {
      category: "ERP / LMS universitaire",
      status: "Produit en ligne",
      tagline:
        "Une plateforme ERP et de gestion de l’apprentissage, fondée sur les rôles, utilisée au quotidien par les étudiants et les enseignants.",
      overview:
        "Lendi Zone est une plateforme ERP/LMS complète, fondée sur les rôles, conçue pour piloter au quotidien les opérations académiques d’un établissement — présences en temps réel, données étudiantes, emplois du temps automatisés et workflows académiques complexes — depuis une interface unique. Elle est déployée et utilisée activement par les étudiants et les enseignants.",
      purpose:
        "Les opérations académiques étaient dispersées entre registres, tableurs et panneaux d’affichage. Lendi Zone réunit présences, dossiers, emplois du temps, validations et communication dans un seul système adapté à chaque rôle.",
      highlights: [
        "Tableaux de bord par rôle pour la direction, les chefs de département, les enseignants et les étudiants",
        "Présences, groupes de discussion et données synchronisés en temps réel",
        "Analyses assistées par l’IA avec import en masse depuis Excel",
      ],
      features: [
        {
          title: "Opérations académiques",
          items: [
            "Gestion des présences en temps réel",
            "Gestion centralisée des données étudiantes",
            "Emplois du temps automatisés",
            "Circuits de validation des congés à plusieurs niveaux",
          ],
        },
        {
          title: "Rôles et accès",
          items: [
            "Authentification sécurisée avec MongoDB Auth",
            "Tableaux de bord dynamiques pour la direction, les chefs de département, les enseignants et les étudiants",
            "Contrôle d’accès par rôle sur chaque module",
          ],
        },
        {
          title: "Temps réel et communication",
          items: [
            "Communication en temps réel et groupes de discussion",
            "Tableaux de bord synchronisés en direct via les canaux temps réel de MongoDB",
          ],
        },
        {
          title: "Données et reporting",
          items: [
            "Analyses assistées par l’IA",
            "Modules robustes d’import en masse depuis Excel",
            "Rapports interactifs",
            "Back-end PostgreSQL évolutif",
          ],
        },
      ],
      recognition:
        "Déployée et utilisée activement par les étudiants et les enseignants pour la gestion académique, la communication et l’analyse en temps réel.",
      coverAlt:
        "Écran de connexion de Lendi Zone : le logo Lendi Zone, les raccourcis de fonctionnalités et le formulaire de connexion",
    },
  },

  {
    id: "gram-vikas",
    index: "02",
    name: "gram vikas",
    title: "Gram Vikas",
    technologies: ["AI", "Edge Computing", "NLP", "Voice Assistance", "Offline-First"],
    gallery: [],
    previews: [
      { tile: { en: "Crop diagnosis", fr: "Diagnostic des cultures" }, format: "square" },
      { tile: { en: "Pocket Doctor", fr: "Pocket Doctor" }, format: "portrait" },
      { tile: { en: "Emergency SOS", fr: "SOS d’urgence" }, format: "square" },
      { tile: { en: "Works offline", fr: "Fonctionne hors ligne" }, format: "portrait" },
      { tile: { en: "Voice, many languages", fr: "Voix multilingue" }, format: "square" },
      { tile: { en: "Hackathon winner 2026", fr: "Lauréat hackathon 2026" }, format: "portrait" },
    ],
    en: {
      category: "AI-Powered Rural Assistance & Healthcare",
      status: "Innovation Idea",
      tagline:
        "An offline-first AI companion bringing agriculture, healthcare and emergency support to rural communities.",
      overview:
        "Gram Vikas is an offline-first AI companion designed for rural communities — combining real-time crop disease diagnosis, multi-lingual voice assistance, on-device health scanning and emergency support into a single accessible product concept.",
      purpose:
        "Rural users face unreliable connectivity and language barriers. Gram Vikas is designed to run at the edge, on-device and multi-lingually, so assistance does not depend on the network.",
      highlights: [
        "Offline-first AI companion for rural communities",
        "Pocket Doctor — on-device vitals and pregnancy tracking",
        "Emergency SOS with localised resource mapping",
      ],
      features: [
        {
          title: "Agriculture",
          items: [
            "Real-time crop disease diagnosis",
            "Multi-lingual agricultural voice assistance",
            "Live commodity market pricing",
          ],
        },
        {
          title: "Pocket Doctor",
          items: [
            "Edge-computing health scanners",
            "Instant on-device vitals monitoring",
            "Pregnancy tracking without internet dependency",
          ],
        },
        {
          title: "Emergency & Access",
          items: [
            "Emergency SOS system",
            "Localised resource mapping for hospitals, disaster centres and agricultural hubs",
          ],
        },
        {
          title: "Engagement",
          items: [
            "Government scheme tracking",
            "NLP-driven chatbot for accessible rural engagement",
          ],
        },
      ],
      recognition:
        "VIET Hackathon 2026 Winner — multilingual, edge-powered assistance and market insights.",
    },
    fr: {
      category: "Assistance rurale et santé propulsées par l’IA",
      status: "Concept innovant",
      tagline:
        "Un compagnon IA pensé hors ligne d’abord, qui apporte agriculture, santé et aide d’urgence aux communautés rurales.",
      overview:
        "Gram Vikas est un compagnon IA conçu hors ligne d’abord pour les communautés rurales. Il réunit en un seul concept accessible le diagnostic des maladies des cultures en temps réel, une assistance vocale multilingue, l’analyse de santé sur l’appareil et l’aide d’urgence.",
      purpose:
        "Les utilisateurs ruraux font face à une connectivité instable et à des barrières linguistiques. Gram Vikas est pensé pour fonctionner en périphérie, sur l’appareil et en plusieurs langues, afin que l’assistance ne dépende pas du réseau.",
      highlights: [
        "Compagnon IA hors ligne d’abord pour les communautés rurales",
        "Pocket Doctor — signes vitaux et suivi de grossesse sur l’appareil",
        "SOS d’urgence avec cartographie locale des ressources",
      ],
      features: [
        {
          title: "Agriculture",
          items: [
            "Diagnostic des maladies des cultures en temps réel",
            "Assistance vocale agricole multilingue",
            "Cours des marchés agricoles en direct",
          ],
        },
        {
          title: "Pocket Doctor",
          items: [
            "Scanners de santé en edge computing",
            "Suivi instantané des signes vitaux sur l’appareil",
            "Suivi de grossesse sans dépendance à internet",
          ],
        },
        {
          title: "Urgence et accès",
          items: [
            "Système SOS d’urgence",
            "Cartographie locale des ressources : hôpitaux, centres de secours et pôles agricoles",
          ],
        },
        {
          title: "Engagement",
          items: [
            "Suivi des programmes gouvernementaux",
            "Chatbot fondé sur le NLP pour un accès facilité en milieu rural",
          ],
        },
      ],
      recognition:
        "Lauréat du VIET Hackathon 2026 — assistance multilingue en edge computing et informations de marché.",
    },
  },

  {
    id: "orbitguard",
    index: "03",
    name: "orbitguard",
    title: "OrbitGuard",
    technologies: [
      "AI",
      "SGP4",
      "Satellite Tracking",
      "3D Visualization",
      "Orbital Mechanics",
      "Supabase",
      "React",
      "Python",
    ],
    cover: "/projects/orbitguard/cover.webp",
    gallery: [],
    previews: [
      { src: "/projects/orbitguard/previews/orbit-01-square.webp", format: "square" },
      { tile: { en: "SGP4 propagation", fr: "Propagation SGP4" }, format: "portrait" },
      { src: "/projects/orbitguard/previews/orbit-02-portrait.webp", format: "portrait" },
      { src: "/projects/orbitguard/previews/orbit-03-square.webp", format: "square" },
      { tile: { en: "Collision alerts", fr: "Alertes de collision" }, format: "square" },
      { src: "/projects/orbitguard/previews/orbit-04-portrait.webp", format: "portrait" },
    ],
    en: {
      category: "AI-Powered Orbital Safety & Space Situational Awareness",
      status: "Full-Stack Build",
      tagline:
        "An AI-assisted orbital safety platform using real satellite catalog data, SGP4 propagation, conjunction screening and 3D visualization to monitor orbital objects and simulate collision-avoidance strategies.",
      overview:
        "OrbitGuard is an AI-assisted orbital safety platform that uses real satellite catalog data, SGP4 propagation, conjunction screening and 3D visualization to monitor orbital objects, identify potential close approaches and simulate collision-avoidance strategies.",
      purpose:
        "Space situational awareness requires continuous orbital monitoring. OrbitGuard brings satellite tracking, conjunction analysis and AI-assisted decision support into a single interactive 3D interface.",
      highlights: [
        "Real-time 3D satellite tracking using live orbital catalog data and continuous SGP4 propagation",
        "Orbital conjunction screening with closest-approach analysis and explainable risk assessment",
        "AI-assisted maneuver simulation and mission decision support",
      ],
      features: [
        {
          title: "Orbital Tracking",
          items: [
            "Real-time 3D satellite tracking using live orbital catalog data and continuous SGP4 propagation",
            "Interactive 3D Earth visualization with orbital trajectory rendering",
            "Selected satellite detail view with orbital parameters",
          ],
        },
        {
          title: "Conjunction Screening",
          items: [
            "Closest-approach analysis with risk assessment",
            "Explainable collision-risk alerts",
            "Configurable screening thresholds",
          ],
        },
        {
          title: "AI-Assisted Analysis",
          items: [
            "AI-assisted mission analysis and decision support",
            "Simulated maneuver planning for collision avoidance",
            "Automated risk classification and prioritisation",
          ],
        },
      ],
      coverAlt: "OrbitGuard 3D view: Earth surrounded by satellite orbits, with one tracked satellite highlighted",
    },
    fr: {
      category: "Sécurité orbitale et surveillance de l’espace assistées par l’IA",
      status: "Projet full-stack",
      tagline:
        "Une plateforme de sécurité orbitale assistée par l’IA, qui s’appuie sur de vrais catalogues de satellites, la propagation SGP4, la détection de conjonctions et la visualisation 3D pour surveiller les objets en orbite et simuler des stratégies d’évitement de collision.",
      overview:
        "OrbitGuard est une plateforme de sécurité orbitale assistée par l’IA qui utilise de vraies données de catalogues de satellites, la propagation SGP4, la détection de conjonctions et la visualisation 3D pour surveiller les objets en orbite, repérer les rapprochements potentiels et simuler des stratégies d’évitement de collision.",
      purpose:
        "La surveillance de l’espace exige un suivi orbital continu. OrbitGuard réunit suivi des satellites, analyse des conjonctions et aide à la décision assistée par l’IA dans une interface 3D interactive unique.",
      highlights: [
        "Suivi 3D des satellites en temps réel, à partir de données orbitales en direct et d’une propagation SGP4 continue",
        "Détection des conjonctions orbitales avec analyse du rapprochement maximal et évaluation explicable du risque",
        "Simulation de manœuvres et aide à la décision de mission assistées par l’IA",
      ],
      features: [
        {
          title: "Suivi orbital",
          items: [
            "Suivi 3D des satellites en temps réel, à partir de données orbitales en direct et d’une propagation SGP4 continue",
            "Visualisation 3D interactive de la Terre avec rendu des trajectoires orbitales",
            "Vue détaillée du satellite sélectionné avec ses paramètres orbitaux",
          ],
        },
        {
          title: "Détection de conjonctions",
          items: [
            "Analyse du rapprochement maximal avec évaluation du risque",
            "Alertes de risque de collision explicables",
            "Seuils de détection configurables",
          ],
        },
        {
          title: "Analyse assistée par l’IA",
          items: [
            "Analyse de mission et aide à la décision assistées par l’IA",
            "Planification simulée de manœuvres d’évitement",
            "Classification et priorisation automatiques des risques",
          ],
        },
      ],
      coverAlt:
        "Vue 3D d’OrbitGuard : la Terre entourée d’orbites de satellites, avec un satellite suivi mis en évidence",
    },
  },

  {
    id: "verifly",
    index: "04",
    name: "verifly",
    title: "Verifly",
    technologies: ["ReactJS", "Node.js", "Supabase", "AI", "Three.js"],
    liveUrl: "https://verify-eight-sandy.vercel.app/",
    cover: "/projects/verifly/cover.webp",
    gallery: [],
    previews: [
      { tile: { en: "3D digital twin", fr: "Jumeau numérique 3D" }, format: "portrait" },
      { tile: { en: "AI scheduling", fr: "Planification IA" }, format: "square" },
      { tile: { en: "Evidence-based progress", fr: "Avancement prouvé" }, format: "portrait" },
      { tile: { en: "Risk & audit", fr: "Risques & audit" }, format: "square" },
      { tile: { en: "Oil & gas", fr: "Pétrole & gaz" }, format: "square" },
    ],
    en: {
      category: "Intelligent Project Management for Oil & Gas",
      status: "Full-Stack Build",
      tagline:
        "Infrastructure project management with AI verification and a 3D digital twin of the field.",
      overview:
        "Verifly is a browser-based project management platform for oil & gas companies, taking complex infrastructure projects from planning through field execution to verified progress — with AI-powered scheduling, evidence-based work submission and a 3D digital twin of the project environment.",
      purpose:
        "Field progress on large infrastructure projects is hard to verify remotely. Verifly pairs evidence-based submission with AI verification and approval workflows.",
      highlights: [
        "AI-powered scheduling and evidence-based verification",
        "Centralised WBS, material, risk and audit modules",
        "3D digital twin for monitoring field environments",
      ],
      features: [
        {
          title: "Execution & Verification",
          items: [
            "Planning through field execution in one platform",
            "Evidence-based work submission",
            "AI verification with approval workflows",
            "Real-time progress tracking",
          ],
        },
        {
          title: "Planning & Teams",
          items: [
            "Role-based access control",
            "AI-powered scheduling",
            "Team and work assignment",
            "WBS (work breakdown structure) management",
          ],
        },
        {
          title: "Centralised Modules",
          items: [
            "Project, team and material management",
            "Risk management",
            "Reporting, audit and notification modules",
          ],
        },
        {
          title: "3D Digital Twin",
          items: [
            "Digital twin of the oil & gas project environment",
            "Monitoring and visualising field infrastructure",
          ],
        },
      ],
    },
    fr: {
      category: "Gestion de projet intelligente pour le pétrole et le gaz",
      status: "Projet full-stack",
      tagline:
        "La gestion de projets d’infrastructure, avec vérification par l’IA et jumeau numérique 3D du terrain.",
      overview:
        "Verifly est une plateforme web de gestion de projet pour les entreprises du pétrole et du gaz. Elle accompagne des projets d’infrastructure complexes de la planification à l’exécution sur le terrain jusqu’à la vérification de l’avancement — avec une planification assistée par l’IA, une remontée des travaux fondée sur des preuves et un jumeau numérique 3D de l’environnement du projet.",
      purpose:
        "Sur les grands projets d’infrastructure, l’avancement terrain est difficile à vérifier à distance. Verifly associe des remontées fondées sur des preuves à une vérification par l’IA et à des circuits de validation.",
      highlights: [
        "Planification assistée par l’IA et vérification fondée sur des preuves",
        "Modules centralisés de WBS, de matériel, de risques et d’audit",
        "Jumeau numérique 3D pour surveiller le terrain",
      ],
      features: [
        {
          title: "Exécution et vérification",
          items: [
            "De la planification à l’exécution terrain sur une seule plateforme",
            "Remontée des travaux fondée sur des preuves",
            "Vérification par l’IA avec circuits de validation",
            "Suivi de l’avancement en temps réel",
          ],
        },
        {
          title: "Planification et équipes",
          items: [
            "Contrôle d’accès par rôle",
            "Planification assistée par l’IA",
            "Affectation des équipes et des tâches",
            "Gestion de la WBS (structure de découpage du projet)",
          ],
        },
        {
          title: "Modules centralisés",
          items: [
            "Gestion des projets, des équipes et du matériel",
            "Gestion des risques",
            "Modules de reporting, d’audit et de notifications",
          ],
        },
        {
          title: "Jumeau numérique 3D",
          items: [
            "Jumeau numérique de l’environnement du projet pétrolier et gazier",
            "Surveillance et visualisation des infrastructures terrain",
          ],
        },
      ],
    },
  },
]

export const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map((project) => [project.id, project]))

// The project's copy in the active language, falling back to English
export function getProjectCopy(project, language) {
  return project[language] ?? project.en
}
