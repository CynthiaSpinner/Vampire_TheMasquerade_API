// this module is responsible for generating ai-powered story content for vampire: the masquerade, enabling automated narrative based on dice outcomes or narrative prompts

const OpenAI = require('openai'); // import openai sdk to interact with the chat completions api

// initialize openai instance using the secret api key stored in environment variables, maintaining security and flexibility in different setups
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// this async function is the core: it takes game narrative context and dynamically generates the next story piece
const generateStory = async (options = {}) => {
    // extract and default all the user options so it's easy to call with specific or fallback settings
    const {
        type = 'hook',            // specifies the story bit: hook, scene, etc.
        clan = null,              // which clan to emphasize, if needed
        location = null,          // where the story is happening
        tone = 'dark',            // mood/atmosphere, defaulted for the gothic horror setting
        prompt = null,            // an explicit player or system prompt (takes priority if present)
        previousStory = null,     // narrative up until now, for story continuation
        diceResult = null,         // outcome from a dice roll, used to guide next scene
        characterContext = null  //character's date_of_birth, place_of_birth, etc.
    } = options;

    // system prompt sets up the ai's role so story output is always on-genre, immersive and fitting for vtm style
    const systemPrompt = `You are a Game Master for Vampire: The Masquerade. Create compelling, dark stories with personal horror themes.`;

    let userPrompt = '';

    //adding character context if available
    let characterInfo = '';
    if (characterContext) {
        if (characterContext.date_of_birth) {
            const birthYear = new Date(characterContext.date_of_birth).getFullYear();
            characterInfo += `Character was born in ${birthYear}`;
            if (characterContext.place_of_birth) {
                characterInfo += ` in ${characterContext.place_of_birth}`;
            }
            characterInfo += '. ';
        }
        if (characterContext.embrace_date) {
            const embraceYear = new Date(characterContext.embrace_date).getFullYear();
            characterInfo += `Embraced in ${embraceYear}. `;
        }
        if (characterContext.clan) {
            characterInfo += `Clan: ${characterContext.clan}. `;
        }
    }
    // how we build the ai prompt depends on the input - decide what gets sent for best context:
    // first, if we have both dice results and a previous narrative, we’re telling the ai: continue the story and use the mechanical outcome
    if (diceResult && previousStory) {
        userPrompt = `Continue this story based on the dice roll result:
        
        Previous Story: ${previousStory}

        ${characterInfo}

        Dice Roll Result: ${diceResult.diceCount} dice, ${diceResult.successes} successes, ${diceResult.difficulty} difficulty

        ${diceResult.successes >= diceResult.difficulty ? 'The action succeeded.' : 'The action failed.'}

        Continue the narrative based on this outcome, considering the character's historical background.`;
    }
    // next, if just a plain prompt is given, feed it right to the ai, letting users override
    else if (prompt) {
        userPrompt = `${characterInfo}${prompt}`;
    }
    // if neither, fall back on generating a prompt using config values to ensure something always goes to the ai
    else {
        userPrompt = `Generate a ${type} for Vampire: The Masquerade.
        ${characterInfo}
        ${clan ? `Clan: ${clan}. ` : ''}
        ${location ? `Location: ${location}. ` : ''}
        Tone: ${tone}.`;
    }

    // main api call: send system/user prompts to openai, using a current model and tuned for creative but readable output
    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', // lets us override model per deployment/env
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,  // slightly high for more creative narratives
            max_tokens: 1000   // prevents runaway responses
        });

        // structure return so downstream code always knows if it succeeded and gets the story content directly
        return {
            success: true,
            content: completion.choices[0].message.content
        };
    } catch (error) {
        // error handling: if ai call fails, return clear structure for better debugging and user feedback
        return {
            success: false,
            error: error.message
        };
    }
};

// export so the rest of the app can generate new scenes or hooks wherever narrative is needed
module.exports = { generateStory };
