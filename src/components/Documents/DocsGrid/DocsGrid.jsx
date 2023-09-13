import "./DocsGrid.css";
import PropTypes from "prop-types";

const DocsGrid = ({documents, docTypeModalRef}) => {
    return (
        <>
            <div className="docsGridHeading">
                <h1>Documents</h1>
                <button className="btnPrimary" onClick={() => docTypeModalRef.current.showModal()}>+ Add document type</button>
            </div>
            <div className="docsGrid">
                {documents.map((doc, index) =>
                    <div key={index} className="docCard">
                        <p className="docCardName">{doc.document_name}</p>
                        <p className="docCardDetails">Uploaded: {doc.total_uploads}</p>
                        <p className="docCardDetails">Review Pending: {doc.reviewPending_count}</p>
                        <p className="docCardDetails">Approved: {doc.approved_count}</p>
                        <div className="docCardBtns">
                            <button className="btnPrimary">Edit Fields</button>
                            <button className="btnPrimary">Upload</button>
                            <button className="btnPrimary">Review</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

DocsGrid.propTypes = {
    documents: PropTypes.array.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
}

export default DocsGrid;
