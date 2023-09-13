/* eslint-disable import/no-extraneous-dependencies */
import path from "path";
import express, { Router } from "express";
import multer from "multer";

import user from "./apps/controllers/UserController";
import mail from "./apps/controllers/SendMailController";
import file from "./apps/controllers/FileController";
import login from "./apps/controllers/LoginController";

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

// Login
routes.post("/login", login.login);

export default routes;
