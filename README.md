# 🌐 Social Net

**Social Net** is a modern, full-stack social media web application that enables users to connect, share, and interact in real time. Users can sign up, create posts, follow others, like, and comment—all within a responsive and intuitive interface. Built using the powerful MERN (MongoDB, Express, React, Node.js) stack, Social Net delivers both performance and scalability.

---

## ✨ Features

- 🔐 User Authentication using JWT
- 📝 Create, Edit, and Delete Posts
- ❤️ Like and Comment on Posts
- 👥 Follow/Unfollow Users
- 🧑‍💼 User Profiles with Bio and Activity
- 🔔 Real-time Notifications (Planned)
- 📱 Responsive Design (Mobile Friendly)

---

## 🛠️ Tech Stack

### 🚀 Frontend
- React.js
- React Router
- Axios
- Context API
- CSS/Flexbox

### 🔧 Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt.js
- JSON Web Tokens (JWT)

---

## 📁 Project Structure

 ```
SocialNet/
├── frontEnd/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
├── backEnd/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md
```



---

## ⚙️ Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (>=14.x)
- MongoDB (local or cloud-based like Atlas)
- npm or yarn

---

## ⚙️ Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (>=14.x)
- MongoDB (local or cloud-based like Atlas)
- npm or yarn

```
backEnd/ 
├── controllers/
│ ├── authController.js
│ ├── postController.js
│ └── userController.js
├── models/
│ ├── Post.js
│ └── User.js
├── routes/
│ ├── auth.js
│ ├── posts.js
│ └── users.js
├── middleware/
│ └── verifyToken.js 
├── .env # Environment variables
├── server.js # Entry point of backend
└── package.json
``` 
---

## 🔐 Authentication

Authentication is handled using **JWT (JSON Web Tokens)** and **bcrypt.js** for password hashing.

## 🧑 User Routes

Base path: `/api/users`

| Route                         | Method | Description               |
|------------------------------|--------|---------------------------|
| `/api/users/:id`             | GET    | Get user profile          |
| `/api/users/:id`             | PUT    | Update user details       |
| `/api/users/:id`             | DELETE | Delete user               |
| `/api/users/:id/follow`      | PUT    | Follow another user       |
| `/api/users/:id/unfollow`    | PUT    | Unfollow another user     |

---

## 📝 Post Routes

Base path: `/api/posts`

| Route                          | Method | Description                    |
|-------------------------------|--------|--------------------------------|
| `/api/posts`                  | POST   | Create a new post              |
| `/api/posts/:id`              | PUT    | Update a post                  |
| `/api/posts/:id`              | DELETE | Delete a post                  |
| `/api/posts/:id/like`         | PUT    | Like/unlike a post             |
| `/api/posts/:id`              | GET    | Get single post by ID          |
| `/api/posts/profile/:username`| GET    | Get all posts from a user      |
| `/api/posts/timeline/:userId`| GET    | Get timeline posts             |

---

## 🧠 Controllers

- **authController.js** – Handles login & register logic
- **userController.js** – Deals with user CRUD & follow/unfollow
- **postController.js** – Manages post creation, likes, deletions

---

## 🔧 Setup & Run

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Local or Atlas)

### Install Dependencies

## 🚀 Usage

1. Open your browser and go to: [http://localhost:8084](http://localhost:8084)
2. Register a new user or log in with existing credentials.
3. Create, like, comment, and explore posts from other users.
4. Visit user profiles and follow/unfollow them.

---

## 📬 Contact

For any inquiries or feedback, feel free to reach out:

- **Email:** [sankalpagarwal8057@example.com](mailto:sankalpagarwal8057@example.com)  
- **LinkedIn:** [https://www.linkedin.com/in/sankalp-agarwal-2b61ab253/]((https://www.linkedin.com/in/sankalp-agarwal-2b61ab253/))

---

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
