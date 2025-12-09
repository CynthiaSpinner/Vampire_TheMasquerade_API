-- vampire: the masquerade v5 seed data
-- complete game data for the gm api
-- run this after running schema.sql

USE vtm_gm_api;

-- attributes
INSERT INTO attributes (category, name, description) VALUES
('Physical', 'Strength', 'Raw physical power and ability to lift, carry, and exert force'),
('Physical', 'Dexterity', 'Agility, reflexes, and coordination'),
('Physical', 'Stamina', 'Endurance, resilience, and ability to resist damage'),
('Social', 'Charisma', 'Personal magnetism, physical attractiveness, leadership, and ability to inspire'),
('Social', 'Manipulation', 'Ability to influence and persuade others'),
('Social', 'Composure', 'Self-control, poise, and ability to remain calm'),
('Mental', 'Intelligence', 'Reasoning, memory, and ability to learn'),
('Mental', 'Wits', 'Perception, awareness, and quick thinking'),
('Mental', 'Resolve', 'Determination, focus, and mental fortitude');

-- skills
-- physical skills
INSERT INTO skills (category, name, description, specialty_examples) VALUES
('Physical', 'Athletics', 'Running, jumping, climbing, swimming', '["Running", "Climbing", "Swimming", "Parkour"]'),
('Physical', 'Brawl', 'Unarmed combat', '["Boxing", "Martial Arts", "Wrestling", "Street Fighting"]'),
('Physical', 'Craft', 'Creating or repairing items', '["Carpentry", "Electronics", "Mechanics", "Art"]'),
('Physical', 'Drive', 'Operating vehicles', '["Motorcycles", "Sports Cars", "Trucks", "Racing"]'),
('Physical', 'Firearms', 'Using ranged weapons', '["Pistols", "Rifles", "Shotguns", "Sniping"]'),
('Physical', 'Larceny', 'Breaking and entering, lockpicking', '["Lockpicking", "Safecracking", "Pickpocketing", "Burglary"]'),
('Physical', 'Melee', 'Close combat with weapons', '["Swords", "Knives", "Improvised", "Axes"]'),
('Physical', 'Stealth', 'Moving unseen and unheard', '["Shadowing", "Hiding", "Sneaking", "Urban"]'),
('Physical', 'Survival', 'Living off the land, tracking', '["Urban", "Wilderness", "Tracking", "Foraging"]'),

-- social skills
('Social', 'Animal Ken', 'Understanding and working with animals', '["Dogs", "Horses", "Wild Animals", "Birds"]'),
('Social', 'Etiquette', 'Knowing proper social behavior', '["Formal", "Street", "Corporate", "Kindred"]'),
('Social', 'Insight', 'Reading people and situations', '["Lies", "Emotions", "Motives", "Kindred"]'),
('Social', 'Intimidation', 'Coercing others through fear', '["Physical", "Psychological", "Social", "Supernatural"]'),
('Social', 'Leadership', 'Inspiring and directing others', '["Combat", "Business", "Social", "Kindred"]'),
('Social', 'Performance', 'Entertaining or performing', '["Acting", "Singing", "Dancing", "Music"]'),
('Social', 'Persuasion', 'Convincing others through argument', '["Debate", "Negotiation", "Seduction", "Diplomacy"]'),
('Social', 'Streetwise', 'Navigating urban environments', '["Gangs", "Black Market", "Rumors", "Contacts"]'),
('Social', 'Subterfuge', 'Deception and misdirection', '["Lying", "Con Games", "Disguise", "Espionage"]'),

