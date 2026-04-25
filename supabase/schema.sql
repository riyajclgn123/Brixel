create extension if not exists "uuid-ossp";

create table students (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  grade text,
  device_id text,
  created_at timestamptz default now()
);

create table sessions (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade,
  subject text,
  started_at timestamptz default now(),
  ended_at timestamptz
);

create table captures (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  captured_at timestamptz default now(),
  image_url text,
  raw_text text,
  braille_unicode text,
  braille_brf text,
  audio_url text,
  subject_guess text,
  confidence float,
  is_assignment boolean default false
);

alter table captures enable row level security;
alter table sessions enable row level security;
alter table students enable row level security;

create policy "Allow all" on captures for all using (true);
create policy "Allow all" on sessions for all using (true);
create policy "Allow all" on students for all using (true);