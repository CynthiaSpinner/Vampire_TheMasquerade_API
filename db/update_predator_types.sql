-- update script to add predator_types table and seed data
-- run this after your existing schema and seed data

USE vtm_gm_api;

-- create predator_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS predator_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    free_discipline_id INT,
    free_skill_id INT,
    free_background_id INT,
    free_background_rating INT DEFAULT 1,
    restrictions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (free_discipline_id) REFERENCES disciplines(id) ON DELETE SET NULL,
    FOREIGN KEY (free_skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    FOREIGN KEY (free_background_id) REFERENCES backgrounds(id) ON DELETE SET NULL
);

-- clear existing predator types if any (optional - remove if you want to keep existing data)
-- DELETE FROM predator_types;

-- insert predator types using subqueries to look up IDs by name
INSERT INTO predator_types (name, description, free_discipline_id, free_skill_id, free_background_id, free_background_rating, restrictions) VALUES
('Alleycat', 'Feed from violence and combat, hunting in dangerous areas. Gain a free dot in Potence or Brawl.', 
    (SELECT id FROM disciplines WHERE name = 'Potence' LIMIT 1), 
    (SELECT id FROM skills WHERE name = 'Brawl' LIMIT 1), 
    NULL, NULL, 'Must feed from combat or violence'),
('Bagger', 'Steal blood from blood banks and hospitals. Gain a free dot in Larceny and Herd.', 
    NULL, 
    (SELECT id FROM skills WHERE name = 'Larceny' LIMIT 1), 
    (SELECT id FROM backgrounds WHERE name = 'Herd' LIMIT 1), 
    1, 'Requires access to medical facilities'),
('Blood Leech', 'Feed from other vampires, dangerous and addictive. Gain a free dot in Blood Sorcery or Oblivion.', 
    (SELECT id FROM disciplines WHERE name = 'Blood Sorcery' LIMIT 1), 
    NULL, NULL, NULL, 'Must feed from Kindred, risk of blood bond'),
('Cleaver', 'Feed from family members, maintaining human connections. Gain a free dot in Herd.', 
    NULL, NULL, 
    (SELECT id FROM backgrounds WHERE name = 'Herd' LIMIT 1), 
    1, 'Must maintain family relationships'),
('Consensualist', 'Feed only from willing donors. Gain a free dot in Herd.', 
    NULL, NULL, 
    (SELECT id FROM backgrounds WHERE name = 'Herd' LIMIT 1), 
    1, 'Must have willing donors'),
('Farmer', 'Feed from animals, avoiding human contact. Gain a free dot in Animal Ken and Herd.', 
    (SELECT id FROM disciplines WHERE name = 'Animalism' LIMIT 1), 
    (SELECT id FROM skills WHERE name = 'Animal Ken' LIMIT 1), 
    (SELECT id FROM backgrounds WHERE name = 'Herd' LIMIT 1), 
    1, 'Cannot feed from humans easily'),
('Osiris', 'Feed from cult members and followers. Gain two free dots in Herd.', 
    NULL, NULL, 
    (SELECT id FROM backgrounds WHERE name = 'Herd' LIMIT 1), 
    2, 'Must maintain cult following'),
('Sandman', 'Feed from sleeping victims, stealthy approach. Gain a free dot in Obfuscate or Stealth.', 
    (SELECT id FROM disciplines WHERE name = 'Obfuscate' LIMIT 1), 
    (SELECT id FROM skills WHERE name = 'Stealth' LIMIT 1), 
    NULL, NULL, 'Must feed from sleeping mortals'),
('Scene Queen', 'Feed from groupies and fans at social events. Gain a free dot in Performance and Fame.', 
    NULL, 
    (SELECT id FROM skills WHERE name = 'Performance' LIMIT 1), 
    (SELECT id FROM backgrounds WHERE name = 'Fame' LIMIT 1), 
    1, 'Must maintain social presence'),
('Siren', 'Use seduction and charm to feed. Gain a free dot in Presence or Persuasion.', 
    (SELECT id FROM disciplines WHERE name = 'Presence' LIMIT 1), 
    (SELECT id FROM skills WHERE name = 'Persuasion' LIMIT 1), 
    NULL, NULL, 'Must use social manipulation'),
('Roadside Killer', 'Feed from travelers and hitchhikers. Gain a free dot in Drive.', 
    NULL, 
    (SELECT id FROM skills WHERE name = 'Drive' LIMIT 1), 
    NULL, NULL, 'Must hunt on the road'),
('Graverobber', 'Feed from the recently dead. Gain a free dot in Larceny.', 
    NULL, 
    (SELECT id FROM skills WHERE name = 'Larceny' LIMIT 1), 
    NULL, NULL, 'Must have access to corpses')
AS new_values
ON DUPLICATE KEY UPDATE 
    description = new_values.description,
    free_discipline_id = new_values.free_discipline_id,
    free_skill_id = new_values.free_skill_id,
    free_background_id = new_values.free_background_id,
    free_background_rating = new_values.free_background_rating,
    restrictions = new_values.restrictions;

