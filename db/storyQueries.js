const { pool } = require('./connection');

//creating a new story session
const createStorySession = async (characterId, title, storyContent) => {
    const [result] = await pool.query(`
        INSERT INTO story_sessions (character_id, title, story_content, dice_rolls)
        VALUES (?, ?, ?, ?)    
    `, [characterId, title, storyContent, JSON.stringify([])]);
    return result.insertId;
};

//getting a story session by id
const getStorySession = async (id) => {
    const [rows] = await pool.query('SELECT * FROM story_sessions WHERE id = ?', [id]);
    return rows[0] || null;
};

//updating story with dice roll results
const updateStoryWithDice = async (id, diceRolls, updatedStory) => {
    await pool.query(`
        UPDATE story_sessions 
        SET dice_rolls = ?, story_content = ?, current_scene = ? 
        WHERE id = ?    
    `, [JSON.stringify(diceRolls), updatedStory, updatedStory, id]);
    return getStorySession(id);
};

//getting all stories for a character
const getCharacterStories = async (characterId) => {
    const [rows] = await pool.query(`
        SELECT * FROM story_sessions 
        WHERE character_id = ? 
        ORDER BY updated_at DESC 
    `, [characterId]);
    return rows;
};

module.exports = {
    createStorySession,
    getStorySession,
    updateStoryWithDice,
    getCharacterStories
};