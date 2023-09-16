import express from "express";
import { UserService } from "../services/UserService.js";

var router = express.Router();

// Authorization middleware functions
const user = (req, res) => res.send(req.user);
const login = (req, res, next) => UserService.logIn(req, res, next);
const register = async (req, res, next) => await UserService.register(req, res, next);

// Authorization middlewares
router.get("/user", user);
router.post("/login", login);
router.post("/register", register, login);

export default router;
