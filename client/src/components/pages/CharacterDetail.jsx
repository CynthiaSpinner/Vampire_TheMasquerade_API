import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { characterAPI } from '../api';
import { getTimePeriodContext, calculateAge, calculateYearsSinceEmbrace } from '../../utils/characterhelpers';
import './CharacterDetail.css';

function CharacterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCharacter();
    }, [id]);

    const loadCharacter = async () => {
        try {
            setLoading(true);
            const response = await characterAPI.getById(id);
            setCharacter(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load character');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
            try {
                await characterAPI.delete(id);
                navigate('/characters');
            } catch (err) {
                setError('Failed to delete character');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="character-detail">
                <div className="loading">Loading character...</div>
            </div>
        );
    }

    if (error || !character) {
        return (
            <div className="character-detail">
                <div className="error">{error || 'Character not found'}</div>
                <Link to="/characters" className="btn-back">Back to Characters</Link>
            </div>
        );
    }

    //calculate derived values
    const timePeriodContext = getTimePeriodContext(character.date_of_birth, character.place_of_birth);
    const age = calculateAge(character.date_of_birth);
    const yearsSinceEmbrace = calculateYearsSinceEmbrace(character.embrace_date);

    //organize attributes by category
    const attributesByCategory = {
        Physical: [
            { name: 'Strength', value: character.strength },
            { name: 'Dexterity', value: character.dexterity },
            { name: 'Stamina', value: character.stamina }
        ],
        Social: [
            { name: 'Charisma', value: character.charisma },
            { name: 'Manipulation', value: character.manipulation },
            { name: 'Composure', value: character.composure }
        ],
        Mental: [
            { name: 'Intelligence', value: character.intelligence },
            { name: 'Wits', value: character.wits },
            { name: 'Resolve', value: character.resolve }
        ]
    };

    //organize skills by category
    const skillsByCategory = {};
    if (character.skills) {
        character.skills.forEach(skill => {
            if (!skillsByCategory[skill.category]) {
                skillsByCategory[skill.category] = [];
            }
            skillsByCategory[skill.category].push(skill);
        });
    }

    return (
        <div className="character-detail">
            <div className="detail-header">
                <div className="header-left">
                    <h1>{character.name || 'Unnamed Character'}</h1>
                    <div className="character-meta">
                        {character.clan_name && (
                            <span className="meta-badge clan">{character.clan_name}</span>
                        )}
                        {character.generation && (
                            <span className="meta-badge">Generation {character.generation}</span>
                        )}
                        {character.sect && (
                            <span className="meta-badge">{character.sect}</span>
                        )}
                    </div>
                </div>
                <div className="header-actions">
                    <Link to={`/characters/${id}/edit`} className="btn-edit">
                        Edit
                    </Link>
                    <button onClick={handleDelete} className="btn-delete">
                        Delete
                    </button>
                    <Link to="/characters" className="btn-back">
                        Back
                    </Link>
                </div>
            </div>

            <div className="detail-content">
                {/* Basic Information */}
                <section className="detail-section">
                    <h2>Basic Information</h2>
                    <div className="info-grid">
                        {character.concept && (
                            <div className="info-item">
                                <strong>Concept:</strong> {character.concept}
                            </div>
                        )}
                        {character.player_name && (
                            <div className="info-item">
                                <strong>Player:</strong> {character.player_name}
                            </div>
                        )}
                        {character.chronicle && (
                            <div className="info-item">
                                <strong>Chronicle:</strong> {character.chronicle}
                            </div>
                        )}
                        {character.location && (
                            <div className="info-item">
                                <strong>Location:</strong> {character.location}
                            </div>
                        )}
                        {character.predator_type && (
                            <div className="info-item">
                                <strong>Predator Type:</strong> {character.predator_type}
                            </div>
                        )}
                    </div>
                </section>

                {/* Birth & Embrace Information */}
                {(character.date_of_birth || character.place_of_birth || character.embrace_date || character.sire) && (
                    <section className="detail-section">
                        <h2>Birth & Embrace</h2>
                        <div className="info-grid">
                            {character.date_of_birth && (
                                <div className="info-item">
                                    <strong>Date of Birth:</strong> {new Date(character.date_of_birth).toLocaleDateString()}
                                    {age && <span className="info-note"> (Age: {age} years)</span>}
                                </div>
                            )}
                            {character.place_of_birth && (
                                <div className="info-item">
                                    <strong>Place of Birth:</strong> {character.place_of_birth}
                                </div>
                            )}
                            {timePeriodContext && (
                                <div className="info-item time-period">
                                    <strong>Historical Context:</strong> {timePeriodContext}
                                </div>
                            )}
                            {character.embrace_date && (
                                <div className="info-item">
                                    <strong>Embrace Date:</strong> {new Date(character.embrace_date).toLocaleDateString()}
                                    {yearsSinceEmbrace && <span className="info-note"> ({yearsSinceEmbrace} years as vampire)</span>}
                                </div>
                            )}
                            {character.sire && (
                                <div className="info-item">
                                    <strong>Sire:</strong> {character.sire}
                                </div>
                            )}
                            {character.apparent_age && (
                                <div className="info-item">
                                    <strong>Apparent Age:</strong> {character.apparent_age}
                                </div>
                            )}
                            {character.true_age && (
                                <div className="info-item">
                                    <strong>True Age:</strong> {character.true_age}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Attributes */}
                <section className="detail-section">
                    <h2>Attributes</h2>
                    {Object.entries(attributesByCategory).map(([category, attrs]) => (
                        <div key={category} className="attribute-category">
                            <h3>{category}</h3>
                            <div className="attributes-grid">
                                {attrs.map(attr => (
                                    <div key={attr.name} className="attribute-item">
                                        <span className="attr-name">{attr.name}</span>
                                        <span className="attr-value">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Skills */}
                {character.skills && character.skills.length > 0 && (
                    <section className="detail-section">
                        <h2>Skills</h2>
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                            <div key={category} className="skill-category">
                                <h3>{category}</h3>
                                <div className="skills-grid">
                                    {skills.map(skill => (
                                        <div key={skill.id} className="skill-item">
                                            <span className="skill-name">{skill.name}</span>
                                            <span className="skill-rating">{skill.rating}</span>
                                            {skill.specialties && Array.isArray(skill.specialties) && skill.specialties.length > 0 && (
                                                <span className="skill-specialties">
                                                    ({skill.specialties.join(', ')})
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Disciplines */}
                {character.disciplines && character.disciplines.length > 0 && (
                    <section className="detail-section">
                        <h2>Disciplines</h2>
                        <div className="disciplines-grid">
                            {character.disciplines.map(disc => (
                                <div key={disc.id} className="discipline-item">
                                    <div className="discipline-header">
                                        <h4>{disc.name}</h4>
                                        <span className="discipline-rating">Level {disc.rating}</span>
                                    </div>
                                    {disc.description && (
                                        <p className="discipline-description">{disc.description}</p>
                                    )}
                                    {disc.powers && Array.isArray(disc.powers) && disc.powers.length > 0 && (
                                        <div className="discipline-powers">
                                            <strong>Powers:</strong>
                                            <ul>
                                                {disc.powers.map((power, idx) => (
                                                    <li key={idx}>
                                                        {power.name} (Level {power.level})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Merits */}
                {character.merits && character.merits.length > 0 && (
                    <section className="detail-section">
                        <h2>Merits</h2>
                        <div className="merits-flaws-grid">
                            {character.merits.map(merit => (
                                <div key={merit.id} className="merit-flaw-item">
                                    <div className="merit-flaw-header">
                                        <span className="merit-flaw-name">{merit.name}</span>
                                        <span className="merit-flaw-cost">({merit.cost} pts)</span>
                                    </div>
                                    {merit.description && (
                                        <p className="merit-flaw-description">{merit.description}</p>
                                    )}
                                    {merit.notes && (
                                        <p className="merit-flaw-notes"><em>{merit.notes}</em></p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Flaws */}
                {character.flaws && character.flaws.length > 0 && (
                    <section className="detail-section">
                        <h2>Flaws</h2>
                        <div className="merits-flaws-grid">
                            {character.flaws.map(flaw => (
                                <div key={flaw.id} className="merit-flaw-item">
                                    <div className="merit-flaw-header">
                                        <span className="merit-flaw-name">{flaw.name}</span>
                                        <span className="merit-flaw-cost">({flaw.cost} pts)</span>
                                    </div>
                                    {flaw.description && (
                                        <p className="merit-flaw-description">{flaw.description}</p>
                                    )}
                                    {flaw.notes && (
                                        <p className="merit-flaw-notes"><em>{flaw.notes}</em></p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Backgrounds */}
                {character.backgrounds && character.backgrounds.length > 0 && (
                    <section className="detail-section">
                        <h2>Backgrounds</h2>
                        <div className="backgrounds-grid">
                            {character.backgrounds.map(bg => (
                                <div key={bg.id} className="background-item">
                                    <div className="background-header">
                                        <span className="background-name">{bg.name}</span>
                                        <span className="background-rating">Rating: {bg.rating}</span>
                                    </div>
                                    {bg.details && (
                                        <p className="background-details">{bg.details}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Stats */}
                <section className="detail-section">
                    <h2>Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <strong>Health:</strong> {character.health_current || 0} / {character.health_max || 0}
                        </div>
                        <div className="stat-item">
                            <strong>Willpower:</strong> {character.willpower_current || 0} / {character.willpower_max || 0}
                        </div>
                        <div className="stat-item">
                            <strong>Humanity:</strong> {character.humanity || 0}
                        </div>
                        <div className="stat-item">
                            <strong>Hunger:</strong> {character.hunger || 0}
                        </div>
                        {character.experience_available !== undefined && (
                            <div className="stat-item">
                                <strong>Experience Available:</strong> {character.experience_available || 0}
                            </div>
                        )}
                    </div>
                </section>

                {/* Notes */}
                {character.notes && (
                    <section className="detail-section">
                        <h2>Notes</h2>
                        <div className="notes-content">
                            <p>{character.notes}</p>
                        </div>
                    </section>
                )}

                {/* Ambition & Desire */}
                {(character.ambition || character.desire) && (
                    <section className="detail-section">
                        <h2>Ambition & Desire</h2>
                        <div className="info-grid">
                            {character.ambition && (
                                <div className="info-item">
                                    <strong>Ambition:</strong> {character.ambition}
                                </div>
                            )}
                            {character.desire && (
                                <div className="info-item">
                                    <strong>Desire:</strong> {character.desire}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Chronicle Tenets & Touchstones */}
                {(character.chronicle_tenets || character.touchstones) && (
                    <section className="detail-section">
                        <h2>Chronicle</h2>
                        <div className="info-grid">
                            {character.chronicle_tenets && (
                                <div className="info-item full-width">
                                    <strong>Chronicle Tenets:</strong>
                                    <p>{character.chronicle_tenets}</p>
                                </div>
                            )}
                            {character.touchstones && (
                                <div className="info-item full-width">
                                    <strong>Touchstones:</strong>
                                    <p>{character.touchstones}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default CharacterDetail;

