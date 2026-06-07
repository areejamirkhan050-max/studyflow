# StudyFlow – Kiro Steering Document

## Project Summary
StudyFlow is a Smart Study Planner for Pakistani students (Matric/FSc/O-Level/A-Level). It solves unorganized study habits by providing task management, weekly timetable, goal tracking, and Pomodoro timer.

## Problem Statement
Pakistani students struggle with:
- No structured study schedule
- Forgetting assignment deadlines
- No way to track study goals
- Lack of focus during study sessions

## How Kiro Was Used

### Spec-Driven Development
Before writing any code, Kiro specs were used to define user stories, data models, and UI layout.

### Agent Tasks via Kiro
- Task 1: Scaffold Vite + React project
- Task 2: Design system and dark theme
- Task 3: localStorage persistence hook
- Task 4: Task Manager with priorities
- Task 5: Weekly Timetable grid
- Task 6: Goal Tracker with progress bars
- Task 7: Pomodoro Timer with SVG ring
- Task 8: Dashboard with stats

### Hooks
- pre-file-save: No external API calls allowed
- post-task: Verify localStorage keys are consistent

## Tech Stack
- React 18 + Vite
- localStorage (works offline, no backend)
- Deployed on Vercel

## Features
1. Dashboard — stats overview
2. Task Manager — subject, due date, priority
3. Weekly Timetable — 7-day visual schedule
4. Goal Tracker — daily progress tracking
5. Pomodoro Timer — 25/5 min focus/break