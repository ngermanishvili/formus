-- Add project_id column to apartments table
ALTER TABLE apartments ADD COLUMN project_id INTEGER;

-- Create a new table for blocks that belong to specific projects
CREATE TABLE IF NOT EXISTS project_blocks (
    block_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Insert default blocks for the existing Ortachala Hills project (assuming project_id 1)
INSERT INTO project_blocks (project_id, name, description)
VALUES 
    (1, 'A', 'Block A of Ortachala Hills'),
    (1, 'B', 'Block B of Ortachala Hills'),
    (1, 'D', 'Block D of Ortachala Hills');

-- Set the default project_id for existing apartments to 1 (Ortachala Hills)
UPDATE apartments SET project_id = 1;

-- Make project_id NOT NULL after setting default value
ALTER TABLE apartments ALTER COLUMN project_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE apartments
ADD CONSTRAINT fk_apartment_project
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Update the block_id in apartments to reference the new project_blocks table
-- First, create a temporary column to store the old block_id values
ALTER TABLE apartments ADD COLUMN temp_block_id VARCHAR(50);
UPDATE apartments SET temp_block_id = block_id;

-- Change the data type of block_id to INTEGER
ALTER TABLE apartments ALTER COLUMN block_id TYPE INTEGER USING (block_id::INTEGER);

-- Update block_id to reference the new project_blocks IDs
-- (This assumes block names in the old system match the new ones - A, B, D)
UPDATE apartments a
SET block_id = pb.block_id
FROM project_blocks pb
WHERE pb.name = a.temp_block_id AND pb.project_id = a.project_id;

-- Drop the temporary column
ALTER TABLE apartments DROP COLUMN temp_block_id;

-- Add foreign key constraint for block_id
ALTER TABLE apartments
ADD CONSTRAINT fk_apartment_block
FOREIGN KEY (block_id) REFERENCES project_blocks(block_id) ON DELETE CASCADE; 