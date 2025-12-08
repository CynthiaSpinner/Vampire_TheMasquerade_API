const { pool } = require('./connection');

//character queries
const getAllCharacters = async () => {
    const [rows] = await pool.query(`
        SELECT c.*, cl.name as clan_name
        FROM characters c
        LEFT JOIN clans cl ON c.clan_id = cl.id
        ORDER BY c.name
        `);
        return rows;
};

const getCharacterById = async (id) => {
    const [charRows] = await pool.query(`
        SELECT c.*, cl.name as clan_name
        FROM characters c
        LEFT JOIN clans cl ON c.clan_id = cl.id
        WHERE c.id = ?
    `, [id]);

    if (!charRows[0]) return null;

    const character = charRows[0];

    //get character skills
    const [skills] = await pool.query(`
        SELECT s.*, cs.rating, cs.specialties
        FROM character_skills cs
        INNER JOIN skills s ON cs.skill_id = s.id
        WHERE cs.character_id = ?
    `, [id]);
    character.skills = skills;

    //get character disciplines
    const [disciplines] = await pool.query(`
        SELECT d.*, cd.rating, cd.powers
        FROM character_disciplines cd
        INNER JOIN disciplines d ON cd.discipline_id = d.id
        WHERE cd.character_id = ?
    `, [id]);
    character.disciplines = disciplines;

    //get character merits
    const [merits] = await pool.query(`
        SELECT m.*, cm.rating, cm.notes
        FROM character_merits cm
        INNER JOIN merits m ON cm.merit_id = m.id
        WHERE cm.character_id = ?
    `, [id]);
    character.merits = merits;

    //get character flaws
    const [flaws] = await pool.query(`
        SELECT f.*, cf.rating, cf.notes
        FROM character_flaws cf
        INNER JOIN flaws f ON cf.flaw_id = f.id
        WHERE cf.character_id = ?
    `, [id]);
    character.flaws = flaws;

    //get character backgrounds
    const [backgrounds] = await pool.query(`
        SELECT b.*, cb.rating, cb.details
        FROM character_backgrounds cb
        INNER JOIN backgrounds b ON cb.background_id = b.id
        WHERE cb.character_id = ?
    `, [id]);
    character.backgrounds = backgrounds;

    return character;
};

const createCharacter = async (characterData) => {
    const {
        name, player_name, chronicle, concept, clan_id, generation, 
        sire, embrace_date, date_of_birth, place_of_birth, apparent_age, true_age,
        strength, dexterity, stamina, 
        charisma, manipulation, composure, intelligence, wits, resolve, 
        health_max, health_current, 
        willpower_max, willpower_current, humanity, hunger 
    } = characterData;

    const [result] = await pool.query(`
        INSERT INTO characters (
            name, player_name, chronicle, concept,
            clan_id, generation, sire, embrace_date, date_of_birth, place_of_birth, apparent_age, true_age,
            strength, dexterity, stamina,
            charisma, manipulation, composure,
            intelligence, wits, resolve,
            health_max, health_current,
            willpower_max, willpower_current,
            humanity, hunger
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,[
        name, player_name, chronicle, concept,
        clan_id, generation || 13, sire, embrace_date, date_of_birth, place_of_birth, apparent_age, true_age,
        strength || 1, dexterity || 1, stamina || 1,
        charisma || 1, manipulation || 1, composure || 1,
        intelligence || 1, wits || 1, resolve || 1,
        health_max || 3, health_current || 3,
        willpower_max || 1, willpower_current || 1,
        humanity || 7, hunger || 0
    ]);

    const characterId = result.insertId;

    //add skills if provided
    if (characterData.skills && Array.isArray(characterData.skills)) {
        for (const skill of characterData.skills) {
            await pool.query(`
                INSERT INTO character_skills (character_id, skill_id, rating, specialties)
                VALUES (?, ?, ?, ?)
            `, [characterId, skill.skill_id, skill.rating || 0, JSON.stringify(skill.specialties || [])]);
        }
    }

    //add disciplines if provided
    if (characterData.disciplines && Array.isArray(characterData.disciplines)) {
        for (const disc of characterData.disciplines) {
            await pool.query(`
                INSERT INTO character_disciplines (character_id, discipline_id, rating, powers)
                VALUES (?, ?, ?, ?)
            `, [characterId, disc.discipline_id, disc.rating || 0, JSON.stringify(disc.powers || [])]);
        }
    }

    return getCharacterById(characterId);
};

const updateCharacter = async (id, characterData) => {
    const {
        name, strength, dexterity, stamina, charisma, manipulation, composure, intelligence, wits, resolve, health_current,
        willpower_current, humanity, hunger
    } = characterData;

    const [result] = await pool.query(`
        UPDATE characters SET
            name = ?, strength = ?, dexterity = ?, stamina = ?,
            charisma = ?, manipulation = ?, composure = ?,
            intelligence = ?, wits = ?, resolve = ?,
            health_current = ?, willpower_current = ?,
            humanity = ?, hunger = ?
        WHERE id = ?        
    `, [
        name, strength, dexterity, stamina, charisma, manipulation, composure,
        intelligence, wits, resolve, health_current, willpower_current, humanity, hunger, id
    ]);

    if (result.affectedRows === 0) return null;
    
    //return updated character with all relationships
    return getCharacterById(id);
};

const deleteCharacter = async (id) => {
    const [result] = await pool.query('DELETE FROM characters WHERE id = ?', [id]);

    return result.affectedRows > 0;
};

module.exports = {
    getAllCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter
};
