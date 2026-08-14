from rest_framework import serializers
from .models import (
    Profile, Project, Skill, Experience, Education, Certification,
    Achievement, SocialLink, Service, ContactMessage, SiteSetting,
    AIKnowledgeDocument, AdminAuditLog
)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'name', 'role', 'tagline', 'summary', 'email', 'location',
            'avatar_url', 'github_url', 'linkedin_url', 'instagram_url',
            'resume_pdf_url', 'availability', 'is_active', 'created_at', 'updated_at'
        ]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'title', 'category', 'short_description', 'detailed_description',
            'problem_statement', 'solution_architecture', 'my_role', 'image_url',
            'github_url', 'live_url', 'technologies', 'features', 'featured',
            'order', 'status', 'frontend_tech', 'backend_tech', 'database_tech',
            'deployment_tech', 'created_at', 'updated_at'
        ]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Project title cannot be empty.")
        return value.strip()

    def validate_slug(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Slug cannot be empty.")
        return value.strip().lower()

class SkillSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'category_display', 'badge', 'icon_name', 'proficiency', 'is_featured', 'order']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company', 'role', 'location', 'start_date', 'end_date', 'is_current', 'summary', 'bullet_points', 'order']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'field_of_study', 'start_year', 'end_year', 'grade', 'description', 'order']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issuing_organization', 'issue_date', 'credential_id', 'credential_url', 'order']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'metric', 'date', 'order']

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'url', 'icon_name', 'order', 'is_visible']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'short_description', 'full_description', 'icon_name', 'technologies', 'order']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'ip_address', 'is_read', 'created_at']
        read_only_fields = ['created_at', 'ip_address']

    def validate_email(self, value):
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        if len(value) > 254:
            raise serializers.ValidationError("Email address is too long.")
        return value.lower().strip()

    def validate_name(self, value):
        val = value.strip() if value else ''
        if not val or len(val) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(val) > 100:
            raise serializers.ValidationError("Name cannot exceed 100 characters.")
        return val

    def validate_subject(self, value):
        val = value.strip() if value else ''
        if len(val) > 200:
            raise serializers.ValidationError("Subject cannot exceed 200 characters.")
        return val

    def validate_message(self, value):
        val = value.strip() if value else ''
        if not val or len(val) < 5:
            raise serializers.ValidationError("Message must be at least 5 characters long.")
        if len(val) > 3000:
            raise serializers.ValidationError("Message cannot exceed 3000 characters.")
        return val

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['privacy_mode', 'maintenance_message', 'allow_contact_form', 'allow_ai_assistant', 'updated_at']

class AIKnowledgeDocumentSerializer(serializers.ModelSerializer):
    topic_display = serializers.CharField(source='get_topic_display', read_only=True)

    class Meta:
        model = AIKnowledgeDocument
        fields = ['id', 'title', 'topic', 'topic_display', 'keywords', 'content', 'is_active', 'priority', 'created_at']

class AdminAuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminAuditLog
        fields = ['id', 'action', 'model_name', 'object_id', 'details', 'timestamp']
