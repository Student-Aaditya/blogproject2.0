# blogproject2.0

# 📝 BlogProject 2.0

A dynamic full-stack blog website built using **Node.js**, **Express**, **EJS**, and **MongoDB**. This platform allows users to register, log in, and create, edit, or delete blog posts. It also integrates image uploads and SMS notifications via Twilio.

---

## 🚀 Features

- 🔐 **User Authentication** (Login & Signup)
- ✍️ **Create, Read, Update, Delete (CRUD)** blog posts
- 📤 **Image Upload** support
- 📱 **SMS Notifications** via Twilio
- ☁️ **Cloudinary** image hosting
- 📦 Session-based authentication using `express-session`
- 📁 File upload support using `multer`

---

## 🛠️ Tech Stack

| Category      | Tech         |
|---------------|--------------|
| Backend       | Node.js, Express.js |
| Frontend      | EJS Templates, HTML, CSS |
| Database      | MongoDB (Mongoose) |
| File Uploads  | Multer, Cloudinary |
| SMS API       | Twilio |
| Authentication| Sessions |



## 📂 Folder Structure

├── Model/
├── PUBLIC/
├── uploads/
├── VIEW/
│ ├── editmotive.ejs
│ ├── login.ejs
│ ├── signup.ejs
│ └── ...
├── app.js
├── sms.js
├── middleware.js
├── cloudConfig.js
├── package.json
└── .env 