-- mental skills
('Mental', 'Academics', 'Formal education and knowledge', '["History", "Literature", "Science", "Philosophy"]'),
('Mental', 'Awareness', 'Noticing details and surroundings', '["Visual", "Auditory", "Smell", "Supernatural"]'),
('Mental', 'Finance', 'Money management and economics', '["Investing", "Accounting", "Markets", "Laundering"]'),
('Mental', 'Investigation', 'Gathering and analyzing clues', '["Crime Scenes", "Research", "Forensics", "Kindred"]'),
('Mental', 'Medicine', 'Healing and medical knowledge', '["Surgery", "Diagnosis", "First Aid", "Pathology"]'),
('Mental', 'Occult', 'Knowledge of supernatural', '["Vampires", "Spirits", "Rituals", "Thaumaturgy"]'),
('Mental', 'Politics', 'Understanding political systems', '["Camarilla", "Sabbat", "Local", "International"]'),
('Mental', 'Science', 'Scientific knowledge and methods', '["Chemistry", "Biology", "Physics", "Forensics"]'),
('Mental', 'Technology', 'Computers and electronics', '["Hacking", "Programming", "Hardware", "Security"]');

-- disciplines
INSERT INTO disciplines (name, description, type, powers) VALUES
('Celerity', 'Supernatural speed and reflexes', 'Physical', '[{"name": "Cat''s Grace", "level": 1, "description": "Add dice to Dexterity-based rolls"}, {"name": "Rapid Reflexes", "level": 2, "description": "Take additional actions in combat"}, {"name": "Lightning Strike", "level": 3, "description": "Move at incredible speeds"}]'),
('Potence', 'Supernatural strength', 'Physical', '[{"name": "Lethal Body", "level": 1, "description": "Add dice to Strength-based rolls"}, {"name": "Prowess", "level": 2, "description": "Deal aggravated damage with bare hands"}, {"name": "Brutal Feed", "level": 3, "description": "Feed more efficiently"}]'),
('Fortitude', 'Supernatural resilience', 'Physical', '[{"name": "Resilience", "level": 1, "description": "Add dice to Stamina-based rolls"}, {"name": "Toughness", "level": 2, "description": "Reduce damage taken"}, {"name": "Defy Bane", "level": 3, "description": "Resist clan banes"}]'),
('Animalism', 'Control and communicate with animals', 'Mental', '[{"name": "Feral Whispers", "level": 1, "description": "Communicate with animals"}, {"name": "Animal Succulence", "level": 2, "description": "Feed from animals"}, {"name": "Quell the Beast", "level": 3, "description": "Calm frenzied animals"}]'),
('Protean', 'Shape-shifting and animal transformation', 'Physical', '[{"name": "Eyes of the Beast", "level": 1, "description": "See in darkness"}, {"name": "Feral Weapons", "level": 2, "description": "Grow claws and fangs"}, {"name": "Shapechange", "level": 3, "description": "Transform into animal"}]'),
('Obfuscate', 'Become invisible and hide from detection', 'Mental', '[{"name": "Cloak of Shadows", "level": 1, "description": "Hide in shadows"}, {"name": "Unseen Passage", "level": 2, "description": "Become invisible"}, {"name": "Impostor''s Guise", "level": 3, "description": "Appear as someone else"}]'),
('Auspex', 'Enhanced senses and psychic perception', 'Mental', '[{"name": "Heightened Senses", "level": 1, "description": "Enhanced perception"}, {"name": "Sense the Unseen", "level": 2, "description": "Detect supernatural"}, {"name": "Premonition", "level": 3, "description": "See glimpses of future"}]'),
('Dominate', 'Mind control and mental influence', 'Social', '[{"name": "Cloud Memory", "level": 1, "description": "Erase memories"}, {"name": "Compel", "level": 2, "description": "Force actions"}, {"name": "Mesmerize", "level": 3, "description": "Complete mind control"}]'),
('Presence', 'Supernatural charisma and influence', 'Social', '[{"name": "Awe", "level": 1, "description": "Inspire admiration"}, {"name": "Dread Gaze", "level": 2, "description": "Intimidate with a look"}, {"name": "Entrancement", "level": 3, "description": "Become irresistible"}]'),
('Blood Sorcery', 'Magic powered by vitae', 'Mental', '[{"name": "A Taste for Blood", "level": 1, "description": "Sense blood"}, {"name": "Extinguish Vitae", "level": 2, "description": "Destroy blood"}, {"name": "Scry the Soul", "level": 3, "description": "Read target''s nature"}]'),
('Oblivion', 'Power over death and shadows', 'Mental', '[{"name": "Shadow Cloak", "level": 1, "description": "Control shadows"}, {"name": "Touch of Oblivion", "level": 2, "description": "Deal aggravated damage"}, {"name": "Shadow Step", "level": 3, "description": "Travel through shadows"}]'),
('Thin-Blood Alchemy', 'Unique powers of thin-bloods', 'Mental', '[{"name": "Day Drinker", "level": 1, "description": "Resist sunlight"}, {"name": "Feign Death", "level": 2, "description": "Appear dead"}, {"name": "Taste of Blood", "level": 3, "description": "Mimic disciplines"}]');

