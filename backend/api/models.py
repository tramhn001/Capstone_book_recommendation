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

    class Meta:
        unique_together = ('user', 'book')
