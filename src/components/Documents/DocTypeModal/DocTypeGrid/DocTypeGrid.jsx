import "./DocTypeGrid.css";
import PropTypes from 'prop-types';
import docTypesData from "./DocTypes.json";

const DocTypeCard = ({name, src, setDocType, setModalHeading, setUploadInterface}) => {
    const handleClick = () => {
        setDocType(name);
        setModalHeading("Create your document type");
        setUploadInterface(true)
    };

    return (
        <div onClick={handleClick} className='docTypeCard'>
            <img src={src} alt="Statement Icon" />
            <h1>{name}</h1>
        </div>
    )
}

const DocTypeGrid = ({setDocType, setModalHeading, setUploadInterface}) => {
    return (
        <div className='docTypeGrid'>
            {docTypesData.DocTypes.map((doc) =>
                <DocTypeCard
                    key={doc.name}
                    name={doc.name}
                    src={doc.src}
                    setDocType={setDocType}
                    setModalHeading={setModalHeading}
                    setUploadInterface={setUploadInterface}
                />
            )}
        </div>
    )
}

DocTypeGrid.propTypes = {
    setDocType: PropTypes.func.isRequired,
    setModalHeading: PropTypes.func.isRequired,
    setUploadInterface: PropTypes.func.isRequired
}

DocTypeCard.propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    setDocType: PropTypes.func.isRequired,
    setModalHeading: PropTypes.func.isRequired,
    setUploadInterface: PropTypes.func.isRequired
}

export default DocTypeGrid;
