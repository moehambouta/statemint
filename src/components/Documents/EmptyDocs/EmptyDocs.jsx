import "./EmptyDocs.css";
import PropTypes from "prop-types";

const EmptyDocs = ({user, authModalRef, docTypeModalRef}) => {
    const handleClick = () => {
        if (!user?.username) {
            authModalRef.current.showModal();
        } else {
            docTypeModalRef.current.showModal();
        }
    };

    return (
        <div className="emptyDocs">
            <img src="assets/docs.png" alt="Documents" />
            <h1>Extract data from any document type</h1>
            <p>Choose from a variety of ready-to-use document types to get started.</p>
            <button className="btnPrimary" onClick={handleClick}>+ Add document type</button>
        </div>
    )
};

EmptyDocs.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
}

export default EmptyDocs;