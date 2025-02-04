from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Book, UserBook, ReadList, WantToReadList
# from django.contrib.auth.hashers import make_password


# Serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
    
    # def create(self, validated_data):
    #     validated_data['password'] = make_password(validated_data['password'])
    #     return super().create(validated_data)
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")

        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            return user
        raise serializers.ValidationError("Incorrect email or password")

# Serializer for Book model
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'google_book_id', 'title', 'author', 'published_date', 'description', 'cover_image', 'genre']

# Serializer for UserBook model
class UserBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBook
        fields = ['id', 'user', 'book', 'read_status', 'finished_date', 'rating', 'review', 'added_at']
        read_only_fields = ['user', 'added_at']

        def validate_rating(self, value):
            if value < 1 or value > 5:
                raise serializers.ValidationError("Rating must be between 1 and 5")
            return value
        
class ReadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadList
        fields = ["book_id", "user", "finished_date", "rating", "review"]

class WantToReadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WantToReadList
        fields = ["book_id", 
                  "title",
                  "author",
                  "user",
                  "thumbnail"]
