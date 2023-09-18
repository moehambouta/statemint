import "./Document.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import AuthModal from "../../components/AuthModal/AuthModal";

/**
 * TODO: Implement better UI
 * TODO: Editable cells that update database accordingly
**/
const Document = ({user, authModalRef}) => {
    const params = useParams();
    const [documentName, setDocumentName] = useState(null);
    const [documentData, setDocumentData] = useState([]);

    useEffect(() => {
        if (!user) return;

        axios({
            method: "GET",
            url: `/api/documents/${params.documentId}`
        })
        .then((res) => {
            setDocumentName(res.data.document[0].documentName);
            setDocumentData(res.data.document);
        })
        .catch((error) => console.log(error));
    }, [user, params.documentId])

    return (
        <React.Fragment>
            <Navbar user={user} authModalRef={authModalRef} />
            <AuthModal authModalRef={authModalRef} />

            <div className="document">
                <h1 className="documentHeading">{documentName ? documentName: "Please Log In"}</h1>
                {user &&
                    <div className="documentTable">
                        <div className="headings">
                            <div className="nameCell">Name</div>
                            <div className="contentCell">Content</div>
                        </div>

                        {documentData.map(item => (
                            <div className="values" key={item.section_id}>
                                <div className="nameCell">{item.category}</div>
                                <div className="contentCell">{item.content}</div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

Document.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired
}

export default Document;