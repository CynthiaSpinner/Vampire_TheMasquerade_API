import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { characterAPI } from '../../api';
import './Characters.css';

function Characters() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCharacters();
    }, []);

    const loadCharacters = async () => {
        try {
            setLoading(true);
            const response = await characterAPI.getAll();
            setCharacters(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load characters');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this character?')) {
            try {
                await characterAPI.delete(id);
                loadCharacters();
            } catch (err) {
                setError('Failed to delete character');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="characters">
                <div className="loading">Loading characters...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="characters">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="characters">
            <div className="characters-header">
                <h1>Characters</h1>
                <Link to="/characters/new" className="btn-create">
                    + Create New Character
                </Link>
            </div>

            {characters.length === 0 ? (
                <div className="empty-state">
                    <p>No characters found. Create your first character to get started!</p>
                    <Link to="/characters/new" className="btn-create">
                        Create Character
                    </Link>
                </div>
            ) : (
                <div className="characters-grid">
                    {characters.map((character) => (
                        <div key={character.id} className="character-card">
                            <div className="character-card-header">
                                <h3>{character.name || 'Unnamed Character'}</h3>
                                <span className="character-clan">{character.clan_name || 'No Clan'}</span>
                            </div>
                            <div className="character-card-body">
                                <div className="character-info">
                                    <p><strong>Generation:</strong> {character.generation || 'N/A'}</p>
                                    <p><strong>Sect:</strong> {character.sect || 'N/A'}</p>
                                    <p><strong>Location:</strong> {character.location || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="character-card-actions">
                                <Link 
                                    to={`/characters/${character.id}`} 
                                    className="btn-view"
                                >
                                    View
                                </Link>
                                <Link 
                                    to={`/characters/${character.id}/edit`} 
                                    className="btn-edit"
                                >
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(character.id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Characters;