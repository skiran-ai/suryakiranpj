import sys
from django.core.management.base import BaseCommand
from django.core.mail import EmailMessage
from django.conf import settings

class Command(BaseCommand):
    help = "Test SMTP email delivery to your inbox and print configuration diagnostics."

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            default=getattr(settings, 'CONTACT_EMAIL', 'suryakiranpjineesh@gmail.com'),
            help='Recipient email address for the test message'
        )

    def handle(self, *args, **options):
        recipient = options['to']
        self.stdout.write(self.style.NOTICE("=================================================="))
        self.stdout.write(self.style.NOTICE("🔍 Testing Email Delivery Configuration"))
        self.stdout.write(self.style.NOTICE("=================================================="))

        self.stdout.write(f"EMAIL_BACKEND:       {getattr(settings, 'EMAIL_BACKEND', 'Not Set')}")
        self.stdout.write(f"EMAIL_HOST:          {getattr(settings, 'EMAIL_HOST', 'Not Set')}")
        self.stdout.write(f"EMAIL_PORT:          {getattr(settings, 'EMAIL_PORT', 'Not Set')}")
        self.stdout.write(f"EMAIL_USE_TLS:       {getattr(settings, 'EMAIL_USE_TLS', 'Not Set')}")
        self.stdout.write(f"EMAIL_HOST_USER:     {getattr(settings, 'EMAIL_HOST_USER', 'Not Set')}")
        self.stdout.write(f"EMAIL_HOST_PASSWORD: {'[CONFIGURED]' if getattr(settings, 'EMAIL_HOST_PASSWORD', '') else '[NOT SET / EMPTY]'}")
        self.stdout.write(f"DEFAULT_FROM_EMAIL:  {getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not Set')}")
        self.stdout.write(f"CONTACT_EMAIL:       {getattr(settings, 'CONTACT_EMAIL', 'Not Set')}")
        self.stdout.write(f"Sending test to:     {recipient}\n")

        if not getattr(settings, 'EMAIL_HOST_USER', '') or not getattr(settings, 'EMAIL_HOST_PASSWORD', ''):
            self.stdout.write(self.style.WARNING("⚠️ WARNING: EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is not configured in your environment."))
            self.stdout.write(self.style.WARNING("For Gmail SMTP, please set EMAIL_HOST_USER and a 16-character Google App Password in your environment variables.\n"))

        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', '') or getattr(settings, 'EMAIL_HOST_USER', '') or 'suryakiranpjineesh@gmail.com'

        try:
            msg = EmailMessage(
                subject="[Portfolio Test] SMTP Verification Email",
                body=(
                    "Hello Suryakiran,\n\n"
                    "If you are reading this email in your Gmail inbox, your portfolio's SMTP email delivery is fully operational and configured correctly!\n\n"
                    f"Backend Host: {getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com')}\n"
                    f"Sender: {from_email}\n"
                    f"Recipient: {recipient}\n"
                ),
                from_email=from_email,
                to=[recipient],
            )
            msg.send(fail_silently=False)
            self.stdout.write(self.style.SUCCESS(f"✅ SUCCESS: Test email successfully sent to {recipient}! Check your inbox/spam folder."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ FAILED: Could not send email via SMTP."))
            self.stdout.write(self.style.ERROR(f"Error details: {e}"))
            self.stdout.write("\n💡 Troubleshooting Tips:")
            self.stdout.write("1. Ensure 2-Step Verification is enabled on your Google Account.")
            self.stdout.write("2. Generate a 16-character Google App Password at: https://myaccount.google.com/apppasswords")
            self.stdout.write("3. Add EMAIL_HOST_USER and EMAIL_HOST_PASSWORD to your Render environment variables.")
