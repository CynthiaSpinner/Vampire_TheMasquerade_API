import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { characterAPI, worldAPI } from '../../api';
import { getTimePeriodContext } from '../../utils/characterhelpers';
import { validateCharacterCreation } from '../../utils/pointsCalculator';
import PointsDisplay from '../PointsDisplay';
import CharacterCreationGuide from '../CharacterCreationGuide';
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
    const [predatorTypes, setPredatorTypes] = useState([]);

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
                locationsRes,
                predatorTypesRes
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
                worldAPI.getPredatorTypes()
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
            setPredatorTypes(predatorTypesRes.data);

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
        
        //if clan changed, apply clan disciplines (free dots)
        if (name === 'clan_id' && value) {
            const selectedClan = clans.find(c => c.id === parseInt(value));
            if (selectedClan && selectedClan.clan_disciplines) {
                const clanDiscIds = JSON.parse(selectedClan.clan_disciplines);
                const discObj = { ...characterDisciplines };
                //set clan disciplines to at least 1 (free)
                clanDiscIds.forEach(discId => {
                    discObj[discId] = Math.max(1, discObj[discId] || 1);
                });
                setCharacterDisciplines(discObj);
            }
        }
    };
    
    const handlePredatorTypeChange = (e) => {
        const predatorTypeId = e.target.value;
        const previousPredatorId = formData.predator_type;
        
        //remove previous predator bonuses if changing
        if (previousPredatorId) {
            const previousPredator = predatorTypes.find(pt => pt.id === parseInt(previousPredatorId));
            if (previousPredator) {
                //remove free discipline dot
                if (previousPredator.free_discipline_id) {
                    setCharacterDisciplines(prev => {
                        const newDiscs = { ...prev };
                        const current = newDiscs[previousPredator.free_discipline_id] || 0;
                        //only remove if it was the free dot (don't go below clan discipline minimum)
                        const clanDiscIds = formData.clan_id ? 
                            JSON.parse(clans.find(c => c.id === parseInt(formData.clan_id))?.clan_disciplines || '[]') : [];
                        const minValue = clanDiscIds.includes(previousPredator.free_discipline_id) ? 1 : 0;
                        newDiscs[previousPredator.free_discipline_id] = Math.max(minValue, current - 1);
                        return newDiscs;
                    });
                }
                
                //remove free skill dot
                if (previousPredator.free_skill_id) {
                    setCharacterSkills(prev => {
                        const newSkills = { ...prev };
                        const current = newSkills[previousPredator.free_skill_id] || 0;
                        newSkills[previousPredator.free_skill_id] = Math.max(0, current - 1);
                        return newSkills;
                    });
                }
                
                //remove free background
                if (previousPredator.free_background_id) {
                    const prevBgId = parseInt(previousPredator.free_background_id);
                    setSelectedBackgrounds(prev => prev.filter(id => parseInt(id) !== prevBgId));
                }
            }
        }
        
        setFormData(prev => ({
            ...prev,
            predator_type: predatorTypeId
        }));
        
        //apply new predator bonuses
        if (predatorTypeId) {
            const selectedPredator = predatorTypes.find(pt => pt.id === parseInt(predatorTypeId));
            if (selectedPredator) {
                //apply free discipline dot
                if (selectedPredator.free_discipline_id) {
                    setCharacterDisciplines(prev => ({
                        ...prev,
                        [selectedPredator.free_discipline_id]: (prev[selectedPredator.free_discipline_id] || 0) + 1
                    }));
                }
                
                //apply free skill dot
                if (selectedPredator.free_skill_id) {
                    setCharacterSkills(prev => ({
                        ...prev,
                        [selectedPredator.free_skill_id]: (prev[selectedPredator.free_skill_id] || 0) + 1
                    }));
                }
                
                //apply free background
                if (selectedPredator.free_background_id) {
                    const bgId = parseInt(selectedPredator.free_background_id);
                    //ensure consistent number type for comparison
                    if (!selectedBackgrounds.some(id => parseInt(id) === bgId)) {
                        setSelectedBackgrounds(prev => [...prev, bgId]);
                    }
                }
            }
        }
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

        //validate character creation points
        const selectedClan = clans.find(c => c.id === parseInt(formData.clan_id));
        const validation = validateCharacterCreation(
            {
                attributes: characterAttributes,
                skills: characterSkills,
                selectedMerits,
                selectedFlaws,
                clan: selectedClan
            },
            attributes,
            skills,
            merits,
            flaws
        );

        if (!validation.valid) {
            setError('Character creation errors:\n' + validation.errors.join('\n') + 
                (validation.warnings.length > 0 ? '\n\nWarnings:\n' + validation.warnings.join('\n') : ''));
            setSubmitting(false);
            return;
        }

        if (validation.warnings.length > 0) {
            const proceed = window.confirm(
                'Character creation warnings:\n' + validation.warnings.join('\n') + 
                '\n\nDo you want to proceed anyway?'
            );
            if (!proceed) {
                setSubmitting(false);
                return;
            }
        }

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
                backgrounds: selectedBackgrounds.map(id => {
                    const bgId = parseInt(id);
                    //get the predator type's free background rating if this background came from a predator type
                    const selectedPredator = predatorTypes.find(pt => 
                        pt.id === parseInt(formData.predator_type) && 
                        pt.free_background_id === bgId
                    );
                    const rating = selectedPredator ? (selectedPredator.free_background_rating || 1) : 1;
                    return { background_id: bgId, rating: rating };
                })
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
                    {error.split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                </div>
            )}

            {/* Character Creation Guide */}
            <CharacterCreationGuide />

            {/* Points Display */}
            <PointsDisplay
                characterData={{
                    attributes: characterAttributes,
                    skills: characterSkills,
                    selectedMerits,
                    selectedFlaws,
                    clan: clans.find(c => c.id === parseInt(formData.clan_id))
                }}
                attributesData={attributes}
                skillsData={skills}
                meritsData={merits}
                flawsData={flaws}
            />

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
                            {formData.clan_id && (() => {
                                const selectedClan = clans.find(c => c.id === parseInt(formData.clan_id));
                                if (selectedClan) {
                                    return (
                                        <div className="clan-info-box">
                                            <p className="clan-description">{selectedClan.description}</p>
                                            <div className="clan-bane">
                                                <strong>Clan Bane:</strong> {selectedClan.bane}
                                            </div>
                                            <div className="clan-compulsion">
                                                <strong>Compulsion:</strong> {selectedClan.compulsion}
                                            </div>
                                            <div className="clan-disciplines">
                                                <strong>Clan Disciplines:</strong> You start with 1 dot in each (free)
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
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
                            <small className="form-helper-text">
                                Generation is determined by your sire's generation (you are one generation higher). 
                                Age does not directly affect generation. Starting characters are typically 13th generation.
                            </small>
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
                            <small className="form-helper-text">
                                Your character's political affiliation. Currently informational only - does not affect point allocation.
                            </small>
                        </div>

                        {/* Sect Info Display */}
                        {formData.sect && (() => {
                            const selectedSect = sects.find(s => s.name === formData.sect);
                            if (selectedSect) {
                                return (
                                    <div className="sect-info-display">
                                        <h3>{selectedSect.name}</h3>
                                        <p><strong>Description:</strong> {selectedSect.description}</p>
                                        <p><strong>Philosophy:</strong> {selectedSect.philosophy}</p>
                                        <p><strong>Structure:</strong> {selectedSect.structure}</p>
                                        {selectedSect.common_clans && (
                                            <p><strong>Common Clans:</strong> {
                                                JSON.parse(selectedSect.common_clans)
                                                    .map(id => clans.find(c => c.id === id)?.name)
                                                    .filter(Boolean)
                                                    .join(', ') || 'Various'
                                            }</p>
                                        )}
                                        <p className="sect-note">
                                            <em>Note: In VtM V5, sects may provide free background dots (e.g., Camarilla often starts with Status 1). 
                                            This feature is not yet implemented but may be added in the future.</em>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        })()}

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
                            <select
                                id="predator_type"
                                name="predator_type"
                                value={formData.predator_type}
                                onChange={handlePredatorTypeChange}
                            >
                                <option value="">Select a Predator Type</option>
                                {predatorTypes.map(pt => (
                                    <option key={pt.id} value={pt.id}>
                                        {pt.name}
                                    </option>
                                ))}
                            </select>
                            {formData.predator_type && (() => {
                                const selectedPredator = predatorTypes.find(pt => pt.id === parseInt(formData.predator_type));
                                if (selectedPredator) {
                                    return (
                                        <div className="predator-bonus-info">
                                            <p className="bonus-label">Free Bonuses:</p>
                                            <ul className="bonus-list">
                                                {selectedPredator.free_discipline_name && (
                                                    <li>+1 {selectedPredator.free_discipline_name} (Discipline)</li>
                                                )}
                                                {selectedPredator.free_skill_name && (
                                                    <li>+1 {selectedPredator.free_skill_name} (Skill)</li>
                                                )}
                                                {selectedPredator.free_background_name && (
                                                    <li>+{selectedPredator.free_background_rating || 1} {selectedPredator.free_background_name} (Background)</li>
                                                )}
                                            </ul>
                                            {selectedPredator.restrictions && (
                                                <p className="restriction-note">Restriction: {selectedPredator.restrictions}</p>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })()}
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
                                        checked={selectedBackgrounds.some(id => parseInt(id) === background.id)}
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