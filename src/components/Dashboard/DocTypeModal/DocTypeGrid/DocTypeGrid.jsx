import "./DocTypeGrid.css";
import PropTypes from 'prop-types';
import docTypesData from "./DocTypes.json";

/**
 * TODO: Retrieve DocTypes from database instead of JSON
**/
const DocTypeCard = ({name, src, setDocumentType, setModalHeading, setUploadInterface}) => {
    const handleClick = () => {
        setDocumentType(name);
        setModalHeading("Create your document type");
        setUploadInterface(true);
    };

    return (
        <div onClick={handleClick} className='docTypeCard'>
            <img src={src} alt="Statement Icon" />
            <h1>{name}</h1>
        </div>
    )
}

const DocTypeGrid = ({setDocumentType, setModalHeading, setUploadInterface}) => {
    return (
        <div className='docTypeGrid'>
            {docTypesData.DocTypes.map((doc) =>
                <DocTypeCard
                    key={doc.name}
                    name={doc.name}
                    src={doc.src}
                    setDocumentType={setDocumentType}
                    setModalHeading={setModalHeading}
                    setUploadInterface={setUploadInterface}
                />
            )}
        </div>
    )
}

DocTypeGrid.propTypes = {
    setDocumentType: PropTypes.func.isRequired,
    setModalHeading: PropTypes.func.isRequired,
    setUploadInterface: PropTypes.func.isRequired
}

DocTypeCard.propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    setDocumentType: PropTypes.func.isRequired,
    setModalHeading: PropTypes.func.isRequired,
    setUploadInterface: PropTypes.func.isRequired
}

export default DocTypeGrid;
