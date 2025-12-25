# ShopEase (Ecommerce Project)

A simple e-commerce web application built with Node.js, Express, MongoDB (Mongoose), EJS templates and Passport.js for authentication.

---

## ✅ Features

- Product listing, create, edit, delete (seller-only where applicable)
- User authentication (register, login, logout)
- Add to cart and checkout (Stripe integration in code)
- Reviews on products (users can add and delete their own reviews)
- Simple profile page

---

## 🔧 Prerequisites

- Node.js (see `package.json` engines or use a recent LTS, e.g. 18+)
- npm (comes with Node)
- MongoDB database (MongoDB Atlas or local instance)

---

## ⚙️ Setup & Run (Development)

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd Lecture_10_Project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables (example):

   ```dotenv
   # MongoDB connection URL (replace values)
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ecommerce?retryWrites=true&w=majority

   # (Optional) Any other secrets you need
   # STRIPE_SECRET_KEY=sk_test_...
   ```

   • Do NOT commit `.env` to version control. Add `.env` to `.gitignore`.

4. Seed the database (optional):

   If there is a `seed.js` script, run it to populate sample products/users:

   ```bash
   node seed.js
   ```

5. Start the app (development):

   ```bash
   npm start
   ```

   The server listens on port `8080` by default. Open `http://localhost:8080/`.

---

## Environment (.env) details & security

- The application reads the MongoDB connection from `process.env.MONGODB_URL`.
- Keep the connection string secret (it includes database credentials). Use environment variables in production.
- Example values:
  - `MONGODB_URL` — MongoDB Atlas connection string or `mongodb://127.0.0.1:27017/shop` for local MongoDB.
  - `STRIPE_SECRET_KEY` — if you integrate Stripe payments.
- Never push real credentials into git. Use `.env`, secrets manager, or environment variables in your hosting provider.

---

## Routes (important)

- `/` — Home
- `/products` — Product list (login-required in this app configuration)
- `/products/:id` — Product detail and reviews
- `/products/:id/review` — POST to add review (user must be logged in)
- `/products/:id/review/:reviewId` — DELETE review (only review author)
- `/register`, `/login`, `/logout` — Authentication
- `/profile` — User profile (requires login)
- `/user/cart`, `/user/cart/...` — Cart routes

---

## How Reviews & Profile work (notes)

- Reviews are stored in `Review` model and include an `author` reference to the `User` model.
- Only the review's author can see the **Delete** button for their review and call the DELETE route.
- The Profile page is available at `/profile` for logged-in users and shows basic information.

---

## Troubleshooting

- If you get a MongoDB connection error, verify `MONGODB_URL` and that your IP is whitelisted (Atlas).
- If you can't add reviews or access protected pages, ensure you are logged in.
- If the app fails to start, run `node app.js` directly to view stack traces.

---

## Development tips

- Add `.env` to `.gitignore`:

  ```text
  .env
  ```

- Use `nodemon` in development (already included in `package.json` script `start`).

---

## Contributing

1. Fork the project
2. Create a feature branch
3. Submit a Pull Request

---

## License

MIT


created by Uday Kushwah❤️🎉