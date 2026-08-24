import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
    Profile, Project, Skill, Education, Experience, Certification,
    Achievement, SocialLink, Service, SiteSetting, AIKnowledgeDocument
)

class Command(BaseCommand):
    help = 'Safely seeds initial portfolio data for Suryakiran P. J. without overwriting admin edits on deployments.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-seed all initial records even if data already exists in the database.'
        )

    def handle(self, *args, **options):
        force = options.get('force', False)
        self.stdout.write(self.style.SUCCESS(f"Checking database seed state (force={force})..."))

        # 0. Ensure Admin Superuser Exists (admin / surya007)
        admin_exists = User.objects.filter(username="admin").exists()
        if not admin_exists or force:
            admin_user, admin_created = User.objects.get_or_create(
                username="admin",
                defaults={
                    "email": "suryakiranpjineesh@gmail.com",
                    "is_staff": True,
                    "is_superuser": True
                }
            )
            if admin_created or force:
                admin_user.set_password("surya007")
                admin_user.is_staff = True
                admin_user.is_superuser = True
                admin_user.save()
                self.stdout.write(f"Admin Superuser: {'Created' if admin_created else 'Reset'} (user: admin).")
            else:
                self.stdout.write("Admin Superuser: Already exists (password and permissions preserved).")
        else:
            self.stdout.write("Admin Superuser: Already exists (preserved).")

        # 1. Profile (Preserve admin changes if record already exists)
        profile_defaults = {
            "name": "Suryakiran P. J.",
            "role": "Python Full Stack & AI Engineer",
            "tagline": "Building modern scalable web apps, autonomous AI agents, verified RAG pipelines, and fine-tuned LLMs.",
            "summary": "Enthusiastic and results-driven Python Full Stack & AI Engineer with a solid foundation in computer science, full-stack web architecture, and modern Generative AI engineering. Passionate about building robust backend APIs using Python & Django/FastAPI, paired with dynamic React user interfaces, autonomous tool-calling AI agents, verified RAG systems, and domain fine-tuned LLM architectures.",
            "location": "Kerala, India",
            "github_url": "https://github.com/skiran-ai",
            "linkedin_url": "https://www.linkedin.com/in/surya-kiran-967659351",
            "instagram_url": "https://www.instagram.com/jstt.kiran",
            "resume_pdf_url": "/assets/Suryakiran-PJ-CV.pdf",
            "availability": "Available for Full-time Roles & High-Impact AI Projects",
            "is_active": True
        }
        if not Profile.objects.exists() or force:
            if force:
                Profile.objects.update_or_create(
                    email="suryakiranpjineesh@gmail.com",
                    defaults=profile_defaults
                )
            else:
                Profile.objects.get_or_create(
                    email="suryakiranpjineesh@gmail.com",
                    defaults=profile_defaults
                )
            self.stdout.write("Profile: Seeded/Updated.")
        else:
            self.stdout.write("Profile: Already configured in database (preserved).")

        # 2. Site Setting & Privacy Switch (Idempotent - never resets custom admin mode)
        site_defaults = {
            "privacy_mode": 'PUBLIC',
            "maintenance_message": "System undergoing planned architecture updates. Public API endpoints are temporarily guarded.",
            "allow_contact_form": True,
            "allow_ai_assistant": True
        }
        if not SiteSetting.objects.exists() or force:
            setting_obj, created = SiteSetting.objects.get_or_create(
                id=1,
                defaults=site_defaults
            )
            self.stdout.write(f"Site Setting: {'Created' if created else 'Already exists (preserved)'}.")
        else:
            self.stdout.write("Site Setting: Already configured (preserved).")

        # 3. Social Links
        socials = [
            {"platform": "GitHub", "url": "https://github.com/skiran-ai", "icon_name": "Github", "order": 1, "is_visible": True},
            {"platform": "LinkedIn", "url": "https://www.linkedin.com/in/surya-kiran-967659351", "icon_name": "Linkedin", "order": 2, "is_visible": True},
            {"platform": "Instagram", "url": "https://www.instagram.com/jstt.kiran", "icon_name": "Instagram", "order": 3, "is_visible": True},
            {"platform": "Email", "url": "mailto:suryakiranpjineesh@gmail.com", "icon_name": "Mail", "order": 4, "is_visible": True},
        ]
        if not SocialLink.objects.exists() or force:
            for s in socials:
                SocialLink.objects.update_or_create(
                    platform=s["platform"],
                    defaults=s
                )
            self.stdout.write("Social Links: Initial seed complete.")
        else:
            self.stdout.write("Social Links: Already present (preserved).")

        # 4. Skills
        skills = [
            # AI & LLM Systems
            {"name": "AI Agents & Tool Calling", "category": "ai", "badge": "LangGraph, ReAct Loops & Code Sandbox", "icon_name": "Bot", "proficiency": 94, "order": 1},
            {"name": "Agentic RAG Systems", "category": "ai", "badge": "LlamaIndex, Hybrid Search & Hallucination Grading", "icon_name": "Sparkles", "proficiency": 92, "order": 2},
            {"name": "LLM Fine-Tuning", "category": "ai", "badge": "QLoRA, Unsloth, PEFT & SFTTrainer", "icon_name": "Cpu", "proficiency": 90, "order": 3},
            {"name": "Vector Databases & Search", "category": "ai", "badge": "ChromaDB, Qdrant, BM25 & BGE-Reranker", "icon_name": "Database", "proficiency": 92, "order": 4},
            {"name": "Foundation Models & Inference", "category": "ai", "badge": "OpenAI, Claude, vLLM, Ollama & Prompting", "icon_name": "Terminal", "proficiency": 95, "order": 5},

            # Frontend
            {"name": "HTML5", "category": "frontend", "badge": "Semantic Markup & Accessibility", "icon_name": "Code", "proficiency": 95, "order": 1},
            {"name": "CSS3", "category": "frontend", "badge": "Flexbox / Grid / Glassmorphism", "icon_name": "Layers", "proficiency": 92, "order": 2},
            {"name": "Bootstrap 5", "category": "frontend", "badge": "Responsive Layout System", "icon_name": "Layout", "proficiency": 95, "order": 3},
            {"name": "JavaScript", "category": "frontend", "badge": "ES6+ Async / Promises / DOM", "icon_name": "Terminal", "proficiency": 90, "order": 4},
            {"name": "React.js", "category": "frontend", "badge": "Hooks & Custom Component Architecture", "icon_name": "Cpu", "proficiency": 90, "order": 5},

            # Backend
            {"name": "Python", "category": "backend", "badge": "Core OOP & Data Structures", "icon_name": "Terminal", "proficiency": 95, "order": 1},
            {"name": "Django", "category": "backend", "badge": "MTV Architecture, ORM & Middleware", "icon_name": "Database", "proficiency": 92, "order": 2},
            {"name": "Django REST Framework", "category": "backend", "badge": "RESTful Endpoints & Serializers", "icon_name": "Globe", "proficiency": 92, "order": 3},
            {"name": "FastAPI", "category": "backend", "badge": "High-Speed Async APIs & SSE Streaming", "icon_name": "Zap", "proficiency": 90, "order": 4},
            {"name": "Relational Databases", "category": "backend", "badge": "SQL, Modeling & Optimization", "icon_name": "Database", "proficiency": 88, "order": 5},

            # Tools
            {"name": "Git & GitHub", "category": "tools", "badge": "Version Control & Branch Management", "icon_name": "Shield", "proficiency": 92, "order": 1},
            {"name": "Docker", "category": "tools", "badge": "Containerization & Sandboxed Envs", "icon_name": "Shield", "proficiency": 88, "order": 2},
            {"name": "VS Code", "category": "tools", "badge": "Primary IDE & Debugging Setup", "icon_name": "Code", "proficiency": 95, "order": 3},
            {"name": "Postman", "category": "tools", "badge": "API Testing, Automated Specs & Docs", "icon_name": "Globe", "proficiency": 90, "order": 4},
            {"name": "Weights & Biases", "category": "tools", "badge": "ML Loss & Convergence Tracking", "icon_name": "Sparkles", "proficiency": 88, "order": 5},

            # Core Development
            {"name": "GenAI SaaS Architecture", "category": "development", "badge": "Multi-Tenant, Streaming & Billing", "icon_name": "Layers", "proficiency": 92, "order": 1},
            {"name": "REST & Streaming APIs", "category": "development", "badge": "JSON Serialization & Server-Sent Events", "icon_name": "Globe", "proficiency": 94, "order": 2},
            {"name": "Responsive Web Design", "category": "development", "badge": "Mobile-First 320px to 4K", "icon_name": "Smartphone", "proficiency": 95, "order": 3},
            {"name": "Full Stack Architecture", "category": "development", "badge": "End-to-End Frontend/Backend Integration", "icon_name": "Layers", "proficiency": 92, "order": 4},
        ]
        if not Skill.objects.exists() or force:
            for sk in skills:
                Skill.objects.update_or_create(
                    name=sk["name"],
                    category=sk["category"],
                    defaults=sk
                )
            self.stdout.write("Skills: Initial seed complete.")
        else:
            self.stdout.write("Skills: Already present (preserved).")

        # 5. Education
        if not Education.objects.exists() or force:
            Education.objects.update_or_create(
                institution="MG University",
                degree="Bachelor of Science in Computer Science",
                defaults={
                    "field_of_study": "Computer Science & Software Engineering",
                    "start_year": 2020,
                    "end_year": 2023,
                    "grade": "First Class",
                    "description": "Comprehensive coursework in computer science fundamentals, data structures, object-oriented programming, database management systems, and software engineering methodologies.",
                    "order": 1
                }
            )
            self.stdout.write("Education: Initial seed complete.")
        else:
            self.stdout.write("Education: Already present (preserved).")

        # 6. Experience
        if not Experience.objects.exists() or force:
            Experience.objects.update_or_create(
                company="Independent AI & Software Engineering",
                role="Python Full Stack & AI Engineer",
                defaults={
                    "location": "Kerala, India / Remote",
                    "start_date": datetime.date(2023, 6, 1),
                    "is_current": True,
                    "summary": "Architecting and deploying production AI systems, autonomous agents, verified RAG pipelines, and full-stack web platforms using Python, Django REST Framework, FastAPI, and React.js.",
                    "bullet_points": [
                        "Engineered DataSense AI autonomous data analyst agent and OmniRAG verified knowledge engine",
                        "Built SynapseSaaS AI code reviewer platform with SSE streaming and GitHub webhooks",
                        "Fine-tuned domain-specialized 7B LLMs on SEC 10-K financial filings using QLoRA and Unsloth",
                        "Designed robust Django REST Framework APIs with rate limiting and JWT authentication"
                    ],
                    "order": 1
                }
            )
            self.stdout.write("Experience: Initial seed complete.")
        else:
            self.stdout.write("Experience: Already present (preserved).")

        # 7. Certifications
        if not Certification.objects.exists() or force:
            Certification.objects.update_or_create(
                title="Python & Django Full Stack Engineering",
                issuing_organization="Full Stack Software Academy",
                defaults={
                    "issue_date": datetime.date(2023, 5, 15),
                    "credential_id": "CERT-PY-2023-8891",
                    "credential_url": "https://github.com/skiran-ai",
                    "order": 1
                }
            )
            self.stdout.write("Certifications: Initial seed complete.")
        else:
            self.stdout.write("Certifications: Already present (preserved).")

        # 8. Achievements
        if not Achievement.objects.exists() or force:
            Achievement.objects.update_or_create(
                title="B.Sc. Computer Science Graduate with Honors",
                defaults={
                    "description": "Successfully completed degree at MG University with distinction in software engineering, algorithms, and AI projects.",
                    "metric": "First Class Honors",
                    "date": datetime.date(2023, 4, 30),
                    "order": 1
                }
            )
            self.stdout.write("Achievements: Initial seed complete.")
        else:
            self.stdout.write("Achievements: Already present (preserved).")

        # 9. Projects
        projects_data = [
            {
                "slug": "datasense-ai",
                "title": "DataSense AI — Autonomous AI Data Analyst & BI Agent",
                "category": "AI/ML",
                "short_description": "Autonomous AI data analyst that ingests CSVs/SQL databases, writes and executes Python/SQL in a secure sandbox, and synthesizes interactive charts & statistical reports.",
                "detailed_description": "DataSense AI is an autonomous ReAct AI agent built with LangGraph state graphs. The agent inspects database schemas, writes and validates SQL/Python code inside an isolated Docker execution sandbox, detects statistical anomalies, and generates responsive charts with plain-English executive summaries.",
                "problem_statement": "Business users, data teams, and founders lose days waiting for engineering teams to write intricate SQL queries, run ad-hoc statistical analyses in pandas, and format visualization charts.",
                "solution_architecture": "Engineered an autonomous ReAct AI agent with LangGraph state graphs. The agent inspects database schemas, writes and validates SQL/Python code inside an isolated Docker execution sandbox, detects statistical anomalies, and generates responsive charts with plain-English executive summaries.",
                "my_role": "AI Systems & Full Stack Engineer (Architected LangGraph state machine, tool-calling loop, and React data visualization dashboard)",
                "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "LangChain", "LangGraph", "Claude / OpenAI API", "DuckDB", "Pandas", "Plotly", "Docker Sandbox"],
                "features": [
                    "Natural language to SQL and Python query execution with AST validation",
                    "Isolated Docker sandbox for secure runtime data transformations",
                    "Auto-generated interactive charts (Plotly, ECharts, heatmaps, cohort breakdowns)",
                    "Database connector integration: PostgreSQL, SQLite, DuckDB, and direct CSV/Parquet uploads",
                    "Plain-English executive summaries with automated outlier & anomaly detection"
                ],
                "featured": True,
                "order": 1,
                "status": "Published",
                "frontend_tech": "React 18, Vite, Plotly.js / ECharts, Monaco Code Viewer",
                "backend_tech": "Python 3.11, LangGraph, ReAct Tool Calling, DuckDB, Pandas, Docker Sandbox",
                "database_tech": "PostgreSQL (Session metadata), Redis (Agent memory state)",
                "deployment_tech": "Docker Containerized Workers + Cloud K8s + CDN Frontend"
            },
            {
                "slug": "omnirag-assistant",
                "title": "OmniRAG — Agentic Document Intelligence & Verification Engine",
                "category": "AI/ML",
                "short_description": "Enterprise Agentic RAG assistant that executes multi-step document retrieval, semantic chunking, factual hallucination grading, and precise page/line source citation attribution.",
                "detailed_description": "OmniRAG is an enterprise-grade Agentic Self-Reflective RAG architecture. It combines hierarchical semantic chunking, hybrid retrieval (BM25 lexical + dense embeddings), dynamic query rewriting, a cross-encoder reranker, and an automated Hallucination Grader that double-checks claims against retrieved text before generating verified responses with clickable inline citations.",
                "problem_statement": "Traditional naive RAG architectures frequently hallucinate, lose cross-document context, fail on complex multi-hop research questions, and lack verifiable page/paragraph citation attribution.",
                "solution_architecture": "Constructed an Agentic Self-Reflective RAG architecture combining hierarchical semantic chunking, hybrid retrieval (BM25 lexical + dense vector search), dynamic query rewriting, a cross-encoder reranker (BGE-Reranker), and an automated Hallucination Grader that double-checks claims against retrieved text before generating verified responses with clickable inline citations.",
                "my_role": "AI Engineer & Backend Architect (Designed semantic chunking pipelines, vector indexing, hallucination evaluation gates, and streaming API)",
                "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "LlamaIndex", "LangChain", "Qdrant / ChromaDB", "Hybrid Search (BM25 + Dense)", "FastAPI", "React.js", "BGE-Reranker"],
                "features": [
                    "Self-correcting agentic loop with automated hallucination scoring and query reformulation",
                    "Multi-format document ingestion: PDF, DOCX, Markdown, scanned tables via OCR",
                    "Hybrid Search combining dense vector cosine similarity with sparse BM25 keyword matching",
                    "Cross-Encoder Re-ranking (BGE-Reranker) for ultra-high contextual relevance",
                    "Interactive source citation drawer with page previews and exact snippet highlight overlays"
                ],
                "featured": True,
                "order": 2,
                "status": "Published",
                "frontend_tech": "React 18, Lucide Icons, Markdown Renderer, PDF Highlight Viewer",
                "backend_tech": "Python 3.11, FastAPI Async, LlamaIndex, BGE-Large Embeddings",
                "database_tech": "Qdrant / ChromaDB Vector Engine + PostgreSQL Document Metadata",
                "deployment_tech": "Docker Container + Cloud Vector Cluster + Vercel Frontend"
            },
            {
                "slug": "synapse-saas",
                "title": "SynapseSaaS — AI Code Reviewer & Architecture Studio",
                "category": "Full Stack",
                "short_description": "Production GenAI SaaS platform featuring multi-tenant auth, real-time GitHub PR webhooks, token-by-token streaming code reviews, and automated architecture diagram synthesis.",
                "detailed_description": "SynapseSaaS is a commercial-grade, multi-tenant GenAI SaaS application. Features secure JWT/OAuth authentication, automated GitHub repository webhook integration, streaming token-by-token code reviews, architectural Mermaid diagram synthesis, and tier-based API rate limiting with Stripe billing.",
                "problem_statement": "Software development teams suffer from slow pull request reviews, undetected security vulnerabilities, inconsistent design patterns, and outdated architectural documentation.",
                "solution_architecture": "Engineered a commercial-grade, multi-tenant GenAI SaaS application. Features secure JWT/OAuth authentication, automated GitHub repository webhook integration, streaming token-by-token code reviews, architectural Mermaid diagram synthesis, and tier-based API rate limiting with Stripe billing.",
                "my_role": "Lead Full Stack & AI SaaS Engineer (Designed multi-tenant Django backend, Celery workers, React dashboard, and LLM prompt/streaming pipeline)",
                "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["React.js", "Python", "Django REST Framework", "Claude 3.5 Sonnet", "PostgreSQL", "Redis & Celery", "Stripe API", "Server-Sent Events (SSE)"],
                "features": [
                    "Real-time GitHub Pull Request automated code review bot & security vulnerability scanner",
                    "Streaming SSE (Server-Sent Events) interactive AI code refactoring co-pilot",
                    "Automated architectural flow diagram generation (Mermaid.js / System Topology)",
                    "Full SaaS architecture: Multi-tenant RBAC, JWT auth, Stripe billing & subscription metering",
                    "Background async workers using Celery & Redis for heavy repository AST parsing"
                ],
                "featured": True,
                "order": 3,
                "status": "Published",
                "frontend_tech": "React 18, Monaco Editor, Tailwind/Glassmorphism CSS, Mermaid.js Visualizer",
                "backend_tech": "Python 3.11, Django REST Framework, Celery Workers, LangChain",
                "database_tech": "PostgreSQL (Multi-tenant schema), Redis (Task broker & Rate limiting)",
                "deployment_tech": "Render/AWS ECS + Redis Cloud + Stripe Webhooks + Netlify Frontend"
            },
            {
                "slug": "finguard-llm",
                "title": "FinGuard-LLM — Domain-Specialized Financial & Compliance LLM",
                "category": "AI/ML",
                "short_description": "Domain-specialized 7B parameter LLM fine-tuned using QLoRA & Unsloth on 50k+ curated SEC 10-K filings and legal compliance contracts for risk assessment and quantitative reasoning.",
                "detailed_description": "FinGuard-LLM is an end-to-end open-source LLM fine-tuning pipeline. Prepared and cleaned a 50,000+ instruction dataset from SEC 10-K filings and financial disclosure reports. Fine-tuned Mistral-7B / LLaMA-3 using 4-bit QLoRA and Unsloth on NVIDIA GPUs, achieving a 34% reduction in financial extraction error rate and 4x lower inference latency via vLLM.",
                "problem_statement": "General-purpose foundation LLMs frequently hallucinate complex financial metrics, struggle with strict regulatory compliance jargon, and cost significant API token fees at scale.",
                "solution_architecture": "Orchestrated an end-to-end open-source LLM fine-tuning pipeline. Prepared and cleaned a 50,000+ instruction dataset from SEC 10-K filings and financial disclosure reports. Fine-tuned Mistral-7B / LLaMA-3 using 4-bit QLoRA and Unsloth on NVIDIA GPUs, achieving a 34% reduction in financial extraction error rate and 4x lower inference latency via vLLM.",
                "my_role": "Machine Learning & LLM Engineer (Data preprocessing, synthetic QA generation, QLoRA training runs, and vLLM deployment)",
                "image_url": "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "PyTorch", "Hugging Face Transformers", "QLoRA / PEFT", "Unsloth", "vLLM / Ollama", "Weights & Biases", "TRL (SFTTrainer)"],
                "features": [
                    "Custom dataset curation, synthetic data generation, and cleaning pipeline using Python & Pandas",
                    "Parameter-Efficient Fine-Tuning (PEFT / QLoRA) on LLaMA-3 / Mistral-7B architecture",
                    "Automated evaluation benchmarks: ROUGE, BLEU, Perplexity, and Custom Financial QA Accuracy",
                    "Quantization to 4-bit GGUF and deployment via vLLM high-throughput inference server",
                    "Full experiment tracking and loss convergence monitoring with Weights & Biases (W&B)"
                ],
                "featured": True,
                "order": 4,
                "status": "Published",
                "frontend_tech": "Gradio Interactive Demo / OpenAI-Compatible Client UI",
                "backend_tech": "PyTorch, Hugging Face, TRL (SFTTrainer), Unsloth, vLLM Server",
                "database_tech": "Hugging Face Datasets (Arrow / Parquet Storage)",
                "deployment_tech": "NVIDIA GPU Cluster + vLLM Inference Engine + FastAPI Wrapper"
            },
            {
                "slug": "devnexus",
                "title": "DevNexus — Full Stack Project Manager",
                "category": "Full Stack",
                "short_description": "Comprehensive developer collaboration platform with Django REST API backend and React frontend.",
                "detailed_description": "DevNexus is a centralized developer management system designed to coordinate project milestones, task state tracking, and team API specs. It features JWT authentication, real-time board updates, and custom backend viewsets.",
                "problem_statement": "Developers and small engineering teams struggle to track multi-tier projects, manage API documentation, and sync frontend/backend tasks seamlessly in one workspace.",
                "solution_architecture": "Engineered a full-stack architecture featuring a Django REST Framework backend with custom permissions and token authentication, paired with an interactive React glassmorphism dashboard.",
                "my_role": "Lead Full Stack Developer (Designed relational schema, Django REST endpoints, and React UI components)",
                "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "Django", "React.js", "REST API", "Bootstrap 5", "PostgreSQL"],
                "features": [
                    "Django REST Framework token authentication & security management",
                    "React interactive Kanban task workspace with real-time state updates",
                    "REST API endpoints for complete task and project CRUD operations",
                    "Responsive Bootstrap 5 grid with dark/light themes"
                ],
                "featured": True,
                "order": 5,
                "status": "Published",
                "frontend_tech": "React 18, Vite, Bootstrap 5, Custom CSS Variables",
                "backend_tech": "Python 3.11, Django 4.2, DRF, Token Auth",
                "database_tech": "Relational Models (PostgreSQL / SQLite)",
                "deployment_tech": "Django WSGI Server + CDN Frontend"
            },
            {
                "slug": "swiftcart",
                "title": "SwiftCart — Modern E-Commerce Engine",
                "category": "Full Stack",
                "short_description": "High-performance full stack e-commerce system built with Django ORM, React, and Bootstrap.",
                "detailed_description": "SwiftCart provides a high-converting digital storefront with category filtering, real-time shopping cart state management, checkout validation, and integrated administrative management.",
                "problem_statement": "E-commerce stores require rapid page load speeds, instant client search responsiveness, and secure product order processing.",
                "solution_architecture": "Developed a decoupled full-stack platform leveraging Django's robust ORM and security model alongside a lightweight React client state engine.",
                "my_role": "Full Stack Developer",
                "image_url": "https://images.unsplash.com/photo-1556742049-0a67d577c77e?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "Django", "React.js", "Bootstrap 5", "REST API", "SQLite"],
                "features": [
                    "Product search, category filter, and dynamic shopping cart",
                    "Django admin panel integration for catalog & order management",
                    "Secure REST API endpoints for customer orders and inquiries",
                    "Fully responsive mobile-first interface"
                ],
                "featured": True,
                "order": 6,
                "status": "Published",
                "frontend_tech": "React 18, Bootstrap 5, Context API",
                "backend_tech": "Python 3.11, Django ORM, DRF ViewSets",
                "database_tech": "SQLite / PostgreSQL ORM",
                "deployment_tech": "Django WSGI API + Netlify Frontend"
            },
            {
                "slug": "pyengine-api",
                "title": "PyEngine — Django REST API Service",
                "category": "Backend",
                "short_description": "Scalable backend service architecture featuring custom serializers, authentication, and endpoint throttling.",
                "detailed_description": "PyEngine is a robust backend boilerplate service implementing clean modular architecture, input validation, custom rate throttling, and standardized JSON error formatting.",
                "problem_statement": "Building reliable, clean backend APIs that handle data validation, error handling, and structured JSON output for multi-platform client apps.",
                "solution_architecture": "Engineered a modular Django app with reusable serializers, robust viewsets, and automated input validation middleware.",
                "my_role": "Backend Python Developer",
                "image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "Django", "Django REST Framework", "Postman", "Git"],
                "features": [
                    "Custom DRF Serializers for nested data structures",
                    "Robust error handling and standardized HTTP response codes",
                    "Postman collection setup for thorough endpoint testing",
                    "Clean project modularity and environment variable configuration"
                ],
                "featured": False,
                "order": 7,
                "status": "Published",
                "frontend_tech": "Postman API Client / Open API Specs",
                "backend_tech": "Python 3.11, Django 4.2, DRF Serializers",
                "database_tech": "Relational Schema ORM",
                "deployment_tech": "WSGI Server Container"
            },
            {
                "slug": "dataflow-processor",
                "title": "DataFlow — Python Async Data Pipeline",
                "category": "Backend",
                "short_description": "Python backend script and Django service for parsing, processing, and storing structured data feeds.",
                "detailed_description": "DataFlow automates batch parsing, CSV/JSON data transformation, and transaction-safe insertion into relational models via Django management commands.",
                "problem_statement": "Handling large batches of incoming structured data requires high-throughput parsing and database insertion without blocking web server execution.",
                "solution_architecture": "Created Python scripts integrated into custom Django management commands with transaction atomic guards and bulk insert optimization.",
                "my_role": "Backend Engineer",
                "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["Python", "Django ORM", "JSON", "REST Architecture"],
                "features": [
                    "Automated batch processing and data validation",
                    "Django ORM optimization for bulk create operations",
                    "Error logging and transaction atomic guards",
                    "CLI integration and Django backend command runner"
                ],
                "featured": False,
                "order": 8,
                "status": "Published",
                "frontend_tech": "CLI & Automated Logs",
                "backend_tech": "Python 3.11, Django Management Commands",
                "database_tech": "Relational Database (Bulk Insert)",
                "deployment_tech": "Cron / Scheduled Worker Task"
            },
            {
                "slug": "portfolio-app",
                "title": "Suryakiran P. J. — Interactive Portfolio Platform",
                "category": "Frontend",
                "short_description": "Futuristic developer portfolio web app built with React, Three.js, Bootstrap 5, Glassmorphism CSS, and Django API.",
                "detailed_description": "A high-performance personal branding platform featuring a 3D cinematic canvas, grounded AI assistant, Command Palette (Ctrl+K), Project X-Ray visual architecture inspector, and backend privacy controls.",
                "problem_statement": "Traditional static resume documents fail to showcase modern interactive engineering capabilities, 3D WebGL scenes, keyboard navigation, and API security architecture.",
                "solution_architecture": "Designed and engineered a production full-stack platform leveraging React 18 for component state, Three.js for 3D graphics, and Django REST Framework for backend persistence and AI grounding.",
                "my_role": "UI/UX Designer & Full Stack Engineer",
                "image_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["React.js", "Three.js", "Python", "Django", "Bootstrap 5"],
                "features": [
                    "Cinematic 3D Three.js particle canvas hero identity reveal",
                    "Interactive ATS-friendly CV Viewer & dynamic metadata",
                    "Grounded AI Portfolio Assistant with Recruiter/Client modes",
                    "Keyboard Command Palette (Ctrl+K) & Project X-Ray modal"
                ],
                "featured": True,
                "order": 9,
                "status": "Published",
                "frontend_tech": "React 18, Three.js, Bootstrap 5",
                "backend_tech": "Python 3.11, Django 4.2, DRF",
                "database_tech": "PostgreSQL / SQLite ORM",
                "deployment_tech": "Netlify CDN + Django Cloud API"
            },
            {
                "slug": "taskmatrix",
                "title": "TaskMatrix — Task Workspace UI",
                "category": "Frontend",
                "short_description": "Interactive React single-page application for task planning with local state persistence.",
                "detailed_description": "TaskMatrix is a zero-lag desktop and mobile web application built to streamline daily engineering sprint items with instant category filtering and accessible UI components.",
                "problem_statement": "Software engineers need a responsive, visual task management workspace with sub-second feedback and offline resilience.",
                "solution_architecture": "Constructed a component-based React single-page UI utilizing clean state reducers, localStorage synchronization, and accessible keyboard focus states.",
                "my_role": "Frontend Developer",
                "image_url": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/skiran-ai",
                "live_url": "https://github.com/skiran-ai",
                "technologies": ["React.js", "JavaScript ES6+", "HTML5", "CSS3", "Bootstrap 5"],
                "features": [
                    "Filterable task lists, tag badges, and priority indicators",
                    "LocalStorage state persistence across browser sessions",
                    "Responsive design tuned for mobile and desktop screens",
                    "Accessible keyboard navigation and visible focus styles"
                ],
                "featured": False,
                "order": 10,
                "status": "Published",
                "frontend_tech": "React 18, HTML5, CSS3, Bootstrap 5",
                "backend_tech": "Client LocalStorage / State Reducer",
                "database_tech": "Browser Local Storage",
                "deployment_tech": "Static Web Hosting"
            }
        ]

        if not Project.objects.exists() or force:
            for p in projects_data:
                Project.objects.update_or_create(
                    slug=p["slug"],
                    defaults=p
                )
            self.stdout.write("Projects: Initial seed complete.")
        else:
            self.stdout.write("Projects: Already configured in database (preserved).")

        # 10. Services
        services_data = [
            {
                "title": "Autonomous AI Agents & RAG Systems",
                "short_description": "Production AI agents, verified RAG pipelines, and tool-calling systems.",
                "full_description": "Architecting autonomous ReAct agents using LangGraph and LlamaIndex. Integrating hybrid search, cross-encoder re-ranking, code execution sandboxes, and hallucination scoring gates.",
                "icon_name": "Sparkles",
                "technologies": ["LangGraph", "LangChain", "LlamaIndex", "FastAPI", "Qdrant", "ChromaDB"],
                "order": 1
            },
            {
                "title": "Full Stack Web & GenAI SaaS",
                "short_description": "End-to-end web applications and multi-tenant GenAI SaaS platforms.",
                "full_description": "Architecting and implementing modern full-stack web platforms. From relational database modeling in Django ORM to stateful, component-driven user interfaces in React.js with SSE streaming.",
                "icon_name": "Layers",
                "technologies": ["Python", "Django", "React.js", "PostgreSQL", "Bootstrap 5", "Stripe API"],
                "order": 2
            },
            {
                "title": "REST & Streaming API Engineering",
                "short_description": "Scalable, secure RESTful & SSE API development with Django & FastAPI.",
                "full_description": "Designing clean JSON endpoints, custom serialization, validation, rate limiting, and comprehensive Postman documentation for seamless integration with frontend frameworks.",
                "icon_name": "Globe",
                "technologies": ["Django REST Framework", "FastAPI", "Python", "JWT Auth", "Postman"],
                "order": 3
            },
            {
                "title": "LLM Fine-Tuning & Quantization",
                "short_description": "Specialized open-source LLM adaptation using QLoRA, Unsloth, and vLLM.",
                "full_description": "Dataset preparation, instruction cleaning, Parameter-Efficient Fine-Tuning (PEFT) on open-source foundation models (LLaMA-3, Mistral-7B), and high-throughput deployment via vLLM.",
                "icon_name": "Cpu",
                "technologies": ["PyTorch", "QLoRA", "Unsloth", "Hugging Face", "vLLM", "Weights & Biases"],
                "order": 4
            }
        ]
        if not Service.objects.exists() or force:
            for s in services_data:
                Service.objects.update_or_create(
                    title=s["title"],
                    defaults=s
                )
            self.stdout.write("Services: Initial seed complete.")
        else:
            self.stdout.write("Services: Already configured in database (preserved).")

        # 11. AI Knowledge Documents
        ai_docs = [
            {
                "title": "Suryakiran Developer Background & Profile",
                "topic": "bio",
                "keywords": ["who", "suryakiran", "about", "bio", "background", "person", "developer", "profile", "location"],
                "content": "Suryakiran P. J. is a Python Full Stack & AI Engineer based in Kerala, India. He holds a B.Sc. in Computer Science from MG University (2020-2023). He specializes in building end-to-end web applications, autonomous AI agents, verified RAG systems, full-stack GenAI SaaS applications, and fine-tuned LLMs.",
                "priority": 10
            },
            {
                "title": "Technical Skill Matrix & Tech Stack",
                "topic": "skill",
                "keywords": ["skill", "skills", "stack", "technology", "technologies", "python", "django", "react", "html", "css", "javascript", "langchain", "llamaindex", "qlora"],
                "content": "Suryakiran's technical toolkit includes:\n• AI & LLM: LangGraph, LangChain, LlamaIndex, QLoRA, Unsloth, Hugging Face, PyTorch, Vector DBs (Chroma/Qdrant), vLLM, OpenAI & Claude APIs\n• Backend: Python 3.11+, Django 4.2, Django REST Framework, FastAPI, PostgreSQL, SQLite, Celery & Redis\n• Frontend: React.js, JavaScript (ES6+), Bootstrap 5, Glassmorphism UI, Plotly/ECharts, HTML5\n• Tools & DevOps: Git, GitHub, Docker, Postman, Weights & Biases, VS Code.",
                "priority": 9
            },
            {
                "title": "Featured AI & Engineering Projects Showcase",
                "topic": "project",
                "keywords": ["project", "projects", "work", "portfolio", "built", "datasense", "omnirag", "synapse", "finguard", "devnexus", "swiftcart", "pyengine", "showcase", "ai"],
                "content": "Suryakiran has engineered 4 core industry-grade AI projects alongside full-stack platforms:\n1. 📊 DataSense AI: Autonomous AI Data Analyst Agent (NL-to-SQL/Python, Docker sandbox, and chart synthesis)\n2. 🔍 OmniRAG: Enterprise Agentic RAG Assistant (hybrid search, cross-encoder re-ranking, and hallucination verification)\n3. ⚡ SynapseSaaS: Full-Stack GenAI Code Reviewer & Architecture Studio (SSE streaming, GitHub webhooks, and Stripe billing)\n4. 🧠 FinGuard-LLM: Domain-Specialized Financial & Compliance LLM (QLoRA fine-tuning on 50k+ SEC 10-K filings)\n5. DevNexus — Full Stack Project Manager (Django REST + React)\n6. SwiftCart — Modern E-Commerce Engine (Django ORM + React)",
                "priority": 8
            },
            {
                "title": "AI Data Analyst Agent — DataSense AI Details",
                "topic": "project",
                "keywords": ["data analyst", "datasense", "sql", "analysis", "chart", "csv", "agent"],
                "content": "DataSense AI is an autonomous AI data analyst agent built by Suryakiran. It allows users to upload CSVs or connect databases, ask questions in plain English, and automatically generates SQL queries, runs Python transformations inside a secure sandbox, and visualizes dynamic interactive charts.",
                "priority": 8
            },
            {
                "title": "Agentic RAG Assistant — OmniRAG Details",
                "topic": "project",
                "keywords": ["rag", "omnirag", "document", "knowledge", "citation", "retrieval", "hallucination"],
                "content": "OmniRAG is Suryakiran's Agentic RAG Knowledge Assistant. It implements hybrid search (BM25 + dense vectors), cross-encoder re-ranking, automated hallucination grading, and precise page/line source citation attribution.",
                "priority": 8
            },
            {
                "title": "GenAI SaaS Platform — SynapseSaaS Details",
                "topic": "project",
                "keywords": ["saas", "synapse", "code review", "reviewer", "streaming", "webhook", "stripe"],
                "content": "SynapseSaaS is a full-stack GenAI SaaS product built with React, Django REST Framework, Celery, and Claude 3.5 Sonnet. It features real-time GitHub PR review bots, token-by-token streaming code refactoring, automated Mermaid.js architecture diagrams, and Stripe subscription billing.",
                "priority": 8
            },
            {
                "title": "LLM Fine-Tuning — FinGuard-LLM Details",
                "topic": "project",
                "keywords": ["finetuning", "fine-tuning", "finguard", "lora", "qlora", "mistral", "llama", "unsloth", "finance"],
                "content": "FinGuard-LLM demonstrates open-source LLM fine-tuning. Suryakiran fine-tuned Mistral-7B / LLaMA-3 using 4-bit QLoRA and Unsloth on 50,000+ SEC 10-K financial and legal compliance filings, achieving a 34% reduction in financial extraction errors and 4x inference speedup with vLLM.",
                "priority": 8
            },
            {
                "title": "CV, Resume & Education Credentials",
                "topic": "cv",
                "keywords": ["cv", "resume", "download", "pdf", "education", "degree", "university", "mg university", "bachelor"],
                "content": "Suryakiran holds a Bachelor of Science (B.Sc.) in Computer Science from MG University, Kerala, India (2020 - 2023). You can view and download his complete ATS-friendly PDF CV directly through the interactive CV modal viewer on this website.",
                "priority": 7
            },
            {
                "title": "Contact Channels & Social Links",
                "topic": "contact",
                "keywords": ["contact", "email", "reach", "hire", "connect", "message", "social", "github", "linkedin", "instagram"],
                "content": "You can contact Suryakiran via:\n• Email: suryakiranpjineesh@gmail.com\n• LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351\n• GitHub: https://github.com/skiran-ai\n• Instagram: https://www.instagram.com/jstt.kiran\n• Or submit a direct contact message via the contact form on this platform.",
                "priority": 6
            }
        ]
        if not AIKnowledgeDocument.objects.exists() or force:
            for doc in ai_docs:
                AIKnowledgeDocument.objects.update_or_create(
                    title=doc["title"],
                    topic=doc["topic"],
                    defaults=doc
                )
            self.stdout.write("AI Knowledge Documents: Initial seed complete.")
        else:
            self.stdout.write("AI Knowledge Documents: Already present (preserved).")

        self.stdout.write(self.style.SUCCESS("Safe, idempotent database seed check complete!"))
