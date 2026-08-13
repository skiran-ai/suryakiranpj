from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=255, blank=True, default='')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Project(models.Model):
    CATEGORY_CHOICES = (
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('Full Stack', 'Full Stack'),
    )

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    short_description = models.CharField(max_length=300)
    problem_statement = models.TextField()
    solution_architecture = models.TextField()
    my_role = models.CharField(max_length=255)
    image_url = models.URLField()
    github_url = models.URLField()
    live_url = models.URLField(blank=True, default='')
    technologies = models.JSONField(default=list)
    features = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} [{self.category}]"
