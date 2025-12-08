-- update script to add free background bonuses to sects table (safe version)
-- run this after your existing schema and seed data
-- This version checks if columns exist before adding them

USE vtm_gm_api;

-- check and add free_background_id column if it doesn't exist
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'sects' 
    AND COLUMN_NAME = 'free_background_id'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE sects ADD COLUMN free_background_id INT',
    'SELECT "Column free_background_id already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- check and add free_background_rating column if it doesn't exist
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'sects' 
    AND COLUMN_NAME = 'free_background_rating'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE sects ADD COLUMN free_background_rating INT DEFAULT 1',
    'SELECT "Column free_background_rating already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- check and add foreign key constraint if it doesn't exist
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'sects' 
    AND CONSTRAINT_NAME = 'fk_sects_free_background'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE sects ADD CONSTRAINT fk_sects_free_background FOREIGN KEY (free_background_id) REFERENCES backgrounds(id) ON DELETE SET NULL',
    'SELECT "Foreign key constraint fk_sects_free_background already exists" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- update existing sects with free background bonuses
-- Camarilla gets Status 1 (free)
UPDATE sects 
SET free_background_id = (SELECT id FROM backgrounds WHERE name = 'Status' LIMIT 1),
    free_background_rating = 1
WHERE name = 'Camarilla';

-- other sects don't have free backgrounds by default
-- you can add more if needed:
-- UPDATE sects 
-- SET free_background_id = (SELECT id FROM backgrounds WHERE name = 'Herd' LIMIT 1),
--     free_background_rating = 1
-- WHERE name = 'Anarch';

