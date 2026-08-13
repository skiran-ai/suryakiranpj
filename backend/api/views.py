from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage, Project
from .serializers import ContactMessageSerializer, ProjectSerializer

class ContactSubmitView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            contact_instance = serializer.save()

            # Attempt optional email notification if SMTP is configured
            if getattr(settings, 'EMAIL_HOST_USER', None):
                try:
                    send_mail(
                        subject=f"New Portfolio Contact: {contact_instance.subject or 'Inquiry'}",
                        message=f"Name: {contact_instance.name}\nEmail: {contact_instance.email}\n\nMessage:\n{contact_instance.message}",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[settings.DEFAULT_FROM_EMAIL],
                        fail_silently=True,
                    )
                except Exception as mail_err:
                    print(f"SMTP notification log: {mail_err}")

            return Response({
                "success": True,
                "message": "Thank you! Your message has been received successfully."
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors,
            "message": "Invalid input provided. Please check the required fields."
        }, status=status.HTTP_400_BAD_REQUEST)

class ChatbotQueryView(APIView):
    KNOWLEDGE_BASE = [
        {
            "keywords": ["who", "suryakiran", "about", "bio", "background", "person", "developer"],
            "answer": "Suryakiran P. J. is a Python Full Stack Developer based in Kerala, India. He holds a B.Sc. in Computer Science from MG University and specializes in building end-to-end web applications using Python, Django, React.js, JavaScript, and Bootstrap 5."
        },
        {
            "keywords": ["skill", "stack", "technology", "technologies", "python", "django", "react", "html", "css", "javascript"],
            "answer": "Suryakiran's technical toolkit includes:\n• Frontend: HTML5, CSS3, Bootstrap 5, JavaScript, React.js\n• Backend: Python, Django, Django REST Framework, Databases\n• Tools: Git, GitHub, VS Code, Postman\n• Architecture: REST APIs, Responsive Web Design & Full Stack System Architecture."
        },
        {
            "keywords": ["project", "projects", "work", "portfolio", "built", "showcase", "full stack", "frontend", "backend"],
            "answer": "Suryakiran has built projects across Frontend, Backend, and Full Stack categories, including:\n1. DevNexus — Full Stack Project Manager (React + Django)\n2. SwiftCart — Modern E-Commerce Engine (Django + React)\n3. PyEngine — Django REST API Service (Python/DRF)\n4. Suryakiran Portfolio — Interactive Web Experience (React + Django API)\nYou can filter projects by category in the Projects section!"
        },
        {
            "keywords": ["cv", "resume", "download", "pdf", "education", "degree"],
            "answer": "You can view Suryakiran's complete ATS-friendly CV by clicking the 'View CV' button in the navigation or Hero section! You can also download the PDF version directly from the CV modal."
        },
        {
            "keywords": ["contact", "email", "reach", "hire", "connect", "message", "touch"],
            "answer": "You can contact Suryakiran directly via:\n• Email: suryakiranpjineesh@gmail.com\n• LinkedIn: linkedin.com/in/surya-kiran-967659351\n• GitHub: github.com/skiran-ai\n• Or send a message using the Contact section below!"
        },
        {
            "keywords": ["github", "linkedin", "instagram", "social", "link"],
            "answer": "Here are Suryakiran's official links:\n• GitHub: https://github.com/skiran-ai\n• LinkedIn: https://www.linkedin.com/in/surya-kiran-967659351\n• Instagram: https://www.instagram.com/jstt.kiran"
        }
    ]

    def post(self, request):
        user_msg = request.data.get('message', '').strip().lower()
        if not user_msg:
            return Response({"answer": "How can I assist you with Suryakiran's portfolio today?"})

        for entry in self.KNOWLEDGE_BASE:
            if any(kw in user_msg for kw in entry["keywords"]):
                return Response({"answer": entry["answer"]})

        return Response({
            "answer": "Suryakiran P. J. is a Python Full Stack Developer specializing in Python, Django, React.js, and modern web application development. Feel free to ask about his skills, projects, CV, or contact details!"
        })

class ProjectListView(APIView):
    def get(self, request):
        category = request.query_params.get('category')
        queryset = Project.objects.all()
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)
        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data)

class CVMetadataView(APIView):
    def get(self, request):
        return Response({
            "name": "Suryakiran P. J.",
            "role": "Python Full Stack Developer",
            "email": "suryakiranpjineesh@gmail.com",
            "github": "https://github.com/skiran-ai",
            "linkedin": "https://www.linkedin.com/in/surya-kiran-967659351",
            "pdf_url": "/assets/Suryakiran-PJ-CV.pdf"
        })
