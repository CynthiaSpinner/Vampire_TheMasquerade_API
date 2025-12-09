//vampire: the masquerade v5 character creation points calculator
//based on official v5 rules

//starting values
const STARTING_ATTRIBUTE_VALUE = 1;
const STARTING_SKILL_VALUE = 0;
const STARTING_DISCIPLINE_VALUE = 1; //one dot in each clan discipline (free)

//point pools
const ATTRIBUTE_POINTS = 7; //distribute among all attributes
const SKILL_POINTS = 11; //distribute among all skills
const MERIT_POINTS = 7; //starting points for merits
const MAX_FLAW_POINTS = 7; //maximum points you can gain from flaws
const BACKGROUND_POINTS = 3; //free background dots to distribute

//calculate attribute points used
//in v5, attributes start at 1, and you have 7 points to distribute
//each point raises an attribute by 1
export const calculateAttributePointsUsed = (attributes, favoredCategory) => {
    let pointsUsed = 0;
    
    Object.entries(attributes).forEach(([attrId, rating]) => {
        const value = parseInt(rating) || STARTING_ATTRIBUTE_VALUE;
        //each point above the starting value costs 1 point
        //so 2 costs 1 point, 3 costs 2 points, 4 costs 3 points, 5 costs 4 points
        if (value > STARTING_ATTRIBUTE_VALUE) {
            pointsUsed += (value - STARTING_ATTRIBUTE_VALUE);
        }
    });
    
    return pointsUsed;
};

//calculate skill points used
//in v5, skills start at 0, and you spend points equal to the rating
//free skill dots from predator types don't count
export const calculateSkillPointsUsed = (skills, predatorType = null) => {
    let pointsUsed = 0;
    
    //get free skill ID from predator type if it exists
    const freeSkillId = predatorType && predatorType.free_skill_id 
        ? parseInt(predatorType.free_skill_id) 
        : null;
    
    Object.entries(skills).forEach(([skillId, rating]) => {
        const id = parseInt(skillId);
        const value = parseInt(rating) || STARTING_SKILL_VALUE;
        
        //if this is the free skill from predator type, subtract 1 from the cost
        //(the free dot doesn't count against points)
        if (freeSkillId && id === freeSkillId && value > 0) {
            //only subtract 1 (the free dot), any additional dots cost points
            pointsUsed += Math.max(0, value - 1);
        } else {
            //cost is the rating value (1 costs 1, 2 costs 2, etc.)
            pointsUsed += value;
        }
    });
    
    return pointsUsed;
};

//calculate merit points used
export const calculateMeritPointsUsed = (selectedMerits, meritsData) => {
    let pointsUsed = 0;
    
    selectedMerits.forEach(meritId => {
        const merit = meritsData.find(m => m.id === parseInt(meritId));
        if (merit) {
            pointsUsed += merit.cost || 1;
        }
    });
    
    return pointsUsed;
};

//calculate flaw points gained
//flaws have negative costs in database (e.g., -1, -2) but give positive merit points
export const calculateFlawPointsGained = (selectedFlaws, flawsData) => {
    let pointsGained = 0;
    
    selectedFlaws.forEach(flawId => {
        const flaw = flawsData.find(f => f.id === parseInt(flawId));
        if (flaw) {
            //flaws give points - use absolute value since costs are stored as negative
            const flawValue = Math.abs(flaw.cost || 1);
            pointsGained += flawValue;
        }
    });
    
    //cap at maximum
    return Math.min(pointsGained, MAX_FLAW_POINTS);
};

//calculate background points used
//in v5, you get 3 free background dots to distribute
//free backgrounds from predator type or sect don't count
export const calculateBackgroundPointsUsed = (backgrounds, predatorType, sect) => {
    let pointsUsed = 0;
    
    //get free background IDs
    const freeBackgroundIds = [];
    if (predatorType && predatorType.free_background_id) {
        freeBackgroundIds.push(parseInt(predatorType.free_background_id));
    }
    if (sect && sect.free_background_id) {
        freeBackgroundIds.push(parseInt(sect.free_background_id));
    }
    
    //sum up all background ratings, excluding free ones
    Object.entries(backgrounds).forEach(([bgId, rating]) => {
        const id = parseInt(bgId);
        const value = parseInt(rating) || 0;
        //only count if not a free background
        if (!freeBackgroundIds.includes(id)) {
            pointsUsed += value;
        }
    });
    
    return pointsUsed;
};

//calculate total available merit points (base + flaws)
export const calculateTotalMeritPoints = (selectedFlaws, flawsData) => {
    const flawPoints = calculateFlawPointsGained(selectedFlaws, flawsData);
    return MERIT_POINTS + flawPoints;
};

