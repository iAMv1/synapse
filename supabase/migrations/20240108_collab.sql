-- Create room_members table first as it's a dependency
create table if not exists room_members (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id, user_id)
);

-- Enable RLS for room_members
alter table room_members enable row level security;

-- Policies for room_members
create policy "Public Read Members" on room_members for select using (true);
create policy "Self Join" on room_members for insert with check (auth.uid() = user_id);
create policy "Self Leave" on room_members for delete using (auth.uid() = user_id);

-- Create room_notes table
create table if not exists room_notes (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  content text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id)
);

-- Enable RLS for room_notes
alter table room_notes enable row level security;

-- Policy: Room members can view notes
create policy "Room members can view notes"
on room_notes for select
to authenticated
using (
  exists (
    select 1 from room_members
    where room_members.room_id = room_notes.room_id
    and room_members.user_id = auth.uid()
  )
  or
  exists (
    select 1 from rooms
    where rooms.id = room_notes.room_id
    and rooms.created_by = auth.uid()
  )
);

-- Policy: Room members can update notes
create policy "Room members can update notes"
on room_notes for update
to authenticated
using (
  exists (
    select 1 from room_members
    where room_members.room_id = room_notes.room_id
    and room_members.user_id = auth.uid()
  )
  or
  exists (
    select 1 from rooms
    where rooms.id = room_notes.room_id
    and rooms.created_by = auth.uid()
  )
);

-- Policy: Room members can insert notes
create policy "Room members can insert notes"
on room_notes for insert
to authenticated
with check (
  exists (
    select 1 from room_members
    where room_members.room_id = room_notes.room_id
    and room_members.user_id = auth.uid()
  )
  or
  exists (
    select 1 from rooms
    where rooms.id = room_notes.room_id
    and rooms.created_by = auth.uid()
  )
);

-- Realtime needs to be explicitly enabled for this table to broadcast changes
alter publication supabase_realtime add table room_notes;
