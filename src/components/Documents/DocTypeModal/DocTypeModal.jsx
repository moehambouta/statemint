import "./DocTypeModal.css";
import { useState } from "react";
import PropTypes from "prop-types";
import DocTypeGrid from "./DocTypeGrid/DocTypeGrid";
import UploadInterface from "./UploadInterface/UploadInterface";

const Modal = ({docs, setDocs, docTypeModalRef}) => {
    const [docType, setDocType] = useState("");
    const [isUploadInterface, setUploadInterface] = useState(false);
    const [modalHeading, setModalHeading] = useState("Select a document type");

    const closeDialog = () => {
        setDocType("");
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
                        setDocType={setDocType}
                        setModalHeading={setModalHeading}
                        setUploadInterface={setUploadInterface}
                    />
                ) : (
                    <UploadInterface
                        docs={docs}
                        docType={docType}
                        setDocs={setDocs}
                        closeDialog={closeDialog}
                        setModalHeading={setModalHeading}
                        setUploadInterface={setUploadInterface}
                    />
                )
            }
        </dialog>
    )
};

Modal.propTypes = {
    docs: PropTypes.array.isRequired,
    setDocs: PropTypes.func.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
};

export default Modal;
