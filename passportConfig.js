import bcrypt from "bcrypt";
import { db } from "./server.js";
import { Strategy } from "passport-local";

export default function (passport) {
    passport.use(
        new Strategy((username, password, done) => {
            let sql = "SELECT * FROM users WHERE username = ?";
            db.query(sql, [username], (err, results) => {
                if (err) throw err;
                if (results.length === 0) return done(null, false);

                bcrypt.compare(password, results[0].password, (err, result) => {
                    if (err) throw err;
                    if (result === true) {
                        return done(null, results[0]);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.user_id);
    });

    passport.deserializeUser((id, cb) => {
        let sql = "SELECT * FROM users WHERE user_id = ?";
        db.query(sql, [id], (err, results) => {
            cb(err, results[0]);
        });
    });
}