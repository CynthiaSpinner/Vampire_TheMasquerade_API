const express = require('express');
const router = express.Router();
const storyQueries = require('../db/storyQueries');
const aiStoryGenerator = require('../services/aiStoryGenerator');

router.post('/generate', async (req, res) => {
    try {
        const { type, clan, location, tone, prompt } = req.body;
        const story = await aiStoryGenerator.generateStory({ type, clan, location, tone, prompt });
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/session', async (req, res) => {
    try {
        const { characterId, title, storyContent } = req.body;
        const sessionId = await storyQueries.createStorySession(characterId, title, storyContent);
        res.json({ id: sessionId, message: 'Story session created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/session/:id', async (req, res) => {
    try {
        const session = await storyQueries.getStorySession(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/session/:id/dice', async (req, res) => {
    try {
        const { diceRolls, previousStory } = req.body;
        const session = await storyQueries.getStorySession(req.params.id);

        if (!session) return res.status(404).json({ error: 'Session not found'});

        const lastRoll = diceRolls[diceRolls.length - 1];
        const updatedStory = await aiStoryGenerator.generateStory({
            previousStory: session.story_content,
            diceResult: lastRoll
        });

        if (!updatedStory.success) {
            return res.status(500).json({ error: updatedStory.error });
        }

        const updated = await storyQueries.updateStoryWithDice(
            req.params.id,
            diceRolls,
            updatedStory.content
        );

        res.json(updated);
    } catch (error) {
        req.status(500).json({ error: error.message });
    }
});

router.get('/character/:characterId', async (req, res) => {
    try {
        const stories = await storyQueries.getCharacterStories(req.params.characterId);
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;