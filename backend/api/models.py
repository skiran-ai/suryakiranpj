from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=150, default="Suryakiran P. J.")
    role = models.CharField(max_length=200, default="Python Full Stack Developer")
    tagline = models.TextField(default="Building modern, responsive and scalable web experiences with Python, Django, and React.")
    summary = models.TextField(default="Enthusiastic Python Full Stack Developer with strong expertise in building RESTful APIs, relational database design, and dynamic React user interfaces.")
    email = models.EmailField(default="suryakiranpjineesh@gmail.com")
    location = models.CharField(max_length=150, default="Kerala, India")
    avatar_url = models.URLField(blank=True, default="")
    github_url = models.URLField(default="https://github.com/skiran-ai")
    linkedin_url = models.URLField(default="https://www.linkedin.com/in/surya-kiran-967659351")
    instagram_url = models.URLField(default="https://www.instagram.com/jstt.kiran")
    resume_pdf_url = models.URLField(blank=True, default="/assets/Suryakiran-PJ-CV.pdf")
    availability = models.CharField(max_length=100, default="Available for Full-time & Remote Roles")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profile"

    def __str__(self):
        return f"{self.name} - {self.role}"


class Project(models.Model):
    CATEGORY_CHOICES = (
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('Full Stack', 'Full Stack'),
        ('AI/ML', 'AI / Machine Learning'),
        ('DevOps', 'DevOps & Cloud'),
    )

    STATUS_CHOICES = (
        ('Published', 'Published'),
        ('Draft', 'Draft'),
    )

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    short_description = models.CharField(max_length=300)
    detailed_description = models.TextField(blank=True, default="")
    problem_statement = models.TextField()
    solution_architecture = models.TextField()
    my_role = models.CharField(max_length=255)
    image_url = models.URLField()
    github_url = models.URLField()
    live_url = models.URLField(blank=True, default='')
    technologies = models.JSONField(default=list)
    features = models.JSONField(default=list)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Published')
    
    # Technical X-Ray visual workflow breakdown details
    frontend_tech = models.CharField(max_length=255, blank=True, default="React 18, Vite, Bootstrap 5, Lucide Icons")
    backend_tech = models.CharField(max_length=255, blank=True, default="Python 3.11+, Django 4.2+, Django REST Framework")
    database_tech = models.CharField(max_length=255, blank=True, default="PostgreSQL / SQLite ORM")
    deployment_tech = models.CharField(max_length=255, blank=True, default="Netlify CDN + Django Cloud API")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.title} [{self.category}]"


class Skill(models.Model):
    CATEGORY_CHOICES = (
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('tools', 'Tools & DevOps'),
        ('development', 'Core Development'),
    )

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    badge = models.CharField(max_length=150, help_text="e.g. Hooks & Component Architecture", blank=True, default="")
    icon_name = models.CharField(max_length=50, default="Code", help_text="Lucide React icon name")
    proficiency = models.PositiveIntegerField(default=90, help_text="Percentage 1-100")
    is_featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    location = models.CharField(max_length=150, default="Remote / Kerala, India")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    summary = models.TextField()
    bullet_points = models.JSONField(default=list)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-start_date']

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(models.Model):
    institution = models.CharField(max_length=250)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    start_year = models.IntegerField(default=2020)
    end_year = models.IntegerField(default=2023)
    grade = models.CharField(max_length=50, blank=True, default="")
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-end_year']
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Certification(models.Model):
    title = models.CharField(max_length=200)
    issuing_organization = models.CharField(max_length=200)
    issue_date = models.DateField()
    credential_id = models.CharField(max_length=100, blank=True, default="")
    credential_url = models.URLField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-issue_date']

    def __str__(self):
        return f"{self.title} ({self.issuing_organization})"


class Achievement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    metric = models.CharField(max_length=100, blank=True, default="")
    date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class SocialLink(models.Model):
    platform = models.CharField(max_length=50)
    url = models.URLField()
    icon_name = models.CharField(max_length=50, default="Globe")
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'platform']

    def __str__(self):
        return f"{self.platform} -> {self.url}"


class Service(models.Model):
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300)
    full_description = models.TextField()
    icon_name = models.CharField(max_length=50, default="Layers")
    technologies = models.JSONField(default=list)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=255, blank=True, default='')
    message = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class SiteSetting(models.Model):
    PRIVACY_CHOICES = (
        ('PUBLIC', 'PUBLIC MODE - Full Access'),
        ('MAINTENANCE', 'MAINTENANCE MODE - Scheduled Maintenance'),
        ('PRIVATE', 'PRIVATE MODE - System Shielded'),
    )

    privacy_mode = models.CharField(max_length=20, choices=PRIVACY_CHOICES, default='PUBLIC')
    maintenance_message = models.TextField(default="System maintenance in progress. Public endpoints are temporarily restricted.")
    allow_contact_form = models.BooleanField(default=True)
    allow_ai_assistant = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Setting & Privacy Control"
        verbose_name_plural = "Site Settings & Privacy Control"

    def __str__(self):
        return f"SYSTEM STATUS: ● {self.privacy_mode} MODE"


class AIKnowledgeDocument(models.Model):
    TOPIC_CHOICES = (
        ('bio', 'Developer Bio & Background'),
        ('skill', 'Skills & Technical Stack'),
        ('project', 'Projects & Engineering'),
        ('cv', 'CV & Career History'),
        ('contact', 'Contact & Socials'),
        ('services', 'Services & Contracting'),
        ('general', 'General Knowledge'),
    )

    title = models.CharField(max_length=200)
    topic = models.CharField(max_length=50, choices=TOPIC_CHOICES, default='general')
    keywords = models.JSONField(default=list, help_text="Keywords list for matching query intent")
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-priority', 'topic']
        verbose_name = "AI Knowledge Document"
        verbose_name_plural = "AI Knowledge Documents"

    def __str__(self):
        return f"[{self.get_topic_display()}] {self.title}"


class AdminAuditLog(models.Model):
    action = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, blank=True, default="")
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {self.action} on {self.model_name}"
