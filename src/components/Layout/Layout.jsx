import React from 'react'
import PropTypes from "prop-types";
import Navbar from '../Navbar/Navbar';
import AuthModal from '../AuthModal/AuthModal';

const Layout = ({user, authModalRef, children}) => {
    return (
        <React.Fragment>
            <Navbar user={user} authModalRef={authModalRef} />
            <AuthModal authModalRef={authModalRef} />
            {children}
        </React.Fragment>
    )
}

Layout.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
}

export default Layout;