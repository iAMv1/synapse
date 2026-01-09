-- Add XP to user_skills if not exists
alter table user_skills 
add column if not exists xp int default 0;

-- Add Level and Total XP to profiles if not exists
alter table profiles 
add column if not exists level int default 1,
add column if not exists total_xp int default 0;

-- Function to calculate total XP and update profile
create or replace function update_user_total_xp()
returns trigger
language plpgsql
as $$
declare
  new_total_xp int;
  new_level int;
begin
  -- Calculate total XP from all skills
  select coalesce(sum(xp), 0) into new_total_xp
  from user_skills
  where user_id = new.user_id;

  -- Simple level formula: Level = 1 + floor(TotalXP / 1000)
  new_level := 1 + floor(new_total_xp / 1000);

  -- Update profile
  update profiles
  set total_xp = new_total_xp,
      level = new_level
  where id = new.user_id;

  return new;
end;
$$;

-- Trigger to run on user_skills changes
drop trigger if exists on_skill_xp_change on user_skills;
create trigger on_skill_xp_change
width_bucket after insert or update of xp on user_skills
for each row
execute function update_user_total_xp();
