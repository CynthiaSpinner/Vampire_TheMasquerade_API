import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="home-hero">
                <h1>Vampire: The Masquerade</h1>
                <h2>Game Master Hub</h2>
                <p className="home-description">
                    Manage your chronicle, create characters, and generate compelling stories
                    with AI-powered narrative assistance.
                </p>
            </div>

            <div className="home-features">
                <div className="feature-card">
                    <h3>📋 Character Management</h3>
                    <p>Create and manage complete VtM character sheets with all attributes, skills, disciplines, and more.</p>
                    <Link to="/characters" className="feature-link">
                        Manage Characters →
                    </Link>
                </div>

                <div className="feature-card">
                    <h3>🧛 World Information</h3>
                    <p>Access complete VtM V5 game data including clans, disciplines, sects, locations, and more.</p>
                    <Link to="/characters/new" className="feature-link">
                        Create Character →
                    </Link>
                </div>

                <div className="feature-card">
                    <h3>📖 AI Story Generation</h3>
                    <p>Generate compelling story hooks, scenes, and narratives powered by AI, integrated with dice rolls.</p>
                    <Link to="/stories" className="feature-link">
                        Generate Stories →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;