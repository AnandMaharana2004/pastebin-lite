# Pastebin-Lite

A small Pastebin-like service where users can create text pastes and share a link to view them.
Supports optional expiration by time (TTL) and by maximum number of views.

This project was built as part of a take-home assignment.

---

## 🚀 Live Demo

Deployed URL:
[https://pastebin-lite-b89c.onrender.com](https://pastebin-lite-b89c.onrender.com)

Health check:
[https://pastebin-lite-b89c.onrender.com/api/healthz](https://pastebin-lite-b89c.onrender.com/api/healthz)

---

## ✨ Features

* Create a paste with arbitrary text
* Receive a shareable URL
* View the paste via API or HTML page
* Optional constraints:

  * Time-based expiry (TTL)
  * View-count limit
* Paste becomes unavailable when any constraint is triggered
* Deterministic time handling for automated tests (`TEST_MODE`)

---

## 🛠 Tech Stack

* Node.js
* Express
* MongoDB (Atlas)
* Mongoose
* Zod (validation)

---

## 📦 Running Locally

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/pastebin-lite.git
cd pastebin-lite
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_ORIGIN=http://localhost:3000
TEST_MODE=0
```

4. Start the server:

```bash
npm run dev
```

The app will run at:
`http://localhost:3000`

---

## 🗄 Persistence Layer

This project uses **MongoDB Atlas** with **Mongoose** as the persistence layer.
It ensures data survives across requests and deployments, making it suitable for serverless platforms like Render.

---

## 🧪 Deterministic Time for Testing

When the environment variable `TEST_MODE=1` is set, the application uses the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

as the current time for expiry logic.
If the header is absent, real system time is used.

This allows automated tests to reliably verify TTL behavior.

---

## 📌 Notes

* All API error responses return JSON with proper status codes.
* Unavailable pastes consistently return HTTP 404.
* Paste content is rendered safely in HTML (no script execution).
* No in-memory global state is used for persistence.
