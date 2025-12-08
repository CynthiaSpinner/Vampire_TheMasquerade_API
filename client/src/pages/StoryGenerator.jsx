import { useState, useEffect } from 'react';
import { characterAPI, worldAPI, storyAPI } from '../api';
import DiceRoller from '../components/DiceRoller';
import './StoryGenerator.css';

function StoryGenerator() {
    //character and world data
    const [characters, setCharacters] = useState([]);
    const [clans, setClans] = useState([]);
    const [locations, setLocations] = useState([]);
    
    //selected character and their stories
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterStories, setCharacterStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    
    //story generation form
    const [storyType, setStoryType] = useState('hook');
    const [selectedClan, setSelectedClan] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [tone, setTone] = useState('dark');
    const [customPrompt, setCustomPrompt] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    
    //generated story
    const [generatedStory, setGeneratedStory] = useState(null);
    const [sessionTitle, setSessionTitle] = useState('');
    
    //dice roll integration
    const [diceRolls, setDiceRolls] = useState([]);
    const [currentDiceRoll, setCurrentDiceRoll] = useState(null);
    
    //ui state
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedCharacter) {
            loadCharacterStories(selectedCharacter.id);
        }
    }, [selectedCharacter]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [charactersRes, clansRes, locationsRes] = await Promise.all([
                characterAPI.getAll(),
                worldAPI.getClans(),
                worldAPI.getLocations()
            ]);
            
            setCharacters(charactersRes.data);
            setClans(clansRes.data);
            setLocations(locationsRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCharacterStories = async (characterId) => {
        try {
            const response = await storyAPI.getCharacterStories(characterId);
            setCharacterStories(response.data);
        } catch (err) {
            console.error('Failed to load character stories:', err);
        }
    };

    const handleCharacterSelect = (characterId) => {
        const character = characters.find(c => c.id === parseInt(characterId));
        setSelectedCharacter(character);
        setSelectedStory(null);
        setGeneratedStory(null);
        setDiceRolls([]);
    };

    const handleGenerateStory = async () => {
        if (!selectedCharacter) {
            setError('Please select a character first');
            return;
        }

        setGenerating(true);
        setError(null);

        try {
            const options = {
                type: storyType,
                tone: tone
            };

            //add character context
            if (selectedCharacter) {
                options.characterContext = {
                    date_of_birth: selectedCharacter.date_of_birth,
                    place_of_birth: selectedCharacter.place_of_birth,
                    embrace_date: selectedCharacter.embrace_date,
                    clan: selectedCharacter.clan_name
                };
            }

            if (selectedClan) options.clan = selectedClan;
            if (selectedLocation) options.location = selectedLocation;
            if (customPrompt) options.prompt = customPrompt;
            if (timePeriod) options.timePeriod = timePeriod;

            const response = await storyAPI.generate(options);
            
            if (response.data.success) {
                setGeneratedStory(response.data.content);
            } else {
                setError(response.data.error || 'Failed to generate story');
            }
        } catch (err) {
            setError('Failed to generate story: ' + (err.response?.data?.error || err.message));
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveSession = async () => {
        if (!selectedCharacter || !generatedStory || !sessionTitle.trim()) {
            setError('Please provide a title for the story session');
            return;
        }

        try {
            const sessionData = {
                characterId: selectedCharacter.id,
                title: sessionTitle,
                storyContent: generatedStory,
                timePeriod: timePeriod || null
            };

            const response = await storyAPI.createSession(sessionData);
            setCharacterStories([response.data, ...characterStories]);
            setSelectedStory(response.data);
            setSessionTitle('');
            setGeneratedStory(null);
        } catch (err) {
            setError('Failed to save session: ' + (err.response?.data?.error || err.message));
            console.error(err);
        }
    };

    const handleLoadStory = async (storyId) => {
        try {
            const response = await storyAPI.getSession(storyId);
            setSelectedStory(response.data);
            setGeneratedStory(response.data.story_content);
            if (response.data.dice_rolls) {
                const rolls = typeof response.data.dice_rolls === 'string' 
                    ? JSON.parse(response.data.dice_rolls) 
                    : response.data.dice_rolls;
                setDiceRolls(rolls);
            }
        } catch (err) {
            setError('Failed to load story: ' + (err.response?.data?.error || err.message));
            console.error(err);
        }
    };

    const handleDiceRollComplete = (diceResult) => {
        setCurrentDiceRoll(diceResult);
        setDiceRolls([...diceRolls, diceResult]);
    };

    const handleContinueWithDice = async () => {
        if (!selectedStory || !currentDiceRoll) {
            setError('Please roll dice first');
            return;
        }

        setGenerating(true);
        setError(null);

        try {
            const diceData = {
                diceRolls: [...diceRolls, currentDiceRoll],
                previousStory: generatedStory || selectedStory.story_content,
                characterContext: selectedCharacter ? {
                    date_of_birth: selectedCharacter.date_of_birth,
                    place_of_birth: selectedCharacter.place_of_birth,
                    embrace_date: selectedCharacter.embrace_date,
                    clan: selectedCharacter.clan_name
                } : null
            };

            const response = await storyAPI.updateWithDice(selectedStory.id, diceData);
            
            //backend returns the updated story session directly
            setGeneratedStory(response.data.story_content);
            setSelectedStory(response.data);
            setCurrentDiceRoll(null);
        } catch (err) {
            setError('Failed to continue story: ' + (err.response?.data?.error || err.message));
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="story-generator">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="story-generator">
            <h1>AI Story Generator</h1>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="story-generator-content">
                {/* Character Selection */}
                <section className="story-section">
                    <h2>Select Character</h2>
                    <div className="form-group">
                        <label htmlFor="character-select">Character:</label>
                        <select
                            id="character-select"
                            value={selectedCharacter?.id || ''}
                            onChange={(e) => handleCharacterSelect(e.target.value)}
                        >
                            <option value="">Choose a character...</option>
                            {characters.map(character => (
                                <option key={character.id} value={character.id}>
                                    {character.name} ({character.clan_name || 'No Clan'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCharacter && (
                        <div className="character-info">
                            <p><strong>Clan:</strong> {selectedCharacter.clan_name || 'N/A'}</p>
                            {selectedCharacter.date_of_birth && (
                                <p><strong>Born:</strong> {new Date(selectedCharacter.date_of_birth).getFullYear()}</p>
                            )}
                            {selectedCharacter.place_of_birth && (
                                <p><strong>Place:</strong> {selectedCharacter.place_of_birth}</p>
                            )}
                        </div>
                    )}
                </section>

                {/* Story Generation Form */}
                {selectedCharacter && (
                    <section className="story-section">
                        <h2>Generate Story</h2>
                        <div className="story-form">
                            <div className="form-group">
                                <label htmlFor="story-type">Story Type:</label>
                                <select
                                    id="story-type"
                                    value={storyType}
                                    onChange={(e) => setStoryType(e.target.value)}
                                >
                                    <option value="hook">Hook</option>
                                    <option value="scene">Scene</option>
                                    <option value="continuation">Continuation</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tone">Tone:</label>
                                <select
                                    id="tone"
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                >
                                    <option value="dark">Dark</option>
                                    <option value="gothic">Gothic</option>
                                    <option value="noir">Noir</option>
                                    <option value="melancholic">Melancholic</option>
                                    <option value="intense">Intense</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="clan-select">Clan (optional):</label>
                                <select
                                    id="clan-select"
                                    value={selectedClan}
                                    onChange={(e) => setSelectedClan(e.target.value)}
                                >
                                    <option value="">Any Clan</option>
                                    {clans.map(clan => (
                                        <option key={clan.id} value={clan.name}>
                                            {clan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="location-select">Location (optional):</label>
                                <select
                                    id="location-select"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">Any Location</option>
                                    {locations.map(location => (
                                        <option key={location.id} value={location.name}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="time-period">Time Period (optional):</label>
                                <input
                                    type="text"
                                    id="time-period"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                    placeholder="e.g., 1920s, Modern Day, Victorian Era"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="custom-prompt">Custom Prompt (optional):</label>
                                <textarea
                                    id="custom-prompt"
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="Enter a custom prompt to guide the story generation..."
                                    rows="4"
                                />
                            </div>

                            <button
                                onClick={handleGenerateStory}
                                disabled={generating}
                                className="btn-generate"
                            >
                                {generating ? 'Generating...' : 'Generate Story'}
                            </button>
                        </div>
                    </section>
                )}

                {/* Generated Story Display */}
                {generatedStory && (
                    <section className="story-section">
                        <h2>Generated Story</h2>
                        <div className="story-content">
                            <p>{generatedStory}</p>
                        </div>

                        <div className="story-actions">
                            <div className="form-group">
                                <label htmlFor="session-title">Save as Session:</label>
                                <input
                                    type="text"
                                    id="session-title"
                                    value={sessionTitle}
                                    onChange={(e) => setSessionTitle(e.target.value)}
                                    placeholder="Enter session title..."
                                />
                                <button
                                    onClick={handleSaveSession}
                                    disabled={!sessionTitle.trim()}
                                    className="btn-save"
                                >
                                    Save Session
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Dice Roller */}
                {selectedCharacter && (
                    <section className="story-section">
                        <h2>Dice Roller</h2>
                        <DiceRoller onRollComplete={handleDiceRollComplete} />
                        
                        {currentDiceRoll && selectedStory && (
                            <div className="dice-continue">
                                <p className="dice-result">
                                    Roll: {currentDiceRoll.diceCount} dice, 
                                    {currentDiceRoll.successes} successes, 
                                    Difficulty: {currentDiceRoll.difficulty}
                                </p>
                                <button
                                    onClick={handleContinueWithDice}
                                    disabled={generating}
                                    className="btn-continue"
                                >
                                    {generating ? 'Continuing...' : 'Continue Story with Dice Result'}
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* Character Stories List */}
                {selectedCharacter && characterStories.length > 0 && (
                    <section className="story-section">
                        <h2>Story Sessions</h2>
                        <div className="stories-list">
                            {characterStories.map(story => (
                                <div
                                    key={story.id}
                                    className={`story-item ${selectedStory?.id === story.id ? 'active' : ''}`}
                                    onClick={() => handleLoadStory(story.id)}
                                >
                                    <h3>{story.title}</h3>
                                    {story.time_period && (
                                        <p className="story-meta">Time Period: {story.time_period}</p>
                                    )}
                                    <p className="story-date">
                                        {new Date(story.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default StoryGenerator;

