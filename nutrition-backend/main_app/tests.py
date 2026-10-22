from django.test import TestCase
from django.test import override_settings
from django.contrib.auth.models import User
from unittest.mock import Mock, patch
import time
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient


class GoogleLoginTests(TestCase):
    @override_settings(GOOGLE_CLIENT_ID="fitness-app-client-id")
    @patch("main_app.views.requests.get")
    def test_google_login_creates_user_and_returns_tokens(self, google_get):
        google_get.return_value = Mock(
            status_code=200,
            json=lambda: {
                "aud": "fitness-app-client-id",
                "iss": "https://accounts.google.com",
                "exp": str(int(time.time()) + 3600),
                "sub": "google-user-123",
                "email": "user@example.com",
                "email_verified": "true",
                "name": "Test User",
            },
        )

        response = APIClient().post(
            "/api/auth/google/",
            {"credential": "valid-google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["profile"]["id"], "google-user-123")
        user = User.objects.get(username="google-user-123")
        self.assertFalse(user.has_usable_password())
        google_get.assert_called_once_with(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": "valid-google-id-token"},
            timeout=5,
        )

    @override_settings(GOOGLE_CLIENT_ID="fitness-app-client-id")
    @patch("main_app.views.requests.get")
    def test_google_login_reuses_existing_user(self, google_get):
        User.objects.create_user(
            username="google-user-123",
            email="user@example.com",
            password="legacy-password",
        )
        google_get.return_value = Mock(
            status_code=200,
            json=lambda: {
                "aud": "fitness-app-client-id",
                "iss": "https://accounts.google.com",
                "exp": str(int(time.time()) + 3600),
                "sub": "google-user-123",
                "email": "user@example.com",
                "email_verified": "true",
            },
        )

        response = APIClient().post(
            "/api/auth/google/",
            {"credential": "valid-google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.filter(username="google-user-123").count(), 1)

    @override_settings(GOOGLE_CLIENT_ID="fitness-app-client-id")
    @patch("main_app.views.requests.get")
    def test_google_login_rejects_invalid_google_token(self, google_get):
        google_get.return_value = Mock(status_code=401)

        response = APIClient().post(
            "/api/auth/google/",
            {"credential": "invalid-google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(User.objects.count(), 0)

    @override_settings(GOOGLE_CLIENT_ID="fitness-app-client-id")
    @patch("main_app.views.requests.get")
    def test_google_login_rejects_wrong_audience_and_expired_token(self, google_get):
        invalid_claims = [
            {
                "aud": "another-app-client-id",
                "iss": "https://accounts.google.com",
                "exp": str(int(time.time()) + 3600),
                "sub": "google-user-123",
                "email": "user@example.com",
                "email_verified": "true",
            },
            {
                "aud": "fitness-app-client-id",
                "iss": "https://accounts.google.com",
                "exp": str(int(time.time()) - 1),
                "sub": "google-user-123",
                "email": "user@example.com",
                "email_verified": "true",
            },
        ]

        for claims in invalid_claims:
            google_get.return_value = Mock(
                status_code=200,
                json=lambda claims=claims: claims,
            )
            response = APIClient().post(
                "/api/auth/google/",
                {"credential": "invalid-google-id-token"},
                format="json",
            )
            self.assertEqual(response.status_code, 401)

        self.assertEqual(User.objects.count(), 0)

    @override_settings(GOOGLE_CLIENT_ID="fitness-app-client-id")
    @patch("main_app.views.requests.get")
    def test_google_login_rejects_mismatched_existing_account_email(self, google_get):
        User.objects.create_user(
            username="google-user-123",
            email="other@example.com",
            password="legacy-password",
        )
        google_get.return_value = Mock(
            status_code=200,
            json=lambda: {
                "aud": "fitness-app-client-id",
                "iss": "https://accounts.google.com",
                "exp": str(int(time.time()) + 3600),
                "sub": "google-user-123",
                "email": "user@example.com",
                "email_verified": "true",
            },
        )

        response = APIClient().post(
            "/api/auth/google/",
            {"credential": "valid-google-id-token"},
            format="json",
        )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(User.objects.count(), 1)

    def test_google_login_requires_google_token(self):
        response = APIClient().post("/api/auth/google/", {}, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 0)


class RefreshTokenLifecycleTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="refresh-user",
            password="test-password",
        )
        self.client = APIClient()

    def test_refresh_rotates_and_revokes_previous_token(self):
        refresh = str(RefreshToken.for_user(self.user))

        response = self.client.post(
            "/api/auth/token/refresh/",
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertNotEqual(response.data["refresh"], refresh)

        old_token_response = self.client.post(
            "/api/auth/token/refresh/",
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(old_token_response.status_code, 401)

    def test_logout_blacklists_refresh_token(self):
        refresh = str(RefreshToken.for_user(self.user))

        logout_response = self.client.post(
            "/api/auth/logout/",
            {"refresh": refresh},
            format="json",
        )
        refresh_response = self.client.post(
            "/api/auth/token/refresh/",
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(logout_response.status_code, 200)
        self.assertEqual(refresh_response.status_code, 401)
