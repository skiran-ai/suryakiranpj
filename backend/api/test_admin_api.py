from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Project, Skill, Profile, Service, Experience

class AdminAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@suryakiranpj.com',
            password='surya007',
            is_staff=True,
            is_superuser=True
        )
        self.normal_user = User.objects.create_user(
            username='regular',
            email='regular@suryakiranpj.com',
            password='regularpass123',
            is_staff=False
        )

    def test_anonymous_access_denied_for_admin_endpoints(self):
        res = self.client.get('/api/admin/projects/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.post('/api/admin/projects/', {'title': 'Hack Project', 'slug': 'hack'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_user_denied_for_admin_endpoints(self):
        # Authenticate regular user
        login_res = self.client.post('/api/admin/login/', {
            'username': 'regular',
            'password': 'regularpass123'
        })
        self.assertEqual(login_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_login_and_token_flow(self):
        login_res = self.client.post('/api/admin/login/', {
            'username': 'admin',
            'password': 'surya007'
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res.data.get('success'))
        token = login_res.data.get('token')
        self.assertIsNotNone(token)

        # Set token header
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # Test /api/admin/me/
        me_res = self.client.get('/api/admin/me/')
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data.get('username'), 'admin')

        # Test /api/admin/stats/
        stats_res = self.client.get('/api/admin/stats/')
        self.assertEqual(stats_res.status_code, status.HTTP_200_OK)
        self.assertIn('counts', stats_res.data)

    def test_project_crud_and_publication_filtering(self):
        # Admin login
        login_res = self.client.post('/api/admin/login/', {
            'username': 'admin',
            'password': 'surya007'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # 1. Create a Draft Project
        draft_payload = {
            'title': 'Secret Project X',
            'slug': 'secret-project-x',
            'category': 'Backend',
            'short_description': 'Internal draft project',
            'problem_statement': 'Needs architecture',
            'solution_architecture': 'Django REST',
            'my_role': 'Lead Architect',
            'image_url': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            'github_url': 'https://github.com/skiran-ai/secret',
            'live_url': '',
            'technologies': ['Python', 'Django'],
            'features': ['Draft spec'],
            'status': 'Draft',
            'featured': False
        }
        create_res = self.client.post('/api/admin/projects/', draft_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        project_id = create_res.data['id']

        # 2. Public Project List should NOT show Draft project
        public_client = APIClient()
        public_res = public_client.get('/api/projects/')
        self.assertEqual(public_res.status_code, status.HTTP_200_OK)
        slugs = [p['slug'] for p in public_res.data]
        self.assertNotIn('secret-project-x', slugs)

        # 3. Admin Project List SHOULD show Draft project
        admin_res = self.client.get('/api/admin/projects/')
        self.assertEqual(admin_res.status_code, status.HTTP_200_OK)
        admin_slugs = [p['slug'] for p in admin_res.data]
        self.assertIn('secret-project-x', admin_slugs)

        # 4. Update status to 'Published'
        update_res = self.client.patch(f'/api/admin/projects/{project_id}/', {'status': 'Published'}, format='json')
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.assertEqual(update_res.data['status'], 'Published')

        # 5. Public Project List now SHOULD include the project
        public_res = public_client.get('/api/projects/')
        slugs = [p['slug'] for p in public_res.data]
        self.assertIn('secret-project-x', slugs)

        # 6. Delete project
        del_res = self.client.delete(f'/api/admin/projects/{project_id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

        # 7. Verify removed from public
        public_res = public_client.get('/api/projects/')
        slugs = [p['slug'] for p in public_res.data]
        self.assertNotIn('secret-project-x', slugs)
