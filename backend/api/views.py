from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
import requests
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, BookSerializer, UserBookSerializer, LoginSerializer, ReadListSerializer, WantToReadListSerializer  
from .models import Book, UserBook, ReadList, WantToReadList

# User login view to accept email instead of username
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        email = request.data.get("username") # fix wrong field to get email instead of username
        password = request.data.get("password")

        
        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)
        
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username
            })
        else:
            return Response({"error": "Invalid credentials"}, status=401)   
    
@api_view(["POST"])
def user_register(request):
    data = request.data

    # Ensure all required fields are provided
    required_fields = ["username", "email", "password"]
    for field in required_fields:
        if not data.get(field):
            return Response({"error": f"{field} is required"}, status=400)
        
    # Check if user already exists
    if User.objects.filter(username=data.get("username")).exists():
        return Response({"error": "User already taken"}, status=400)
    
    if User.objects.filter(email=data.get("email")).exists():
        return Response({"error": "Email already registered"}, status=400)
    
    try:
        user = User.objects.create_user(
            username=data.get("username"),
            email=data.get("email"),
            password=data.get("password")
        )

        return Response({"message": "User registered successfully"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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
# class BookListCreate(generics.ListCreateAPIView):
#     serializer_class = BookSerializer
#     permission = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return Book.objects.all()
    
#     def perform_create(self, serializer):
#         serializer.save()

# # View to add a book to user's to-read or read list
# class AddBookToList(generics.CreateAPIView):
#     serializer_class = UserBookSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         book_id = self.request.data.get('book_id')
#         read_status = self.request.data.get('read_status', 'to-read')

#         book = Book.objects.get(id=book_id)

#         if UserBook.objects.filter(user=self.request.user, book=book).exists():
#             raise PermissionDenied("This book is already in your list.")
        
#         serializer.save(user=self.request.user, book=book, read_status=read_status)

# # View to delete a book from user's to-read or read list
# class DeleteBookFromListView(generics.DestroyAPIView):
#     serializer_class = UserBookSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return UserBook.objects.filter(user=self.request.user)
    
#     def perform_destroy(self, instance):
#         if instance.user != self.request.user:
#             raise PermissionDenied("You do not have permission to delete this book")
#         instance.delete()

# # View to get to-read list of a user
# class ToReadListView(generics.ListAPIView):
#     serializer_class = UserBookSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return UserBook.objects.filter(user=self.request.user, read_status="to-read")
    
# 

class UserListsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        read_books = ReadList.objects.filter(user=request.user)
        want_to_read_books = WantToReadList.objects.filter(user=request.user)
    
        read_books_serialized = ReadListSerializer(read_books, many=True)
        want_to_read_books_serialized = WantToReadListSerializer(want_to_read_books, many=True)

        return Response({
            "read_list": read_books_serialized.data,
            "want_to_read_list": want_to_read_books_serialized.data
        })

class AddToReadListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data) # debugging
        book_id = request.data['payload']['book_id']
        book_authors = request.data['payload']['author']
        book_title = request.data['payload']['title']
        thumbnail  = request.data['payload']['thumbnail']
        finished_date = request.data['payload']['finished_date']
        rating = request.data['payload']['rating']
        review = request.data['payload']['review']
        filtered_data = {"book_id": book_id, 
                         "author": book_authors,
                         "title": book_title,
                         "user": request.user.id,
                         "thumbnail": thumbnail,
                         "finished_date": finished_date,
                         "rating": rating,
                         "review": review}
        
        serializer = ReadListSerializer(data=filtered_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
class AddToWantToReadListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data) # debugging
        book_id = request.data['payload']['book_id']
        book_authors = request.data['payload']['author']
        book_title = request.data['payload']['title']
        thumbnail  = request.data['payload']['thumbnail']
        filtered_data = {"book_id": book_id, 
                         "author": book_authors,
                         "title": book_title,
                         "user": request.user.id,
                         "thumbnail": thumbnail}
        serializer = WantToReadListSerializer(data=filtered_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# User registration
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


        
