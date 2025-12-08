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
};

//attribute queries
const getAllAttributes = async () => {
    const [rows] = await pool.query('SELECT * FROM attributes ORDER BY category, name');
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
    return rows;
};

//background queries
const getAllBackgrounds = async () => {
    const [rows] = await pool.query('SELECT * FROM backgrounds ORDER BY name');
    return rows;
};

//sect queries
const getAllSects = async () => {
    const [rows] = await pool.query('SELECT * FROM sects ORDER BY name');
    return rows;
};

const getSectById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM sects WHERE id = ?', [id]);
    return rows[0] || null;
};

//location queries
const getAllLocations = async () => {
    const [rows] = await pool.query('SELECT * FROM locations ORDER BY name');
    return rows;
};

const getLocationById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [id]);
    return rows[0] || null;
};


//predator type queries
const getAllPredatorTypes = async () => {
    const [rows] = await pool.query(`
        SELECT pt.*, 
               d.name as free_discipline_name,
               s.name as free_skill_name,
               b.name as free_background_name
        FROM predator_types pt
        LEFT JOIN disciplines d ON pt.free_discipline_id = d.id
        LEFT JOIN skills s ON pt.free_skill_id = s.id
        LEFT JOIN backgrounds b ON pt.free_background_id = b.id
        ORDER BY pt.name
    `);
    return rows;
};

const getPredatorTypeById = async (id) => {
    const [rows] = await pool.query(`
        SELECT pt.*, 
               d.name as free_discipline_name,
               s.name as free_skill_name,
               b.name as free_background_name
        FROM predator_types pt
        LEFT JOIN disciplines d ON pt.free_discipline_id = d.id
        LEFT JOIN skills s ON pt.free_skill_id = s.id
        LEFT JOIN backgrounds b ON pt.free_background_id = b.id
        WHERE pt.id = ?
    `, [id]);
    return rows[0] || null;
};

module.exports = {
    getAllClans,
    getClanById,
    getAllDisciplines,
    getAllAttributes,
    getAllSkills,
    getAllMerits,
    getAllFlaws,
    getAllBackgrounds,
    getAllSects,
    getSectById,
    getAllLocations,
    getLocationById,
    getAllPredatorTypes,
    getPredatorTypeById
};