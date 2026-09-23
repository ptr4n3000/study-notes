# Study Notes

Study Notes is a small, private note-taking web application. Users can register, log in, and create, view, edit, or delete their own notes. Supabase Row Level Security keeps every user's data separate.

## Live application

Deployment link: _add after Netlify deployment_

## Demo video

Unlisted YouTube video: _add before submission_

## Features

- Email and password registration, login, and logout
- Create, read, update, and delete notes
- Private notes protected by database policies
- Responsive interface with loading, empty, and error states

## Technologies

- React and Vite
- Supabase Auth and PostgreSQL
- Supabase Row Level Security
- Netlify
- Git and GitHub

## Local setup

1. Clone this repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and publishable key.
5. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor.
6. Run `npm run dev`.

## Project structure

- `src/components`: authentication, note form, list, and card components
- `src/lib/supabaseClient.js`: Supabase browser client
- `src/App.jsx`: session management and database operations
- `supabase/schema.sql`: table, grants, trigger, and RLS policies

## Database design

The `notes` table stores a title, content, owner ID, creation time, and update time. Four separate RLS policies allow authenticated users to select, insert, update, and delete only rows whose `user_id` matches their authenticated Supabase user ID.

## AI-assisted development

This project was developed with Codex assistance. AI was used to scaffold the interface, connect Supabase authentication and CRUD operations, and review the database security policies. The application was tested manually, including a two-user privacy test.