-- clans
INSERT INTO clans (name, description, bane, compulsion, favored_attributes, clan_disciplines, sect) VALUES
('Brujah', 'Rebels and philosophers who value passion and action. Once scholars and warriors, now punks and activists.', 'Fury: When provoked, must make a Resolve + Composure roll or fly into a rage, losing control.', 'Violence: Must act aggressively when insulted or challenged, escalating conflicts.', 'Physical', '[1, 2, 3]', 'Camarilla'),
('Gangrel', 'Survivors and loners who embrace their animal nature. Shapeshifters who prefer the wild.', 'Beast: Animal features appear when Hunger rises above 2, becoming permanent marks.', 'Frenzy: Must resist frenzy when in danger, losing humanity to the Beast.', 'Physical', '[4, 5, 6]', 'Independent'),
('Malkavian', 'Seers touched by madness who see hidden truths others cannot. Prophets and madmen.', 'Derangements: All Malkavians have a derangement that affects their behavior.', 'Delusion: Must act on a delusion when stressed, seeing things that aren\'t there.', 'Mental', '[7, 8, 9]', 'Camarilla'),
('Nosferatu', 'Hideous outcasts who gather secrets in the shadows. Information brokers and spies.', 'Repulsive: Cannot use Social skills on mortals without Masquerade risk. Always hideous.', 'Paranoia: Must act on suspicion when threatened, seeing conspiracies everywhere.', 'Social', '[6, 10, 11]', 'Camarilla'),
('Toreador', 'Artists and hedonists who appreciate beauty. Socialites and aesthetes.', 'Aesthetic Fixation: Must make a Resolve + Composure roll or be captivated by beauty, losing focus.', 'Melancholy: Falls into depression when art is destroyed or beauty is lost.', 'Social', '[1, 7, 9]', 'Camarilla'),
('Tremere', 'Warlocks who practice blood magic and maintain strict hierarchy. Scholars and manipulators.', 'Blood Bond: Cannot break blood bonds, always bound to their sire and clan.', 'Perfectionism: Must succeed at all costs, cannot accept failure gracefully.', 'Mental', '[7, 8, 10]', 'Camarilla'),
('Ventrue', 'Nobles and leaders who command respect. Corporate executives and aristocrats.', 'Feeding Restriction: Can only feed from specific types of mortals (e.g., only virgins, only criminals).', 'Arrogance: Must assert dominance when challenged, cannot back down from confrontations.', 'Social', '[3, 8, 9]', 'Camarilla'),
('Caitiff', 'Clanless vampires without a clan curse. Outcasts and rebels.', 'None: No clan bane, but also no clan support or identity.', 'Alienation: Feels disconnected from Kindred society, struggles with identity.', 'Any', '[1, 2, 3]', 'Camarilla'),
('Thin-Blood', 'Weak-blooded vampires of 15th+ generation. Barely Kindred, almost human.', 'Thin Blood: Limited powers, can walk in sunlight, need less blood.', 'Mortality: Struggles with human connections, feels neither human nor Kindred.', 'Any', '[12]', 'Anarch'),
('The Ministry', 'Formerly Followers of Set. Corrupters and tempters who spread discord and undermine society. Revere the Egyptian god Set.', 'Serpent''s Bite: Take double damage from sunlight (aggravated damage). More vulnerable to bright light than other Kindred.', 'Temptation: Must corrupt or tempt others when opportunity arises, spreading vice and discord.', 'Social', '[5, 6, 9]', 'Anarch'),
('Lasombra', 'Shadow manipulators and power brokers. Control darkness and command respect through fear.', 'Bane of Shadows: Cannot be photographed or recorded, appear as shadows in mirrors and cameras.', 'Hubris: Must assert dominance and control, cannot accept being subservient.', 'Social', '[2, 8, 11]', 'Sabbat'),
('Tzimisce', 'Body-shapers and territorial masters. Transform flesh and command loyalty through fear.', 'Clan Bane: Must sleep with grave soil from their homeland, or suffer penalties.', 'Avarice: Obsessed with possessions and territory, must defend what is theirs.', 'Mental', '[4, 5, 8]', 'Sabbat'),
('Banu Haqim', 'Assassins and judges who enforce justice. Warriors and scholars of the blood.', 'Blood Addiction: Must make rolls to resist feeding frenzy when smelling blood.', 'Obsession: Fixated on a goal or target, cannot rest until it is achieved.', 'Physical', '[1, 6, 10]', 'Independent'),
('Ravnos', 'Tricksters and wanderers who live by their wits. Nomads and illusionists.', 'Clan Bane: Must make rolls to resist committing crimes or acts of chaos when stressed.', 'Wanderlust: Cannot stay in one place too long, must move or suffer restlessness.', 'Social', '[4, 6, 9]', 'Independent'),
('Hecata', 'Death cultists and necromancers. Formerly Giovanni, now a united clan of death-mages.', 'Bane of Death: Cannot create new vampires, only Embrace through special rituals.', 'Obsession: Fixated on death, the dead, or necromancy, cannot ignore opportunities to study it.', 'Mental', '[3, 7, 11]', 'Independent');

