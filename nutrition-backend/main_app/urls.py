from django.urls import path
from .views import greeting, RegisterNewUser
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('main_app/', views.exercise_list),
    path('main_app/<int:pk>/', views.exercise_detail),
    path('main_app/<int:pk>/bookmarks/', views.exercise_bookmark),
    path("auth/hello/", greeting.as_view(), name="greeting"),
    path("auth/register/", RegisterNewUser.as_view(), name="register"),
    path("auth/login/", obtain_auth_token, name="create_token"),
]