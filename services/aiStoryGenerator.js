const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateStory = async (options = {}) => {
    const {
        type = 'hook',
        clan = null,
        location = null,
        tone = 'dark',
        prompt = null,
        previousStory = null,
        diceResult = null
    } = options;

    const systemPrompt = `You are a Game Master for Vampire: The Masquerade. Create compelling, dark stories with personal horror themes.`;

    let userPrompt = '';

    if (diceResult && previousStory) {
        userPrompt = `Continue this story based on the dice roll result:
        
        Previous Story: ${previousStory}

        Dice Roll Result: ${diceResult.diceCount} dice, ${diceResult.successes} successes, ${diceResult.difficulty} difficulty

        ${diceResult.successes >= diceResult.difficulty ? 'The action succeeded.' : 'The action failed.'}

        Continue the narrative based on this outcome.`;
    } else if (prompt) {
        userPrompt = prompt;
    } else {
        userPrompt = `Generate a ${type} for Vampire: The Masquerade.
        ${clan ? `Clan: ${clan}. ` : ''}
        ${location ? `Location: ${location}. ` : ''}
        Tone: ${tone}.`;
    }

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_tokens: 1000
        });

        return {
            success: true,
            content: completion.choices[0].message.content
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { generateStory };

