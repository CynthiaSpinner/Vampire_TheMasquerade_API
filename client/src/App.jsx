import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'App.css';

//components (may add to it, but this should be the basic components)
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Characters from './pages/Characters';
import CharacterCreator from './pages/CharacterCreator';
import StoryGenerator from './pages/StoryGenerator';
import DiceRoller from './components/DiceRoller';

function App() {
    return (
        <Router>
            <div className='App'>
                <Navbar />
                <main className='main-content'>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/characters" element={<Characters />} />
                    <Route path="/characters/new" element={<CharacterCreator />} />
                    <Route path="/stories" element={<StoryGenerator />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;