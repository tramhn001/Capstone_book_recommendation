from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CreateUserView, LoginView, GoogleBooksSearchView, UserListsView, AddToReadListView, AddToWantToReadListView, RemoveBookFromListView, RecommendationByGenreView, RecommendationByAuthorView

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="register-user"),
    path("user/login/", LoginView.as_view(), name="login"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("books/search/", GoogleBooksSearchView.as_view(), name="search-books"),
    path("user/lists/", UserListsView.as_view(), name="user-lists"),
    path("user/lists/read/add/", AddToReadListView.as_view(), name="add-to-read-list"),
    path("user/lists/want-to-read/add/", AddToWantToReadListView.as_view(), name="add-to-want-to-read-list"),
    path("user/lists/<str:list_type>/remove/<str:book_id>/", RemoveBookFromListView.as_view(), name="remove-book"),
    path("user/lists/recommendations/genre/", RecommendationByGenreView.as_view(), name="recommend-books-by-genre"),
    path("user/lists/recommendations/author/", RecommendationByAuthorView.as_view(), name="recommend-books-by-author"),
]