import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Navbar/Navbar";
import Dashboard from "../../components/Dashboard/Dashboard";
import AuthModal from "../../components/AuthModal/AuthModal";

const Home = ({user, authModalRef}) => {
    return (
        <React.Fragment>
            <Navbar user={user} authModalRef={authModalRef} />
            <Dashboard user={user} authModalRef={authModalRef} />
            <AuthModal authModalRef={authModalRef} />
        </React.Fragment>
    )
}

Home.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired
}

export default Home;