//check if character creation is valid
export const validateCharacterCreation = (characterData, attributesData, skillsData, meritsData, flawsData) => {
    const errors = [];
    const warnings = [];
    
    const { attributes, skills, selectedMerits, selectedFlaws, clan_id } = characterData;
    
    //get clan info for favored category
    const clan = characterData.clan || null;
    const favoredCategory = clan?.favored_attributes || null;
    const predatorType = characterData.predatorType || null;
    
    //check attributes
    const attrPointsUsed = calculateAttributePointsUsed(attributes, favoredCategory);
    if (attrPointsUsed > ATTRIBUTE_POINTS) {
        errors.push(`Attributes: Used ${attrPointsUsed} points, but only ${ATTRIBUTE_POINTS} available`);
    }
    
    //check if favored category has at least one attribute at 2+
    if (favoredCategory && favoredCategory !== 'Any') {
        let hasFavoredAttr = false;
        Object.entries(attributes).forEach(([attrId, rating]) => {
            const attr = attributesData.find(a => a.id === parseInt(attrId));
            if (attr && attr.category === favoredCategory) {
                const value = parseInt(rating) || STARTING_ATTRIBUTE_VALUE;
                if (value >= 2) {
                    hasFavoredAttr = true;
                }
            }
        });
        if (!hasFavoredAttr) {
            warnings.push(`At least one ${favoredCategory} attribute must be 2 or higher`);
        }
    }
    
    //check skills (exclude free skill dot from predator type)
    const skillPointsUsed = calculateSkillPointsUsed(skills, predatorType);
    if (skillPointsUsed > SKILL_POINTS) {
        errors.push(`Skills: Used ${skillPointsUsed} points, but only ${SKILL_POINTS} available`);
    }
    
    //check if favored category has at least one skill at 1+
    if (favoredCategory && favoredCategory !== 'Any') {
        let hasFavoredSkill = false;
        Object.entries(skills).forEach(([skillId, rating]) => {
            const skill = skillsData.find(s => s.id === parseInt(skillId));
            if (skill && skill.category === favoredCategory) {
                const value = parseInt(rating) || STARTING_SKILL_VALUE;
                if (value >= 1) {
                    hasFavoredSkill = true;
                }
            }
        });
        if (!hasFavoredSkill) {
            warnings.push(`At least one ${favoredCategory} skill must be 1 or higher`);
        }
    }
    
    //check merits
    const meritPointsUsed = calculateMeritPointsUsed(selectedMerits, meritsData);
    const totalMeritPoints = calculateTotalMeritPoints(selectedFlaws, flawsData);
    if (meritPointsUsed > totalMeritPoints) {
        errors.push(`Merits: Used ${meritPointsUsed} points, but only ${totalMeritPoints} available (${MERIT_POINTS} base + ${totalMeritPoints - MERIT_POINTS} from flaws)`);
    }
    
    //check flaw limit
    const flawPointsGained = calculateFlawPointsGained(selectedFlaws, flawsData);
    if (flawPointsGained > MAX_FLAW_POINTS) {
        warnings.push(`Flaws: Can only gain up to ${MAX_FLAW_POINTS} points from flaws`);
    }
    
    //check backgrounds
    const { backgrounds, sect } = characterData;
    if (backgrounds) {
        const bgPointsUsed = calculateBackgroundPointsUsed(backgrounds, predatorType, sect);
        if (bgPointsUsed > BACKGROUND_POINTS) {
            errors.push(`Backgrounds: Used ${bgPointsUsed} dots, but only ${BACKGROUND_POINTS} available`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
};

//get points summary
export const getPointsSummary = (characterData, attributesData, skillsData, meritsData, flawsData) => {
    const attributes = characterData.attributes || {};
    const skills = characterData.skills || {};
    const selectedMerits = characterData.selectedMerits || [];
    const selectedFlaws = characterData.selectedFlaws || [];
    const backgrounds = characterData.backgrounds || {};
    const predatorType = characterData.predatorType || null;
    const sect = characterData.sect || null;
    
    const attrPointsUsed = calculateAttributePointsUsed(attributes);
    const skillPointsUsed = calculateSkillPointsUsed(skills, predatorType);
    const meritPointsUsed = calculateMeritPointsUsed(selectedMerits, meritsData);
    const flawPointsGained = calculateFlawPointsGained(selectedFlaws, flawsData);
    const totalMeritPoints = calculateTotalMeritPoints(selectedFlaws, flawsData);
    const bgPointsUsed = calculateBackgroundPointsUsed(backgrounds, predatorType, sect);
    
    return {
        attributes: {
            used: attrPointsUsed,
            available: ATTRIBUTE_POINTS,
            remaining: ATTRIBUTE_POINTS - attrPointsUsed
        },
        skills: {
            used: skillPointsUsed,
            available: SKILL_POINTS,
            remaining: SKILL_POINTS - skillPointsUsed
        },
        merits: {
            used: meritPointsUsed,
            available: totalMeritPoints,
            remaining: totalMeritPoints - meritPointsUsed,
            fromFlaws: flawPointsGained
        },
        flaws: {
            pointsGained: flawPointsGained,
            maxGain: MAX_FLAW_POINTS
        },
        backgrounds: {
            used: bgPointsUsed,
            available: BACKGROUND_POINTS,
            remaining: BACKGROUND_POINTS - bgPointsUsed
        }
    };
};

//export constants for use in components
export const POINTS_CONSTANTS = {
    STARTING_ATTRIBUTE_VALUE,
    STARTING_SKILL_VALUE,
    STARTING_DISCIPLINE_VALUE,
    ATTRIBUTE_POINTS,
    SKILL_POINTS,
    MERIT_POINTS,
    MAX_FLAW_POINTS,
    BACKGROUND_POINTS
};