-- merits
INSERT INTO merits (name, description, cost, category, max_rating, restrictions) VALUES
('Acute Senses', 'Enhanced perception in one sense (sight, hearing, smell, taste, touch)', 1, 'Physical', 1, NULL),
('Ambidextrous', 'No penalty for using off-hand', 1, 'Physical', 1, NULL),
('Barfly', 'Resist social penalties when drunk', 1, 'Social', 1, NULL),
('Bruiser', 'Intimidating presence, +1 to Intimidation', 1, 'Social', 1, NULL),
('Common Sense', 'GM can warn about bad decisions', 1, 'Mental', 1, NULL),
('Danger Sense', 'Sense immediate danger, +1 to Awareness', 2, 'Mental', 1, NULL),
('Eat Food', 'Can consume food (rare for vampires)', 1, 'Supernatural', 1, NULL),
('Fame', 'Recognized by the public', 1, 'Social', 5, NULL),
('Fast Reflexes', 'Add dice to initiative rolls', 1, 'Physical', 1, NULL),
('Fleet of Foot', 'Run faster than normal, +1 to Athletics', 1, 'Physical', 1, NULL),
('Good Time Management', 'More efficient use of time', 1, 'Mental', 1, NULL),
('Iron Will', 'Resist mental influence, +1 to Resolve', 2, 'Mental', 1, NULL),
('Language', 'Speak additional languages fluently', 1, 'Mental', 5, NULL),
('Library', 'Access to research materials', 1, 'Mental', 5, NULL),
('Mentor', 'Have a powerful teacher or guide', 1, 'Social', 5, NULL),
('Resources', 'Wealth and financial assets', 1, 'Social', 5, NULL),
('Retainer', 'Loyal mortal servant', 1, 'Social', 5, NULL),
('Status', 'Rank in Kindred society', 1, 'Social', 5, NULL),
('Striking Looks', 'Exceptionally attractive, +1 to Social rolls', 2, 'Social', 1, NULL),
('Unbondable', 'Cannot be blood bound', 3, 'Supernatural', 1, NULL),
('Ventrue Feeding', 'Can feed from specific type without penalty', 1, 'Supernatural', 1, 'Ventrue only'),
('Day Drinker', 'Resist sunlight damage', 2, 'Supernatural', 1, 'Thin-Blood only'),
('Thin-Blood Alchemy', 'Access to Thin-Blood Alchemy discipline', 1, 'Supernatural', 1, 'Thin-Blood only');

