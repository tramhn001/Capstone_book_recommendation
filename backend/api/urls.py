from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CreateUserView, LoginView, GoogleBooksSearchView 

# urlpatterns = [
#     path("books/", views.BookListCreate.as_view(), name="book-list"),
#     path("login/", views.LoginView.as_view(), name="login"),
#     path("api-auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
#     path("api-auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
#     path("user_books/add/", views.AddBookToList.as_view(), name="add-user-book"),
#     path("user_books/<int:pk>/delete/", views.DeleteBookFromListView.as_view(), name="delete-user-book"),
#     path("user_books/to-read/", views.ToReadListView.as_view(), name="to-read-list"),
#     path("user_books/read/", views.ReadListView.as_view(), name="read-list"),
#     path("user_books/", views.UserBookListView.as_view(), name="user-books"),
#     path("user/register/", views.CreateUserView.as_view(), name="register-user"),
#     path("books/search/", views.GoogleBooksSearchView.as_view(), name="search-books"),
# ]

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="register-user"),
    path("user/login/", LoginView.as_view(), name="login"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("books/search/", GoogleBooksSearchView.as_view(), name="search-books"),
    # path("books/recommendations/", RecommendationView.as_view(), name="recommend-books"),
]