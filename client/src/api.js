import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

//world data api calls
export const worldAPI = {
    getClans: () => api.get('/world/clans'),
    getClanById: (id) => api.get(`/world/clans/${id}`),
    getDisciplines: () => api.get('/world/disciplines'),
    getDisciplineById: (id) => api.get(`/world/disciplines/${id}`),
    getAttributes: () => api.get('/world/attributes'),
    getSkills: () => api.get('/world/skills'),
    getMerits: () => api.get('/world/merits'),
    getFlaws: () => api.get('/world/flaws'),
    getBackgrounds: () => api.get('/world/backgrounds'),
    getSects: () => api.get('/world/sects'),
    getSectById: (id) => api.get(`/world/sects/${id}`),
    getLocations: () => api.get('/world/locations'),
    getLocationById: (id) => api.get(`/world/locations/${id}`)
};

//character api calls
export const characterAPI = {
    getAll: () => api.get('/characters'),
    getById: (id) => api.get(`/characters/${id}`),
    create: (character) => api.post('/characters', character),
    update: (id, character) => api.put(`/characters/${id}`, character),
    delete: (id) => api.delete(`/characters/${id}`)
};

//story api calls
export const storyAPI = {
    generate: (options) => api.post('/stories/generate', options),
    createSession: (sessionData) => api.post('/stories/session', sessionData),
    getSession: (id) => api.get(`/stories/session/${id}`),
    updateWithDice: (id, diceData) => api.post(`/stories/session/${id}/dice`, diceData),
    getCharacterStories: (characterId) => api.get(`/stories/character/${characterId}`)
};

export default api;