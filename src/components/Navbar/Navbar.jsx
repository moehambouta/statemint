import "./Navbar.css";
import PropTypes from "prop-types";

const Navbar = ({user, authModalRef}) => {
    return (
        <div className="nav">
            <a href="/" className="homeLink">
                <img src="assets/logoIcon.png" alt="Logo" />
            </a>
            <div className="account">
                <span>{user?.username}</span>
                <img
                    className="user"
                    alt="User Icon"
                    src="assets/user.png"
                    onClick={() => !user?.username && authModalRef.current.showModal()}
                />
            </div>
        </div>
    )
};

Navbar.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired
};

export default Navbar;
