import "./EmptyDocs.css";
import PropTypes from "prop-types";

const EmptyDocs = ({user, authModalRef, docTypeModalRef}) => {
    const handleAddDocClick = () => {
        if (!user?.username) {
            authModalRef.current.showModal();
        } else {
            docTypeModalRef.current.showModal();
        }
    };

    return (
        <div className="emptyDocs">
            <img src="/assets/docs.png" alt="Documents" />
            <h1 className="heading">Extract data from any document type</h1>
            <h2 className="subheading">Choose from a variety of ready-to-use document types to get started.</h2>
            <button className="btnPrimary" onClick={handleAddDocClick}>+ Add document type</button>
        </div>
    )
};

EmptyDocs.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
}

export default EmptyDocs;