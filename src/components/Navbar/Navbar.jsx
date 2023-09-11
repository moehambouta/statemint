import "./Navbar.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Navbar = ({authModalRef}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/user",
            withCredentials: true
        }).then((res) => {
            setUser(res.data.username)
        });
    }, []);

    return (
        <div className="nav">
            <a href="/" className="homeLink">
                <img src="assets/logoIcon.png" alt="Logo" />
            </a>
            <div className="account">
                <span>{user}</span>
                <img
                    className="user"
                    alt="User Icon"
                    src="assets/user.png"
                    onClick={() => !user && authModalRef.current.showModal()}
                />
            </div>
        </div>
    )
};

Navbar.propTypes = {
    authModalRef: PropTypes.object.isRequired
};

export default Navbar;
