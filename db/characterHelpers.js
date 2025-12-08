const { pool } = require('./connection');

//determining historical era from date of birth
const getHistoricalEra = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const year = new Date(dateOfBirth).getFullYear();
    
    if (year < 500) return 'Ancient Era';
    if (year < 1000) return 'Early Medieval Period';
    if (year < 1300) return 'High Medieval Period';
    if (year < 1500) return 'Late Medieval Period';
    if (year < 1600) return 'Renaissance';
    if (year < 1700) return 'Early Modern Period';
    if (year < 1800) return 'Age of Enlightenment';
    if (year < 1900) return 'Victorian Era';
    if (year < 1920) return 'Edwardian Era';
    if (year < 1940) return 'Interwar Period';
    if (year < 1960) return 'Post-War Era';
    if (year < 1980) return 'Modern Era (1960s-1970s)';
    if (year < 2000) return 'Late 20th Century';
    if (year < 2010) return 'Early 2000s';
    return 'Contemporary Era';
};

//auto-creating origin background for character
const createOriginBackground = async (characterId, dateOfBirth, placeOfBirth) => {
    if (!dateOfBirth && !placeOfBirth) return null;
    
    //find or create an "Origin" background
    let [originBackground] = await pool.query(
        'SELECT id FROM backgrounds WHERE name = ?',
        ['Origin']
    );
    
    //if origin background doesn't exist, create it
    if (originBackground.length === 0) {
        const [result] = await pool.query(`
            INSERT INTO backgrounds (name, description, max_rating, category)
            VALUES (?, ?, ?, ?)
        `, ['Origin', 'Character\'s place and time of birth, providing historical and cultural context', 1, 'Personal']);
        originBackground = [{ id: result.insertId }];
    }
    
    const backgroundId = originBackground[0].id;
    
    //building the details string
    let details = '';
    if (dateOfBirth) {
        const year = new Date(dateOfBirth).getFullYear();
        const era = getHistoricalEra(dateOfBirth);
        details = `Born in ${year} (${era})`;
    }
    if (placeOfBirth) {
        if (details) details += ` in ${placeOfBirth}`;
        else details = `Born in ${placeOfBirth}`;
    }
    
    //inserting into character_backgrounds
    await pool.query(`
        INSERT INTO character_backgrounds (character_id, background_id, rating, details)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE details = ?
    `, [characterId, backgroundId, 1, details, details]);
    
    return details;
};

module.exports = {
    getHistoricalEra,
    createOriginBackground
};