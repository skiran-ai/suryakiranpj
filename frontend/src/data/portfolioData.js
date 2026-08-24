export const personalInfo = {
  name: "Suryakiran P. J.",
  role: "Python Full Stack & AI Engineer",
  tagline: "Building modern scalable web apps, autonomous AI agents, verified RAG pipelines, and fine-tuned LLMs.",
  email: "suryakiranpjineesh@gmail.com",
  github: "https://github.com/skiran-ai",
  linkedin: "https://www.linkedin.com/in/surya-kiran-967659351",
  instagram: "https://www.instagram.com/jstt.kiran",
  education: {
    degree: "Bachelor of Science in Computer Science",
    institution: "MG University, Kerala, India"
  },
  summary: "Enthusiastic and results-driven Python Full Stack & AI Engineer with a solid foundation in computer science, full-stack web architecture, and modern Generative AI engineering. Passionate about building robust backend APIs using Python & Django/FastAPI, paired with dynamic React user interfaces, autonomous tool-calling AI agents, verified RAG systems, and domain fine-tuned LLM architectures.",
  stats: [
    { label: "AI & LLM Systems", value: "Agents & RAG", detail: "LangGraph, LlamaIndex, QLoRA Fine-Tuning" },
    { label: "Backend Core", value: "Python & Django", detail: "FastAPI, Scalable REST APIs & ORM" },
    { label: "Frontend Mastery", value: "React.js & JS", detail: "Modern Component Architecture & UI/UX" },
    { label: "Full Stack Vision", value: "End-to-End", detail: "Production AI SaaS & Data Pipelines" }
  ]
};

export const skillsData = {
  ai: [
    { name: "AI Agents & Tool Calling", badge: "LangGraph, ReAct Loops & Code Sandbox", icon: "Bot" },
    { name: "Agentic RAG Systems", badge: "LlamaIndex, Hybrid Search & Hallucination Grading", icon: "Sparkles" },
    { name: "LLM Fine-Tuning", badge: "QLoRA, Unsloth, PEFT & SFTTrainer", icon: "Cpu" },
    { name: "Vector Databases & Search", badge: "ChromaDB, Qdrant, BM25 & BGE-Reranker", icon: "Database" },
    { name: "Foundation Models & Inference", badge: "OpenAI, Claude, vLLM, Ollama & Prompting", icon: "Terminal" }
  ],
  frontend: [
    { name: "HTML5", badge: "Semantic Markup & Accessibility", icon: "Code" },
    { name: "CSS3", badge: "Flexbox / Grid / Glassmorphism", icon: "Layers" },
    { name: "Bootstrap 5", badge: "Responsive Layouts", icon: "Layout" },
    { name: "JavaScript", badge: "ES6+ Async / Promises", icon: "Terminal" },
    { name: "React.js", badge: "Hooks & Component Architecture", icon: "Cpu" }
  ],
  backend: [
    { name: "Python", badge: "Core & OOP Architecture", icon: "Terminal" },
    { name: "Django", badge: "MTV / MVC Architecture & ORM", icon: "Database" },
    { name: "Django REST Framework", badge: "RESTful API Endpoints", icon: "Globe" },
    { name: "FastAPI", badge: "High-Speed Async APIs & SSE", icon: "Zap" },
    { name: "Database Design", badge: "Relational Modeling & Queries", icon: "Database" }
  ],
  tools: [
    { name: "Git & GitHub", badge: "Version Control & Collaboration", icon: "Github" },
    { name: "Docker", badge: "Containerization & Sandboxed Envs", icon: "Shield" },
    { name: "VS Code", badge: "Development Environment", icon: "Code" },
    { name: "Postman", badge: "API Testing & Automated Specs", icon: "Globe" },
    { name: "Weights & Biases", badge: "ML Experiment Tracking", icon: "Sparkles" }
  ],
  development: [
    { name: "GenAI SaaS Architecture", badge: "Multi-Tenant, Streaming & Billing", icon: "Layers" },
    { name: "REST & Streaming APIs", badge: "JSON Serialization & Server-Sent Events", icon: "Globe" },
    { name: "Responsive Web Design", badge: "Mobile-First 320px to 4K", icon: "Smartphone" },
    { name: "Full Stack Development", badge: "Integrated Frontend & Backend", icon: "Layers" }
  ]
};

