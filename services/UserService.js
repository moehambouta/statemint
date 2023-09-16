import bcrypt from "bcrypt";
import passport from "passport";
import { db } from "../server.js";

export class UserService {
    /**
    * Register a new user
    * Hashes password using bcrypt
    * Inserts new user into database
    * Calls logIn method on success
    * TODO: Implement SQL query class
    * @param {*} req body in the form of {username, email, password}
    **/
    static async register(req, res, next) {
        const insertUserSql = "INSERT INTO users SET ?";
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { ...req.body, password: hashedPassword };

        db.query(insertUserSql, user, (error, results) => {
            if (error) return res.status(500).send({success: false, error});
            req.user = { user_id: results.insertId, ...user };
            next();
        });
    }

    /**
    * Logs in using passport local strategy
    * TODO: Implement SQL query class
    * @param {*} req user in the form {user_id, username, password}
    * @returns {Object} {success: boolean, error: ?} on success
    **/
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
}
