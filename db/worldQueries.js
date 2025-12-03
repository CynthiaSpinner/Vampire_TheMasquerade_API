const { pool } = require('./connection');

//clan queries
const getAllClans = async () => {
    const [rows] = await pool.query('SELECT * FROM clans ORDER BY name');
    return rows;
};

const getClanById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [id]);
    return rows[0] || null;
};

//discipline queries
const getAllDisciplines = async () => {
    const [rows] = await pool.query('SELECT * FROM disciplines ORDER BY name');
    return rows;
};

const getDisciplineById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM disciplines WHERE id = ?', [id]);
    return rows[0] || null;
}

//attribute queries
const getAllAttributes = async () => {
    const [rows] = await pool.query('SELECT * FROM attributes ORDER BY catagory, name');
    return rows;
};

//skill queries
const getAllSkills = async () => {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY category, name');
    return rows;
};

//merit queries
const getAllMerits = async () => {
    const [rows] = await pool.query('SELECT * FROM merits ORDER BY name');
    return rows;
};

//flaw queries 
const getAllFlaws = async () => {
    const [rows] = await pool.query('SELECT * FROM flaws ORDER BY name');
};

//background queries
const getAllBackgrounds = async () => {
    const [rows] = await pool.query('SELECT * FROM backgrounds ORDER BY name');
    return rows;
};

module.exports = {
    getAllClans,
    getClanById,
    getAllDisciplines,
    getAllAttributes,
    getAllSkills,
    getAllMerits,
    getAllFlaws,
    getAllBackgrounds
};