# BookBuddy

BookBuddy is a book recommendation and review platform that helps users discover their next favorite book based on their reading preferences.

## 🚀 Features

- 📚 **Search for Books** using the Google Books API.
- ✍️ **Write and Read Reviews** for books you have read.
- ⭐ **Rate Books** to get personalized recommendations.
- 📖 **Manage Your Reading List** (Read & To-Read books).
- 🤝 **Social Features** to connect with friends and see their recommendations. (Outreach goals for future implementation)

---

## 🛠 Tech Stack

### Frontend:

- React.js
- React Router
- Axios (for API calls)
- CSS (for styling)

### Backend:

- Django Rest Framework (DRF)
- PostgreSQL (Database)
- Google Books API (for book search)
- JWT Authentication

---

## 🔧 Installation & Setup

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone https://github.com/tramhn001/Capstone_book_recommendation.git
cd bookbuddy/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the server
python manage.py runserver
```

### 2️⃣ Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the React app
npm run dev
```

---

## 🔐 Environment Variables

Create a **.env** file in both frontend and backend folders:

### Backend `.env`:

```env
GOOGLE_BOOKS_API_KEY = your_api_key
SECRET_KEY=your_secret_key
DB_NAME=your_db_name
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST="localhost"
DB_PORT="5432"
```

### Frontend `.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
GOOGLE_BOOKS_API_KEY=your_api_key
```

---

## 🌍 Deployment

### 1️⃣ **Deploy Backend (Django) to Render**

1. Push your code to GitHub.
2. Create a new **Render Web Service**.
3. Connect your repository.
4. Set environment variables.
5. Deploy and get the backend URL.

### 2️⃣ **Deploy Frontend (React) to Netlify**

```bash
npm run build
netlify deploy --prod
```

---

## 📜 API Endpoints

### User Authentication

- `POST /api/user/register/` - Register a new user
- `POST /api/user/login/` - Login and get a token

### Books

- `GET /api/books/search/?q=title` - Search books
- `POST /api/user/lists/read/add/` - Add a book to the Read list
- `POST /api/user/lists/want-to-read/add/` - Add a book to the Want to Read list

### Recommendations

- `GET /api/user/lists/recommendations/genre/` - Get book recommendations by genre
- `GET /api/user/lists/recommendations/author/` - Get book recommendations by author

---

## 📢 Contributing

Want to contribute? Feel free to submit a pull request!

---

## 📄 License

This project is licensed under the MIT License.

