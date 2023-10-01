import "./DocsGrid.css";
import React from "react";
import PropTypes from "prop-types";

/**
 * TODO: Add click functionality for all buttons
 * TODO: Separate DocCard logic to separate component
**/
const DocsGrid = ({documents, docTypeModalRef}) => {
    const handleReviewClick = (e, documentId) => {
        window.location.href = `/document/${documentId}`;
    };

    const handleUploadClick = (e, documentId) => {
        console.log(e, documentId)
    }

    return (
        <React.Fragment>
            <div className="docsGridHeading">
                <h1>Document Types</h1>
                <button className="btnPrimary" onClick={() => docTypeModalRef.current.showModal()}>+ Add document type</button>
            </div>
            <div className="docsGrid">
                {documents.map((doc) =>
                    <div key={doc.document_id} className="docCard">
                        <p className="docCardName">{doc.document_name}</p>
                        <p className="docCardDetails">Uploaded: {doc.total_uploads}</p>
                        <p className="docCardDetails">Review Pending: {doc.reviewPending_count}</p>
                        <p className="docCardDetails">Approved: {doc.approved_count}</p>
                        <div className="docCardBtns">
                            <button className="btnPrimary">Edit Fields</button>
                            <button className="btnPrimary" onClick={(e) => handleUploadClick(e, doc.document_id)}>Upload</button>
                            <button className="btnPrimary" onClick={(e) => handleReviewClick(e, doc.document_id)}>Review</button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

DocsGrid.propTypes = {
    documents: PropTypes.array.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
}

export default DocsGrid;
