from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Profile, Project, Skill, Experience, Education, Certification,
    Achievement, SocialLink, Service, ContactMessage, SiteSetting,
    AIKnowledgeDocument, AdminAuditLog
)

admin.site.site_header = "Suryakiran Portfolio Command Center"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Full Stack Platform Management"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'email', 'location', 'availability', 'is_active', 'updated_at')
    list_editable = ('availability', 'is_active')
    search_fields = ('name', 'role', 'email', 'tagline', 'summary')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'role', 'tagline', 'summary', 'email', 'location', 'avatar_url', 'availability', 'is_active')
        }),
        ('Social & CV Resources', {
            'fields': ('github_url', 'linkedin_url', 'instagram_url', 'resume_pdf_url')
        }),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'featured', 'order', 'status', 'github_link_preview', 'created_at')
    list_filter = ('category', 'status', 'featured', 'created_at')
    search_fields = ('title', 'slug', 'short_description', 'problem_statement', 'technologies')
    list_editable = ('featured', 'order', 'status')
    prepopulated_fields = {'slug': ('title',)}
    actions = ['mark_as_published', 'mark_as_draft', 'toggle_featured']

    fieldsets = (
        ('General Details', {
            'fields': ('title', 'slug', 'category', 'status', 'featured', 'order', 'short_description', 'detailed_description')
        }),
        ('Engineering & Problem Solving', {
            'fields': ('problem_statement', 'solution_architecture', 'my_role', 'technologies', 'features')
        }),
        ('Technical X-Ray Specifications', {
            'fields': ('frontend_tech', 'backend_tech', 'database_tech', 'deployment_tech')
        }),
        ('Links & Assets', {
            'fields': ('image_url', 'github_url', 'live_url')
        }),
    )

    def github_link_preview(self, obj):
        if obj.github_url:
            return format_html('<a href="{}" target="_blank" rel="noopener">Repo 🔗</a>', obj.github_url)
        return "-"
    github_link_preview.short_description = "GitHub"

    @admin.action(description="Mark selected projects as Published")
    def mark_as_published(self, request, queryset):
        count = queryset.update(status='Published')
        self.message_user(request, f"{count} project(s) set to Published.")

    @admin.action(description="Mark selected projects as Draft")
    def mark_as_draft(self, request, queryset):
        count = queryset.update(status='Draft')
        self.message_user(request, f"{count} project(s) set to Draft.")

    @admin.action(description="Toggle Featured Status")
    def toggle_featured(self, request, queryset):
        for p in queryset:
            p.featured = not p.featured
            p.save()
        self.message_user(request, "Toggled featured flag for selected projects.")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'badge', 'icon_name', 'proficiency', 'is_featured', 'order')
    list_filter = ('category', 'is_featured')
    search_fields = ('name', 'badge')
    list_editable = ('proficiency', 'is_featured', 'order')


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'location', 'start_date', 'end_date', 'is_current', 'order')
    list_filter = ('is_current', 'start_date')
    search_fields = ('role', 'company', 'summary')
    list_editable = ('order',)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'field_of_study', 'start_year', 'end_year', 'grade', 'order')
    search_fields = ('degree', 'institution', 'field_of_study')
    list_editable = ('order',)


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuing_organization', 'issue_date', 'credential_id', 'order')
    search_fields = ('title', 'issuing_organization')


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'metric', 'date', 'order')
    search_fields = ('title', 'description', 'metric')


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'icon_name', 'is_visible', 'order')
    list_editable = ('is_visible', 'order')
    search_fields = ('platform', 'url')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'short_description', 'icon_name', 'order')
    search_fields = ('title', 'short_description', 'full_description')
    list_editable = ('order',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'status_badge', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at', 'ip_address')
    actions = ['mark_as_read', 'mark_as_unread']

    def status_badge(self, obj):
        if obj.is_read:
            return format_html('<span style="color: #10b981; font-weight: bold;">● READ</span>')
        return format_html('<span style="color: #ef4444; font-weight: bold;">● UNREAD</span>')
    status_badge.short_description = "Status"

    @admin.action(description="Mark selected messages as READ")
    def mark_as_read(self, request, queryset):
        count = queryset.update(is_read=True)
        self.message_user(request, f"{count} message(s) marked as read.")

    @admin.action(description="Mark selected messages as UNREAD")
    def mark_as_unread(self, request, queryset):
        count = queryset.update(is_read=False)
        self.message_user(request, f"{count} message(s) marked as unread.")


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('privacy_mode_badge', 'allow_contact_form', 'allow_ai_assistant', 'updated_at')
    list_editable = ('allow_contact_form', 'allow_ai_assistant')
    actions = ['set_mode_public', 'set_mode_maintenance', 'set_mode_private']

    def privacy_mode_badge(self, obj):
        colors = {
            'PUBLIC': '#10b981',      # green
            'MAINTENANCE': '#f59e0b', # amber
            'PRIVATE': '#ef4444',     # red
        }
        color = colors.get(obj.privacy_mode, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold;">● {} MODE</span>', color, obj.privacy_mode)
    privacy_mode_badge.short_description = "System Privacy Status"

    @admin.action(description="Switch System Status to PUBLIC MODE")
    def set_mode_public(self, request, queryset):
        queryset.update(privacy_mode='PUBLIC')
        self.message_user(request, "System privacy mode changed to PUBLIC.")

    @admin.action(description="Switch System Status to MAINTENANCE MODE")
    def set_mode_maintenance(self, request, queryset):
        queryset.update(privacy_mode='MAINTENANCE')
        self.message_user(request, "System privacy mode changed to MAINTENANCE.")

    @admin.action(description="Switch System Status to PRIVATE MODE (Shielded)")
    def set_mode_private(self, request, queryset):
        queryset.update(privacy_mode='PRIVATE')
        self.message_user(request, "System privacy mode changed to PRIVATE.")


@admin.register(AIKnowledgeDocument)
class AIKnowledgeDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'priority', 'is_active', 'created_at')
    list_filter = ('topic', 'is_active')
    search_fields = ('title', 'content', 'keywords')
    list_editable = ('priority', 'is_active')


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'action', 'model_name', 'object_id', 'details')
    list_filter = ('model_name', 'action', 'timestamp')
    readonly_fields = ('action', 'model_name', 'object_id', 'details', 'timestamp')
