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

from .serializers import BookSerializer, UserSerializer,LoginSerializer, ReadListSerializer, WantToReadListSerializer  
from .models import Book, ReadList, RecommendationByGenre, WantToReadList, UserBook, RecommendationByAuthor
from collections import Counter

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

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
        
# User registration
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        required_fields = ["username", "email", "password"]
        
        # Ensure all required fields are provided
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"{field} is required"}, status=400)

        # Check if user already exists
        if User.objects.filter(username=data.get("username")).exists():
            return Response({"error": "Username is already taken"}, status=400)

        if User.objects.filter(email=data.get("email")).exists():
            return Response({"error": "Email is already registered"}, status=400)

        return super().create(request, *args, **kwargs)

# View for searching book
class GoogleBooksSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"})
        
        params = {
            "q": query,
            "key": settings.GOOGLE_BOOKS_API_KEY,
            "maxResults": 20 # Limit the number of results
        }

        response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
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
        genre = request.data['payload']['genre']
        filtered_data = {"book_id": book_id, 
                         "author": book_authors,
                         "title": book_title,
                         "user": request.user.id,
                         "thumbnail": thumbnail,
                         "finished_date": finished_date,
                         "rating": rating,
                         "review": review,
                         "genre":genre}
        
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
        genre = request.data['payload']['genre']
        filtered_data = {"book_id": book_id, 
                         "author": book_authors,
                         "title": book_title,
                         "user": request.user.id,
                         "thumbnail": thumbnail,
                         "genre": genre}
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
    
class RecommendationByGenreView(APIView):
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
                genres.extend(book.genre.split(","))
        # Count the occurrences of each genre
        genre_counts = Counter(genres)
        
        # Get the top 3 genres
        top_genres = [genre for genre, _ in genre_counts.most_common(3)]
        # Fetch recommendations based on the top genres from google books API
        genre_recommendations = {}
        for genre in top_genres:
            recommended_books = []
            params = {
                "q": f"subject:{genre}",
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "printType": "books",
                "maxResults": 5
            }
            response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
            if response.status_code == 200:
                books = response.json().get('items', [])
                for book in books:
                    print(f"Found {book}\r    \n")
                    
                    volume_info = book.get('volumeInfo', {})
                    recommended_book, created = Book.objects.get_or_create(
                        google_book_id=book.get("id"),
                        title = volume_info.get("title"),
                        author = ", ".join(volume_info.get("authors", [])),
                        published_date = volume_info.get("publishedDate"),  
                        description = volume_info.get("description"),
                        cover_image = volume_info.get("imageLinks", {}).get("thumbnail"),
                    )
                    recommended_books.append(recommended_book)

            recommendation, created = RecommendationByGenre.objects.get_or_create(user=user, genre=genre)

            recommendation.recommended_books.set(recommended_books)
            recommendation.save()

            genre_recommendations[genre] = [
                { 
                    "id": book.google_book_id,
                    "title": book.title,
                    "authors": book.author,
                    "publishedDate": book.published_date,
                    "description": book.description,
                    "thumbnail": book.cover_image
                } for book in recommended_books
            ]
        # Serialize the recommended books and return the response
        return Response({
            "top_genres": top_genres,
            "recommendations_by_genre": genre_recommendations
            })

class RecommendationByAuthorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        read_books = ReadList.objects.filter(user=user)
        want_to_read_books = WantToReadList.objects.filter(user=user)

        # Combine the books from both lists
        all_books = list(read_books) + list(want_to_read_books)
        
        # Extract genres from the books
        authors = []
        for book in all_books:
            if book.author:
                authors.extend(book.author.split(","))
        # Count the occurrences of each genre
        author_counts = Counter(authors)
        
        # Get the top 3 genres
        top_authors = [author for author, _ in author_counts.most_common(3)]
        # Fetch recommendations based on the top genres from google books API
        
        author_recommendations = {}

        for author in top_authors:
            recommended_books = []
            params = {
                "q": f"inauthor:{author}",
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "printType": "books",
                "maxResults": 5
            }
            response = requests.get(GOOGLE_BOOKS_API_URL, params=params)

            if response.status_code == 200:
                books = response.json().get('items', [])
                for book in books:
                    print(f"Found {book}\r    \n")
                    volume_info = book.get('volumeInfo', {})
                    recommended_book, created = Book.objects.get_or_create(
                        google_book_id=book.get("id"),
                        title = volume_info.get("title"),
                        author = ", ".join(volume_info.get("authors", [])),
                        published_date = volume_info.get("publishedDate"),  
                        description = volume_info.get("description"),
                        cover_image = volume_info.get("imageLinks", {}).get("thumbnail"),
                    )
                recommended_books.append(recommended_book)

            recommendation, created = RecommendationByAuthor.objects.get_or_create(user=user, author=author)

            recommendation.recommended_books.set(recommended_books)
            recommendation.save()

            author_recommendations[author] = [
                { 
                    "id": book.google_book_id,
                    "title": book.title,
                    "authors": book.author,
                    "publishedDate": book.published_date,
                    "description": book.description,
                    "thumbnail": book.cover_image
                } for book in recommended_books
            ]
        # Serialize the recommended books and return the response
        return Response({
            "top_authors": top_authors,
            "recommendations_by_author": author_recommendations
        })
    