-- flaws
INSERT INTO flaws (name, description, cost, category, max_rating, restrictions) VALUES
('Addiction', 'Addicted to something (drugs, blood, gambling)', -1, 'Mental', 1, NULL),
('Amnesia', 'Cannot remember past before Embrace', -2, 'Mental', 1, NULL),
('Anarch', 'Rejected by Camarilla, -2 to Status', -1, 'Social', 1, NULL),
('Archaic', 'Out of touch with modern world', -1, 'Mental', 1, NULL),
('Bad Sight', 'Poor vision, -1 to Awareness', -1, 'Physical', 1, NULL),
('Bestial Temper', 'Prone to frenzy, -1 to resist', -2, 'Mental', 1, NULL),
('Blood Bond', 'Bound to another vampire', -2, 'Supernatural', 1, NULL),
('Clan Enmity', 'Hated by a specific clan', -1, 'Social', 1, NULL),
('Dark Secret', 'Dangerous secret that could destroy you', -2, 'Social', 1, NULL),
('Deformity', 'Physical disfigurement, -1 to Social rolls', -1, 'Physical', 1, NULL),
('Derangement', 'Mental illness affecting behavior', -1, 'Mental', 1, NULL),
('Elder', 'Very old, out of touch with modern times', -1, 'Social', 1, NULL),
('Enemy', 'Someone wants you dead or harmed', -1, 'Social', 5, NULL),
('Folkloric Block', 'Cannot use certain abilities (e.g., cannot cross running water)', -1, 'Supernatural', 1, NULL),
('Hunted', 'Being actively pursued by hunters', -2, 'Social', 1, NULL),
('Illiterate', 'Cannot read', -1, 'Mental', 1, NULL),
('Infamous Sire', 'Your sire is notorious, affects your reputation', -1, 'Social', 1, NULL),
('Lifesaver', 'Cannot bring yourself to kill mortals', -2, 'Mental', 1, NULL),
('Long Bond', 'Bound to your sire, cannot break free', -1, 'Supernatural', 1, NULL),
('Nightmares', 'Troubled by bad dreams, -1 to rest', -1, 'Mental', 1, NULL),
('Notoriety', 'Known for negative reasons, -1 to Status', -1, 'Social', 1, NULL),
('Oblivion\'s Call', 'Drawn to the Abyss, risk of losing humanity', -2, 'Supernatural', 1, NULL),
('Obvious Predator', 'Clearly dangerous to mortals, Masquerade risk', -1, 'Social', 1, NULL),
('Prey Exclusion', 'Cannot feed from certain sources', -1, 'Supernatural', 1, NULL),
('Repulsed by Garlic', 'Cannot stand garlic, -1 to resist', -1, 'Supernatural', 1, NULL),
('Shy', 'Difficulty in social situations, -1 to Social rolls', -1, 'Social', 1, NULL),
('Soft-Hearted', 'Easily moved by others\' suffering', -1, 'Mental', 1, NULL),
('Stigmata', 'Bleed from wounds like Christ, Masquerade risk', -1, 'Supernatural', 1, NULL),
('Thin-Blooded', 'Weak blood, limited powers, 15th+ generation', -2, 'Supernatural', 1, NULL),
('Unbondable', 'Cannot form blood bonds (also a merit)', -1, 'Supernatural', 1, NULL);

-- backgrounds
INSERT INTO backgrounds (name, description, max_rating, category) VALUES
('Allies', 'Mortals who help you, provide information and support', 5, 'Social'),
('Contacts', 'People with useful information in various fields', 5, 'Social'),
('Fame', 'Public recognition and celebrity status', 5, 'Social'),
('Generation', 'Power of your bloodline (lower is better)', 5, 'Supernatural'),
('Haven', 'Safe place to rest during the day', 5, 'Physical'),
('Herd', 'Mortals you feed from regularly without risk', 5, 'Social'),
('Influence', 'Power over mortal institutions (police, media, etc.)', 5, 'Social'),
('Mask', 'False identity in mortal world', 5, 'Social'),
('Mentor', 'Powerful teacher who guides you', 5, 'Social'),
('Resources', 'Wealth and financial assets', 5, 'Social'),
('Retainers', 'Loyal servants (mortal or ghoul)', 5, 'Social'),
('Status', 'Rank in Kindred society (Camarilla, Anarch, etc.)', 5, 'Social');

