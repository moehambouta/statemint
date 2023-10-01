import "./SideNav.css";

const SideNav = () => {
    return (
        <div className="sidenav">
            <a href="/" className="homeLink">
                <img src="/assets/logo.png" alt="Logo" />
            </a>
            <button className="btnPrimary">
                Upload
            </button>
            <ul className="top navLinks">
                <li className="active navLink">Document Types</li>
                <li className="navLink">My Documents</li>
                <li className="navLink">Models & Training</li>
            </ul>
            <ul className="bottom navLinks">
                <li className="navLink">AI Models Hub</li>
                <li className="navLink">Settings</li>
            </ul>
        </div>
    )
}

export default SideNav;