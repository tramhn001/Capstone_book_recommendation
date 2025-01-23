from django.urls import path
from . import views

urlpatterns = [
    path("books/", views.BookListCreate.as_view(), name="book-list"),
    path("user_books/add/", views.AddBookToList.as_view(), name="add-user-book"),
    path("user_books/<int:pk>/delete/", views.DeleteBookFromListView.as_view(), name="delete-user-book"),
    path("user_books/to-read/", views.ToReadListView.as_view(), name="to-read-list"),
    path("user_books/read/", views.ReadListView.as_view(), name="read-list"),
    path("user_books/", views.UserBookListView.as_view(), name="user-books"),
    path("user/register/", views.CreateUserView.as_view(), name="register-user"),
]