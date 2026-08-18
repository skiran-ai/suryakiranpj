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
            "role": "Python Full Stack Developer",
            "tagline": "Building modern, responsive and scalable web experiences with Python, Django, and React.",
            "summary": "Enthusiastic and results-driven Python Full Stack Developer with a solid foundation in computer science and full-stack architecture. Passionate about building robust backend APIs using Python & Django, paired with dynamic, responsive user interfaces built with React.js, JavaScript, and Bootstrap 5. Adept at problem-solving, clean code design, and continuous technical growth.",
            "location": "Kerala, India",
            "github_url": "https://github.com/skiran-ai",
            "linkedin_url": "https://www.linkedin.com/in/surya-kiran-967659351",
            "instagram_url": "https://www.instagram.com/jstt.kiran",
            "resume_pdf_url": "/assets/Suryakiran-PJ-CV.pdf",
            "availability": "Available for Full-time Roles & High-Impact Projects",
            "is_active": True
        }
        if not Profile.objects.exists() or force:
            profile_obj, created = Profile.objects.get_or_create(
                email="suryakiranpjineesh@gmail.com",
                defaults=profile_defaults
            )
            self.stdout.write(f"Profile: {'Created' if created else 'Already exists (preserved)'}.")
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
                SocialLink.objects.get_or_create(
                    platform=s["platform"],
                    defaults=s
                )
            self.stdout.write("Social Links: Initial seed complete.")
        else:
            self.stdout.write("Social Links: Already present (preserved).")

        # 4. Skills
        skills = [
            # Frontend
            {"name": "HTML5", "category": "frontend", "badge": "Semantic Markup & Accessibility", "icon_name": "Code", "proficiency": 95, "order": 1},
            {"name": "CSS3", "category": "frontend", "badge": "Flexbox / Grid / Glassmorphism", "icon_name": "Layers", "proficiency": 92, "order": 2},
            {"name": "Bootstrap 5", "category": "frontend", "badge": "Responsive Layout System", "icon_name": "Layout", "proficiency": 95, "order": 3},
            {"name": "JavaScript", "category": "frontend", "badge": "ES6+ Async / Promises / DOM", "icon_name": "Terminal", "proficiency": 90, "order": 4},
            {"name": "React.js", "category": "frontend", "badge": "Hooks & Custom Component Architecture", "icon_name": "Cpu", "proficiency": 88, "order": 5},

            # Backend
            {"name": "Python", "category": "backend", "badge": "Core OOP & Data Structures", "icon_name": "Terminal", "proficiency": 94, "order": 1},
            {"name": "Django", "category": "backend", "badge": "MTV Architecture, ORM & Middleware", "icon_name": "Database", "proficiency": 92, "order": 2},
            {"name": "Django REST Framework", "category": "backend", "badge": "RESTful Endpoints & Serializers", "icon_name": "Globe", "proficiency": 90, "order": 3},
            {"name": "Relational Databases", "category": "backend", "badge": "SQL, Modeling & Optimization", "icon_name": "Database", "proficiency": 86, "order": 4},

            # Tools
            {"name": "Git", "category": "tools", "badge": "Version Control & Branch Management", "icon_name": "Shield", "proficiency": 90, "order": 1},
            {"name": "GitHub", "category": "tools", "badge": "Repository Management & Collaboration", "icon_name": "Github", "proficiency": 92, "order": 2},
            {"name": "VS Code", "category": "tools", "badge": "Primary IDE & Debugging Setup", "icon_name": "Code", "proficiency": 95, "order": 3},
            {"name": "Postman", "category": "tools", "badge": "API Testing, Automated Specs & Docs", "icon_name": "Globe", "proficiency": 88, "order": 4},

            # Core Development
            {"name": "Responsive Web Design", "category": "development", "badge": "Mobile-First 320px to 4K", "icon_name": "Smartphone", "proficiency": 95, "order": 1},
            {"name": "REST APIs", "category": "development", "badge": "JSON Serialization & Throttling", "icon_name": "Globe", "proficiency": 92, "order": 2},
            {"name": "UI / UX Engineering", "category": "development", "badge": "Modern Cinematic Aesthetic", "icon_name": "Sparkles", "proficiency": 90, "order": 3},
            {"name": "Full Stack Architecture", "category": "development", "badge": "End-to-End Frontend/Backend Integration", "icon_name": "Layers", "proficiency": 89, "order": 4},
        ]
        if not Skill.objects.exists() or force:
            for sk in skills:
                Skill.objects.get_or_create(
                    name=sk["name"],
                    category=sk["category"],
                    defaults=sk
                )
            self.stdout.write("Skills: Initial seed complete.")
        else:
            self.stdout.write("Skills: Already present (preserved).")

        # 5. Education
        if not Education.objects.exists() or force:
            Education.objects.get_or_create(
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
            Experience.objects.get_or_create(
                company="Independent Software Engineering",
                role="Python Full Stack Developer",
                defaults={
                    "location": "Kerala, India / Remote",
                    "start_date": datetime.date(2023, 6, 1),
                    "is_current": True,
                    "summary": "Architecting and deploying full-stack web platforms using Python, Django REST Framework, and React.js. Implementing clean RESTful API standards, database models, rate limiting, and glassmorphism user interfaces.",
                    "bullet_points": [
                        "Designed and built DevNexus, SwiftCart, and PyEngine backend REST APIs",
                        "Created responsive React component architectures connected to Django APIs",
                        "Engineered custom management commands and database ORM optimizations"
                    ],
                    "order": 1
                }
            )
            self.stdout.write("Experience: Initial seed complete.")
        else:
            self.stdout.write("Experience: Already present (preserved).")

        # 7. Certifications
        if not Certification.objects.exists() or force:
            Certification.objects.get_or_create(
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
            Achievement.objects.get_or_create(
                title="B.Sc. Computer Science Graduate with Honors",
                defaults={
                    "description": "Successfully completed degree at MG University with distinction in software engineering and database projects.",
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
                "order": 1,
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
                "order": 2,
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
                "featured": True,
                "order": 3,
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
                "order": 4,
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
                "order": 5,
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
                "order": 6,
                "status": "Published",
                "frontend_tech": "React 18, HTML5, CSS3, Bootstrap 5",
                "backend_tech": "Client LocalStorage / State Reducer",
                "database_tech": "Browser Local Storage",
                "deployment_tech": "Static Web Hosting"
            }
        ]

        if not Project.objects.exists() or force:
            for p in projects_data:
                Project.objects.get_or_create(
                    slug=p["slug"],
                    defaults=p
                )
            self.stdout.write("Projects: Initial seed complete.")
        else:
            self.stdout.write("Projects: Already configured in database (preserved).")

        # 10. Services
        services_data = [
            {
                "title": "Full Stack Web Development",
                "short_description": "End-to-end web application development using Django and React.",
                "full_description": "Architecting and implementing modern full-stack web platforms. From relational database modeling in Django ORM to stateful, component-driven user interfaces in React.js.",
                "icon_name": "Layers",
                "technologies": ["Python", "Django", "React.js", "PostgreSQL", "Bootstrap 5"],
                "order": 1
            },
            {
                "title": "REST API Design & Integration",
                "short_description": "Scalable, secure RESTful API development with Django REST Framework.",
                "full_description": "Designing clean JSON endpoints, custom serialization, validation, rate limiting, and comprehensive Postman documentation for seamless integration with frontend frameworks.",
                "icon_name": "Globe",
                "technologies": ["Django REST Framework", "Python", "JSON", "JWT Auth", "Postman"],
                "order": 2
            },
            {
                "title": "Responsive UI / UX Engineering",
                "short_description": "Futuristic, mobile-first web interface design and implementation.",
                "full_description": "Building fast, high-contrast, accessible, and visually stunning dark/light web interfaces using React, CSS variables, glassmorphism, and responsive grid layouts.",
                "icon_name": "Sparkles",
                "technologies": ["React.js", "HTML5", "CSS3", "Bootstrap 5", "Lucide Icons"],
                "order": 3
            }
        ]
        if not Service.objects.exists() or force:
            for s in services_data:
                Service.objects.get_or_create(
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
                "content": "Suryakiran P. J. is a Python Full Stack Developer based in Kerala, India. He holds a B.Sc. in Computer Science from MG University (2020-2023). He specializes in building end-to-end web applications using Python, Django, Django REST Framework, React.js, JavaScript, and Bootstrap 5. He is passionate about clean code, RESTful API engineering, and responsive UI design.",
                "priority": 10
            },
            {
                "title": "Technical Skill Matrix & Tech Stack",
                "topic": "skill",
                "keywords": ["skill", "skills", "stack", "technology", "technologies", "python", "django", "react", "html", "css", "javascript", "bootstrap", "git", "postman"],
                "content": "Suryakiran's technical toolkit includes:\n• Frontend: React.js, JavaScript (ES6+), HTML5, CSS3, Bootstrap 5, Glassmorphism UI\n• Backend: Python 3.11+, Django 4.2, Django REST Framework (DRF), Relational Database Design\n• Tools & Workflow: Git, GitHub, VS Code, Postman API testing\n• Core Concepts: REST API Architecture, Responsive Web Design (320px to 4K), Full Stack System Integration, Throttling & Security.",
                "priority": 9
            },
            {
                "title": "Featured Engineering Projects Showcase",
                "topic": "project",
                "keywords": ["project", "projects", "work", "portfolio", "built", "devnexus", "swiftcart", "pyengine", "dataflow", "taskmatrix", "showcase"],
                "content": "Suryakiran has engineered several full-stack and backend projects:\n1. DevNexus — Full Stack Project Manager (React + Django REST Framework + JWT)\n2. SwiftCart — Modern E-Commerce Engine (Django ORM + React + Bootstrap 5)\n3. PyEngine — Django REST API Service (Python backend with rate limiting & custom serializers)\n4. DataFlow — Python Async Data Pipeline (Batch ingestion via Django management commands)\n5. Suryakiran Portfolio — Interactive Web Experience (React 18 + Three.js + Django REST API)\n6. TaskMatrix — Task Workspace UI (React single-page application)",
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
                AIKnowledgeDocument.objects.get_or_create(
                    title=doc["title"],
                    topic=doc["topic"],
                    defaults=doc
                )
            self.stdout.write("AI Knowledge Documents: Initial seed complete.")
        else:
            self.stdout.write("AI Knowledge Documents: Already present (preserved).")

        self.stdout.write(self.style.SUCCESS("Safe, idempotent database seed check complete!"))
