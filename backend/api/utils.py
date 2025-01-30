import requests
from django.conf import settings

def get_google_books(query, max_results=10):
    google_books_api_url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": query,
        "key": settings.GOOGLE_BOOKS_API_KEY,
        "maxResults": max_results,
    }

    response = requests.get(google_books_api_url, params=params)
    if response.status_code == 200:
        books = response.json().get("items", [])
        results = []
        for book in books:
            volume_info = book.get("volumeInfo", {})
            results.append({
                "google_book_id": book.get("id"),
                "title": volume_info.get("title"),
                "author": ", ".join(volume_info.get("authors", [])),
                "published_date": volume_info.get("publishedDate"),
                "description": volume_info.get("description"),
                "cover_image": volume_info.get("imageLinks", {}).get("thumbnail"),
                "genre": ", ".join(volume_info.get("categories", [])) if volume_info
                .get("categories") else None,
            })
        return results
    return []