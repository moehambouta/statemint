import "./AuthModal.css";
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";

const AuthModal = ({authModalRef}) => {
    const [isEmail, setIsEmail] = useState(true);
    const [modalType, setModalType] = useState("Register");
    const [message, setMessage] = useState("Already have an account?");
    const [otherModalType, setOtherModalType] = useState("Log In");

    const closeDialog = () => {
        authModalRef.current.close();
    };

    const changeModalType = () => {
        if (isEmail) {
            setIsEmail(false);
            setModalType("Log In");
            setMessage("Don't have an account?");
            setOtherModalType("Register");
        } else {
            setIsEmail(true);
            setModalType("Register");
            setMessage("Already have an account?");
            setOtherModalType("Log In");
        }
    };

    const handleFormSubmit = (e) => {
        const formData = new FormData(e.target);

        let data = {
            username: formData.get("username"),
            password: formData.get("password")
        };

        if (modalType === "Register") {
            data["email"] = formData.get("email");
        }

        axios({
            method: "POST",
            data: data,
            withCredentials: true,
            url: `/${modalType.replace(/\s+/g, '').toLowerCase()}`
        })
    };

    return (
        <dialog id="authModal" className="authModal" ref={authModalRef}>
            <div className="authModalHeading">
                <h1>{modalType}</h1>
                <span onClick={closeDialog}>✖</span>
            </div>

            <form className="registerForm" onSubmit={handleFormSubmit}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required/>

                {
                    isEmail && 
                        <>
                            <label htmlFor="email">Email: </label>
                            <input type="text" id="email" name="email" required/>
                        </>
                }

                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" required/>

                <button className="btnPrimary" type="submit" id="authModalSubmit">{modalType}</button>

                <p className="message">
                    <span>{message}</span>
                    <button type="button" className="btnSecondary" onClick={changeModalType}>{otherModalType}</button>
                </p>
            </form>
        </dialog>
    )
};

AuthModal.propTypes = {
    authModalRef: PropTypes.object.isRequired
};

export default AuthModal;
