from rest_framework import serializers
from .models import ContactMessage, Project

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']

    def validate_email(self, value):
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value.lower().strip()

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()

    def validate_message(self, value):
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError("Message must be at least 5 characters long.")
        return value.strip()

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
