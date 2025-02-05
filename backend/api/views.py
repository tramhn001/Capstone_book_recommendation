from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
import requests
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer,LoginSerializer, ReadListSerializer, WantToReadListSerializer  
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


class RemoveBookFromListView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, list_type, book_id):
        user = request.user
        print(f"Received DELETE request for {list_type} list, book_id={book_id}, user={user}")

        if list_type == "read":
            book_entry = ReadList.objects.filter(user=user, book_id=book_id).first()
        elif list_type == "want-to-read":
            book_entry = WantToReadList.objects.filter(user=user, book_id=book_id).first()
        else:
            return Response({"error": "Invalid list type"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if book_entry is None before calling delete()
        if book_entry is None:
            print("Book not found, returning 404")
            return Response({"error": "Book not found in the list"}, status=status.HTTP_404_NOT_FOUND)

        # Now it's safe to call delete()
        book_entry.delete()
        print("Book deleted successfully")
        return Response({"message": "Book removed successfully"}, status=status.HTTP_200_OK)
    
class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        read_books = ReadList.objects.filter(user=user)
        want_to_read_books = WantToReadList.objects.filter(user=user)

        # Combine the books from both lists
        all_books = list(read_books) + list(want_to_read_books)

        # Extract genres from the books
        genres = []
        for book in all_books:
            if book.genre:
                genres.extend(book.genre)

        # Count the occurrences of each genre
        genre_counts = {}
        for genre in genres:
            if genre in genre_counts:
                genre_counts[genre] += 1
            else:
                genre_counts[genre] = 1

        # Sort genres by their counts in descending order
        sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)

        # Get the top 3 genres
        top_genres = [genre for genre, count in sorted_genres[:3]]

        # Fetch recommendations based on the top genres
        recommendations = Book.objects.filter(genre__in=top_genres).exclude(id__in=[book.id for book in all_books])

        return Response({"recommendations": recommendations.values()})
        
        
# User registration
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


        
