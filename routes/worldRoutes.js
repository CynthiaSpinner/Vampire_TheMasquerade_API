const express = require('express');
const router = express.Router();
const worldQueries = require('../db/worldQueries');

router.get('/clans', async (req, res) => {
    try {
        const clans = await worldQueries.getAllClans();
        res.json(clans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/clans/:id', async (req, res) => {
    try {
        const clan = await worldQueries.getClanById(req.params.id);
        res.json(clan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/disciplines', async (req, res) => {
    try {
        const disciplines = await worldQueries.getAllDisciplines();
        res.json(disciplines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/disciplines/:id', async (req, res) => {
    try {
        const discipline = await worldQueries.getDisciplineById(req.params.id);

        if (!discipline) return res.status(404).json({ error: 'Discipline not found' });
        res.json(discipline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/attributes', async (req, res) => {
    try {
        const attributes = await worldQueries.getAllAttributes();
        res.json(attributes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/skills', async (req, res) => {
    try {
        const skills = await worldQueries.getAllSkills();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/merits', async (req, res) => {
    try {
        const merits = await worldQueries.getAllMerits();
        res.json(merits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/flaws', async (req, res) => {
    try {
        const flaws = await worldQueries.getAllFlaws();
        res.json(flaws);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/backgrounds', async (req, res) => {
    try {
        const backgrounds = await worldQueries.getAllBackgrounds();
        res.json(backgrounds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;