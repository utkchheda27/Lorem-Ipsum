import express from "express"
import passport from "passport"
import catchAsync from "../utilities/catchAsync.js";
import { renderRegister, register, renderLogin, login, logout } from "../controllers/users.js"
import { storage } from "../cloudinary/profilePictures.js";
import multer from "multer";
const upload = multer({ storage });



const router = express.Router();

router.route("/register")
  .get(renderRegister)
  .post(upload.single('profilePicture'), catchAsync(register))

router.route("/login")
  .get(renderLogin)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), login)

router.get("/logout", logout)

export default router;