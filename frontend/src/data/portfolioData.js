export const personalInfo = {
  name: "Suryakiran P. J.",
  role: "Python Full Stack Developer",
  tagline: "Building modern, responsive and scalable web experiences with Python and modern frontend technologies.",
  email: "suryakiranpjineesh@gmail.com",
  github: "https://github.com/skiran-ai",
  linkedin: "https://www.linkedin.com/in/surya-kiran-967659351",
  instagram: "https://www.instagram.com/jstt.kiran",
  education: {
    degree: "Bachelor of Science in Computer Science",
    institution: "MG University, Kerala, India"
  },
  summary: "Enthusiastic and results-driven Python Full Stack Developer with a solid foundation in computer science and full-stack architecture. Passionate about building robust backend APIs using Python & Django, paired with dynamic, responsive user interfaces built with React.js, JavaScript, and Bootstrap 5. Adept at problem-solving, clean code design, and continuous technical growth.",
  stats: [
    { label: "Frontend Mastery", value: "React.js & JS", detail: "Modern UI / UX Component Architecture" },
    { label: "Backend Core", value: "Python & Django", detail: "Scalable REST APIs & Database Design" },
    { label: "Full Stack Vision", value: "End-to-End", detail: "Seamless API Integration & State" },
    { label: "Learning Mindset", value: "Continuous", detail: "Clean Architecture & Industry Standards" }
  ]
};

export const skillsData = {
  frontend: [
    { name: "HTML5", badge: "Semantic Markup", icon: "Code" },
    { name: "CSS3", badge: "Flexbox / Grid / Glassmorphism", icon: "Layers" },
    { name: "Bootstrap 5", badge: "Responsive Layouts", icon: "Layout" },
    { name: "JavaScript", badge: "ES6+ Async / Promises", icon: "Terminal" },
    { name: "React.js", badge: "Hooks & Component Architecture", icon: "Cpu" }
  ],
  backend: [
    { name: "Python", badge: "Core & OOP Architecture", icon: "Terminal" },
    { name: "Django", badge: "MTV / MVC Architecture & ORM", icon: "Database" },
    { name: "Django REST Framework", badge: "RESTful API Endpoints", icon: "Globe" },
    { name: "Database Design", badge: "Relational Modeling & Queries", icon: "Database" }
  ],
  tools: [
    { name: "Git", badge: "Version Control", icon: "Shield" },
    { name: "GitHub", badge: "Collaboration & Repos", icon: "Github" },
    { name: "VS Code", badge: "Development Environment", icon: "Code" },
    { name: "Postman", badge: "API Testing & Docs", icon: "Globe" }
  ],
  development: [
    { name: "Responsive Web Design", badge: "Mobile-First 320px to 4K", icon: "Smartphone" },
    { name: "REST APIs", badge: "JSON Serialization & HTTP", icon: "Globe" },
    { name: "UI Development", badge: "Modern Developer Aesthetic", icon: "Sparkles" },
    { name: "Full Stack Development", badge: "Integrated Frontend & Backend", icon: "Layers" }
  ]
};

