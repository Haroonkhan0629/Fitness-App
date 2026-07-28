from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import greeting, RegisterNewUser
from . import views

urlpatterns = [
    path('main_app/', views.exercise_list),
    path('main_app/<int:pk>/', views.exercise_detail),
    path('main_app/<int:pk>/bookmarks/', views.exercise_bookmark),
    path("auth/hello/", greeting.as_view(), name="greeting"),
    path("auth/register/", RegisterNewUser.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]