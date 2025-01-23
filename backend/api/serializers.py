from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Book, UserBook

# Serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Serializer for Book model
class BookSerializer(serializers.ModelSerializer):
    user_books = serializers.PrimaryKeyRelatedField(queryset=UserBook.objects.all(), source='userbook_set', many=True)

    class Meta:
        model = Book
        fields = ['id', 'google_book_id', 'title', 'author', 'published_date', 'description', 'cover_image', 'user_books']

# Serializer for UserBook model
class UserBookSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = UserBook
        fields = ['user', 'book', 'read_status', 'finished_date', 'rating', 'review', 'added_at']