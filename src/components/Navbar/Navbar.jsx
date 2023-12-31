import "./Navbar.css";
import PropTypes from "prop-types";

const Navbar = ({user, authModalRef}) => {
    return (
        <div className="navbar">
            <div className="account" onClick={() => !user?.username && authModalRef.current.showModal()}>
                <span>{user?.username || "Register"}</span>
                <img
                    className="user"
                    alt="User Icon"
                    src="/assets/user.png"
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
