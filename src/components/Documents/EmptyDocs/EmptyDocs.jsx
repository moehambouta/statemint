import "./EmptyDocs.css";
import PropTypes from "prop-types";

const EmptyDocs = ({docTypeModalRef}) => {
    return (
        <div className="emptyDocs">
            <img src="assets/docs.png" alt="Documents" />
            <h1>Extract data from any document type</h1>
            <p>Choose from a variety of ready-to-use document types to get started.</p>
            <button className="btnPrimary" onClick={() => docTypeModalRef.current.showModal()}>+ Add document type</button>
        </div>
    )
};

EmptyDocs.propTypes = {
    docTypeModalRef: PropTypes.object.isRequired
}

export default EmptyDocs;