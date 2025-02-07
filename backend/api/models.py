from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    google_book_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    author = models.TextField(max_length=255, blank=True, null=True)
    published_date = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    user = models.ManyToManyField(User, through="UserBook", related_name="books")

    def __str__(self):
        return self.title

class UserBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    read_status = models.CharField(max_length=20, choices=[('to-read', 'To Read'), ('read', 'Read')])
    finished_date = models.DateTimeField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    added_at = models.DateField(auto_now_add=True)
    genre = models.JSONField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'book')

class ReadList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="read_books")
    book_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    finished_date = models.DateTimeField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    added_at = models.DateField(auto_now_add=True)
    thumbnail = models.CharField(max_length=255, blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return f"{self.user.username} - {self.title}"

class WantToReadList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="want_to_read_books")
    book_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    added_at = models.DateField(auto_now_add=True)
    thumbnail = models.CharField(max_length=255, blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} wants to read {self.title}"
    
class RecommendationByGenre(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    genre = models.CharField(max_length=255)
    recommended_books = models.ManyToManyField(Book)

    def __str__(self):
        return f"Recommendations for {self.user.username} in {self.genre} genre"

class RecommendationByAuthor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    author = models.CharField(max_length=255)
    recommended_books = models.ManyToManyField(Book)

    def __str__(self):
        return f"Recommendations for {self.user.username} by author {self.author}"

# class Recommendation(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     by_genre = models.OneToManyField(RecommendationByGenre)
#     by_author = models.OneToManyField(RecommendationByAuthor)
    
#     def __str__(self):
#         return f"Recommendations for {self.user.username}"
