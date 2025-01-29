from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, BookSerializer, UserBookSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Book, UserBook
from rest_framework.exceptions import PermissionDenied
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

# View for searching book
class GoogleBooksSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"})
        
        google_books_api_url = "https://www.googleapis.com/books/v1/volumes"
        params = {
            "q": query,
            "key": settings.GOOGLE_BOOKS_API_KEY,
            "maxResults": 10 # Limit the number of results
        }

        response = requests.get(google_books_api_url, params=params)
        if response.status_code == 200:
            books = response.json().get('items', [])
            results = []
            for book in books:
                volume_info = book.get('volumeInfo', {})
                results.append({
                    "google_book_id": book.get("id"),
                    "title": volume_info.get("title"),
                    "author": ", ".join(volume_info.get("authors", [])),
                    "published_date": volume_info.get("publishedDate"),
                    "description": volume_info.get("description"),
                    "cover_image": volume_info.get("imageLinks", {}).get("thumbnail"),
                })
            return Response(results)
        return Response({"error": "Failed to fetch data from Google Books API"}, status=response.status_code)
    
# View to list and create books
class BookListCreate(generics.ListCreateAPIView):
    serializer_class = BookSerializer
    permission = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Book.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()

# View to add a book to user's to-read or read list
class AddBookToList(generics.CreateAPIView):
    serializer_class = UserBookSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        book_id = self.request.data.get('book_id')
        read_status = self.request.data.get('read_status', 'to-read')

        book = Book.objects.get(id=book_id)

        if UserBook.objects.filter(user=self.request.user, book=book).exist():
            raise PermissionDenied("This book is already in your list.")
        
        serializer.save(user=self.request.user, book=book, read_status=read_status)

# View to delete a book from user's to-read or read list
class DeleteBookFromListView(generics.DestroyAPIView):
    serializer_class = UserBookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBook.objects.filter(user=self.request.user)
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this book")
        instance.delete()

# View to get to-read list of a user
class ToReadListView(generics.ListAPIView):
    serializer_class = UserBookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBook.objects.filter(user=self.request.user, read_status="to-read")
    
# View to get read list of a user
class ReadListView(generics.ListAPIView):
    serializer_class = UserBookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBook.objects.filter(user=self.request.user, read_status="read")
    
# View to get all books of a user
class UserBookListView(generics.ListAPIView):
    serializer_class = UserBookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBook.objects.filter(user=self.request.user)
    
# User registration
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


        
