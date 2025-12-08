import { useState } from 'react';
import './CharacterCreationGuide.css';

function CharacterCreationGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="creation-guide">
            <button 
                className="guide-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '▼' : '▶'} Character Creation Rules
            </button>
            
            {isOpen && (
                <div className="guide-content">
                    <h3>Vampire: The Masquerade V5 Character Creation</h3>
                    
                    <div className="guide-section">
                        <h4>Attributes</h4>
                        <ul>
                            <li>All attributes start at <strong>1</strong></li>
                            <li>You have <strong>7 points</strong> to distribute</li>
                            <li>Each point raises an attribute by 1 (max 5)</li>
                            <li>At least one attribute in your <strong>favored category</strong> must be <strong>2 or higher</strong></li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h4>Skills</h4>
                        <ul>
                            <li>All skills start at <strong>0</strong></li>
                            <li>You have <strong>11 points</strong> to distribute</li>
                            <li>Each point raises a skill by 1 (max 5)</li>
                            <li>At least one skill in your <strong>favored category</strong> must be <strong>1 or higher</strong></li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h4>Disciplines</h4>
                        <ul>
                            <li>You start with <strong>1 dot</strong> in each of your clan's 3 disciplines (free)</li>
                            <li>Additional discipline dots cost experience points (not during creation)</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h4>Merits & Flaws</h4>
                        <ul>
                            <li>You start with <strong>7 points</strong> for merits</li>
                            <li>You can take <strong>flaws</strong> to gain additional merit points</li>
                            <li>Maximum <strong>7 points</strong> can be gained from flaws</li>
                            <li>Total merit points = 7 base + points from flaws (max 14 total)</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h4>Backgrounds</h4>
                        <ul>
                            <li>Backgrounds are selected but don't cost creation points</li>
                            <li>They represent your character's resources, connections, and history</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h4>Tips</h4>
                        <ul>
                            <li>Focus on your character's concept and favored category</li>
                            <li>Balance your attributes - don't neglect any category completely</li>
                            <li>Skills should reflect your character's background and profession</li>
                            <li>Merits and flaws add depth and mechanical benefits/drawbacks</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CharacterCreationGuide;

