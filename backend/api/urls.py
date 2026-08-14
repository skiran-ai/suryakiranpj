from django.urls import path
from .views import (
    # Public views
    SystemStatusView, ProfileView, ProjectListView, ProjectDetailView,
    SkillListView, ExperienceListView, EducationListView, ServiceListView,
    SocialLinkListView, ContactSubmitView, CVMetadataView, ChatbotQueryView,

    # Admin Auth & Stats
    AdminLoginView, AdminLogoutView, AdminMeView, AdminStatsView,

    # Admin CRUD
    AdminProjectListCreateView, AdminProjectDetailView,
    AdminSkillListCreateView, AdminSkillDetailView,
    AdminServiceListCreateView, AdminServiceDetailView,
    AdminExperienceListCreateView, AdminExperienceDetailView,
    AdminEducationListCreateView, AdminEducationDetailView,
    AdminCertificationListCreateView, AdminCertificationDetailView,
    AdminAchievementListCreateView, AdminAchievementDetailView,
    AdminSocialLinkListCreateView, AdminSocialLinkDetailView,
    AdminProfileView,
    AdminAIKnowledgeListCreateView, AdminAIKnowledgeDetailView,
    AdminContactMessageListView, AdminContactMessageDetailView,
    AdminSiteSettingView, AdminAuditLogListView
)

urlpatterns = [
    # -------------------------------------------------------------------------
    # PUBLIC ENDPOINTS
    # -------------------------------------------------------------------------
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

    # -------------------------------------------------------------------------
    # PRIVATE ADMIN AUTH & DASHBOARD
    # -------------------------------------------------------------------------
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/me/', AdminMeView.as_view(), name='admin-me'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),

    # Projects
    path('admin/projects/', AdminProjectListCreateView.as_view(), name='admin-project-list'),
    path('admin/projects/<int:pk>/', AdminProjectDetailView.as_view(), name='admin-project-detail'),

    # Skills
    path('admin/skills/', AdminSkillListCreateView.as_view(), name='admin-skill-list'),
    path('admin/skills/<int:pk>/', AdminSkillDetailView.as_view(), name='admin-skill-detail'),

    # Services
    path('admin/services/', AdminServiceListCreateView.as_view(), name='admin-service-list'),
    path('admin/services/<int:pk>/', AdminServiceDetailView.as_view(), name='admin-service-detail'),

    # Experience
    path('admin/experience/', AdminExperienceListCreateView.as_view(), name='admin-experience-list'),
    path('admin/experience/<int:pk>/', AdminExperienceDetailView.as_view(), name='admin-experience-detail'),

    # Education
    path('admin/education/', AdminEducationListCreateView.as_view(), name='admin-education-list'),
    path('admin/education/<int:pk>/', AdminEducationDetailView.as_view(), name='admin-education-detail'),

    # Certifications
    path('admin/certifications/', AdminCertificationListCreateView.as_view(), name='admin-certification-list'),
    path('admin/certifications/<int:pk>/', AdminCertificationDetailView.as_view(), name='admin-certification-detail'),

    # Achievements
    path('admin/achievements/', AdminAchievementListCreateView.as_view(), name='admin-achievement-list'),
    path('admin/achievements/<int:pk>/', AdminAchievementDetailView.as_view(), name='admin-achievement-detail'),

    # Social Links
    path('admin/social-links/', AdminSocialLinkListCreateView.as_view(), name='admin-social-link-list'),
    path('admin/social-links/<int:pk>/', AdminSocialLinkDetailView.as_view(), name='admin-social-link-detail'),

    # Profile
    path('admin/profile/', AdminProfileView.as_view(), name='admin-profile'),

    # AI Knowledge Documents
    path('admin/ai-documents/', AdminAIKnowledgeListCreateView.as_view(), name='admin-ai-docs-list'),
    path('admin/ai-documents/<int:pk>/', AdminAIKnowledgeDetailView.as_view(), name='admin-ai-docs-detail'),

    # Contact Messages
    path('admin/messages/', AdminContactMessageListView.as_view(), name='admin-messages-list'),
    path('admin/messages/<int:pk>/', AdminContactMessageDetailView.as_view(), name='admin-messages-detail'),

    # Site Settings & Audit
    path('admin/site-settings/', AdminSiteSettingView.as_view(), name='admin-site-settings'),
    path('admin/audit-logs/', AdminAuditLogListView.as_view(), name='admin-audit-logs'),
]
