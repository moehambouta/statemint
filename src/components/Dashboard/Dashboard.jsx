import axios from "axios";
import "./Dashboard.css";
import PropTypes from "prop-types";
import Navbar from "../Navbar/Navbar";
import DocsGrid from "./DocsGrid/DocsGrid";
import React, { useEffect, useRef, useState } from "react";
import EmptyDocs from "./EmptyDocs/EmptyDocs";
import DocTypeModal from "./DocTypeModal/DocTypeModal";
import AuthModal from "../AuthModal/AuthModal";

/**
 * TODO: Abstract container css for DocsGrid and EmptyDocs
 * TODO: Add loading component for after document creation
**/
const Dashboard = ({user, authModalRef}) => {
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
        <React.Fragment>
            <Navbar user={user} authModalRef={authModalRef} />
            <AuthModal authModalRef={authModalRef} />
            <main>
                {
                    documents.length
                        ? <DocsGrid documents={documents} docTypeModalRef={docTypeModalRef} />
                        : <EmptyDocs user={user} authModalRef={authModalRef} docTypeModalRef={docTypeModalRef} />
                }
                <DocTypeModal setDocuments={setDocuments} docTypeModalRef={docTypeModalRef} />
            </main>
        </React.Fragment>
    )
}

Dashboard.propTypes = {
    user: PropTypes.object,
    authModalRef: PropTypes.object.isRequired
};

export default Dashboard;
