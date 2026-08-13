from django.urls import path
from .views import ContactSubmitView, ChatbotQueryView, ProjectListView, CVMetadataView

urlpatterns = [
    path('contact/', ContactSubmitView.as_view(), name='contact-submit'),
    path('chatbot/', ChatbotQueryView.as_view(), name='chatbot-query'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('cv/', CVMetadataView.as_view(), name='cv-metadata'),
]
