-- clans table
CREATE TABLE IF NOT EXISTS clans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    bane TEXT,
    compulsion TEXT,
    favored_attributes VARCHAR(50),
    clan_disciplines VARCHAR(200),
    sect VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- disciplines table
CREATE TABLE IF NOT EXISTS disciplines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50),
    powers JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- attributes table
CREATE TABLE IF NOT EXISTS attributes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE KEY unique_attr (category, name)
);

-- skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    specialty_examples TEXT,
    UNIQUE KEY unique_skill (category, name)
);

-- merits table
CREATE TABLE IF NOT EXISTS merits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    cost INT NOT NULL,
    category VARCHAR(50),
    max_rating INT DEFAULT 1,
    restrictions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- flaws table
CREATE TABLE IF NOT EXISTS flaws (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    cost INT NOT NULL,
    category VARCHAR(50),
    max_rating INT DEFAULT 1,
    restrictions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- backgrounds table
CREATE TABLE IF NOT EXISTS backgrounds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    max_rating INT DEFAULT 5,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- characters table
CREATE TABLE IF NOT EXISTS characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    player_name VARCHAR(100),
    chronicle VARCHAR(100),
    concept VARCHAR(200),
    clan_id INT,
    generation INT DEFAULT 13,
    sire VARCHAR(100),
    embrace_date DATE,
    apparent_age INT,
    date_of_birth DATE,
    true_age INT,
    strength INT DEFAULT 1,
    dexterity INT DEFAULT 1,
    stamina INT DEFAULT 1,
    charisma INT DEFAULT 1,
    manipulation INT DEFAULT 1,
    composure INT DEFAULT 1,
    intelligence INT DEFAULT 1,
    wits INT DEFAULT 1,
    resolve INT DEFAULT 1,
    health_max INT DEFAULT 3,
    health_current INT DEFAULT 3,
    willpower_max INT DEFAULT 1,
    willpower_current INT DEFAULT 1,
    humanity INT DEFAULT 7,
    hunger INT DEFAULT 0,
    experience_total INT DEFAULT 0,
    experience_spent INT DEFAULT 0,
    experience_available INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clan_id) REFERENCES clans(id) ON DELETE SET NULL
);

-- character skills
CREATE TABLE IF NOT EXISTS character_skills (
    character_id INT NOT NULL,
    skill_id INT NOT NULL,
    rating INT DEFAULT 0,
    specialties JSON,
    PRIMARY KEY (character_id, skill_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- character disciplines
CREATE TABLE IF NOT EXISTS character_disciplines (
    character_id INT NOT NULL,
    discipline_id INT NOT NULL,
    rating INT DEFAULT 0,
    powers JSON,
    PRIMARY KEY (character_id, discipline_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE
);

-- character merits
CREATE TABLE IF NOT EXISTS character_merits (
    character_id INT NOT NULL,
    merit_id INT NOT NULL,
    rating INT DEFAULT 1,
    notes TEXT,
    PRIMARY KEY (character_id, merit_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (merit_id) REFERENCES merits(id) ON DELETE CASCADE
);

-- character flaws
CREATE TABLE IF NOT EXISTS character_flaws (
    character_id INT NOT NULL,
    flaw_id INT NOT NULL,
    rating INT DEFAULT 1,
    notes TEXT,
    PRIMARY KEY (character_id, flaw_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (flaw_id) REFERENCES flaws(id) ON DELETE CASCADE
);

-- character backgrounds
CREATE TABLE IF NOT EXISTS character_backgrounds (
    character_id INT NOT NULL,
    background_id INT NOT NULL,
    rating INT DEFAULT 0,
    details TEXT,
    PRIMARY KEY (character_id, background_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (background_id) REFERENCES backgrounds(id) ON DELETE CASCADE
);

-- sects table
CREATE TABLE IF NOT EXISTS sects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    philosophy TEXT,
    structure TEXT,
    common_clans JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- locations table
CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    country VARCHAR(100),
    description TEXT,
    prince VARCHAR(100),
    sect VARCHAR(50),
    population INT,
    notable_locations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- predator types table
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

-- request logs table
CREATE TABLE IF NOT EXISTS request_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    method VARCHAR(10),
    endpoint VARCHAR(255),
    status_code INT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- story sessions for ai story generation with dice rolls
CREATE TABLE IF NOT EXISTS story_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    character_id INT,
    title VARCHAR(200),
    story_content TEXT,
    dice_rolls JSON,
    current_scene TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
);