export const projectsData = [
  {
    id: "devnexus",
    title: "DevNexus — Full Stack Project Manager",
    category: "Full Stack",
    shortDesc: "Comprehensive developer collaboration platform with Django REST API backend and React frontend.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Django", "React.js", "REST API", "Bootstrap 5", "PostgreSQL"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Developers and small teams struggle to track projects, manage API documentation, and sync frontend/backend tasks seamlessly in one place.",
      solution: "Built a full-stack web application featuring Django backend authentication, REST APIs, and a sleek React glassmorphism dashboard.",
      features: [
        "Django REST Framework authentication & JWT token management",
        "React interactive Kanban board with real-time state updates",
        "REST API endpoints for task CRUD operations",
        "Responsive Bootstrap 5 grid with dark/light themes"
      ],
      role: "Lead Full Stack Developer (Designed DB models, Django APIs, and React UI components)"
    }
  },
  {
    id: "swiftcart",
    title: "SwiftCart — Modern E-Commerce Engine",
    category: "Full Stack",
    shortDesc: "High-performance full stack e-commerce system built with Django ORM, React, and Bootstrap.",
    image: "https://images.unsplash.com/photo-1556742049-0a67d577c77e?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Django", "React.js", "Bootstrap 5", "REST API", "SQLite"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Need for a fast, responsive e-commerce application with secure checkout flow, product categorization, and admin product management.",
      solution: "Developed a full-stack platform leveraging Django's robust backend security and ORM, combined with React for dynamic shopping cart state.",
      features: [
        "Product search, category filter, and dynamic shopping cart",
        "Django admin panel integration for catalog management",
        "Secure REST API endpoints for orders and contact queries",
        "Fully responsive interface across mobile, tablet, and desktop"
      ],
      role: "Full Stack Developer"
    }
  },
  {
    id: "pyengine-api",
    title: "PyEngine — Django REST API Service",
    category: "Backend",
    shortDesc: "Scalable backend service architecture featuring custom serializers, authentication, and endpoint throttling.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Django", "Django REST Framework", "Postman", "Git"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Building reliable, clean backend APIs that handle data validation, error handling, and structured JSON output for client apps.",
      solution: "Engineered a modular Django app with reusable serializers, robust viewsets, and automated input validation.",
      features: [
        "Custom DRF Serializers for nested data structures",
        "Robust error handling and standardized HTTP response codes",
        "Postman collection setup for thorough endpoint testing",
        "Clean project modularity and environment variable configuration"
      ],
      role: "Backend Python Developer"
    }
  },
  {
    id: "dataflow-processor",
    title: "DataFlow — Python Async Data Pipeline",
    category: "Backend",
    shortDesc: "Python backend script and Django service for parsing, processing, and storing structured data feeds.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Django ORM", "JSON", "REST Architecture"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Handling large batches of incoming user data requires structured parsing and database insertion without blocking operations.",
      solution: "Created Python scripts integrated into Django management commands to automate data ingestion into relational models.",
      features: [
        "Automated batch processing and validation",
        "Django ORM optimization for bulk create operations",
        "Error logging and transaction atomic guards",
        "CLI integration and Django backend command runner"
      ],
      role: "Backend Engineer"
    }
  },
  {
    id: "portfolio-app",
    title: "Suryakiran P. J. — Interactive Portfolio",
    category: "Frontend",
    shortDesc: "Premium developer portfolio web app built with React, Bootstrap 5, Glassmorphism CSS, and Django API.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Bootstrap 5", "Django API"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Traditional resume documents fail to showcase interactive frontend development capabilities, dark mode theme systems, and API integrations.",
      solution: "Designed and engineered this custom React portfolio app with glassmorphism UI, project filter tabs, ATS CV modal viewer, and Django contact backend.",
      features: [
        "Responsive Bootstrap 5 grid layout with custom CSS tokens",
        "Interactive ATS-friendly CV Viewer & PDF generator",
        "Floating portfolio AI Chatbot widget with instant answers",
        "Dark & Light mode persistence using LocalStorage"
      ],
      role: "UI/UX & Frontend Developer"
    }
  },
  {
    id: "taskmatrix",
    title: "TaskMatrix — Task Workspace UI",
    category: "Frontend",
    shortDesc: "Interactive React single-page application for task planning with local state persistence.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
    technologies: ["React.js", "JavaScript ES6+", "HTML5", "CSS3", "Bootstrap 5"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Users need a responsive, zero-lag task board interface to organize daily software sprint items.",
      solution: "Constructed a component-based React UI featuring clean state management and micro-animations.",
      features: [
        "Filterable task lists and priority badges",
        "LocalStorage state persistence across browser sessions",
        "Responsive design tuned for mobile and desktop screens",
        "Accessible keyboard navigation and visible focus styles"
      ],
      role: "Frontend Developer"
    }
  }
];

export const chatbotKnowledgeBase = [
  {
    keywords: ["who", "suryakiran", "about", "bio", "background", "person"],
    answer: "Suryakiran P. J. is a passionate Python Full Stack Developer based in Kerala, India. He holds a B.Sc. in Computer Science from MG University and specializes in building end-to-end web applications using Python, Django, React.js, JavaScript, and Bootstrap 5."
  },
  {
    keywords: ["skill", "stack", "technology", "technologies", "python", "django", "react", "html", "css", "javascript"],
    answer: "Suryakiran's technical toolkit includes:\n• Frontend: HTML5, CSS3, Bootstrap 5, JavaScript, React.js\n• Backend: Python, Django, Django REST Framework, Databases\n• Tools: Git, GitHub, VS Code, Postman\n• Core: REST API Architecture, Responsive Web Design & Full Stack Architecture."
  },
  {
    keywords: ["project", "projects", "work", "portfolio", "built", "showcase", "full stack", "frontend", "backend"],
    answer: "Suryakiran has built projects across Frontend, Backend, and Full Stack categories, including:\n1. DevNexus — Full Stack Project Manager (React + Django)\n2. SwiftCart — Modern E-Commerce Engine (Django + React)\n3. PyEngine — Django REST API Service (Python/DRF)\n4. Suryakiran Portfolio — Interactive Web Experience (React + Django API)\nYou can filter projects by category in the Projects section!"
  },
  {
    keywords: ["cv", "resume", "download", "pdf", "education", "degree"],
    answer: "You can view Suryakiran's complete ATS-friendly CV by clicking the 'View CV' button in the navigation or Hero section! You can also download the PDF version directly from the CV modal."
  },
  {
    keywords: ["contact", "email", "reach", "hire", "connect", "message", "touch"],
    answer: "You can contact Suryakiran directly via:\n• Email: suryakiranpjineesh@gmail.com\n• LinkedIn: linkedin.com/in/surya-kiran-967659351\n• GitHub: github.com/skiran-ai\n• Or send a message using the Contact section below!"
  },
  {
    keywords: ["github", "linkedin", "instagram", "social", "link"],
    answer: "Here are Suryakiran's official links:\n• GitHub: https://github.com/skiran-ai\n• LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351\n• Instagram: https://www.instagram.com/jstt.kiran"
  }
];
