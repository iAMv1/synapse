-- Migration: Add invite codes and descriptions to rooms
-- This enables room sharing via unique codes

-- Add new columns to rooms table
-- Using VARCHAR(10) to accommodate 'SYN' prefix + 6 chars safely
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS invite_code VARCHAR(10) UNIQUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS description TEXT;

-- Create function to generate invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result VARCHAR(10) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN 'SYN' || result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invite code on room creation
CREATE OR REPLACE FUNCTION set_room_invite_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invite_code IS NULL THEN
        NEW.invite_code := generate_invite_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rooms_invite_code_trigger ON rooms;
CREATE TRIGGER rooms_invite_code_trigger
    BEFORE INSERT ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION set_room_invite_code();

-- Update existing rooms with invite codes
-- Note: existing rows might violate the constraint if we added NOT NULL immediately, 
-- but we are just adding the column first.
-- We update them now:
UPDATE rooms SET invite_code = generate_invite_code() WHERE invite_code IS NULL;

-- Add role column to room_members for access control
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member'));

-- Policy for room creation (owners are auto-added as members)
CREATE OR REPLACE FUNCTION add_room_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO room_members (room_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner')
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rooms_add_owner_trigger ON rooms;
CREATE TRIGGER rooms_add_owner_trigger
    AFTER INSERT ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION add_room_owner_as_member();

-- Policy: Only room members can view private rooms
DROP POLICY IF EXISTS "View private rooms" ON rooms;
CREATE POLICY "View private rooms" ON rooms
    FOR SELECT USING (
        is_public = true
        OR created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM room_members
            WHERE room_members.room_id = rooms.id
            AND room_members.user_id = auth.uid()
        )
    );

-- Drop the old public join policy if it exists
DROP POLICY IF EXISTS "Public Join" ON rooms;

-- Policy: Users can insert rooms
DROP POLICY IF EXISTS "Users can create rooms" ON rooms;
CREATE POLICY "Users can create rooms" ON rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);
