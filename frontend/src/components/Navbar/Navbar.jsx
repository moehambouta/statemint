import "./Navbar.css"

const Navbar = () => {
    return (
        <div className="nav">
            <a href="/" className="homeLink">
                Statemint
            </a>
            <div className="account">
                <span>Guest</span>
                <img src="user.svg" alt="User Icon" />
            </div>
        </div>
    )
}

export default Navbar
