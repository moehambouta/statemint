import axios from 'axios';
import "./UploadInterface.css";
import PropTypes from 'prop-types';
import { useRef, useState } from "react";

const UploadInterface = ({documentType, setDocuments, closeDialog, setModalHeading, setUploadInterface}) => {
    const [files, setFiles] = useState([]);
    const fileUploadInputRef = useRef(null);
    const [documentName, setDocumentName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    let isSubmitBtnDisabled = documentName.length === 0 || files.length === 0;

    const returnToDocTypeModal = () => {
        setModalHeading("Select a document type");
        setUploadInterface(false);
    };

    const handleClick = (e) => {
        e.preventDefault();
        fileUploadInputRef.current.click();
    };

    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer);
        }
    };

    const handleFileChange = (target) => {
        let tempArr = [];
        for (let i = 0; i < target.files.length; i++) {
            if (target.files[i].size !== 0) {
                tempArr.push(target.files[i]);
            } else {
                alert(target.files[i].name + " size: 0. Skipping file!");
            }
        }
        setFiles([...files, ...tempArr]);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('documentType', documentType);
        formData.append('documentName', documentName);

        for (let i = 0; i < files.length; i++) {
            formData.append('documentFiles', files[i]);
        }

        const document = {
            document_id: null,
            document_name: documentName,
            total_uploads: files.length,
            reviewPending_count: 0,
            approved_count: 0
        }

        axios({
            method: 'POST',
            url: '/api/upload',
            data: formData,
            withCredentials: true
        }).then((res) => {
            closeDialog();
            document.document_id = res.data.documentId;
            setDocuments(prevDocs => [...prevDocs, document]);
        }).catch((error) => {
            console.log(error);
            alert("Error uploading document!");
        });
    };

    return (
        <form className="uploadForm" onDragEnter={handleDrag} onSubmit={handleFormSubmit}>
            <label htmlFor="documentName">Document Name:</label>
            <input type="text" id="documentName" value={documentName} onChange={(e) => setDocumentName(e.target.value)} required/>

            <div className="uploadArea">
                <input
                    multiple
                    type="file"
                    id="DocumentFile"
                    name="DocumentFile"
                    ref={fileUploadInputRef}
                    style={{display: "none"}}
                    onChange={(e) => handleFileChange(e.target)}
                    accept=".pdf, image/png, image/jpeg"
                />

                <label htmlFor="DocumentFile" className={dragActive ? "uploadAreaInput dragActive" : "uploadAreaInput" }>
                    <img src="/assets/upload.png" alt="Upload Icon" />
                    <p>Drag and drop files here</p>
                    <p>OR</p>
                    <p style={{fontWeight: 700}} onClick={handleClick}>Click here to upload</p>
                    <div className="details">
                        <p>Supported: JPG, JPEG, PNG, PDF</p>
                        <p>File size should be maximum 25mb and it shouldn&apos;t be password protected</p>
                    </div>
                </label>

                <div className="uploadedFiles">
                    {files && files.map((file, index) => <p key={index}>{file.name}</p>)}
                </div>
            </div>

            <div className="buttons">
                <button className="btnPrimary" onClick={returnToDocTypeModal}>Back</button>
                <button className={isSubmitBtnDisabled ? "btnPrimary btnDisabled" : "btnPrimary"} type="submit" disabled={isSubmitBtnDisabled}>Create</button>
            </div>

            { dragActive && <div id="dragFileElement" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
        </form>
    )
};

UploadInterface.propTypes = {
    documentType: PropTypes.string.isRequired,
    setDocuments: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    setModalHeading: PropTypes.func.isRequired,
    setUploadInterface: PropTypes.func.isRequired
};

export default UploadInterface;
