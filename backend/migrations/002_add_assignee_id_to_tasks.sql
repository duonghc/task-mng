-- Migration: add assignee_id to tasks
ALTER TABLE tasks ADD COLUMN assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
UPDATE tasks SET assignee_id = user_id WHERE assignee_id IS NULL;
