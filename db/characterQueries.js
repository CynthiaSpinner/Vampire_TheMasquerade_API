const { pool } = require('./connection');

//GET all characters
const getAllCharacters = async () => {
    //pool.query returns [rows, fields] - we only need rows!
    const [rows] = await pool.query('Select * From characters');
    return rows;
};

//GET one character by ID
const getCharacterById = async (id) => {
    //use ? placeholder to prevent SQL injection
    const [rows] = await pool.query('SELECT * FROM characters WHERE id = ?', [id]);
    return rows[0] || null; //return first match or null
};

//Post - create new character
const createCharacter = async (character) => {
    const { name, species, origin, status, occupation } = character;
    const [result] = await pool.query(
        'INSERT INTO characters (name, species, origin, status, occupation) VALUES (?, ?, ?, ?, ?)',
        [name, species, origin, status, occupation]
    );

    //return the new character with its auto-generated ID
    return { id : result.insertId, ...character};
};

//PUT - updating existing character
const updateCharacter = async (id, character) => {
    const { name, species, origin, status, occupation } = character;
    const [result] = await pool.query (
        'UPDATE characters SET name = ?, species = ?, origin = ?, status =?, occupation = ? WHERE id = ?',
        [name, species, origin, status, occupation, id]
    );

    //tells me if the update actually changed anything
    if (result.affectedRows === 0) {
        return null; //not found
    }
    return { id: parseInt(id), ...character };
};

//DELETE character
const deleteCharacter = async (id) => {
    const [result] = await pool.query('DELETE FROM characters WHERE id = ?', [id]);
    return result.affectedRows > 0; //return true if detected, false if not found
};

module.export = {
    getAllCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter
};