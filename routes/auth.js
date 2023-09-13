import express from "express";
import { UserService } from "../services/UserService.js";

var router = express.Router();

router.get("/user", (req, res) => res.send(req.user));
router.post("/login", (req, res, next) => UserService.logIn(req, res, next));
router.post("/register", async (req, res) => await UserService.register(req, res));

export default router;
