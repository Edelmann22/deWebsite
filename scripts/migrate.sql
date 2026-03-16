-- Language Course: classes table
CREATE TABLE IF NOT EXISTS classes (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  student_user_id INTEGER,
  language    TEXT NOT NULL DEFAULT 'Deutsch',
  teacher     TEXT NOT NULL DEFAULT 'Rosi Vaseva',
  created_by_user_id INTEGER,
  color       TEXT NOT NULL DEFAULT '#2f8f9d',
  details_background_color TEXT NOT NULL DEFAULT '#e7f6f8',
  slot_color  TEXT NOT NULL DEFAULT '#cfecee',
  online      BOOLEAN NOT NULL DEFAULT FALSE,
  date        DATE NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  lesson_notes TEXT NOT NULL DEFAULT '',
  homework    TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT '#2f8f9d';

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS student_user_id INTEGER;

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER;

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS details_background_color TEXT NOT NULL DEFAULT '#e7f6f8';

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS slot_color TEXT NOT NULL DEFAULT '#cfecee';

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS online BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  event_date DATE,
  created_by_user_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'classes_created_by_user_id_fkey'
      AND table_name = 'classes'
  ) THEN
    ALTER TABLE classes
    ADD CONSTRAINT classes_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'classes_student_user_id_fkey'
      AND table_name = 'classes'
  ) THEN
    ALTER TABLE classes
    ADD CONSTRAINT classes_student_user_id_fkey
    FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index for fast month-range queries
CREATE INDEX IF NOT EXISTS idx_classes_date ON classes (date);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions (token_hash);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'events_created_by_user_id_fkey'
      AND table_name = 'events'
  ) THEN
    ALTER TABLE events
    ADD CONSTRAINT events_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;
