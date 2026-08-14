import time
import os
import urllib.request
import json
from django.db import connection
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle

from .models import (
    Profile, Project, Skill, Experience, Education, Certification,
    Achievement, SocialLink, Service, ContactMessage, SiteSetting,
    AIKnowledgeDocument
)
from .serializers import (
    ProfileSerializer, ProjectSerializer, SkillSerializer,
    ExperienceSerializer, EducationSerializer, CertificationSerializer,
    AchievementSerializer, SocialLinkSerializer, ServiceSerializer,
    ContactMessageSerializer, SiteSettingSerializer
)

# Helper function to check application-level Privacy & Maintenance Mode
def get_site_setting():
    setting, _ = SiteSetting.objects.get_or_create(id=1)
    return setting

def check_privacy_restriction():
    setting = get_site_setting()
    if setting.privacy_mode == 'PRIVATE':
        return Response({
            "status": "PRIVATE_MODE",
            "system_mode": "PRIVATE",
            "message": "System is currently in PRIVATE MODE. Public data endpoints are temporarily shielded.",
            "allow_access": False
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    elif setting.privacy_mode == 'MAINTENANCE':
        return Response({
            "status": "MAINTENANCE_MODE",
            "system_mode": "MAINTENANCE",
            "message": setting.maintenance_message or "System is currently under maintenance. Please check back shortly.",
            "allow_access": False
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return None


class SystemStatusView(APIView):
    """
    Public Health & Operational Status Monitoring Endpoint
    Returns real database ping, system mode, and AI provider readiness.
    """
    def get(self, request):
        start_time = time.time()

        # Test real DB connectivity
        db_ok = False
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                row = cursor.fetchone()
                db_ok = (row[0] == 1)
        except Exception as e:
            db_ok = False

        latency = round((time.time() - start_time) * 1000, 2)
        setting = get_site_setting()
        ai_configured = bool(os.getenv('GEMINI_API_KEY') or os.getenv('OPENAI_API_KEY'))

        return Response({
            "status": "healthy" if db_ok else "degraded",
            "system_mode": setting.privacy_mode,
            "privacy_active": setting.privacy_mode == 'PRIVATE',
            "maintenance_active": setting.privacy_mode == 'MAINTENANCE',
            "maintenance_message": setting.maintenance_message if setting.privacy_mode != 'PUBLIC' else None,
            "services": {
                "frontend": "ONLINE",
                "api": "ONLINE" if db_ok else "DEGRADED",
                "database": "ONLINE" if db_ok else "OFFLINE",
                "ai": "READY" if (setting.allow_ai_assistant and db_ok) else "DISABLED"
            },
            "metrics": {
                "database_connected": db_ok,
                "ai_provider_configured": ai_configured,
                "api_latency_ms": latency
            },
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        })


class ProfileView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        profile = Profile.objects.filter(is_active=True).first()
        if not profile:
            return Response({"message": "Profile record not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class ProjectListView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        category = request.query_params.get('category')
        search_query = request.query_params.get('search')
        featured_only = request.query_params.get('featured')

        queryset = Project.objects.filter(status='Published')

        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)

        if featured_only and featured_only.lower() in ('true', '1'):
            queryset = queryset.filter(featured=True)

        if search_query:
            queryset = queryset.filter(
                title__icontains=search_query
            ) | queryset.filter(
                short_description__icontains=search_query
            ) | queryset.filter(
                problem_statement__icontains=search_query
            )

        serializer = ProjectSerializer(queryset.distinct(), many=True)
        return Response(serializer.data)


class ProjectDetailView(APIView):
    def get(self, request, slug):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        project = Project.objects.filter(slug=slug, status='Published').first()
        if not project:
            return Response({"message": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectSerializer(project)
        return Response(serializer.data)


class SkillListView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        queryset = Skill.objects.all()
        serializer = SkillSerializer(queryset, many=True)
        
        # Categorized payload for convenient frontend consumption
        grouped = {
            "frontend": [],
            "backend": [],
            "tools": [],
            "development": []
        }
        for item in serializer.data:
            cat = item['category'].lower()
            if cat in grouped:
                grouped[cat].append(item)
            else:
                grouped.setdefault(cat, []).append(item)

        return Response({
            "all": serializer.data,
            "grouped": grouped
        })


class ExperienceListView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        queryset = Experience.objects.all()
        serializer = ExperienceSerializer(queryset, many=True)
        return Response(serializer.data)


class EducationListView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        education_qs = Education.objects.all()
        cert_qs = Certification.objects.all()
        achievement_qs = Achievement.objects.all()

        return Response({
            "education": EducationSerializer(education_qs, many=True).data,
            "certifications": CertificationSerializer(cert_qs, many=True).data,
            "achievements": AchievementSerializer(achievement_qs, many=True).data
        })


class ServiceListView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class SocialLinkListView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        links = SocialLink.objects.filter(is_visible=True)
        serializer = SocialLinkSerializer(links, many=True)
        return Response(serializer.data)


class ContactSubmitView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'

    def post(self, request):
        setting = get_site_setting()
        if setting.privacy_mode in ('PRIVATE', 'MAINTENANCE') or not setting.allow_contact_form:
            return Response({
                "success": False,
                "message": "Contact form submissions are currently disabled by the system administrator."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            client_ip = request.META.get('REMOTE_ADDR')
            contact_instance = serializer.save(ip_address=client_ip)

            # Optional SMTP notification trigger
            if getattr(settings, 'EMAIL_HOST_USER', None):
                try:
                    send_mail(
                        subject=f"Portfolio Inquiry: {contact_instance.subject or 'General Inquiry'}",
                        message=f"Name: {contact_instance.name}\nEmail: {contact_instance.email}\nIP: {client_ip}\n\nMessage:\n{contact_instance.message}",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[settings.DEFAULT_FROM_EMAIL],
                        fail_silently=True,
                    )
                except Exception as mail_err:
                    print(f"SMTP Log Notice: {mail_err}")

            return Response({
                "success": True,
                "message": "Thank you! Your message has been received successfully."
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors,
            "message": "Invalid submission details. Please check the required fields."
        }, status=status.HTTP_400_BAD_REQUEST)


class CVMetadataView(APIView):
    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        profile = Profile.objects.filter(is_active=True).first()
        education = Education.objects.all()
        skills = Skill.objects.all()

        return Response({
            "name": profile.name if profile else "Suryakiran P. J.",
            "role": profile.role if profile else "Python Full Stack Developer",
            "email": profile.email if profile else "suryakiranpjineesh@gmail.com",
            "location": profile.location if profile else "Kerala, India",
            "github": profile.github_url if profile else "https://github.com/skiran-ai",
            "linkedin": profile.linkedin_url if profile else "https://www.linkedin.com/in/surya-kiran-967659351",
            "pdf_url": profile.resume_pdf_url if profile else "/assets/Suryakiran-PJ-CV.pdf",
            "summary": profile.summary if profile else "",
            "education": EducationSerializer(education, many=True).data,
            "top_skills": [s.name for s in skills[:8]]
        })


class ChatbotQueryView(APIView):
    """
    KIRAN AI - Grounded Portfolio Assistant
    Supports standard Q&A plus RECRUITER, CLIENT, and DEVELOPER special modes.
    """
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_chat'

    def post(self, request):
        setting = get_site_setting()
        if setting.privacy_mode in ('PRIVATE', 'MAINTENANCE') or not setting.allow_ai_assistant:
            return Response({
                "answer": "KIRAN AI Assistant is currently unavailable due to system privacy guards.",
                "mode": "PRIVACY"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        user_msg = request.data.get('message', '').strip()
        mode = request.data.get('mode', 'STANDARD').upper() # RECRUITER, CLIENT, DEVELOPER, STANDARD

        if len(user_msg) > 1000:
            return Response({
                "answer": "Prompt length exceeds the maximum allowed limit of 1000 characters. Please refine your query.",
                "mode": mode
            }, status=status.HTTP_400_BAD_REQUEST)

        if not user_msg:
            return Response({
                "answer": "Hello! I am KIRAN AI, Suryakiran's Portfolio Intelligence assistant. How can I help you explore his skills, projects, or CV today?",
                "mode": mode
            })

        # Special Mode Handlers
        if mode == 'RECRUITER' or 'recruiter' in user_msg.lower():
            profile = Profile.objects.first()
            skills = Skill.objects.filter(is_featured=True)
            projects = Project.objects.filter(featured=True)
            skill_list = ", ".join([s.name for s in skills[:6]])
            project_names = ", ".join([p.title for p in projects[:3]])
            answer = (
                f"📋 RECRUITER SUMMARY FOR {profile.name.upper() if profile else 'SURYAKIRAN P. J.'}:\n"
                f"• Target Role: {profile.role if profile else 'Python Full Stack Developer'}\n"
                f"• Core Stack: Python, Django, DRF, React.js, JavaScript, Relational DBs & REST APIs\n"
                f"• Key Skills: {skill_list}\n"
                f"• Highlight Projects: {project_names}\n"
                f"• Education: B.Sc. Computer Science (MG University)\n"
                f"• Availability: {profile.availability if profile else 'Available for Full-time roles'}\n"
                f"• Contact: {profile.email if profile else 'suryakiranpjineesh@gmail.com'}"
            )
            return Response({"answer": answer, "mode": "RECRUITER"})

        if mode == 'CLIENT' or 'client' in user_msg.lower() or 'build' in user_msg.lower():
            answer = (
                "💼 CLIENT CONSULTATION MODE:\n"
                "Suryakiran specializes in custom full-stack software development:\n"
                "1. Full-Stack Web Applications (React Frontend + Django REST Backend)\n"
                "2. E-Commerce Platforms (Product management, shopping carts, checkout)\n"
                "3. Custom API Services (Secure backend endpoints, authentication & database modeling)\n"
                "4. Modern UI Upgrades (Converting static sites into sleek glassmorphism React apps)\n\n"
                "Tell me what system you are looking to build, or submit your project inquiry in the Contact section below!"
            )
            return Response({"answer": answer, "mode": "CLIENT"})

        if mode == 'DEVELOPER' or 'developer' in user_msg.lower() or 'xray' in user_msg.lower():
            projects = Project.objects.filter(status='Published')[:2]
            proj_breakdowns = []
            for p in projects:
                proj_breakdowns.append(
                    f"• {p.title}:\n"
                    f"  - Problem: {p.problem_statement}\n"
                    f"  - Solution: {p.solution_architecture}\n"
                    f"  - Stack: {p.frontend_tech} | {p.backend_tech} | {p.database_tech}"
                )
            answer = (
                "⚙️ DEVELOPER ARCHITECTURE MODE:\n"
                "Here is how Suryakiran structures full-stack systems:\n\n" +
                "\n\n".join(proj_breakdowns) +
                "\n\nYou can click 'View Details' on any project card to open the visual X-RAY architecture flow!"
            )
            return Response({"answer": answer, "mode": "DEVELOPER"})

        # Try Google Gemini API if key is available
        gemini_key = os.getenv('GEMINI_API_KEY')
        if gemini_key:
            try:
                ai_response = self.call_gemini_api(user_msg, gemini_key)
                if ai_response:
                    return Response({"answer": ai_response, "mode": mode, "provider": "Gemini"})
            except Exception as llm_err:
                print(f"Gemini API Notice: {llm_err}")

        # Grounded Database Context Search Fallback
        grounded_answer = self.grounded_db_search(user_msg)
        return Response({
            "answer": grounded_answer,
            "mode": mode,
            "provider": "GroundedDB"
        })

    def grounded_db_search(self, user_msg):
        lower_msg = user_msg.lower()

        # Check AIKnowledgeDocument table first
        docs = AIKnowledgeDocument.objects.filter(is_active=True).order_by('-priority')
        for doc in docs:
            if any(kw.lower() in lower_msg for kw in doc.keywords):
                return doc.content

        # Project query matching
        projects = Project.objects.filter(status='Published')
        for p in projects:
            if p.title.lower() in lower_msg or p.slug.lower() in lower_msg:
                return (
                    f"📌 {p.title}:\n"
                    f"{p.short_description}\n"
                    f"• Role: {p.my_role}\n"
                    f"• Problem: {p.problem_statement}\n"
                    f"• Solution: {p.solution_architecture}\n"
                    f"• Technologies: {', '.join(p.technologies)}"
                )

        # Default grounded response
        profile = Profile.objects.first()
        return (
            f"{profile.name if profile else 'Suryakiran P. J.'} is a Python Full Stack Developer specializing in Python, Django, React.js, JavaScript, and Bootstrap 5. "
            "He builds clean REST APIs and modern web interfaces. Feel free to ask about his skills, projects, CV, or contact details!"
        )

    def call_gemini_api(self, prompt, api_key):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        # Build grounded context
        docs = AIKnowledgeDocument.objects.filter(is_active=True)
        knowledge_context = "\n---\n".join([f"[{d.title}]: {d.content}" for d in docs])
        
        system_instruction = (
            "You are KIRAN AI, the official portfolio AI assistant for Suryakiran P. J. (Python Full Stack Developer). "
            "Answer questions concisely, professionally, and strictly grounded in the following factual portfolio data. "
            "NEVER invent achievements, jobs, salaries, clients, or technologies not present in the context. "
            "If information is not available in the context, politely inform the user that it is not available."
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"SYSTEM CONTEXT:\n{system_instruction}\n\nPORTFOLIO KNOWLEDGE BASE:\n{knowledge_context}\n\nUSER QUESTION: {prompt}"}
                    ]
                }
            ]
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )

        with urllib.request.urlopen(req, timeout=8) as response:
            res_body = json.loads(response.read().decode('utf-8'))
            candidates = res_body.get('candidates', [])
            if candidates:
                parts = candidates[0].get('content', {}).get('parts', [])
                if parts:
                    return parts[0].get('text', '').strip()
        return None
