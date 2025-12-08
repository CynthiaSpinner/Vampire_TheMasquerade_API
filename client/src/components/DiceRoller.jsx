import { useState } from 'react';
import './DiceRoller.css';

function DiceRoller({ onRollComplete }) {
    const [diceCount, setDiceCount] = useState(3);
    const [difficulty, setDifficulty] = useState(2);
    const [rolling, setRolling] = useState(false);
    const [lastRoll, setLastRoll] = useState(null);

    const rollDice = () => {
        if (diceCount < 1 || difficulty < 1) {
            alert('Dice count and difficulty must be at least 1');
            return;
        }

        setRolling(true);
        
        //simulate dice rolling with a short delay
        setTimeout(() => {
            const results = [];
            let successes = 0;
            
            //roll each die (d10 in VtM)
            for (let i = 0; i < diceCount; i++) {
                const roll = Math.floor(Math.random() * 10) + 1;
                results.push(roll);
                
                //in VtM, 6+ is a success, 10 is a critical (2 successes)
                if (roll >= 6) {
                    successes++;
                    if (roll === 10) {
                        successes++; //critical success
                    }
                }
            }
            
            const rollResult = {
                diceCount: diceCount,
                difficulty: difficulty,
                successes: successes,
                results: results,
                timestamp: new Date().toISOString()
            };
            
            setLastRoll(rollResult);
            setRolling(false);
            
            //call callback if provided
            if (onRollComplete) {
                onRollComplete(rollResult);
            }
        }, 500);
    };

    return (
        <div className="dice-roller">
            <div className="dice-controls">
                <div className="dice-control-group">
                    <label htmlFor="dice-count">Number of Dice:</label>
                    <input
                        type="number"
                        id="dice-count"
                        min="1"
                        max="20"
                        value={diceCount}
                        onChange={(e) => setDiceCount(parseInt(e.target.value) || 1)}
                    />
                </div>

                <div className="dice-control-group">
                    <label htmlFor="difficulty">Difficulty:</label>
                    <input
                        type="number"
                        id="difficulty"
                        min="1"
                        max="10"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value) || 1)}
                    />
                </div>

                <button
                    onClick={rollDice}
                    disabled={rolling}
                    className="btn-roll"
                >
                    {rolling ? 'Rolling...' : 'Roll Dice'}
                </button>
            </div>

            {lastRoll && (
                <div className="dice-result">
                    <h3>Last Roll Result</h3>
                    <div className="result-details">
                        <p><strong>Dice Rolled:</strong> {lastRoll.diceCount}</p>
                        <p><strong>Difficulty:</strong> {lastRoll.difficulty}</p>
                        <p><strong>Successes:</strong> 
                            <span className={lastRoll.successes >= lastRoll.difficulty ? 'success' : 'failure'}>
                                {lastRoll.successes}
                            </span>
                        </p>
                        <p><strong>Result:</strong> 
                            <span className={lastRoll.successes >= lastRoll.difficulty ? 'success' : 'failure'}>
                                {lastRoll.successes >= lastRoll.difficulty ? 'Success!' : 'Failure'}
                            </span>
                        </p>
                        <div className="dice-values">
                            <strong>Individual Rolls:</strong>
                            <div className="dice-list">
                                {lastRoll.results.map((roll, idx) => (
                                    <span
                                        key={idx}
                                        className={`dice-value ${roll === 10 ? 'critical' : roll >= 6 ? 'success' : 'failure'}`}
                                    >
                                        {roll}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DiceRoller;