export const projectsData = [
  {
    id: "datasense-ai",
    title: "DataSense AI — Autonomous AI Data Analyst & BI Agent",
    category: "AI/ML",
    shortDesc: "Autonomous AI data analyst that ingests CSVs/SQL databases, writes and executes Python/SQL in a secure sandbox, and synthesizes interactive charts & statistical reports.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "LangChain", "LangGraph", "Claude / OpenAI API", "DuckDB", "Pandas", "Plotly", "Docker Sandbox"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Business users, data teams, and founders lose days waiting for engineering teams to write intricate SQL queries, run ad-hoc statistical analyses in pandas, and format visualization charts.",
      solution: "Engineered an autonomous ReAct AI agent with LangGraph state graphs. The agent inspects database schemas, writes and validates SQL/Python code inside an isolated Docker execution sandbox, detects statistical anomalies, and generates responsive charts with plain-English executive summaries.",
      features: [
        "Natural language to SQL and Python query execution with AST validation",
        "Isolated Docker sandbox for secure runtime data transformations",
        "Auto-generated interactive charts (Plotly, ECharts, heatmaps, cohort breakdowns)",
        "Database connector integration: PostgreSQL, SQLite, DuckDB, and direct CSV/Parquet uploads",
        "Plain-English executive summaries with automated outlier & anomaly detection"
      ],
      role: "AI Systems & Full Stack Engineer (Architected LangGraph state machine, tool-calling loop, and React data visualization dashboard)"
    }
  },
  {
    id: "omnirag-assistant",
    title: "OmniRAG — Agentic Document Intelligence & Verification Engine",
    category: "AI/ML",
    shortDesc: "Enterprise Agentic RAG assistant that executes multi-step document retrieval, semantic chunking, factual hallucination grading, and precise page/line source citation attribution.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "LlamaIndex", "LangChain", "Qdrant / ChromaDB", "Hybrid Search (BM25 + Dense)", "FastAPI", "React.js", "BGE-Reranker"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Traditional naive RAG architectures frequently hallucinate, lose cross-document context, fail on complex multi-hop research questions, and lack verifiable page/paragraph citation attribution.",
      solution: "Constructed an Agentic Self-Reflective RAG architecture. Combines hierarchical semantic chunking, hybrid retrieval (BM25 lexical + dense embeddings), dynamic query rewriting, a cross-encoder reranker, and an automated Hallucination Grader that double-checks claims against retrieved text before generating verified responses with clickable inline citations.",
      features: [
        "Self-correcting agentic loop with automated hallucination scoring and query reformulation",
        "Multi-format document ingestion: PDF, DOCX, Markdown, scanned tables via OCR",
        "Hybrid Search combining dense vector cosine similarity with sparse BM25 keyword matching",
        "Cross-Encoder Re-ranking (BGE-Reranker) for ultra-high contextual relevance",
        "Interactive source citation drawer with page previews and exact snippet highlight overlays"
      ],
      role: "AI Engineer & Backend Architect (Designed semantic chunking pipelines, vector indexing, hallucination evaluation gates, and streaming API)"
    }
  },
  {
    id: "synapse-saas",
    title: "SynapseSaaS — AI Code Reviewer & Architecture Studio",
    category: "Full Stack",
    shortDesc: "Production GenAI SaaS platform featuring multi-tenant auth, real-time GitHub PR webhooks, token-by-token streaming code reviews, and automated architecture diagram synthesis.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    technologies: ["React.js", "Python", "Django REST Framework", "Claude 3.5 Sonnet", "PostgreSQL", "Redis & Celery", "Stripe API", "Server-Sent Events (SSE)"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "Software development teams suffer from slow pull request reviews, undetected security vulnerabilities, inconsistent design patterns, and outdated architectural documentation.",
      solution: "Engineered a commercial-grade, multi-tenant GenAI SaaS application. Features secure JWT/OAuth authentication, automated GitHub repository webhook integration, streaming token-by-token code reviews, architectural Mermaid diagram synthesis, and tier-based API rate limiting with Stripe billing.",
      features: [
        "Real-time GitHub Pull Request automated code review bot & security vulnerability scanner",
        "Streaming SSE (Server-Sent Events) interactive AI code refactoring co-pilot",
        "Automated architectural flow diagram generation (Mermaid.js / System Topology)",
        "Full SaaS architecture: Multi-tenant RBAC, JWT auth, Stripe billing & subscription metering",
        "Background async workers using Celery & Redis for heavy repository AST parsing"
      ],
      role: "Lead Full Stack & AI SaaS Engineer (Designed multi-tenant Django backend, Celery workers, React dashboard, and LLM prompt/streaming pipeline)"
    }
  },
  {
    id: "finguard-llm",
    title: "FinGuard-LLM — Domain-Specialized Financial & Compliance LLM",
    category: "AI/ML",
    shortDesc: "Domain-specialized 7B parameter LLM fine-tuned using QLoRA & Unsloth on 50k+ curated SEC 10-K filings and legal compliance contracts for risk assessment and quantitative reasoning.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "PyTorch", "Hugging Face Transformers", "QLoRA / PEFT", "Unsloth", "vLLM / Ollama", "Weights & Biases", "TRL (SFTTrainer)"],
    githubUrl: "https://github.com/skiran-ai",
    liveUrl: "https://github.com/skiran-ai",
    details: {
      problem: "General-purpose foundation LLMs frequently hallucinate complex financial metrics, struggle with strict regulatory compliance jargon, and cost significant API token fees at scale.",
      solution: "Orchestrated an end-to-end open-source LLM fine-tuning pipeline. Prepared and cleaned a 50,000+ instruction dataset from SEC 10-K filings and financial disclosure reports. Fine-tuned Mistral-7B / LLaMA-3 using 4-bit QLoRA and Unsloth on NVIDIA GPUs, achieving a 34% reduction in financial extraction error rate and 4x lower inference latency via vLLM.",
      features: [
        "Custom dataset curation, synthetic data generation, and cleaning pipeline using Python & Pandas",
        "Parameter-Efficient Fine-Tuning (PEFT / QLoRA) on LLaMA-3 / Mistral-7B architecture",
        "Automated evaluation benchmarks: ROUGE, BLEU, Perplexity, and Custom Financial QA Accuracy",
        "Quantization to 4-bit GGUF and deployment via vLLM high-throughput inference server",
        "Full experiment tracking and loss convergence monitoring with Weights & Biases (W&B)"
      ],
      role: "Machine Learning & LLM Engineer (Data preprocessing, synthetic QA generation, QLoRA training runs, and vLLM deployment)"
    }
  },
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
    answer: "Suryakiran P. J. is a passionate Python Full Stack & AI Engineer based in Kerala, India. He holds a B.Sc. in Computer Science from MG University and specializes in building end-to-end web applications, autonomous AI agents, verified RAG systems, and fine-tuned LLM architectures."
  },
  {
    keywords: ["ai", "agents", "rag", "llm", "fine-tuning", "genai", "datasense", "omnirag", "synapse", "finguard"],
    answer: "Suryakiran has built 4 production-grade AI & GenAI projects:\n1. 📊 DataSense AI: Autonomous AI Data Analyst Agent with NL-to-SQL/Python, code sandbox execution, and interactive chart synthesis.\n2. 🔍 OmniRAG: Enterprise Agentic RAG Assistant with hybrid search, cross-encoder re-ranking, hallucination grading, and inline source citations.\n3. ⚡ SynapseSaaS: Full-Stack GenAI Code Reviewer & Architecture Co-Pilot with SSE streaming, GitHub webhooks, and Stripe billing.\n4. 🧠 FinGuard-LLM: Open-source 7B LLM fine-tuned with QLoRA/Unsloth on 50k+ SEC filings for financial & legal compliance reasoning."
  },
  {
    keywords: ["skill", "stack", "technology", "technologies", "python", "django", "react", "html", "css", "javascript", "langchain", "llamaindex"],
    answer: "Suryakiran's technical toolkit includes:\n• AI & LLM: LangGraph, LangChain, LlamaIndex, QLoRA, Unsloth, Hugging Face, PyTorch, Vector DBs (Chroma/Qdrant), vLLM, OpenAI & Claude APIs\n• Backend: Python, Django, Django REST Framework, FastAPI, PostgreSQL, SQLite, Celery & Redis\n• Frontend: React.js, JavaScript (ES6+), Bootstrap 5, Glassmorphism CSS, Plotly/ECharts, HTML5\n• Tools & DevOps: Git, GitHub, Docker, Postman, Weights & Biases, VS Code"
  },
  {
    keywords: ["project", "projects", "work", "portfolio", "built", "showcase", "full stack", "frontend", "backend", "ai/ml"],
    answer: "Suryakiran has built featured projects across AI/ML, Full Stack, Backend, and Frontend categories, including:\n1. DataSense AI — Autonomous Data Analyst & BI Agent (AI/ML)\n2. OmniRAG — Agentic Document Intelligence & Verification Engine (AI/ML)\n3. SynapseSaaS — AI Code Reviewer & Architecture Studio (Full Stack / GenAI)\n4. FinGuard-LLM — Specialized Financial & Compliance LLM (AI/ML)\n5. DevNexus — Full Stack Project Manager (React + Django)\n6. SwiftCart — Modern E-Commerce Engine (Django + React)\n7. PyEngine — Django REST API Service (Python/DRF)\nYou can filter projects by category in the Projects section!"
  },
  {
    keywords: ["data analyst", "datasense", "sql", "analysis", "chart", "csv"],
    answer: "DataSense AI is an autonomous AI data analyst agent built by Suryakiran. It allows users to upload CSVs or connect databases, ask questions in plain English, and automatically generates SQL queries, runs Python transformations inside a secure sandbox, and visualizes dynamic interactive charts."
  },
  {
    keywords: ["rag", "omnirag", "document", "knowledge", "citation", "retrieval", "hallucination"],
    answer: "OmniRAG is Suryakiran's Agentic RAG Knowledge Assistant. It goes beyond simple chatbot wrappers by implementing hybrid search (BM25 + dense vectors), cross-encoder re-ranking, automated hallucination grading, and precise page/line source citation attribution."
  },
  {
    keywords: ["saas", "synapse", "code review", "reviewer", "streaming", "webhook", "stripe"],
    answer: "SynapseSaaS is a full-stack GenAI SaaS product built with React, Django REST Framework, Celery, and Claude 3.5 Sonnet. It features real-time GitHub PR review bots, token-by-token streaming code refactoring, automated Mermaid.js architecture diagrams, and Stripe subscription billing."
  },
  {
    keywords: ["finetuning", "fine-tuning", "finguard", "lora", "qlora", "mistral", "llama", "unsloth", "finance"],
    answer: "FinGuard-LLM demonstrates open-source LLM fine-tuning. Suryakiran fine-tuned Mistral-7B / LLaMA-3 using 4-bit QLoRA and Unsloth on 50,000+ SEC 10-K financial and legal compliance filings, achieving a 34% reduction in financial extraction errors and 4x inference speedup with vLLM."
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

