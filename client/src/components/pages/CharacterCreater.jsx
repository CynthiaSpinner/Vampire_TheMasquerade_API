import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { characterAPI, worldAPI } from '../api';
import { getTimePeriodContext } from '../utils/characterHelpers';
import './CharacterCreator.css';


function CharacterCreator() {
    const navigate = useNavigate();
    
    //form state
    const [formData, setFormData] = useState({
        name: '',
        clan_id: '',
        generation: 13,
        sect: '',
        location: '',
        concept: '',
        predator_type: '',
        ambition: '',
        desire: '',
        chronicle_tenets: '',
        touchstones: '',
        notes: '',
        date_of_birth: '',   
        place_of_birth: '',      
        embrace_date: '',        
        sire: '',                
        apparent_age: '',        
        true_age: ''      
    });

    //world data
    const [clans, setClans] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [skills, setSkills] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [merits, setMerits] = useState([]);
    const [flaws, setFlaws] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [sects, setSects] = useState([]);
    const [locations, setLocations] = useState([]);

    //character data
    const [characterAttributes, setCharacterAttributes] = useState({});
    const [characterSkills, setCharacterSkills] = useState({});
    const [characterDisciplines, setCharacterDisciplines] = useState({});
    const [selectedMerits, setSelectedMerits] = useState([]);
    const [selectedFlaws, setSelectedFlaws] = useState([]);
    const [selectedBackgrounds, setSelectedBackgrounds] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWorldData();
    }, []);

    const loadWorldData = async () => {
        try {
            setLoading(true);
            const [
                clansRes,
                attributesRes,
                skillsRes,
                disciplinesRes,
                meritsRes,
                flawsRes,
                backgroundsRes,
                sectsRes,
                locationsRes
            ] = await Promise.all([
                worldAPI.getClans(),
                worldAPI.getAttributes(),
                worldAPI.getSkills(),
                worldAPI.getDisciplines(),
                worldAPI.getMerits(),
                worldAPI.getFlaws(),
                worldAPI.getBackgrounds(),
                worldAPI.getSects(),
                worldAPI.getLocations()
            ]);

            setClans(clansRes.data);
            setAttributes(attributesRes.data);
            setSkills(skillsRes.data);
            setDisciplines(disciplinesRes.data);
            setMerits(meritsRes.data);
            setFlaws(flawsRes.data);
            setBackgrounds(backgroundsRes.data);
            setSects(sectsRes.data);
            setLocations(locationsRes.data);

            //initialize attribute and skill ratings
            const attrObj = {};
            attributesRes.data.forEach(attr => {
                attrObj[attr.id] = 1;
            });
            setCharacterAttributes(attrObj);

            const skillObj = {};
            skillsRes.data.forEach(skill => {
                skillObj[skill.id] = 0;
            });
            setCharacterSkills(skillObj);

            const discObj = {};
            disciplinesRes.data.forEach(disc => {
                discObj[disc.id] = 0;
            });
            setCharacterDisciplines(discObj);

        } catch (err) {
            setError('Failed to load world data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAttributeChange = (attrId, value) => {
        setCharacterAttributes(prev => ({
            ...prev,
            [attrId]: parseInt(value) || 1
        }));
    };

    const handleSkillChange = (skillId, value) => {
        setCharacterSkills(prev => ({
            ...prev,
            [skillId]: parseInt(value) || 0
        }));
    };

    const handleDisciplineChange = (discId, value) => {
        setCharacterDisciplines(prev => ({
            ...prev,
            [discId]: parseInt(value) || 0
        }));
    };

    const toggleMerit = (meritId) => {
        setSelectedMerits(prev => {
            if (prev.includes(meritId)) {
                return prev.filter(id => id !== meritId);
            }
            return [...prev, meritId];
        });
    };

    const toggleFlaw = (flawId) => {
        setSelectedFlaws(prev => {
            if (prev.includes(flawId)) {
                return prev.filter(id => id !== flawId);
            }
            return [...prev, flawId];
        });
    };

    const toggleBackground = (backgroundId) => {
        setSelectedBackgrounds(prev => {
            if (prev.includes(backgroundId)) {
                return prev.filter(id => id !== backgroundId);
            }
            return [...prev, backgroundId];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const characterData = {
                ...formData,
                attributes: Object.entries(characterAttributes).map(([id, rating]) => ({
                    attribute_id: parseInt(id),
                    rating: rating
                })),
                skills: Object.entries(characterSkills)
                    .filter(([id, rating]) => rating > 0)
                    .map(([id, rating]) => ({
                        skill_id: parseInt(id),
                        rating: rating
                    })),
                disciplines: Object.entries(characterDisciplines)
                    .filter(([id, rating]) => rating > 0)
                    .map(([id, rating]) => ({
                        discipline_id: parseInt(id),
                        level: rating
                    })),
                merits: selectedMerits.map(id => ({ merit_id: parseInt(id) })),
                flaws: selectedFlaws.map(id => ({ flaw_id: parseInt(id) })),
                backgrounds: selectedBackgrounds.map(id => ({ background_id: parseInt(id) }))
            };

            const response = await characterAPI.create(characterData);
            navigate(`/characters/${response.data.id}`);
        } catch (err) {
            setError('Failed to create character: ' + (err.response?.data?.error || err.message));
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="character-creator">
                <div className="loading">Loading character creation form...</div>
            </div>
        );
    }

    const attributesByCategory = {
        Physical: attributes.filter(a => a.category === 'Physical'),
        Social: attributes.filter(a => a.category === 'Social'),
        Mental: attributes.filter(a => a.category === 'Mental')
    };

    const skillsByCategory = {
        Physical: skills.filter(s => s.category === 'Physical'),
        Social: skills.filter(s => s.category === 'Social'),
        Mental: skills.filter(s => s.category === 'Mental')
    };

    //computing time period context for helper display
    const timePeriodContext = getTimePeriodContext(formData.date_of_birth, formData.place_of_birth);

    return (
        <div className="character-creator">
            <div className="creator-header">
                <h1>Create New Character</h1>
                <button onClick={() => navigate('/characters')} className="btn-cancel">
                    Cancel
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="character-form">
                {/* Basic Information Section */}
                <section className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Character Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="clan_id">Clan *</label>
                            <select
                                id="clan_id"
                                name="clan_id"
                                value={formData.clan_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a Clan</option>
                                {clans.map(clan => (
                                    <option key={clan.id} value={clan.id}>
                                        {clan.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="generation">Generation</label>
                            <input
                                type="number"
                                id="generation"
                                name="generation"
                                value={formData.generation}
                                onChange={handleInputChange}
                                min="8"
                                max="15"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sect">Sect</label>
                            <select
                                id="sect"
                                name="sect"
                                value={formData.sect}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a Sect</option>
                                {sects.map(sect => (
                                    <option key={sect.id} value={sect.name}>
                                        {sect.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <select
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a Location</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.name}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="concept">Concept</label>
                            <input
                                type="text"
                                id="concept"
                                name="concept"
                                value={formData.concept}
                                onChange={handleInputChange}
                                placeholder="e.g., Former Detective, Socialite, Scholar"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="predator_type">Predator Type</label>
                            <input
                                type="text"
                                id="predator_type"
                                name="predator_type"
                                value={formData.predator_type}
                                onChange={handleInputChange}
                                placeholder="e.g., Sandman, Osiris, Siren"
                            />
                        </div>
                    </div>
                </section>

                {/* Birth Information Section */}
                <section className="form-section">
                   <h2>Birth Information</h2>
                   <div className="form-grid">
                       <div className="form-group">
                           <label htmlFor="date_of_birth">Date of Birth</label>
                           <input
                               type="date"
                               id="date_of_birth"
                               name="date_of_birth"
                               value={formData.date_of_birth}
                               onChange={handleInputChange}
                           />
                       </div>

                       <div className="form-group">
                           <label htmlFor="place_of_birth">Place of Birth</label>
                           <input
                               type="text"
                               id="place_of_birth"
                               name="place_of_birth"
                               value={formData.place_of_birth}
                               onChange={handleInputChange}
                               placeholder="e.g., London, England"
                           />
                       </div>

                       <div className="form-group">
                           <label htmlFor="embrace_date">Embrace Date</label>
                           <input
                               type="date"
                               id="embrace_date"
                               name="embrace_date"
                               value={formData.embrace_date}
                               onChange={handleInputChange}
                           />
                       </div>

                       <div className="form-group">
                           <label htmlFor="sire">Sire</label>
                           <input
                               type="text"
                               id="sire"
                               name="sire"
                               value={formData.sire}
                               onChange={handleInputChange}
                               placeholder="Name of the vampire who embraced you"
                           />
                       </div>
                   </div>

                   {/* helper text showing time period context */}
                   {timePeriodContext && (
                       <div className="time-period-helper">
                           <p className="helper-label">Historical Context:</p>
                           <p className="helper-text">{timePeriodContext}</p>
                           <p className="helper-note">Use this information to craft your character's background story</p>
                       </div>
                   )}
                </section>

                {/* Attributes Section */}
                <section className="form-section">
                    <h2>Attributes</h2>
                    {Object.entries(attributesByCategory).map(([category, attrs]) => (
                        <div key={category} className="attribute-category">
                            <h3>{category}</h3>
                            <div className="attributes-grid">
                                {attrs.map(attr => (
                                    <div key={attr.id} className="attribute-item">
                                        <label htmlFor={`attr-${attr.id}`}>
                                            {attr.name}
                                        </label>
                                        <select
                                            id={`attr-${attr.id}`}
                                            value={characterAttributes[attr.id] || 1}
                                            onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                        >
                                            {[1, 2, 3, 4, 5].map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Skills Section */}
                <section className="form-section">
                    <h2>Skills</h2>
                    {Object.entries(skillsByCategory).map(([category, skillList]) => (
                        <div key={category} className="skill-category">
                            <h3>{category}</h3>
                            <div className="skills-grid">
                                {skillList.map(skill => (
                                    <div key={skill.id} className="skill-item">
                                        <label htmlFor={`skill-${skill.id}`}>
                                            {skill.name}
                                        </label>
                                        <select
                                            id={`skill-${skill.id}`}
                                            value={characterSkills[skill.id] || 0}
                                            onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                                        >
                                            {[0, 1, 2, 3, 4, 5].map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Disciplines Section */}
                <section className="form-section">
                    <h2>Disciplines</h2>
                    <div className="disciplines-grid">
                        {disciplines.map(disc => (
                            <div key={disc.id} className="discipline-item">
                                <label htmlFor={`disc-${disc.id}`}>
                                    {disc.name}
                                </label>
                                <select
                                    id={`disc-${disc.id}`}
                                    value={characterDisciplines[disc.id] || 0}
                                    onChange={(e) => handleDisciplineChange(disc.id, e.target.value)}
                                >
                                    {[0, 1, 2, 3, 4, 5].map(val => (
                                        <option key={val} value={val}>{val}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Merits Section */}
                <section className="form-section">
                    <h2>Merits</h2>
                    <div className="merits-flaws-grid">
                        {merits.map(merit => (
                            <div key={merit.id} className="merit-flaw-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedMerits.includes(merit.id)}
                                        onChange={() => toggleMerit(merit.id)}
                                    />
                                    <span className="merit-flaw-name">{merit.name}</span>
                                    <span className="merit-flaw-cost">({merit.cost} pts)</span>
                                </label>
                                {selectedMerits.includes(merit.id) && (
                                    <p className="merit-flaw-description">{merit.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Flaws Section */}
                <section className="form-section">
                    <h2>Flaws</h2>
                    <div className="merits-flaws-grid">
                        {flaws.map(flaw => (
                            <div key={flaw.id} className="merit-flaw-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedFlaws.includes(flaw.id)}
                                        onChange={() => toggleFlaw(flaw.id)}
                                    />
                                    <span className="merit-flaw-name">{flaw.name}</span>
                                    <span className="merit-flaw-cost">({flaw.cost} pts)</span>
                                </label>
                                {selectedFlaws.includes(flaw.id) && (
                                    <p className="merit-flaw-description">{flaw.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Backgrounds Section */}
                <section className="form-section">
                    <h2>Backgrounds</h2>
                    <div className="backgrounds-grid">
                        {backgrounds.map(background => (
                            <div key={background.id} className="background-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedBackgrounds.includes(background.id)}
                                        onChange={() => toggleBackground(background.id)}
                                    />
                                    <span>{background.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Additional Information Section */}
                <section className="form-section">
                    <h2>Additional Information</h2>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="ambition">Ambition</label>
                            <textarea
                                id="ambition"
                                name="ambition"
                                value={formData.ambition}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="What does your character want to achieve?"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="desire">Desire</label>
                            <textarea
                                id="desire"
                                name="desire"
                                value={formData.desire}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="What does your character want right now?"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="chronicle_tenets">Chronicle Tenets</label>
                            <textarea
                                id="chronicle_tenets"
                                name="chronicle_tenets"
                                value={formData.chronicle_tenets}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Chronicle-specific moral guidelines"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="touchstones">Touchstones</label>
                            <textarea
                                id="touchstones"
                                name="touchstones"
                                value={formData.touchstones}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="People or places that connect you to your humanity"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows="5"
                                placeholder="Additional character notes, backstory, etc."
                            />
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create Character'}
                    </button>
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => navigate('/characters')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CharacterCreator;