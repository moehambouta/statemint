import "./Document.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

/**
 * TODO: Implement better UI
 * TODO: Editable cells that update database accordingly
**/
const Document = ({user}) => {
    const params = useParams();
    const [documentName, setDocumentName] = useState(null);
    const [documentData, setDocumentData] = useState([]);
    const [documentUploads, setDocumentUploads] = useState([]);

    useEffect(() => {
        if (!user) return;

        axios({
            method: "GET",
            url: `/api/document/${params.documentId}`
        })
        .then((res) => {
            setDocumentName(res.data.documentName);
            setDocumentData(res.data.documentData);
            setDocumentUploads(res.data.documentUploads);
        })
        .catch((error) => console.log(error));
    }, [user, params.documentId]);

    return (
        <div className="document">
            <h1 className="documentHeading">{documentName ? documentName: "Please Log In"}</h1>
            <div className="documentContent">
                {user &&
                    <React.Fragment>
                        <div className="documentTable">
                            {documentData.map(item => (
                                <div className="values" key={item.section_id}>
                                    <div className="nameCell">{item.category}</div>
                                    <div className="contentCell">{item.content}</div>
                                </div>
                            ))}
                        </div>
                        <div className="documentImages">
                            {documentUploads.length > 0 && documentUploads[0].files.map((image, index) => (
                                <img key={index} src={`/auth/secure-image?path=${encodeURIComponent(image.replace(/\\/g, '/'))}`} alt="" />
                            ))}
                        </div>
                    </React.Fragment>
                }
            </div>
        </div>
    )
}

Document.propTypes = {
    user: PropTypes.object
}

export default Document;