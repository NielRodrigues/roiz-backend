/* eslint-disable import/no-extraneous-dependencies */
import path from "path";
import express, { Router } from "express";
import multer from "multer";

import user from "./apps/controllers/UserController";
import mail from "./apps/controllers/SendMailController";
import file from "./apps/controllers/FileController";
import login from "./apps/controllers/LoginController";
import register from "./apps/controllers/RegisterController";
import confirm from "./apps/controllers/ConfirmCodeController";
import forgotPassword from "./apps/controllers/ForgotPassword";
import categories from "./apps/controllers/CategoryController";
import products from "./apps/controllers/ProductController";
import cart from "./apps/controllers/CartController";
import message from "./apps/controllers/MessageController";
import favorite from "./apps/controllers/FavoritesController";
import rates from "./apps/controllers/RateController";
import request from "./apps/controllers/RequestController";
import payment from "./apps/controllers/PaymentController";

import multerConfig from "./config/multer";

const staticPath = path.resolve(__dirname, "../tmp/uploads");

const routes = new Router();
const upload = multer(multerConfig);

routes.use("/tmp/uploads", express.static(staticPath));

// File
routes.post("/files", upload.single("file"), file.create);

// Users
routes.get("/users", user.index);
routes.get("/users/:id", user.show);
routes.post("/users", user.create);
routes.put("/users/:id", user.update);

// Send Mail
routes.post("/send_mail_confirmation", mail.codeConfirmation);
routes.post("/send_code_forgot_password", forgotPassword.sendCode);
routes.put("/update_password", forgotPassword.update);

// Login
routes.post("/login", login.login);

// Register
routes.post("/register", register.create);

// Confirm code
routes.post("/confirm_code", confirm.create);

// Categories
routes.get("/categories", categories.index);
routes.get("/categories/:id", categories.show);
routes.post("/categories", categories.create);
routes.put("/categories/:id", categories.update);
routes.delete("/categories/:id", categories.delete);

// Products
routes.get("/products", products.index);
routes.get("/products/:id", products.show);
routes.post("/products", products.create);
routes.put("/products/:id", products.update);
routes.delete("/products/:id", products.delete);

// Carts
routes.get("/cart/:id", cart.index);
routes.post("/cart", cart.create);
routes.put("/cart", cart.update);
routes.delete("/cart/:id", cart.delete);

// Message
routes.get("/claim", message.index);
routes.post("/claim", message.create);

// Favorites
routes.get("/favorites/:id", favorite.index);
routes.post("/favorites", favorite.create);
routes.post("/favorites_delete", favorite.delete);

// Rates
routes.get("/rates", rates.index);
routes.post("/rates", rates.create);
routes.delete("/rates/:id", rates.delete);

// Request
routes.get("/requests", request.index);
routes.get("/requests/:id", request.show);
routes.post("/requests", request.create);
routes.put("/requests/:id", request.update);
routes.get("/requests_user/:id", request.showUser);

// Payment
routes.post("/payment", payment.create);



export default routes;
