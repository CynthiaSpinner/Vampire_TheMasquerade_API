const express = require('express');
const router = express.Router();
const worldQueries = require('../db/worldQueries');

/**
 * @swagger
 * /api/world/clans:
 *   get:
 *     summary: Get all clans
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all clans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clan'
 */
router.get('/clans', async (req, res) => {
    try {
        const clans = await worldQueries.getAllClans();
        res.json(clans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/clans/{id}:
 *   get:
 *     summary: Get a single clan by ID
 *     tags: [World]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Clan ID
 *     responses:
 *       200:
 *         description: Clan details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clan'
 *       404:
 *         description: Clan not found
 */
router.get('/clans/:id', async (req, res) => {
    try {
        const clan = await worldQueries.getClanById(req.params.id);
        res.json(clan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/disciplines:
 *   get:
 *     summary: Get all disciplines
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all disciplines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discipline'
 */
router.get('/disciplines', async (req, res) => {
    try {
        const disciplines = await worldQueries.getAllDisciplines();
        res.json(disciplines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/disciplines/{id}:
 *   get:
 *     summary: Get a single discipline by ID
 *     tags: [World]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Discipline ID
 *     responses:
 *       200:
 *         description: Discipline details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discipline'
 *       404:
 *         description: Discipline not found
 */
router.get('/disciplines/:id', async (req, res) => {
    try {
        const discipline = await worldQueries.getDisciplineById(req.params.id);

        if (!discipline) return res.status(404).json({ error: 'Discipline not found' });
        res.json(discipline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/attributes:
 *   get:
 *     summary: Get all attributes
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all attributes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attribute'
 */
router.get('/attributes', async (req, res) => {
    try {
        const attributes = await worldQueries.getAllAttributes();
        res.json(attributes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 */
router.get('/skills', async (req, res) => {
    try {
        const skills = await worldQueries.getAllSkills();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/merits:
 *   get:
 *     summary: Get all merits
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all merits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Merit'
 */
router.get('/merits', async (req, res) => {
    try {
        const merits = await worldQueries.getAllMerits();
        res.json(merits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/flaws:
 *   get:
 *     summary: Get all flaws
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all flaws
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flaw'
 */
router.get('/flaws', async (req, res) => {
    try {
        const flaws = await worldQueries.getAllFlaws();
        res.json(flaws);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/backgrounds:
 *   get:
 *     summary: Get all backgrounds
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all backgrounds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Background'
 */
router.get('/backgrounds', async (req, res) => {
    try {
        const backgrounds = await worldQueries.getAllBackgrounds();
        res.json(backgrounds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/sects:
 *   get:
 *     summary: Get all sects
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all sects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sect'
 */
router.get('/sects', async (req, res) => {
    try {
        const sects = await worldQueries.getAllSects();
        res.json(sects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/sects/{id}:
 *   get:
 *     summary: Get a single sect by ID
 *     tags: [World]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sect ID
 *     responses:
 *       200:
 *         description: Sect details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sect'
 *       404:
 *         description: Sect not found
 */
router.get('/sects/:id', async (req, res) => {
    try {
        const sect = await worldQueries.getSectById(req.params.id);
        if (!sect) return res.status(404).json({ error: 'Sect not found' });
        res.json(sect);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [World]
 *     responses:
 *       200:
 *         description: List of all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
router.get('/locations', async (req, res) => {
    try {
        const locations = await worldQueries.getAllLocations();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/world/locations/{id}:
 *   get:
 *     summary: Get a single location by ID
 *     tags: [World]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
router.get('/locations/:id', async (req, res) => {
    try {
        const location = await worldQueries.getLocationById(req.params.id);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// expose routes to app
module.exports = router;