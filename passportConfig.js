import bcrypt from "bcrypt";
import { db } from "./server.js";
import { Strategy } from "passport-local";

// TODO: Implement SQL query class
// ? select(selectWhat, fromWhere, byWhat, Value)
// ? insertInto(insertIntoWhat, setWhat)
// ? insertInto(insertIntoWhat, columns, values)
// ? getDocsBy(getDocsByWhat)

export default function (passport) {
    passport.use(
        new Strategy((username, password, done) => {
            let sql = "SELECT * FROM users WHERE username = ?";
            db.query(sql, [username], (error, results) => {
                if (error) throw error;
                if (results.length === 0) return done(null, false);

                bcrypt.compare(password, results[0].password, (error, result) => {
                    if (error) throw error;
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
        db.query(sql, [id], (error, results) => cb(error, results[0]));
    });
}
