# StudyFlow – Requirements Spec

## User Stories

### Tasks
- Add task with subject, title, due date, priority
- Mark tasks as done
- Delete tasks
- Tasks persist after closing browser

### Timetable
- Add study sessions to specific days
- Visual 7-day timetable with color-coded subjects
- Remove sessions by clicking them

### Goals
- Set goal with name and target days
- Track daily progress
- Progress bar showing completion

### Timer
- 25-minute focus timer with countdown ring
- 5-minute break timer
- Pause and reset timer

### Dashboard
- Stats: total tasks, completed, hours/week, goals
- Upcoming pending tasks list

## Functional Requirements
- Tasks stored in localStorage key: sf_tasks
- Sessions stored in localStorage key: sf_sessions
- Goals stored in localStorage key: sf_goals
- App works fully offline, no external API
- Works on mobile browsers

## Out of Scope
- User login
- Cloud sync
- AI features
- PDF export