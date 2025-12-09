import { getPointsSummary } from '../utils/pointsCalculator';
import './SectionPointsDisplay.css';

function SectionPointsDisplay({ 
    sectionType, 
    characterData, 
    attributesData, 
    skillsData, 
    meritsData, 
    flawsData 
}) {
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

    let sectionData = null;
    let label = '';
    let remaining = 0;
    let used = 0;
    let available = 0;

    switch (sectionType) {
        case 'attributes':
            sectionData = summary.attributes;
            label = 'Attributes';
            used = sectionData.used;
            available = sectionData.available;
            remaining = sectionData.remaining;
            break;
        case 'skills':
            sectionData = summary.skills;
            label = 'Skills';
            used = sectionData.used;
            available = sectionData.available;
            remaining = sectionData.remaining;
            break;
        case 'merits':
            sectionData = summary.merits;
            label = 'Merits';
            used = sectionData.used;
            available = sectionData.available;
            remaining = sectionData.remaining;
            break;
        case 'flaws':
            sectionData = summary.flaws;
            label = 'Flaws';
            used = sectionData.pointsGained;
            available = sectionData.maxGain;
            remaining = available - used;
            break;
        case 'backgrounds':
            sectionData = summary.backgrounds;
            label = 'Backgrounds';
            used = sectionData?.used || 0;
            available = sectionData?.available || 3;
            remaining = sectionData?.remaining || 3;
            break;
        default:
            return null;
    }

    if (sectionType === 'flaws') {
        return (
            <div className="section-points-display">
                <div className="section-points-header">
                    <span className="section-points-label">{label}:</span>
                    <span className={`section-points-value good`}>
                        +{used} / +{available}
                    </span>
                </div>
                <div className="section-points-remaining">
                    {remaining > 0 ? `${remaining} more available` : 'At maximum'}
                </div>
            </div>
        );
    }

    return (
        <div className="section-points-display">
            <div className="section-points-header">
                <span className="section-points-label">{label}:</span>
                <span className={`section-points-value ${getStatusClass(used, available)}`}>
                    {used} / {available}
                </span>
            </div>
            <div className="section-points-remaining">
                {remaining >= 0 
                    ? `${remaining} remaining`
                    : `${Math.abs(remaining)} over limit`
                }
            </div>
        </div>
    );
}

export default SectionPointsDisplay;

