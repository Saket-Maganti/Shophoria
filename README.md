# 🛍️ Shophoria

**Shophoria** is a modern, responsive, and fully functional e-commerce web application built using **React**, **Tailwind CSS**, and additional powerful tools like **Stripe**, **Firebase**, and **Vercel**. It provides a seamless shopping experience with admin capabilities, customer-friendly interfaces, and secure payment integrations.

---

## 🌐 Live Demo

Coming soon...

---

## 📌 Key Features

### 👤 User Features
- 🔐 Firebase Authentication (Register/Login)
- 🛍️ Browse Products by Categories
- 🔎 Search, Filter by Price, and View Product Details
- 🧺 Add to Cart and Wishlist (with `localStorage`)
- 🧾 Place Orders with Address Entry
- 📜 Order History and Downloadable Invoices (via `html2pdf.js`)
- 📝 Submit and Manage Product Reviews
- 🎁 Rewards System with Coupons and Signup Bonuses

### 🛠️ Admin Features
- 📊 Dashboard with Stats and Charts
- 📦 Add/Edit/Delete Products with Quantity and Image Uploads
- 👥 View and Manage Users (promote/demote roles)
- 📝 Review Moderation (delete offensive or fake reviews)
- 🎟️ Create, Edit, and Delete Coupon Codes
- 📉 Track Low Stock Inventory

### 💳 Checkout & Payments
- Integrated with **Stripe** for secure payments
- Serverless backend using **Vercel** functions
- Stripe Webhooks to track order status and payments

---

## 🧱 Tech Stack

| Layer      | Technologies |
|------------|--------------|
| Frontend   | React, Tailwind CSS, Framer Motion |
| Backend    | Node.js (Vercel Serverless Functions) |
| Database   | Firebase Firestore |
| Auth       | Firebase Authentication |
| Storage    | Firebase Storage |
| Payments   | Stripe |
| Deployment | Firebase Hosting (Frontend), Vercel (Backend Functions) |

---

## 📁 Project Structure

```
Shophoria/
│
├── api/                        # Vercel Serverless Functions (Stripe)
│   ├── create-checkout-session.js
│   ├── stripe-webhook.js
│
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── context/                # Auth, Cart, Wishlist Context
│   ├── pages/                  # Page Components (Home, ProductDetails, Cart, Admin, etc.)
│   ├── routes/                 # Private & Public Routes
│   ├── utils/                  # Utility functions (cart, wishlist, formatters)
│   ├── firebase.js             # Firebase configuration
│
├── firebase.json               # Firebase project setup
├── vercel.json                 # API function deployment setup
├── tailwind.config.js          # Tailwind configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- Firebase CLI (`npm install -g firebase-tools`)
- Stripe Account
- Vercel Account (for backend)

### Install All Dependencies (Except Firebase, Stripe, Vercel)

```bash
npm install `
"@craco/craco" `
"@stripe/stripe-js" `
"@testing-library/dom" `
"@testing-library/jest-dom" `
"@testing-library/react" `
"@testing-library/user-event" `
"axios" `
"file-saver" `
"framer-motion" `
"html2pdf.js" `
"lucide-react" `
"react" `
"react-dom" `
"react-hot-toast" `
"react-router-dom" `
"react-scripts" `
"react-to-print" `
"recharts" `
"web-vitals" `
"autoprefixer" `
"patch-package" `
"postcss" `
"tailwindcss" `
"tailwindcss-cli"
```

---

## 🔧 Firebase Setup

```bash
npm install firebase
npm install -g firebase-tools

firebase login
firebase init
firebase deploy
```

---

## 💳 Stripe Setup

```bash
npm install stripe @stripe/stripe-js
```

- Configure Stripe API keys in `.env.local`
- Use `api/create-checkout-session.js` and `api/stripe-webhook.js` for integration
- Set up webhook in Stripe dashboard for `/api/stripe-webhook`

---

## ▲ Vercel Setup

```bash
npm install -g vercel

vercel login
vercel
```

- Ensure your `api/` folder is linked to a Vercel project
- Deploy backend functions easily via `vercel` CLI

---

## 🚀 Run the Project

```bash
npm start
```

---

## 💡 Developer Notes

- State management is done using React's Context API
- Cart and Wishlist data are stored in browser `localStorage` for persistence
- Product images are uploaded to Firebase Storage
- Coupons are managed in Firestore and applied at checkout
- Stripe payment is handled via serverless APIs and confirmed using webhooks
- All orders and user data are stored and queried in Firestore

---

## 📈 Future Enhancements

- Email notifications on order confirmation
- Product recommendations engine
- Real-time chat support
- Progressive Web App (PWA) features
- Advanced analytics dashboard for admins

---

## 👩‍💻 Author

**Saket Maganti**  
Full Stack Developer – Java | React | Firebase | Stripe | Spring Boot  

---

## 📜 License

This project is licensed under the MIT License. Feel free to use and modify with attribution.
