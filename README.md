# 📖 Personal Journaling App - README

Welcome to the **CK's Personal Journaling App**! 🚀 This app is designed to help users jot down their thoughts, categorize entries, and gain insights into their journaling habits. Built with **Next.js** and **TypeScript**, it offers a secure and user-friendly experience. Let's dive in! 🎯

---

## 🛠 Application Platform & Setup

### 🚀 Framework & Language
- **Framework:** [Next.js](https://nextjs.org/) - Chosen for its **server-side rendering (SSR)**, API routes, and full-stack capabilities.
- **Language:** TypeScript - Ensures **type safety**, better **developer experience**, and **fewer runtime errors**.

### 📂 Project Structure
The project follows a modular structure for better maintainability:
```
📦 my-personal-journaling-web-app
 ┣ 📂 components     # Reusable UI components (JournalForm, JournalList, Sidebar)
 ┣ 📂 contexts       # Manages global state (e.g., AuthContext)
 ┣ 📂 lib            # Utility files (prisma.ts, auth.ts)
 ┣ 📂 pages          # Next.js pages & API routes
 ┣ 📂 prisma         # Prisma schema & migrations
 ┣ 📂 app            # Global styles & layout files
```

### 🔑 Environment Variables
Sensitive data is stored securely using `.env` files:
```
DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=your_secret_key
```

---

## 📦 Third-Party Libraries
- **🔐 Authentication:** `next-auth`, `jsonwebtoken`, `bcryptjs`
- **🗄 Database:** `@prisma/client`, `pg` (PostgreSQL)
- **💅 UI & Styling:** `tailwindcss`, `react-icons`, `sweetalert2`, `chart.js`
- **🧪 Testing:** `jest`, `@testing-library/react`
- **🌍 Deployment:** Optimized for **Vercel** 🚀

---

## 🔐 User Authentication
### 🔑 Strategy
- Uses **JWT-based authentication** with `next-auth` for session management.
- Passwords are **hashed** using `bcryptjs` before storing in the database.

### 🔒 Security Measures
✅ **Protected Routes:** Middleware in `middleware.ts` restricts access to `/journal`, `/settings` and other routes for authenticated users.
✅ **Session Expiration:** Tokens expire in **1 hour** ⏳.
✅ **Secure Cookies:** `httpOnly` and `secure` flags prevent security vulnerabilities.
✅ **User Roles:** `role` field exists but **RBAC** is not yet implemented.

---

## 📝 Journal Entry Management
### 📌 CRUD Operations (via `/api/journal`)
- **GET** → Fetch all journal entries
- **POST** → Create a new entry
- **PUT** → Update an existing entry
- **DELETE** → Remove an entry

### 🔗 Frontend Communication
- The frontend interacts with the backend via **fetch API calls**.
- Validation occurs on both frontend (required fields) & backend (missing field checks).

---

## 🎨 Journal UI & Features
### 🖥 User-Friendly Design
- Clean, **responsive** UI ✨
- Entries displayed in a **scrollable list** with **filtering options**.

### 📂 Categorization System
- Categories: **Personal, Work, Ideas, Goals** assigned your journal entry category when filling the `JournalForm`.
- **Filtering** implemented on the frontend using JavaScript.

---

## ⚙️ Settings & User Preferences
- **👤 Profile Management:** Users can update their name via the `SettingsPage`.
- **🎛 Preferences:** Currently limited to name updates.

---

## 🏗 Backend & API Development
### 🌐 Framework & APIs
- Uses **Next.js API routes** for backend functionality.
- Follows a **RESTful API** design.

### 🛡 Security Measures
✅ **Middleware for route protection**
✅ **Secure cookies** (`httpOnly`, `secure` flags)
✅ **Input validation** (frontend & backend)

🔒 **Attack Prevention:**
- **SQL Injection** → Prevented by using **Prisma ORM** 🛑
- **XSS** → Input sanitization & escaping 🔏
- **CSRF** → Secure cookies & token-based authentication ✅

---

## 🗄 Database Design
### 📊 Schema Overview
- **PostgreSQL** as the database
- **Prisma ORM** for database interactions

🛠 **Tables:**
- `users` → Stores user data (name, email, password, role)
- `journal` → Stores journal entries, linked to users

### 🔄 Migrations
- Managed using **Prisma's migration system**.

---

## 📏 System Design & Scalability
### 🏛 Architecture
- **Monolithic** application using **Next.js**.
- Can **scale horizontally** when deployed on **Vercel**.

### 📌 Key Technical Decisions
✅ **Framework:** Next.js for **SSR & API routes**.
✅ **Authentication:** `next-auth` for **seamless integration**.
✅ **Database:** Prisma ORM for **type-safe database interactions**.

---

## 🧪 Code Quality & Testing
### 🔍 Testing
✅ **Unit & Integration Testing:** Uses **Jest** and **React Testing Library** 🧪.
✅ **Error Handling:** Proper error messages & logging for debugging 🛠.

---

## 🚀 Deployment & Setup Instructions
### 🏗 Local Development Setup
1️⃣ **Clone the repository:**
```sh
git clone https://github.com/nyathirak/Journaling-App.git
```
2️⃣ **Install dependencies:**
```sh
npm install
```
3️⃣ **Set up environment variables:**
- Create a `.env` file with the required keys.

4️⃣ **Run the development server:**
```sh
npm run dev
```

### 🔌 API Endpoints
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/api/auth/signup`    | User registration      |
| POST   | `/api/auth/login`     | User login            |
| GET    | `/api/journal`        | Fetch all entries     |
| POST   | `/api/journal`        | Create a new entry    |
| PUT    | `/api/journal/:id`    | Update an entry       |
| DELETE | `/api/journal/:id`    | Remove an entry       |

### 🌍 Deployment
- **Hosted on Vercel** for automatic deployments.
- Supports **CI/CD pipelines** (not explicitly configured but can be added).

---

## 🎉 Conclusion
This **Personal Journaling App** is a secure, modern, and feature-rich solution for journaling 💻✨

🚀 **Contributions & Feedback Welcome!** 📝

