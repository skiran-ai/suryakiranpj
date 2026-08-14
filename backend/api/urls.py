from django.urls import path
from .views import (
    SystemStatusView, ProfileView, ProjectListView, ProjectDetailView,
    SkillListView, ExperienceListView, EducationListView, ServiceListView,
    SocialLinkListView, ContactSubmitView, CVMetadataView, ChatbotQueryView
)

urlpatterns = [
    path('health/', SystemStatusView.as_view(), name='system-status'),
    path('profile/', ProfileView.as_view(), name='profile-detail'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project-detail'),
    path('skills/', SkillListView.as_view(), name='skill-list'),
    path('experience/', ExperienceListView.as_view(), name='experience-list'),
    path('education/', EducationListView.as_view(), name='education-list'),
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('social-links/', SocialLinkListView.as_view(), name='social-link-list'),
    path('contact/', ContactSubmitView.as_view(), name='contact-submit'),
    path('cv/', CVMetadataView.as_view(), name='cv-metadata'),
    path('ai/chat/', ChatbotQueryView.as_view(), name='ai-chat'),
    path('chatbot/', ChatbotQueryView.as_view(), name='chatbot-legacy-compat'),
]