-- sects (with free background bonuses)
INSERT INTO sects (name, description, philosophy, structure, common_clans, free_background_id, free_background_rating) VALUES
('Camarilla', 'The largest and most organized sect, focused on maintaining the Masquerade and controlling mortal society', 'Maintain secrecy, preserve the Masquerade, control mortal society, follow the Traditions', 'Hierarchical with Princes ruling cities, Primogen councils, and Justicars overseeing regions', '[1, 3, 4, 5, 6, 7, 8]', 
    (SELECT id FROM backgrounds WHERE name = 'Status' LIMIT 1), 1),
('Sabbat', 'Radical sect that embraces the Beast and rejects human morality, preparing for Gehenna', 'Embrace the Beast, destroy the Antediluvians, freedom from the Masquerade, war against the Camarilla', 'Military structure with Bishops and Archbishops, packs instead of coteries', '[2, 9, 10]', 
    NULL, NULL),
('Anarch', 'Rebels who reject both Camarilla and Sabbat control, seeking freedom from elders', 'Freedom from elders, self-determination, equality among Kindred, reject the Traditions', 'Loose confederations with Barons ruling territories, democratic coteries', '[1, 2, 8, 9]', 
    NULL, NULL),
('Independent', 'Clans that remain neutral in sect politics', 'Stay out of sect politics, maintain independence, follow own traditions', 'Varies by clan, often loose associations', '[2, 11, 12]', 
    NULL, NULL);

-- predator types (each gives free dots in disciplines, skills, or backgrounds)
-- using subqueries to look up IDs by name to avoid foreign key constraint errors
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
    NULL, NULL, 'Must have access to corpses');

-- locations
INSERT INTO locations (name, type, country, description, prince, sect, population, notable_locations) VALUES
('New York', 'City', 'USA', 'Massive Camarilla stronghold with multiple Princes and intense political intrigue', 'Various', 'Camarilla', 8000000, '["Manhattan", "Brooklyn", "Queens", "The Bronx"]'),
('Los Angeles', 'City', 'USA', 'Anarch-controlled city with heavy Hollywood influence and thin-blood presence', 'Vanessa', 'Anarch', 4000000, '["Hollywood", "Downtown", "Venice Beach", "Santa Monica"]'),
('Chicago', 'City', 'USA', 'Classic Camarilla domain with political intrigue and a powerful Prince', 'Lodin', 'Camarilla', 2700000, '["The Loop", "Wrigleyville", "South Side", "Hyde Park"]'),
('London', 'City', 'UK', 'Ancient Camarilla domain with deep history and powerful elders', 'Mithras', 'Camarilla', 9000000, '["Westminster", "East End", "Thames", "Soho"]'),
('Berlin', 'City', 'Germany', 'Divided between Camarilla and Anarchs with ongoing conflict', 'Various', 'Mixed', 3700000, '["Mitte", "Kreuzberg", "Prenzlauer Berg", "Charlottenburg"]'),
('San Francisco', 'City', 'USA', 'Anarch stronghold with tech industry influence', 'Various', 'Anarch', 870000, '["Downtown", "Mission District", "Haight-Ashbury", "Silicon Valley"]'),
('Paris', 'City', 'France', 'Elegant Camarilla domain with Toreador influence', 'Various', 'Camarilla', 2100000, '["Champs-Élysées", "Montmartre", "Latin Quarter", "Le Marais"]'),
('Moscow', 'City', 'Russia', 'Sabbat-controlled city with brutal politics', 'Various', 'Sabbat', 12000000, '["Red Square", "Kremlin", "Arbat", "Outskirts"]');

