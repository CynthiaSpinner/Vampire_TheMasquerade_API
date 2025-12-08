const express = require('express');
const router = express.Router();
const storyQueries = require('../db/storyQueries');
const characterQueries = require('../db/characterQueries');
const aiStoryGenerator = require('../services/aiStoryGenerator');

/**
 * @swagger
 * /api/stories/generate:
 *   post:
 *     summary: Generate an AI story
 *     tags: [Stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: hook
 *               clan:
 *                 type: string
 *                 example: Toreador
 *               location:
 *                 type: string
 *                 example: New York
 *               tone:
 *                 type: string
 *                 example: dark
 *               prompt:
 *                 type: string
 *                 example: A mysterious figure approaches
 *     responses:
 *       200:
 *         description: Story generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 content:
 *                   type: string
 */
router.post('/generate', async (req, res) => {
    try {
        const { type, clan, location, tone, prompt } = req.body;
        const story = await aiStoryGenerator.generateStory({ type, clan, location, tone, prompt });
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/stories/session:
 *   post:
 *     summary: Create a new story session
 *     tags: [Stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - characterId
 *               - title
 *               - storyContent
 *             properties:
 *               characterId:
 *                 type: integer
 *               title:
 *                 type: string
 *               storyContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Story session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.post('/session', async (req, res) => {
    try {
        const { characterId, title, storyContent, timePeriod } = req.body;
        const sessionId = await storyQueries.createStorySession(characterId, title, storyContent, timePeriod);
        const session = await storyQueries.getStorySession(sessionId);
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/stories/session/{id}:
 *   get:
 *     summary: Get a story session by ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Story session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorySession'
 *       404:
 *         description: Session not found
 */
router.get('/session/:id', async (req, res) => {
    try {
        const session = await storyQueries.getStorySession(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/stories/session/{id}/dice:
 *   post:
 *     summary: Update story session with dice roll results
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diceRolls
 *             properties:
 *               diceRolls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     diceCount:
 *                       type: integer
 *                     successes:
 *                       type: integer
 *                     difficulty:
 *                       type: integer
 *               previousStory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Story updated with dice results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorySession'
 *       404:
 *         description: Session not found
 *       500:
 *         description: AI generation error
 */
router.post('/session/:id/dice', async (req, res) => {
    try {
        const { diceRolls, previousStory, characterContext } = req.body;
        const session = await storyQueries.getStorySession(req.params.id);

        if (!session) return res.status(404).json({ error: 'Session not found' });

        //get character context if not provided
        let charContext = characterContext;
        if (!charContext && session.character_id) {
            const character = await characterQueries.getCharacterById(session.character_id);
            if (character) {
                charContext = {
                    date_of_birth: character.date_of_birth,
                    place_of_birth: character.place_of_birth,
                    embrace_date: character.embrace_date,
                    clan: character.clan_name
                };
            }
        }

        const lastRoll = diceRolls[diceRolls.length - 1];
        const updatedStory = await aiStoryGenerator.generateStory({
            previousStory: previousStory || session.story_content,
            diceResult: lastRoll,
            characterContext: charContext
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
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/stories/character/{characterId}:
 *   get:
 *     summary: Get all story sessions for a character
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Character ID
 *     responses:
 *       200:
 *         description: List of story sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StorySession'
 */
router.get('/character/:characterId', async (req, res) => {
    try {
        const stories = await storyQueries.getCharacterStories(req.params.characterId);
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;