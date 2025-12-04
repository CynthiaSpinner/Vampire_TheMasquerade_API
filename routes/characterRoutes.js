const express = require('express');
const router = express.Router();
const characterQueries = require('../db/characterQueries');

router.get('/', async (req, res) => {
    try {
        const characters = await characterQueries.getAllCharacters();
        res.json(characters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const character = await characterQueries.getCharacterById(req.params.id);
        if (!character) return res.status(404).json({ error: 'Character not found' });
        res.json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const character = await characterQueries.createCharacter(req.body);
        res.status(201).json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const character = await characterQueries.updateCharacter(req.params.id, req.body);
        if (!character) return res.status(404).json({ error: 'Character not found' });
        res.json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await characterQueries.deleteCharacter(req.params.id);
        if(!deleted) return res.status(404).json({ error: 'Character not found' });
        res.json({ message: 'Character deleted' }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;