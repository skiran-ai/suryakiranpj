from django.test import TestCase
from django.core import mail
from rest_framework.test import APIClient
from rest_framework import status
from api.models import ContactMessage, SiteSetting

class ContactEmailDeliveryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        SiteSetting.objects.get_or_create(
            id=1,
            defaults={
                "privacy_mode": "PUBLIC",
                "allow_contact_form": True
            }
        )

    def test_contact_form_submission_success_and_email_dispatched(self):
        payload = {
            "name": "Alex Johnson",
            "email": "alex.johnson@example.com",
            "subject": "Full Stack Contract Inquiry",
            "message": "Hi Suryakiran, I would like to discuss building a custom Django + React web platform."
        }

        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get('success'))
        self.assertTrue(response.data.get('email_delivered'))

        # Verify record in database
        message_obj = ContactMessage.objects.filter(email="alex.johnson@example.com").first()
        self.assertIsNotNone(message_obj)
        self.assertEqual(message_obj.name, "Alex Johnson")
        self.assertEqual(message_obj.subject, "Full Stack Contract Inquiry")
        self.assertEqual(message_obj.is_read, False)

        # Verify email dispatched in django.core.mail.outbox
        self.assertEqual(len(mail.outbox), 1)
        sent_email = mail.outbox[0]
        self.assertIn("Full Stack Contract Inquiry", sent_email.subject)
        self.assertIn("[Portfolio Contact]", sent_email.subject)
        self.assertEqual(sent_email.to, ["suryakiranpjineesh@gmail.com"])
        self.assertEqual(sent_email.reply_to, ["alex.johnson@example.com"])
        self.assertIn("Alex Johnson", sent_email.body)
        self.assertIn("Hi Suryakiran, I would like to discuss building a custom Django + React web platform.", sent_email.body)

    def test_contact_form_validation_rejects_empty_and_invalid(self):
        # Empty name
        res = self.client.post('/api/contact/', {
            "name": "",
            "email": "valid@email.com",
            "message": "This is a valid message length."
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data.get('success'))

        # Invalid email format
        res = self.client.post('/api/contact/', {
            "name": "Jane Doe",
            "email": "not-an-email",
            "message": "This is a valid message length."
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data.get('success'))

        # Too short message
        res = self.client.post('/api/contact/', {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "message": "hi"
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data.get('success'))

    def test_contact_form_handles_optional_subject(self):
        payload = {
            "name": "Sam Developer",
            "email": "sam@dev.org",
            "message": "Inquiring without a specific subject line provided."
        }
        res = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("[Portfolio Contact] New Inquiry from Sam Developer", mail.outbox[0].subject)
