import { getPointsSummary } from '../utils/pointsCalculator';
import './PointsDisplay.css';

function PointsDisplay({ characterData, attributesData, skillsData, meritsData, flawsData }) {
    if (!characterData || !attributesData || !skillsData || !meritsData || !flawsData) {
        return null;
    }

    const summary = getPointsSummary(characterData, attributesData, skillsData, meritsData, flawsData);

    const getStatusClass = (used, available) => {
        if (used > available) return 'over-limit';
        if (used === available) return 'at-limit';
        if (used < available * 0.8) return 'good';
        return 'warning';
    };

    return (
        <div className="points-display">
            <h3>Character Creation Points</h3>
            <div className="points-grid">
                {/* Attributes */}
                <div className="points-section">
                    <div className="points-header">
                        <span className="points-label">Attributes</span>
                        <span className={`points-value ${getStatusClass(summary.attributes.used, summary.attributes.available)}`}>
                            {summary.attributes.used} / {summary.attributes.available}
                        </span>
                    </div>
                    <div className="points-bar">
                        <div 
                            className={`points-fill ${getStatusClass(summary.attributes.used, summary.attributes.available)}`}
                            style={{ width: `${Math.min(100, (summary.attributes.used / summary.attributes.available) * 100)}%` }}
                        />
                    </div>
                    <div className="points-remaining">
                        {summary.attributes.remaining >= 0 
                            ? `${summary.attributes.remaining} remaining`
                            : `${Math.abs(summary.attributes.remaining)} over limit`
                        }
                    </div>
                    <div className="points-note">
                        Start with 1 in each. Distribute {summary.attributes.available} points.
                    </div>
                </div>

                {/* Skills */}
                <div className="points-section">
                    <div className="points-header">
                        <span className="points-label">Skills</span>
                        <span className={`points-value ${getStatusClass(summary.skills.used, summary.skills.available)}`}>
                            {summary.skills.used} / {summary.skills.available}
                        </span>
                    </div>
                    <div className="points-bar">
                        <div 
                            className={`points-fill ${getStatusClass(summary.skills.used, summary.skills.available)}`}
                            style={{ width: `${Math.min(100, (summary.skills.used / summary.skills.available) * 100)}%` }}
                        />
                    </div>
                    <div className="points-remaining">
                        {summary.skills.remaining >= 0 
                            ? `${summary.skills.remaining} remaining`
                            : `${Math.abs(summary.skills.remaining)} over limit`
                        }
                    </div>
                    <div className="points-note">
                        Start with 0 in each. Distribute {summary.skills.available} points.
                    </div>
                </div>

                {/* Merits */}
                <div className="points-section">
                    <div className="points-header">
                        <span className="points-label">Merits</span>
                        <span className={`points-value ${getStatusClass(summary.merits.used, summary.merits.available)}`}>
                            {summary.merits.used} / {summary.merits.available}
                        </span>
                    </div>
                    <div className="points-bar">
                        <div 
                            className={`points-fill ${getStatusClass(summary.merits.used, summary.merits.available)}`}
                            style={{ width: `${Math.min(100, (summary.merits.available > 0 ? (summary.merits.used / summary.merits.available) * 100 : 0))}%` }}
                        />
                    </div>
                    <div className="points-remaining">
                        {summary.merits.remaining >= 0 
                            ? `${summary.merits.remaining} remaining`
                            : `${Math.abs(summary.merits.remaining)} over limit`
                        }
                    </div>
                    {summary.merits.fromFlaws > 0 && (
                        <div className="points-note">
                            {summary.merits.available - summary.merits.fromFlaws} base + {summary.merits.fromFlaws} from flaws
                        </div>
                    )}
                    {summary.merits.fromFlaws === 0 && (
                        <div className="points-note">
                            {summary.merits.available} base points. Take flaws to gain more.
                        </div>
                    )}
                </div>

                {/* Flaws */}
                <div className="points-section">
                    <div className="points-header">
                        <span className="points-label">Flaws</span>
                        <span className={`points-value ${summary.flaws.pointsGained > 0 ? 'good' : ''}`}>
                            +{summary.flaws.pointsGained} / +{summary.flaws.maxGain}
                        </span>
                    </div>
                    <div className="points-bar">
                        <div 
                            className="points-fill good"
                            style={{ width: `${(summary.flaws.pointsGained / summary.flaws.maxGain) * 100}%` }}
                        />
                    </div>
                    <div className="points-remaining">
                        {summary.flaws.maxGain - summary.flaws.pointsGained} more available
                    </div>
                    <div className="points-note">
                        Flaws give extra merit points (max {summary.flaws.maxGain}).
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PointsDisplay;

