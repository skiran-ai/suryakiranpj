import time
import os
import urllib.request
import json
import logging
from django.db import connection
from django.conf import settings
from django.core.mail import EmailMessage, send_mail
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.authtoken.models import Token

logger = logging.getLogger('api')


from .models import (
    Profile, Project, Skill, Experience, Education, Certification,
    Achievement, SocialLink, Service, ContactMessage, SiteSetting,
    AIKnowledgeDocument, AdminAuditLog
)
from .serializers import (
    ProfileSerializer, ProjectSerializer, SkillSerializer,
    ExperienceSerializer, EducationSerializer, CertificationSerializer,
    AchievementSerializer, SocialLinkSerializer, ServiceSerializer,
    ContactMessageSerializer, SiteSettingSerializer, AIKnowledgeDocumentSerializer,
    AdminAuditLogSerializer
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

def log_admin_action(action, model_name, object_id="", details=None):
    try:
        AdminAuditLog.objects.create(
            action=action,
            model_name=model_name,
            object_id=str(object_id),
            details=details or {}
        )
    except Exception as e:
        print(f"Audit log error: {e}")


# ==============================================================================
# PUBLIC API ENDPOINTS
# ==============================================================================

class SystemStatusView(APIView):
    """
    Public Health & Operational Status Monitoring Endpoint
    Returns real database ping, system mode, and AI provider readiness.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        start_time = time.time()

        # Test real DB connectivity
        db_ok = False
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                row = cursor.fetchone()
                db_ok = (row[0] == 1)
        except Exception:
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
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        queryset = Skill.objects.all()
        serializer = SkillSerializer(queryset, many=True)
        
        # Categorized payload for convenient frontend consumption
        grouped = {
            "ai": [],
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
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        queryset = Experience.objects.all()
        serializer = ExperienceSerializer(queryset, many=True)
        return Response(serializer.data)


class EducationListView(APIView):
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class SocialLinkListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        restriction = check_privacy_restriction()
        if restriction:
            return restriction

        links = SocialLink.objects.filter(is_visible=True)
        serializer = SocialLinkSerializer(links, many=True)
        return Response(serializer.data)


class ContactSubmitView(APIView):
    permission_classes = [permissions.AllowAny]
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
        if not serializer.is_valid():
            return Response({
                "success": False,
                "errors": serializer.errors,
                "message": "Invalid submission details. Please check the required fields."
            }, status=status.HTTP_400_BAD_REQUEST)

        client_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        if client_ip and ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()

        # 1. Durable Record Storage in PostgreSQL
        contact_instance = serializer.save(ip_address=client_ip)

        # 2. Transactional Email Notification
        email_sent = False
        recipient_email = getattr(settings, 'CONTACT_EMAIL', 'suryakiranpjineesh@gmail.com')
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'suryakiranpjineesh@gmail.com')

        subject_line = f"[Portfolio Contact] {contact_instance.subject or 'New Inquiry from ' + contact_instance.name}"
        body_content = (
            f"====================================================\n"
            f"NEW PORTFOLIO CONTACT INQUIRY\n"
            f"====================================================\n\n"
            f"Name:       {contact_instance.name}\n"
            f"Email:      {contact_instance.email}\n"
            f"Subject:    {contact_instance.subject or 'N/A'}\n"
            f"Date/Time:  {contact_instance.created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            f"Client IP:  {client_ip or 'Unknown'}\n\n"
            f"----------------------------------------------------\n"
            f"MESSAGE CONTENT:\n"
            f"----------------------------------------------------\n"
            f"{contact_instance.message}\n\n"
            f"====================================================\n"
            f"Note: Replying to this email will reply directly to {contact_instance.email}.\n"
        )

        try:
            email_msg = EmailMessage(
                subject=subject_line,
                body=body_content,
                from_email=from_email,
                to=[recipient_email],
                reply_to=[contact_instance.email],
            )
            email_msg.send(fail_silently=False)
            email_sent = True
            logger.info(f"Contact email successfully sent for message ID #{contact_instance.id} from {contact_instance.email}")
        except Exception as mail_err:
            logger.error(f"Contact email delivery exception for message ID #{contact_instance.id}: {mail_err}", exc_info=True)

        if email_sent:
            return Response({
                "success": True,
                "email_delivered": True,
                "message": "Thank you! Your message has been sent successfully. I'll get back to you soon.",
                "id": contact_instance.id
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": True,
                "email_delivered": False,
                "message": "Thank you! Your message has been safely recorded in the database. Notification dispatch had a slight delay, but your message is stored.",
                "id": contact_instance.id
            }, status=status.HTTP_201_CREATED)



class CVMetadataView(APIView):
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]
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
        mode = request.data.get('mode', 'STANDARD').upper()

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


# ==============================================================================
# PRIVATE ADMIN AUTHENTICATION & DASHBOARD ENDPOINTS
# ==============================================================================

class AdminLoginView(APIView):
    """
    POST /api/admin/login/
    Authenticates staff/admin user and returns secure auth token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({
                "success": False,
                "message": "Please provide both username and password."
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({
                "success": False,
                "message": "Invalid username or password credentials."
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({
                "success": False,
                "message": "User account has been deactivated."
            }, status=status.HTTP_403_FORBIDDEN)

        if not (user.is_staff or user.is_superuser):
            return Response({
                "success": False,
                "message": "Access denied. Administrator privileges required."
            }, status=status.HTTP_403_FORBIDDEN)

        # Issue/get auth token
        token, _ = Token.objects.get_or_create(user=user)
        log_admin_action('LOGIN', 'User', user.id, {'username': user.username})

        return Response({
            "success": True,
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            },
            "message": f"Welcome back, {user.username}!"
        }, status=status.HTTP_200_OK)


class AdminLogoutView(APIView):
    """
    POST /api/admin/logout/
    Destroys active authentication token on logout.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.is_authenticated:
            Token.objects.filter(user=request.user).delete()
            log_admin_action('LOGOUT', 'User', request.user.id, {'username': request.user.username})
        return Response({"success": True, "message": "Logged out successfully."}, status=status.HTTP_200_OK)


class AdminMeView(APIView):
    """
    GET /api/admin/me/
    Validates current admin session & returns user details.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser
        })


class AdminStatsView(APIView):
    """
    GET /api/admin/stats/
    Returns aggregated stats for the admin dashboard home.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        projects_qs = Project.objects.all()
        setting = get_site_setting()

        recent_projects = ProjectSerializer(projects_qs.order_by('-created_at')[:5], many=True).data
        recent_messages = ContactMessageSerializer(ContactMessage.objects.all().order_by('-created_at')[:5], many=True).data

        return Response({
            "counts": {
                "projects_total": projects_qs.count(),
                "projects_published": projects_qs.filter(status='Published').count(),
                "projects_draft": projects_qs.filter(status='Draft').count(),
                "projects_featured": projects_qs.filter(featured=True).count(),
                "skills": Skill.objects.count(),
                "services": Service.objects.count(),
                "experience": Experience.objects.count(),
                "education": Education.objects.count(),
                "certifications": Certification.objects.count(),
                "achievements": Achievement.objects.count(),
                "social_links": SocialLink.objects.count(),
                "ai_documents": AIKnowledgeDocument.objects.count(),
                "unread_messages": ContactMessage.objects.filter(is_read=False).count(),
                "total_messages": ContactMessage.objects.count()
            },
            "system": {
                "privacy_mode": setting.privacy_mode,
                "allow_contact_form": setting.allow_contact_form,
                "allow_ai_assistant": setting.allow_ai_assistant,
                "maintenance_message": setting.maintenance_message
            },
            "recent_projects": recent_projects,
            "recent_messages": recent_messages
        })


# ==============================================================================
# ADMIN CRUD VIEWSETS & VIEWS
# ==============================================================================

# Projects Management
class AdminProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Project', instance.id, {'title': instance.title, 'slug': instance.slug})


class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Project', instance.id, {'title': instance.title, 'status': instance.status})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Project', instance.id, {'title': instance.title, 'slug': instance.slug})
        instance.delete()


# Skills Management
class AdminSkillListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = SkillSerializer
    queryset = Skill.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Skill', instance.id, {'name': instance.name, 'category': instance.category})


class AdminSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = SkillSerializer
    queryset = Skill.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Skill', instance.id, {'name': instance.name})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Skill', instance.id, {'name': instance.name})
        instance.delete()


# Services Management
class AdminServiceListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Service', instance.id, {'title': instance.title})


class AdminServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Service', instance.id, {'title': instance.title})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Service', instance.id, {'title': instance.title})
        instance.delete()


# Experience Management
class AdminExperienceListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Experience', instance.id, {'company': instance.company, 'role': instance.role})


class AdminExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Experience', instance.id, {'company': instance.company, 'role': instance.role})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Experience', instance.id, {'company': instance.company, 'role': instance.role})
        instance.delete()


# Education Management
class AdminEducationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = EducationSerializer
    queryset = Education.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Education', instance.id, {'institution': instance.institution, 'degree': instance.degree})


class AdminEducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = EducationSerializer
    queryset = Education.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Education', instance.id, {'institution': instance.institution, 'degree': instance.degree})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Education', instance.id, {'institution': instance.institution, 'degree': instance.degree})
        instance.delete()


# Certifications Management
class AdminCertificationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = CertificationSerializer
    queryset = Certification.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Certification', instance.id, {'title': instance.title})


class AdminCertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = CertificationSerializer
    queryset = Certification.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Certification', instance.id, {'title': instance.title})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Certification', instance.id, {'title': instance.title})
        instance.delete()


# Achievements Management
class AdminAchievementListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AchievementSerializer
    queryset = Achievement.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'Achievement', instance.id, {'title': instance.title})


class AdminAchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AchievementSerializer
    queryset = Achievement.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'Achievement', instance.id, {'title': instance.title})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'Achievement', instance.id, {'title': instance.title})
        instance.delete()


# Social Links Management
class AdminSocialLinkListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = SocialLinkSerializer
    queryset = SocialLink.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'SocialLink', instance.id, {'platform': instance.platform})


class AdminSocialLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = SocialLinkSerializer
    queryset = SocialLink.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'SocialLink', instance.id, {'platform': instance.platform})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'SocialLink', instance.id, {'platform': instance.platform})
        instance.delete()


# Profile Management
class AdminProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(name="Suryakiran P. J.")
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(name="Suryakiran P. J.")
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            log_admin_action('UPDATE', 'Profile', profile.id, {'name': profile.name})
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(name="Suryakiran P. J.")
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_admin_action('UPDATE_PARTIAL', 'Profile', profile.id, {'name': profile.name})
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# AI Knowledge Documents Management
class AdminAIKnowledgeListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AIKnowledgeDocumentSerializer
    queryset = AIKnowledgeDocument.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action('CREATE', 'AIKnowledgeDocument', instance.id, {'title': instance.title, 'topic': instance.topic})


class AdminAIKnowledgeDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AIKnowledgeDocumentSerializer
    queryset = AIKnowledgeDocument.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action('UPDATE', 'AIKnowledgeDocument', instance.id, {'title': instance.title})

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'AIKnowledgeDocument', instance.id, {'title': instance.title})
        instance.delete()


# Contact Messages Management
class AdminContactMessageListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ContactMessageSerializer

    def get_queryset(self):
        queryset = ContactMessage.objects.all()
        unread_only = self.request.query_params.get('unread')
        if unread_only and unread_only.lower() in ('true', '1'):
            queryset = queryset.filter(is_read=False)
        return queryset


class AdminContactMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()

    def perform_destroy(self, instance):
        log_admin_action('DELETE', 'ContactMessage', instance.id, {'sender': instance.email})
        instance.delete()


# Site Settings Management
class AdminSiteSettingView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        setting = get_site_setting()
        serializer = SiteSettingSerializer(setting)
        return Response(serializer.data)

    def patch(self, request):
        setting = get_site_setting()
        serializer = SiteSettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_admin_action('UPDATE_SETTING', 'SiteSetting', setting.id, request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Audit Logs
class AdminAuditLogListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminAuditLogSerializer
    queryset = AdminAuditLog.objects.all()[:100]
