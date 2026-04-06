-- Add build_status column for tracking autonomous school building
ALTER TABLE schools ADD COLUMN IF NOT EXISTS build_status text DEFAULT 'pending';
CREATE INDEX IF NOT EXISTS idx_schools_build_status ON schools(build_status);
