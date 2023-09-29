import PropTypes from "prop-types";
import Dashboard from "../../components/Dashboard/Dashboard";

const Home = ({user, authModalRef}) => {
    return (
        <Dashboard user={user} authModalRef={authModalRef} />
    )
}

Home.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired
}

export default Home;