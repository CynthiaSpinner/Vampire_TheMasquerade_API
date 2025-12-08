import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">VtM GM Hub</Link>
            </div>
            <ul className="navbar-nav">
                <li>
                    <Link 
                        to="/" 
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/characters" 
                        className={location.pathname.startsWith('/characters') ? 'active' : ''}
                    >
                        Characters
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/stories" 
                        className={location.pathname === '/stories' ? 'active' : ''}
                    >
                        Stories
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;