import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import bodyParser from "body-parser";
import mysql from "mysql";
import passportConfig from "./passportConfig.js";

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'statemint'
});

db.connect((err) => {
    if (err) throw err;
});

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("secret"));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) throw err;
        if (!user) res.send({"success": false})
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.send({"success": true});
            });
        }
    })(req, res, next);
});

app.post("/register", async (req, res) => {
    const sql = "INSERT INTO users SET ?";
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.query(sql, {...req.body, password: hashedPassword}, (err) => {
        if (err) {
            res.send({"success": false, "message": err.message})
        } else {
            res.send({"success": true})
        }
    });
});

app.get("/user", (req, res) => {
    res.send(req.user);
});

app.post('/upload', upload.any(), (req, res) => {
    console.log(req.body);
    console.log(req.files);
    res.send({"success": true});
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
