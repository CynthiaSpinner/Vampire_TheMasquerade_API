# Vampire: The Masquerade GM API

A comprehensive Game Master API for Vampire: The Masquerade (V5) with character management, world information, and AI-powered story generation.

## Features

- **World Information API** - Complete VtM V5 game data including clans, disciplines, attributes, skills, merits, flaws, backgrounds, sects, and locations
- **Character Management** - Full CRUD operations for character sheets with all VtM mechanics
- **AI Story Generation** - OpenAI-powered story generation with dice roll integration
- **Story Sessions** - Track and manage story sessions for characters with dice roll history
- **Swagger Documentation** - Interactive API documentation at `/api-docs`
- **Request Logging** - Automatic logging of all API requests

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with connection pooling
- **AI**: OpenAI API (GPT-3.5-turbo) for story generation
- **Documentation**: Swagger/OpenAPI 3.0

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Vampire_TheMasquerade_API
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=vtm_gm_api
DB_PORT=3306
PORT=3000
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
```

4. Set up the database:
- Create a new MySQL database named `vtm_gm_api`
- Run `db/schema.sql` to create all tables
- Run `db/seedData.sql` to populate initial game data

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### World Information (`/api/world`)

- `GET /api/world/clans` - Get all clans
- `GET /api/world/clans/:id` - Get clan by ID
- `GET /api/world/disciplines` - Get all disciplines
- `GET /api/world/disciplines/:id` - Get discipline by ID
- `GET /api/world/attributes` - Get all attributes
- `GET /api/world/skills` - Get all skills
- `GET /api/world/merits` - Get all merits
- `GET /api/world/flaws` - Get all flaws
- `GET /api/world/backgrounds` - Get all backgrounds
- `GET /api/world/sects` - Get all sects
- `GET /api/world/sects/:id` - Get sect by ID
- `GET /api/world/locations` - Get all locations
- `GET /api/world/locations/:id` - Get location by ID

### Characters (`/api/characters`)

- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get character by ID
- `POST /api/characters` - Create new character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

### Stories (`/api/stories`)

- `POST /api/stories/generate` - Generate AI story
- `POST /api/stories/session` - Create new story session
- `GET /api/stories/session/:id` - Get story session by ID
- `POST /api/stories/session/:id/dice` - Update story with dice roll results
- `GET /api/stories/character/:characterId` - Get all stories for a character

### Health

- `GET /health` - Health check (database connection status)
- `GET /` - API information

## API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:3000/api-docs
```

## Database Schema

The database includes tables for:
- **clans** - Vampire clans with bane, compulsion, and disciplines
- **disciplines** - Supernatural powers with JSON power arrays
- **attributes** - Physical, Social, and Mental attributes
- **skills** - Skills organized by category
- **merits** - Character advantages
- **flaws** - Character disadvantages
- **backgrounds** - Character backgrounds
- **sects** - Vampire sects (Camarilla, Anarch, etc.)
- **locations** - Game world locations
- **characters** - Full character sheets
- **character_skills** - Character skill ratings
- **character_disciplines** - Character discipline levels
- **character_merits** - Character merits
- **character_flaws** - Character flaws
- **character_backgrounds** - Character backgrounds
- **story_sessions** - Story sessions with dice roll history
- **request_logs** - API request logging

## Project Structure

```
Vampire_TheMasquerade_API/
├── db/
│   ├── connection.js          # Database connection pool
│   ├── schema.sql             # Database schema
│   ├── seedData.sql           # Initial game data
│   ├── worldQueries.js        # World data queries
│   ├── characterQueries.js    # Character CRUD operations
│   ├── storyQueries.js        # Story session queries
│   └── requestLogQueries.js   # Request logging queries
├── routes/
│   ├── worldRoutes.js         # World information endpoints
│   ├── characterRoutes.js     # Character endpoints
│   └── storyRoutes.js         # Story endpoints
├── services/
│   └── aiStoryGenerator.js    # OpenAI integration
├── server/
│   ├── index.js               # Express server setup
│   └── swagger.js             # Swagger configuration
├── package.json
└── .env                       # Environment variables (not in git)
```

## Usage Examples

### Generate a Story
```bash
POST /api/stories/generate
Content-Type: application/json

{
  "type": "hook",
  "clan": "Toreador",
  "location": "New York",
  "tone": "dark",
  "prompt": "A mysterious figure approaches"
}
```

### Create a Character
```bash
POST /api/characters
Content-Type: application/json

{
  "name": "Elena Blackwood",
  "clan_id": 1,
  "generation": 13,
  "attributes": {...},
  "skills": [...],
  "disciplines": [...]
}
```

### Update Story with Dice Roll
```bash
POST /api/stories/session/1/dice
Content-Type: application/json

{
  "diceRolls": [
    {
      "diceCount": 5,
      "successes": 3,
      "difficulty": 2
    }
  ]
}
```

## Development

### Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)

### Environment Variables

All configuration is done through environment variables in `.env`. Make sure to:
- Never commit `.env` to version control
- Use strong database passwords
- Keep your OpenAI API key secure

## License

ISC

## Contributing

This is a personal project for learning and game management purposes.

## Acknowledgments

- White Wolf Publishing for Vampire: The Masquerade
- OpenAI for GPT API

