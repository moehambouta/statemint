import axios from "axios";
import "./Dashboard.css";
import PropTypes from "prop-types";
import Navbar from "../Navbar/Navbar";
import DocsGrid from "./DocsGrid/DocsGrid";
import { useEffect, useRef, useState } from "react";
import EmptyDocs from "./EmptyDocs/EmptyDocs";
import DocTypeModal from "./DocTypeModal/DocTypeModal";
import AuthModal from "../AuthModal/AuthModal";
import SideNav from "./SideNav/SideNav";

/**
 * TODO: Abstract container css for DocsGrid and EmptyDocs
 * TODO: Add loading component for after document creation
**/
const Dashboard = ({user}) => {
    const authModalRef = useRef(null);
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
        <div className="dashboard">
            <SideNav />
            <div className="mainContent">
                <Navbar user={user} authModalRef={authModalRef} />
                <main>
                    {
                        documents.length
                            ? <DocsGrid documents={documents} docTypeModalRef={docTypeModalRef} />
                            : <EmptyDocs user={user} authModalRef={authModalRef} docTypeModalRef={docTypeModalRef} />
                    }
                </main>
                <DocTypeModal setDocuments={setDocuments} docTypeModalRef={docTypeModalRef} />
                <AuthModal authModalRef={authModalRef} />
            </div>
        </div>
    )
}

Dashboard.propTypes = {
    user: PropTypes.object,
};

export default Dashboard;
