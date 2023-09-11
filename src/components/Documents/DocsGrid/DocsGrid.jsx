import "./DocsGrid.css";
import PropTypes from "prop-types";

const DocsGrid = ({docs, docTypeModalRef}) => {
    return (
        <>
            <div className="docsGridHeading">
                <h1>Documents</h1>
                <button className="btnPrimary" onClick={() => docTypeModalRef.current.showModal()}>+ Add document type</button>
            </div>
            <div className="docsGrid">
                {docs.map((doc, index) =>
                    <div key={index} className="docCard">
                        <p className="docCardName">{doc.name}</p>
                        <p className="docCardDetails">Uploaded: {doc.uploaded}</p>
                        <p className="docCardDetails">Review Pending: {doc.reviewPending}</p>
                        <p className="docCardDetails">Approved: {doc.approved}</p>
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
    docs: PropTypes.array.isRequired,
    docTypeModalRef: PropTypes.object.isRequired
}

export default DocsGrid;
