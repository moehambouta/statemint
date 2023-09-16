import "./DocTypeModal.css";
import { useState } from "react";
import PropTypes from "prop-types";
import DocTypeGrid from "./DocTypeGrid/DocTypeGrid";
import UploadInterface from "./UploadInterface/UploadInterface";

/**
 * TODO: Improve mobile experience
 * TODO: Make modal take whole screen in mobile view
**/
const DocTypeModal = ({setDocuments, docTypeModalRef}) => {
    const [documentType, setDocumentType] = useState("");
    const [isUploadInterface, setUploadInterface] = useState(false);
    const [modalHeading, setModalHeading] = useState("Select a document type");

    const closeDialog = () => {
        setDocumentType("");
        setUploadInterface(false);
        setModalHeading("Select a document type");
        docTypeModalRef.current.close();
    };

    return (
        <dialog id="docTypeModal" className="docTypeModal" ref={docTypeModalRef} onClose={closeDialog}>
            <div className="docTypeModalHeading">
                <h1>{modalHeading}</h1>
                <span onClick={closeDialog}>✖</span>
            </div>

            {isUploadInterface === false
                ? (
                    <DocTypeGrid
                        setDocumentType={setDocumentType}
                        setModalHeading={setModalHeading}
                        setUploadInterface={setUploadInterface}
                    />
                ) : (
                    <UploadInterface
                        documentType={documentType}
                        setDocuments={setDocuments}
                        closeDialog={closeDialog}
                        setModalHeading={setModalHeading}
                        setUploadInterface={setUploadInterface}
                    />
                )
            }
        </dialog>
    )
};

DocTypeModal.propTypes = {
    setDocuments: PropTypes.func.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
};

export default DocTypeModal;
