from django.urls import path
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenRefreshView,
)
from .views import GoogleLogin, greeting
from . import views

urlpatterns = [
    path('main_app/', views.exercise_list),
    path('main_app/<int:pk>/', views.exercise_detail),
    path('main_app/<int:pk>/bookmarks/', views.exercise_bookmark),
    path("auth/hello/", greeting.as_view(), name="greeting"),
    path("auth/google/", GoogleLogin.as_view(), name="google_login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", TokenBlacklistView.as_view(), name="token_blacklist"),
]
