import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { characterAPI, worldAPI } from '../api';
import { getTimePeriodContext } from '../../utils/characterhelpers';
import './CharacterCreator.css';

function CharacterEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    //form state
    const [formData, setFormData] = useState({
        name: '',
        player_name: '',
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
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            //load world data and character data in parallel
            const [
                clansRes,
                attributesRes,
                skillsRes,
                disciplinesRes,
                meritsRes,
                flawsRes,
                backgroundsRes,
                sectsRes,
                locationsRes,
                characterRes
            ] = await Promise.all([
                worldAPI.getClans(),
                worldAPI.getAttributes(),
                worldAPI.getSkills(),
                worldAPI.getDisciplines(),
                worldAPI.getMerits(),
                worldAPI.getFlaws(),
                worldAPI.getBackgrounds(),
                worldAPI.getSects(),
                worldAPI.getLocations(),
                characterAPI.getById(id)
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

            const character = characterRes.data;

            //populate form data
            setFormData({
                name: character.name || '',
                player_name: character.player_name || '',
                clan_id: character.clan_id || '',
                generation: character.generation || 13,
                sect: character.sect || '',
                location: character.location || '',
                concept: character.concept || '',
                predator_type: character.predator_type || '',
                ambition: character.ambition || '',
                desire: character.desire || '',
                chronicle_tenets: character.chronicle_tenets || '',
                touchstones: character.touchstones || '',
                notes: character.notes || '',
                date_of_birth: character.date_of_birth || '',
                place_of_birth: character.place_of_birth || '',
                embrace_date: character.embrace_date || '',
                sire: character.sire || '',
                apparent_age: character.apparent_age || '',
                true_age: character.true_age || ''
            });

            //populate attributes
            const attrObj = {};
            attributesRes.data.forEach(attr => {
                if (attr.category === 'Physical') {
                    if (attr.name === 'Strength') attrObj[attr.id] = character.strength || 1;
                    else if (attr.name === 'Dexterity') attrObj[attr.id] = character.dexterity || 1;
                    else if (attr.name === 'Stamina') attrObj[attr.id] = character.stamina || 1;
                    else attrObj[attr.id] = 1;
                } else if (attr.category === 'Social') {
                    if (attr.name === 'Charisma') attrObj[attr.id] = character.charisma || 1;
                    else if (attr.name === 'Manipulation') attrObj[attr.id] = character.manipulation || 1;
                    else if (attr.name === 'Composure') attrObj[attr.id] = character.composure || 1;
                    else attrObj[attr.id] = 1;
                } else if (attr.category === 'Mental') {
                    if (attr.name === 'Intelligence') attrObj[attr.id] = character.intelligence || 1;
                    else if (attr.name === 'Wits') attrObj[attr.id] = character.wits || 1;
                    else if (attr.name === 'Resolve') attrObj[attr.id] = character.resolve || 1;
                    else attrObj[attr.id] = 1;
                } else {
                    attrObj[attr.id] = 1;
                }
            });
            setCharacterAttributes(attrObj);

            //populate skills
            const skillObj = {};
            skillsRes.data.forEach(skill => {
                skillObj[skill.id] = 0;
            });
            if (character.skills) {
                character.skills.forEach(skill => {
                    skillObj[skill.id] = skill.rating || 0;
                });
            }
            setCharacterSkills(skillObj);

            //populate disciplines
            const discObj = {};
            disciplinesRes.data.forEach(disc => {
                discObj[disc.id] = 0;
            });
            if (character.disciplines) {
                character.disciplines.forEach(disc => {
                    discObj[disc.id] = disc.rating || 0;
                });
            }
            setCharacterDisciplines(discObj);

            //populate merits
            if (character.merits) {
                setSelectedMerits(character.merits.map(m => m.id));
            }

            //populate flaws
            if (character.flaws) {
                setSelectedFlaws(character.flaws.map(f => f.id));
            }

            //populate backgrounds
            if (character.backgrounds) {
                setSelectedBackgrounds(character.backgrounds.map(bg => bg.id));
            }

        } catch (err) {
            setError('Failed to load character data: ' + (err.response?.data?.error || err.message));
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
            //map attributes to the correct fields for update
            const attrMap = {};
            Object.entries(characterAttributes).forEach(([attrId, rating]) => {
                const attr = attributes.find(a => a.id === parseInt(attrId));
                if (attr) {
                    if (attr.name === 'Strength') attrMap.strength = rating;
                    else if (attr.name === 'Dexterity') attrMap.dexterity = rating;
                    else if (attr.name === 'Stamina') attrMap.stamina = rating;
                    else if (attr.name === 'Charisma') attrMap.charisma = rating;
                    else if (attr.name === 'Manipulation') attrMap.manipulation = rating;
                    else if (attr.name === 'Composure') attrMap.composure = rating;
                    else if (attr.name === 'Intelligence') attrMap.intelligence = rating;
                    else if (attr.name === 'Wits') attrMap.wits = rating;
                    else if (attr.name === 'Resolve') attrMap.resolve = rating;
                }
            });

            const characterData = {
                ...formData,
                ...attrMap,
                health_current: formData.health_current || characterAttributes.health_current || 3,
                willpower_current: formData.willpower_current || characterAttributes.willpower_current || 1
            };

            await characterAPI.update(id, characterData);
            navigate(`/characters/${id}`);
        } catch (err) {
            setError('Failed to update character: ' + (err.response?.data?.error || err.message));
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="character-creator">
                <div className="loading">Loading character...</div>
            </div>
        );
    }

    const timePeriodContext = getTimePeriodContext(formData.date_of_birth, formData.place_of_birth);

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

    return (
        <div className="character-creator">
            <div className="creator-header">
                <h1>Edit Character</h1>
                <button onClick={() => navigate(`/characters/${id}`)} className="btn-cancel">
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
                            <label htmlFor="player_name">Player Name</label>
                            <input
                                type="text"
                                id="player_name"
                                name="player_name"
                                value={formData.player_name}
                                onChange={handleInputChange}
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
                                        <label htmlFor={`attr-${attr.id}`}>{attr.name}</label>
                                        <input
                                            type="number"
                                            id={`attr-${attr.id}`}
                                            min="1"
                                            max="5"
                                            value={characterAttributes[attr.id] || 1}
                                            onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Skills Section */}
                <section className="form-section">
                    <h2>Skills</h2>
                    {Object.entries(skillsByCategory).map(([category, skillsList]) => (
                        <div key={category} className="skill-category">
                            <h3>{category}</h3>
                            <div className="skills-grid">
                                {skillsList.map(skill => (
                                    <div key={skill.id} className="skill-item">
                                        <label htmlFor={`skill-${skill.id}`}>{skill.name}</label>
                                        <input
                                            type="number"
                                            id={`skill-${skill.id}`}
                                            min="0"
                                            max="5"
                                            value={characterSkills[skill.id] || 0}
                                            onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                                        />
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
                                <h4>{disc.name}</h4>
                                <p>{disc.description}</p>
                                <label htmlFor={`disc-${disc.id}`}>Level:</label>
                                <input
                                    type="number"
                                    id={`disc-${disc.id}`}
                                    min="0"
                                    max="5"
                                    value={characterDisciplines[disc.id] || 0}
                                    onChange={(e) => handleDisciplineChange(disc.id, e.target.value)}
                                />
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
                                <div className="merit-flaw-header">
                                    <input
                                        type="checkbox"
                                        id={`merit-${merit.id}`}
                                        checked={selectedMerits.includes(merit.id)}
                                        onChange={() => toggleMerit(merit.id)}
                                    />
                                    <span className="merit-flaw-name">{merit.name}</span>
                                    <span className="merit-flaw-cost">({merit.cost} pts)</span>
                                </div>
                                <p className="merit-flaw-description">{merit.description}</p>
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
                                <div className="merit-flaw-header">
                                    <input
                                        type="checkbox"
                                        id={`flaw-${flaw.id}`}
                                        checked={selectedFlaws.includes(flaw.id)}
                                        onChange={() => toggleFlaw(flaw.id)}
                                    />
                                    <span className="merit-flaw-name">{flaw.name}</span>
                                    <span className="merit-flaw-cost">({flaw.cost} pts)</span>
                                </div>
                                <p className="merit-flaw-description">{flaw.description}</p>
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
                                <label htmlFor={`bg-${background.id}`}>{background.name}</label>
                                <input
                                    type="number"
                                    id={`bg-${background.id}`}
                                    min="0"
                                    max={background.max_rating || 5}
                                    value={selectedBackgrounds.includes(background.id) ? 1 : 0}
                                    onChange={(e) => {
                                        if (parseInt(e.target.value) > 0) {
                                            toggleBackground(background.id);
                                        } else {
                                            setSelectedBackgrounds(prev => prev.filter(id => id !== background.id));
                                        }
                                    }}
                                />
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
                                placeholder="The moral principles of your chronicle"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="touchstones">Touchstones</label>
                            <textarea
                                id="touchstones"
                                name="touchstones"
                                value={formData.touchstones}
                                onChange={handleInputChange}
                                placeholder="People or things that connect you to your humanity"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Additional notes about your character"
                            />
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Character'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/characters/${id}`)}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CharacterEdit;

