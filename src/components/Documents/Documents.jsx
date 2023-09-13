import "./Documents.css";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import DocsGrid from "./DocsGrid/DocsGrid";
import EmptyDocs from "./EmptyDocs/EmptyDocs";
import DocTypeModal from "./DocTypeModal/DocTypeModal";
import axios from "axios";

const Documents = ({user, authModalRef}) => {
    const docTypeModalRef = useRef(null);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (!user) return;

        axios({
            method: 'GET',
            url: '/api/documents'
        })
        .then((res) => setDocuments(res.data.documents))
        .catch((error) => console.log(error));
    }, [user]);

    return (
        <main>
            {
                documents.length
                    ? <DocsGrid documents={documents} docTypeModalRef={docTypeModalRef} />
                    : <EmptyDocs user={user} authModalRef={authModalRef} docTypeModalRef={docTypeModalRef} />
            }
            <DocTypeModal setDocuments={setDocuments} docTypeModalRef={docTypeModalRef} />
        </main>
    )
}

Documents.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired
};

export default Documents;
