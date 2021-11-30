import express from "express"
import User from "./../models/user.js"
import flash from "connect-flash"
import passport from "passport"
import catchAsync from "../utilities/catchAsync.js";
import { renderRegister, register, renderLogin, login, logout } from "../controllers/users.js"
import { isLoggedIn } from "../middlewares.js";

const router = express.Router();

router.route("/register")
  .get(renderRegister)
  .post(catchAsync(register))

router.route("/login")
  .get(renderLogin)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), login)

router.get("/logout", logout)

export default router;