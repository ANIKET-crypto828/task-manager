-- Initialize database with extensions if needed

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Optional: Create additional schemas or initial data