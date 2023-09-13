import bcrypt from "bcrypt";
import passport from "passport";
import { db } from "../server.js";

export class UserService {
    static logIn(req, res, next) {
        let authenticateLocal = passport.authenticate("local", (error, user) => {
            if (error) return res.status(500).send({success: false, error});
            if (!user) return res.send({success: false, error: "user not found!"});

            req.logIn(user, error => {
                if (error) return res.status(500).send({success: false, error});
                res.send({success: true});
            });
        });

        authenticateLocal(req, res, next);
    }

    static async register(req, res) {
        const insertUserSql = "INSERT INTO users SET ?";
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {...req.body, password: hashedPassword};

        db.query(insertUserSql, user, (error, results) => {
            if (error) return res.status(500).send({success: false, error});
            const getUserSql = "SELECT * FROM users WHERE user_id = ?";
    
            db.query(getUserSql, results.insertId, (error, rows) => {
                if (error) return res.status(500).send({success: false, error});
    
                req.logIn(rows[0], error => {
                    if (error) return res.status(500).send({success: false, error});
                    res.send({success: true});
                });
            });
        });
    }
}
