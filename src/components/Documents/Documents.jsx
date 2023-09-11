import "./Documents.css";
import { useRef, useState } from "react";
import DocsGrid from "./DocsGrid/DocsGrid";
import EmptyDocs from "./EmptyDocs/EmptyDocs";
import DocTypeModal from "./DocTypeModal/DocTypeModal";

const Docs = () => {
    const docTypeModalRef = useRef(null);
    const [docs, setDocs] = useState([]);

    return (
        <main>
            {docs.length ? <DocsGrid docs={docs} docTypeModalRef={docTypeModalRef} /> : <EmptyDocs docTypeModalRef={docTypeModalRef} />}
            <DocTypeModal docs={docs} docTypeModalRef={docTypeModalRef} setDocs={setDocs} />
        </main>
    )
}

export default Docs;
