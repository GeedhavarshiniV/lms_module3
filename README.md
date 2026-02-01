# Module 3: Course Management System

A complete course management module for creating, organizing, and publishing educational content.


## 🎯 What It Does

- Create and manage courses with modules and lessons
- Support multiple content types (Video, PDF, Link, Text, Quiz)
- Draft/Publish workflow
- Role-based access control


## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB, JWT  
**Frontend:** React, React Router, Axios


## 📦 Installation

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=your_secret_key
PORT=5000
```

Run:
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```


## 📡 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/courses` | Create course | Trainer/Admin |
| GET | `/api/courses` | Get all courses | All |
| GET | `/api/courses/:id` | Get course details | All |
| PUT | `/api/courses/:id` | Update course | Trainer/Admin |
| DELETE | `/api/courses/:id` | Delete course | Admin |
| POST | `/api/courses/:courseId/modules` | Create module | Trainer/Admin |
| POST | `/api/courses/modules/:moduleId/lessons` | Create lesson | Trainer/Admin |


## 🗄️ Database Models

**Course:** title, description, category, difficulty, status, tags  
**Module:** title, order, duration  
**Lesson:** title, contentType, contentUrl, order, isPreview


## 🔐 User Roles

| Role | Create Course | Edit Course | Delete Course | View Course |
|------|--------------|-------------|---------------|-------------|
| **TRAINER** | ✅ | ✅ (own) | ❌ | ✅ |
| **ADMIN** | ✅ | ✅ (all) | ✅ | ✅ |
| **LEARNER** | ❌ | ❌ | ❌ | ✅ (published) |


## 🧪 Quick Test (Postman)

1. **Login**
```http
POST /api/auth/login
{"email": "trainer@example.com", "password": "password123"}
```

2. **Create Course**
```http
POST /api/courses
Authorization: Bearer {token}
{"title": "React Course", "description": "Learn React", "category": "TECHNICAL"}
```

3. **Add Module**
```http
POST /api/courses/{courseId}/modules
{"title": "Module 1", "order": 1}
```

4. **Add Lesson**
```http
POST /api/courses/modules/{moduleId}/lessons
{"title": "Intro", "contentType": "VIDEO", "contentUrl": "https://...", "order": 1}
```


## 📁 File Structure

```
backend/src/
├── models/         # Course, Module, Lesson
├── controllers/    # courseController.js
├── routes/         # courseRoutes.js
└── middlewares/    # authMiddleware, roleMiddleware

frontend/src/
├── pages/          # CoursesPage, CourseBuilder, etc.
├── services/       # api.js
└── context/        # AuthContext.js
```


## ✨ Key Features

- ✅ Create courses with rich metadata
- ✅ Organize content into modules and lessons
- ✅ Multiple content types (Video, PDF, Link, Text)
- ✅ Draft/Publish workflow
- ✅ Search and filter courses
- ✅ Role-based permissions
- ✅ Modern, responsive UI


## 👤 Author

Geedhavarshini V, Kalyani G - Learning Management System(Internship Project) 
