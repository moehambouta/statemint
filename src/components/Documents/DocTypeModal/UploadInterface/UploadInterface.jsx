import "./UploadInterface.css";
import { useRef, useState } from "react";
import PropTypes from 'prop-types';

const UploadInterface = ({docs, setDocs, docType, closeDialog, setModalHeading, setUploadInterface}) => {
    const inputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [documentName, setDocumentName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    let isSubmitBtnDisabled = documentName.length === 0 || files.length === 0;

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
                alert(target.files[i].name + " size: 0. Skipping upload!");
            }
        }
        setFiles([...files, ...tempArr]);
    };

    const handleClick = (e) => {
        e.preventDefault();
        inputRef.current.click();
    };

    const returnToDocTypeModal = () => {
        setModalHeading("Select a document type");
        setUploadInterface(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('documentType', docType);
        formData.append('documentName', documentName);
        for (let i = 0; i < files.length; i++) {
            formData.append('documentFiles', files[i]);
        }

        const requestOptions = {
            method: 'POST',
            body: formData
        };

        fetch('/upload', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => console.error('Error:', error));

        setDocs([...docs, {"name": documentName, "uploaded": files.length, "reviewPending": 0, "approved": 0}]);
        closeDialog();
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
                    ref={inputRef}
                    style={{display: "none"}}
                    onChange={(e) => handleFileChange(e.target)}
                    accept=".pdf, image/png, image/jpeg"
                />

                <label htmlFor="DocumentFile" className={dragActive ? "uploadAreaInput dragActive" : "uploadAreaInput" }>
                    <img src="assets/upload.png" alt="Upload Icon" />
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
    docs: PropTypes.array.isRequired,
    setDocs: PropTypes.func.isRequired,
    docType: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    setModalHeading: PropTypes.func.isRequired,
    setUploadInterface: PropTypes.func.isRequired
};

export default UploadInterface;
