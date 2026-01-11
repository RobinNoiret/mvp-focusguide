# Brainstorming Session Results

**Session Date:** 2026-01-09
**Facilitator:** Business Analyst Mary 📊
**Participant:** User (Co-founder, Focus Guide)

---

## Executive Summary

**Topic:** Feature Ideas for Focus Guide Application - MVP Definition

**Session Goals:**
Refine initial feature ideas into solid specifications ready for architecture and development. Transform broad product vision into actionable MVP scope for a 2-person team building a SaaS productivity tool with users already on waiting list.

**Techniques Used:**
1. Resource Constraints (MVP Forcing Function)
2. First Principles Thinking (Feature Breakdown)
3. Six Thinking Hats - Black Hat (Risk Analysis)
4. Resource Constraints - Simplification Round
5. User Journey Mapping (Navigation & Flow)
6. Dot Voting (Build Sequence Prioritization)
7. Question Storming (Architecture Prep)

**Total Ideas Generated:** 3 core MVP features with detailed specifications, plus ~15 post-MVP enhancements identified and deferred

### Key Themes Identified:
- **Focus-First Philosophy:** Bridge the gap between project planning and daily execution
- **Simplicity & Maintainability:** Side project constraints drive architectural decisions
- **Data Integrity:** Never lose user data - critical non-functional requirement
- **Incremental Delivery:** Build Today → Projects → Connect → Pomodoro sequence enables early user testing
- **Strategic Deferral:** Clear V2 roadmap (collaboration, calendar sync, custom fields, PiP timer)

---

## Technique Sessions

### Technique 1: Resource Constraints (MVP Forcing Function) - 15 minutes

**Description:** Force prioritization by applying extreme constraints - "6 weeks, 5 features max" - to identify true MVP core.

**Ideas Generated:**
1. **Projects Page** - Grid view for project overview + Kanban view for project task management
2. **Today Page** - Daily focus board with 4-column kanban (Backlog, To Do Today, In Progress, Done)
3. **Pomodoro Timer** - Configurable focus timer on dedicated page

**Insights Discovered:**
- User already had clear product vision and Figma mockups
- The constraint revealed natural feature clustering around "strategic planning → daily execution → focused work"
- The 3 features tell a coherent product story
- Team already did the hard work of cutting scope - they came prepared!

**Notable Connections:**
- Product name "Focus Guide" aligns perfectly with feature set
- The 3 features create a complete workflow: Projects (strategy) → Today (tactics) → Pomodoro (execution)

---

### Technique 2: First Principles Thinking - Projects Feature - 25 minutes

**Description:** Break down Projects feature to fundamental requirements, questioning each assumption to build precise specifications.

**Ideas Generated:**

1. **Projects Grid View**
   - Display: Title, description, deadline, completion percentage (tasks completed/total), tags
   - Action: Click card → opens project detail view

2. **Project Detail View**
   - Header: Project title + back arrow + info icon (for settings/metadata)
   - Main: Kanban with 4 columns (Backlog, Todo, In Progress, Done)
   - Info panel: Custom fields (deferred to V2) - links, notes, attachments

3. **Project Creation**
   - Required: Title only
   - Optional: Description, deadline, tags/categories, tasks

4. **Task-Project Relationship Model**
   - Tasks have TWO optional relationships: Project link + Todo placement
   - Three creation paths:
     a. Create in Project → lives in project kanban → optionally drag to Today
     b. Create in Today directly → standalone task, no project link
     c. Create in Project + immediately add to Today
   - Result: Task can exist in project only, Today only, or both simultaneously

**Insights Discovered:**
- The flexible task model is brilliant - gives users choice without complexity
- Grid vs Kanban views serve completely different purposes (Grid = all PROJECTS overview, Kanban = one PROJECT's TASKS)
- Minimal required fields reduce friction for project creation
- Custom fields deferral to V2 significantly reduces MVP scope without losing core value

**Notable Connections:**
- Task relationship model mirrors real workflow: some work is project-based, some is ad-hoc
- The dual-presence model (task in Project AND Today) solves the "where do I track progress?" dilemma

---

### Technique 3: First Principles Thinking - Today Feature - 20 minutes

**Description:** Apply first principles to define the daily execution interface, with special focus on clarifying Vision A (multiple todo lists) vs Vision B (daily focus board).

**Ideas Generated:**

1. **Core Problem Definition**
   - Vision A: "I have tasks scattered everywhere and need flexible organization" → Multiple todo lists
   - Vision B: "I have too many projects and tasks, I need to focus on what matters TODAY" → Daily focus board
   - **DECISION: Vision B selected** - aligns with product name and positioning

2. **Today Page Structure: 4-Column Kanban**
   - **Backlog:** Brain dump zone for non-project tasks, not yet scheduled
   - **To Do Today:** Daily commitment, what user will work on today
   - **In Progress:** Actively working on right now
   - **Done:** Completed tasks (then archived/hidden from view, kept in database for history)

3. **Side Panel: Project Task Selector**
   - Dropdown/selector to choose any active project
   - Displays all tasks from selected project
   - Drag tasks from panel → To Do Today or Backlog columns

4. **Task Creation Options**
   - Create standalone tasks directly in Backlog (for ad-hoc, non-project work)
   - Create standalone tasks in To Do Today (urgent, one-off items)
   - Drag tasks from projects via side panel

5. **Task Completion Flow**
   - Move through columns: Backlog → To Do Today → In Progress → Done
   - Done tasks disappear from view (archived)
   - Maintain in database for statistics and history

**Insights Discovered:**
- The Backlog column solves "getting things out of your head" without cluttering Today
- Vision B creates strong product differentiation: "We help you bridge the gap between project planning and daily execution"
- Side panel is elegant solution for multi-project daily planning
- The 4-column flow gives users flexibility without overwhelming them

**Notable Connections:**
- Today page becomes the "hub" where strategy (projects) meets execution (daily work)
- This is where Focus Guide's unique value lives - the bridge between planning and doing

---

### Technique 4: First Principles Thinking - Pomodoro Feature - 10 minutes

**Description:** Define minimum viable Pomodoro timer specifications, with clear post-MVP evolution path.

**Ideas Generated:**

1. **Location & Access**
   - MVP: Dedicated page accessible via left navbar
   - Post-MVP: Picture-in-Picture mode when navigating to other pages

2. **Configuration Settings (All User-Customizable)**
   - Focus time (default: 25 minutes)
   - Break time (default: 5 minutes)
   - Number of repetitions (default: 3 cycles)
   - Auto-switch toggle (automatically advance from focus → break → focus)

3. **Timer Controls**
   - Start, pause, stop, reset
   - Visual countdown display

4. **Completion Actions**
   - Browser notification when timer completes
   - Sound design (audio alert - to be defined)

5. **Task Tracking (Deferred to Post-MVP)**
   - Link timer session to specific task
   - Log time spent to task/project
   - Pomodoro history and statistics

**Insights Discovered:**
- Pomodoro is intentionally simple for MVP - execution layer, not tracking layer
- Customization provides flexibility without complexity
- Clear post-MVP path (PiP, task tracking) prevents scope creep
- Sound design detail shows attention to user experience

**Notable Connections:**
- Pomodoro completes the workflow: Plan (Projects) → Schedule (Today) → Execute (Pomodoro)
- Keeping it simple for MVP means faster delivery and user testing

---

### Technique 5: Six Thinking Hats - Black Hat (Risk Analysis) - 15 minutes

**Description:** Devil's advocate perspective - identify risks, challenges, and potential problems with MVP scope.

**Ideas Generated:**

**Technical Challenges:**
1. **Drag & Drop:** Library exists (not worried), but API request handling for status changes on drop needs design
2. **Data Sync:** No real-time collaboration in MVP, but CRITICAL requirement - never lose user data
3. **Data Model Complexity:** Already thought through, less concerning

**User Confusion Risks:**
1. **Task Relationship Model:** Is it too complex? Counter-argument: Projects and Today are separate interfaces, the connection is optional, not mandatory

**Scope Creep Potential:**
2. Many post-MVP improvements possible: collaboration, calendar integration, advanced stats, custom fields
3. Need discipline to defer enhancements

**Team Limitations (Most Critical):**
4. **Side Project Reality:** Studies, alternance (internship/work-study), limited time
5. **Must be simple to maintain** - this is the TRUE north star constraint
6. **SaaS delivery required** - freemium model, cloud backend from day 1
7. Can't spend full weeks on this - maintainability is key

**Insights Discovered:**
- The "side project" constraint is the most important filter for all decisions
- Data integrity (never lose user modifications) is non-negotiable - impacts architecture significantly
- User confusion risk is low because the complexity is optional (can use Today without projects)
- Scope creep is manageable with clear V2 backlog

**Notable Connections:**
- Technical challenges are solvable with good architecture (task for architect agent)
- Maintainability requirement will drive tech stack choices and architectural patterns

---

### Technique 6: User Journey Mapping - 20 minutes

**Description:** Walk through day-in-the-life scenario (Marie, student in alternance) to clarify navigation, page hierarchy, and user flows.

**Scenario:** Marie has 3 active projects (Mémoire M2, Dev App Client, Apprendre React) and wants to plan her Monday.

**Ideas Generated:**

1. **Landing Page: Today**
   - Users land on Today page (focus-first!)
   - Reinforces "daily execution" positioning

2. **Navigation: Left Sidebar**
   - Today
   - Projects
   - Pomodoro
   - Account
   - (Settings - implied)

3. **Projects Page Flow**
   - Click "Projects" in navbar → Grid view of all projects
   - Each project card shows: title, description, deadline, progress %, tags
   - Click project card → Opens project detail view

4. **Project Detail View**
   - Header: Project title + back arrow + info icon (access settings/metadata)
   - Main content: Kanban (4 columns: Backlog, Todo, In Progress, Done)
   - Add task: In-column action or top button (Jira-style) - to be defined by UX

5. **Daily Planning Flow (Marie's workflow)**
   - Start on Today page
   - Open side panel → select "Mémoire M2" project
   - View tasks from that project
   - Drag 2 tasks to "To Do Today" column
   - Switch to "Dev App Client" in selector
   - Drag 1 task to "To Do Today"
   - Add standalone task directly in "To Do Today" (Buy groceries)
   - Now has 3 project tasks + 1 personal task in Today
   - Navigate to Pomodoro to start working

**Insights Discovered:**
- The side panel project selector is KEY innovation - allows multi-project daily planning
- Landing on Today (not Projects) reinforces product positioning
- Left navbar provides clear, simple navigation - no complex menus
- User flow is intuitive: Plan projects (Projects page) → Schedule day (Today page) → Execute (Pomodoro)

**Notable Connections:**
- Navigation structure mirrors mental model: strategic planning → daily execution → focused work
- The side panel solves "I work on multiple projects per day" use case elegantly

---

### Technique 7: Dot Voting - Build Sequence Prioritization - 10 minutes

**Description:** Determine optimal development sequence for MVP features to enable incremental delivery and early user testing.

**Options Evaluated:**

**Option A: Projects First**
1. Projects page (grid + kanban) → 2. Today page (+ drag from projects) → 3. Pomodoro
- Rationale: Foundation first, then daily execution

**Option B: Today First (SELECTED)**
1. Today page (4-column kanban, standalone tasks only)
2. Projects page (grid + project detail kanban)
3. Connection layer (drag from projects to Today, side panel)
4. Pomodoro timer
- Rationale: Users can start using immediately, add complexity incrementally

**Option C: Vertical Slice**
1. Simplified Today (2 columns) → 2. Simplified Projects (grid only) → 3. Add depth incrementally
- Rationale: Working end-to-end early, iterate

**Decision: Option B - Today First**

**Build Sequence Finalized:**

**Phase 1: Today Page (Standalone)**
- 4-column kanban: Backlog, To Do Today, In Progress, Done
- Create, edit, delete tasks
- Drag & drop between columns
- Task CRUD operations
- Basic authentication & user data persistence

**Phase 2: Projects Page**
- Grid view: Display all projects
- Project CRUD operations
- Project detail view with kanban (4 columns)
- Task CRUD within projects
- No connection to Today yet

**Phase 3: Connection Layer**
- Side panel on Today page
- Project selector in panel
- Display project tasks in panel
- Drag tasks from Projects → Today (creates link, task appears in both)
- Bidirectional sync (update in Today → updates in Project, vice versa)

**Phase 4: Pomodoro Timer**
- Dedicated page
- Configurable settings (focus time, break time, repetitions, auto-switch)
- Timer controls (start, pause, stop, reset)
- Notifications & sound on completion

**Insights Discovered:**
- Option B enables early user testing - users can validate Today page before projects exist
- Incremental complexity is easier for 2-person team to manage
- Each phase delivers user value independently
- Clear handoff points for architect and dev agents

**Notable Connections:**
- Build sequence mirrors user adoption: start simple (Today), add strategy layer (Projects), connect them, add execution tool (Pomodoro)
- Phase 1 is fully functional standalone product - could even launch as "super simple daily todo"

---

### Technique 8: Question Storming - 15 minutes

**Description:** Generate open questions and technical decisions to prepare for architect agent handoff.

**Questions Identified:**

**Category 1: Authentication & Security**
1. Authentication system design?
   - Email/password, OAuth (Google, GitHub?), magic link?
   - Separate auth database vs unified with business data?
   - User preference: Separate DBs, support Google OAuth at minimum
2. Password reset, email verification flows?
3. Session management strategy?

**Category 2: Data Model & Backend**
4. Database schema for task-project-today relationships?
   - User has initial idea but open to refinement
5. API architecture: REST confirmed, endpoint design?
6. Data integrity & error handling strategy (CRITICAL):
   - Optimistic UI with retry logic
   - Local queue for failed requests?
   - Visual feedback for sync failures?
   - Rollback mechanism if server definitively fails?

**Category 3: Frontend Libraries & Architecture**
7. Drag & drop library recommendation?
   - Requirement: Mature, established, won't need replacement in 3 months
   - Candidates: dnd-kit, react-beautiful-dnd
8. State management approach?
   - Context API, Redux, Zustand, Jotai?
9. Form handling library?
   - React Hook Form, Formik?

**Category 4: User Experience & Performance**
10. Real-time updates: Optimistic UI confirmed
    - Update UI immediately on user action
    - Handle background API call
    - NEVER lose data if API fails
11. PWA implementation details?
    - Offline capability scope
    - Service worker strategy
    - Install prompt UX

**Category 5: Deployment & Infrastructure**
12. Hosting solution?
   - Vercel, Railway, AWS, DigitalOcean?
   - Frontend and backend hosting (separate or unified)?
13. Database hosting?
   - Managed PostgreSQL (Supabase, Railway, AWS RDS)?
14. CI/CD pipeline setup?
15. Monitoring and error tracking?
    - Sentry, LogRocket?

**Category 6: Business Logic Edge Cases**
16. When project task is in Today and marked Done in Today, does it auto-update in Project kanban?
    - Answer: YES - bidirectional sync is critical
17. When a project is deleted, what happens to its tasks in Today?
    - Answer: Cascade delete - tasks are deleted from Today too
18. Can a task be in multiple projects?
    - Answer: NO - 1 task = max 1 project (or standalone)
19. Can a task in Today be moved to a different project after creation?
    - To be defined with architect

**Ideas Generated:**
- Most questions are for architect to answer/recommend
- User has clear constraints: mature libraries, data integrity, optimistic UI
- Some business logic already decided, reduces architect's scope

**Insights Discovered:**
- Data integrity requirement is the most architecturally complex aspect
- Tech stack is largely decided (Next.js, AdonisJS, PostgreSQL)
- The "never lose user data" constraint might drive offline-first architecture or sophisticated retry mechanisms

**Notable Connections:**
- Business logic decisions (bidirectional sync, cascade delete) directly impact database schema design
- Optimistic UI + data integrity creates interesting architectural challenge - architect will need to solve this carefully

---

## Idea Categorization

### Immediate Opportunities
*Ideas ready to implement in MVP*

1. **Today Page with Standalone Tasks (Phase 1)**
   - Description: 4-column kanban (Backlog, To Do Today, In Progress, Done) with ability to create, edit, delete, and drag tasks
   - Why immediate: Core value proposition, can launch as standalone product, enables early user testing
   - Resources needed: Frontend dev (Next.js), Backend API (AdonisJS), PostgreSQL schema, authentication system

2. **Projects Page with Grid & Kanban (Phase 2)**
   - Description: Grid view of all projects + detail view with task kanban per project
   - Why immediate: Second core feature, provides strategic planning layer
   - Resources needed: Extend API & database schema, project CRUD, task-project relationships

3. **Project-Today Connection (Phase 3)**
   - Description: Side panel on Today page to drag project tasks into daily planning
   - Why immediate: The "bridge" that creates unique value - differentiates from competitors
   - Resources needed: Complex drag-drop logic, bidirectional data sync, side panel UI component

4. **Pomodoro Timer (Phase 4)**
   - Description: Dedicated page with configurable focus timer
   - Why immediate: Completes MVP workflow, relatively simple to implement
   - Resources needed: Timer logic, browser notifications, sound assets, settings persistence

5. **Optimistic UI with Data Integrity**
   - Description: UI updates immediately, background sync with retry logic, never lose user data
   - Why immediate: Non-functional requirement, critical for user trust, must be architected from start
   - Resources needed: State management strategy, error handling framework, retry queue mechanism

---

### Future Innovations
*Ideas requiring development/research for V2+*

1. **Custom Fields in Project Detail**
   - Description: User-defined fields (links, notes, file attachments) in project metadata
   - Development needed: File upload system, rich text editor, custom field schema flexibility
   - Timeline estimate: V2 (3-6 months post-MVP)

2. **Collaboration Features**
   - Description: Multi-user projects, shared workspaces, real-time collaboration, comments
   - Development needed: Real-time sync (WebSockets), permissions system, team management, billing tiers
   - Timeline estimate: V3 (6-12 months post-MVP)

3. **Calendar Integration**
   - Description: Sync Google Calendar, display events alongside tasks, deadline reminders
   - Development needed: OAuth integration, calendar API, event-task relationship model
   - Timeline estimate: V2 (3-6 months post-MVP)

4. **Picture-in-Picture Pomodoro**
   - Description: Floating timer widget that persists across page navigation
   - Development needed: PiP API, global state management for timer, UI overlay component
   - Timeline estimate: V2 (2-4 months post-MVP)

5. **Advanced Statistics & Time Tracking**
   - Description: "You spent 10h on this project, 50% completed", productivity streaks, pomodoro session history
   - Development needed: Time tracking data model, analytics engine, visualization components
   - Timeline estimate: V2-V3 (4-8 months post-MVP)

6. **Gantt Chart View**
   - Description: Timeline visualization of project tasks with dependencies
   - Development needed: Gantt chart library integration, task dependency model, date calculations
   - Timeline estimate: V3 (8-12 months post-MVP)

7. **Eisenhower Matrix View**
   - Description: 4-quadrant view (Urgent/Important) for task prioritization
   - Development needed: Priority dimensions on tasks, matrix UI component, drag-drop between quadrants
   - Timeline estimate: V2 (3-6 months post-MVP)

8. **Browser Extension**
   - Description: Quick task/event creation, status updates, mini Pomodoro from browser toolbar
   - Development needed: Extension development (Chrome, Firefox), extension-webapp communication, mini UI
   - Timeline estimate: V3 (6-9 months post-MVP)

9. **Whiteboard / Moodboard for Projects**
   - Description: Visual canvas for project ideation and planning
   - Development needed: Canvas library, real-time drawing sync, image uploads, infinite canvas UX
   - Timeline estimate: V3+ (9-15 months post-MVP)

10. **Notion-Style Notes**
    - Description: Rich text note-taking linked to projects/tasks
    - Development needed: Rich text editor (Tiptap?), block-based editing, notes data model
    - Timeline estimate: V2 (4-6 months post-MVP)

---

### Moonshots
*Ambitious, transformative concepts*

1. **AI-Powered Task Scheduling**
   - Description: Machine learning suggests optimal daily task selection based on deadlines, user patterns, energy levels
   - Transformative potential: Removes decision fatigue, makes Focus Guide indispensable, high competitive moat
   - Challenges to overcome: Requires large dataset, ML expertise, ongoing training costs, user trust in AI suggestions

2. **Cross-Platform Native Apps**
   - Description: Native iOS, Android, desktop apps with offline-first architecture and full feature parity
   - Transformative potential: Reaches users where they work, offline capability, superior UX vs web
   - Challenges to overcome: 3-4x development effort, platform expertise, app store approval, maintenance burden

3. **Integration Ecosystem**
   - Description: Zapier-style integrations with 100+ tools (Notion, Slack, GitHub, Jira, etc.)
   - Transformative potential: Becomes central hub for all productivity workflows, massive network effects
   - Challenges to overcome: API maintenance for each integration, authentication complexity, rate limits, breaking changes

4. **Multiplayer Productivity Features**
   - Description: Shared focus sessions, team Pomodoro, collaborative daily planning, accountability features
   - Transformative potential: Creates social layer, increases engagement, enables team/study group use cases
   - Challenges to overcome: Real-time infrastructure complexity, social features moderation, notification noise management

---

### Insights & Learnings
*Key realizations from the session*

- **Product Positioning is Clear:** "We help you bridge the gap between project planning and daily execution" - this is the north star. Focus Guide sits between high-level project tools (Notion, Asana) and simple todo apps (Todoist), offering the connection layer.

- **Vision B Defines Everything:** Choosing "Daily Focus" over "Multiple Todo Lists" clarified every subsequent decision. The Today page as landing page, the 4-column kanban, the side panel - all flow from this core vision.

- **Side Project Constraint is Liberating:** The "études, alternance, side project" reality forced ruthless prioritization. It's not a limitation - it's a forcing function for MVP discipline. Maintainability trumps feature richness.

- **The Task Model is Elegant:** Flexible task-project-today relationships (tasks can be in project only, today only, or both) solves real user workflow without unnecessary complexity. Users aren't forced into rigid structures.

- **Data Integrity is the Hidden Complexity:** "Never lose user modifications" sounds simple but has deep architectural implications. Optimistic UI + retry logic + error handling + offline scenarios = significant engineering investment. This is where architect guidance is most needed.

- **Build Sequence Enables Risk Reduction:** Starting with Today (standalone) before adding Projects means the team can validate core UX with real users before investing in complex features. Each phase delivers independent value.

- **Users Are Waiting = Validation + Pressure:** Having a waiting list is incredible validation, but also creates urgency to ship. The MVP scope decisions balance thoroughness with speed.

- **Clear V2 Roadmap Prevents Scope Creep:** By explicitly categorizing post-MVP features (custom fields, collaboration, calendar, etc.), the team can confidently say "not now" without saying "never." This protects MVP timeline.

- **Navigation Structure Reinforces Product Story:** Landing on Today (not Projects) is a statement: "This is about daily execution, not endless planning." Small UX decisions compound into brand identity.

- **Tech Stack Decisions Already Made:** Next.js + AdonisJS + PostgreSQL means architect can focus on architecture patterns, not technology selection debates. Reduces decision paralysis.

---

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Handoff to Architect Agent

**Rationale:**
Before any development can begin, the architect must design the system architecture, database schema, API contracts, and solve the data integrity challenge. This is the critical path blocker. All specifications from this session are ready for architect consumption.

**Next steps:**
1. User invokes `/architect` agent with this brainstorming document
2. Architect reviews MVP specs and tech stack decisions
3. Architect designs:
   - Database schema (users, projects, tasks, task-project relationships, task-today assignments)
   - API endpoint structure (REST conventions, authentication flow)
   - Authentication system (recommend OAuth providers, session strategy)
   - Data integrity solution (optimistic UI + retry mechanism + error handling)
   - State management recommendation (Context API vs Redux vs Zustand)
   - Drag-drop library recommendation (dnd-kit vs react-beautiful-dnd)
4. Architect produces architecture document following BMAD framework structure
5. Architect identifies any risks or architectural trade-offs for user review

**Resources needed:**
- This brainstorming document
- Architect agent (BMAD)
- ~2-3 hours of user time for architect Q&A and review

**Timeline:**
Complete architecture document before starting development

---

#### #2 Priority: Phase 1 Development - Today Page (Standalone)

**Rationale:**
First shippable feature. Enables early user testing and validation. Solves core user need (daily task management) even without projects. De-risks the MVP by getting working software in front of users quickly. Builds team confidence and momentum.

**Next steps:**
1. Wait for architecture document completion
2. User invokes `/dev` agent with Phase 1 requirements
3. Dev agent implements:
   - Authentication system (login, registration, session management)
   - Database schema for users and tasks
   - API endpoints for task CRUD operations
   - Today page frontend (4-column kanban: Backlog, To Do Today, In Progress, Done)
   - Drag-drop functionality between columns
   - Optimistic UI with data integrity guarantees
4. Internal testing by 2-person team
5. Deploy to staging environment
6. Invite 3-5 users from waiting list for alpha testing
7. Gather feedback on Today page UX and core workflows

**Resources needed:**
- Architecture document from Priority #1
- Dev agent (BMAD)
- Staging environment setup (hosting, database)
- ~3-4 weeks of development time (2 people, side project pace)

**Timeline:**
Start immediately after architecture complete, ship Phase 1 in 3-4 weeks

---

#### #3 Priority: Phase 2 Development - Projects Page

**Rationale:**
Adds strategic planning layer. Differentiates Focus Guide from simple todo apps. Prepares foundation for Phase 3 (the connection layer that creates unique value). Users can start organizing work into projects while still using Today page for daily execution.

**Next steps:**
1. Dev agent implements:
   - Database schema extensions for projects (including task-project relationships)
   - API endpoints for project CRUD operations
   - Projects page grid view (display all projects with cards showing title, description, deadline, progress %, tags)
   - Project detail view with kanban (4 columns: Backlog, Todo, In Progress, Done)
   - Task CRUD within project context
   - Navigation between Projects page and Project detail views
2. Integration testing with Phase 1 (ensure no regressions)
3. Alpha user testing - gather feedback on project organization workflows
4. Prepare for Phase 3 (most complex phase - connection layer)

**Resources needed:**
- Completed Phase 1 as foundation
- Dev agent (BMAD)
- Alpha user feedback from Phase 1
- ~2-3 weeks of development time

**Timeline:**
Start immediately after Phase 1 ships, ship Phase 2 in 2-3 weeks

---

## Reflection & Follow-up

### What Worked Well
- **User came prepared:** Clear product vision, Figma mockups, and initial ideas made session highly productive
- **Clarifying Vision A vs B:** This single decision (multiple lists vs daily focus) unlocked everything else
- **First principles questioning:** Breaking down each feature to fundamentals revealed precise specifications
- **Risk analysis (Black Hat):** Surfaced the critical "side project maintainability" constraint early
- **User journey mapping:** Walking through Marie's scenario clarified navigation and page hierarchy concretely
- **Build sequence prioritization:** Option B (Today First) enables incremental delivery and early validation
- **Question storming:** Identified clear handoff to architect with open questions and constraints

### Areas for Further Exploration
- **Onboarding & User Tutorial:** MVP specs don't include first-time user experience - how do users learn the Today-Projects-Pomodoro workflow?
- **Mobile Responsive Design:** PWA mentioned but not detailed - what's mobile UX for drag-drop kanban?
- **Freemium Model & Pricing:** SaaS business model mentioned but not defined - what features are free vs paid? When to introduce payment?
- **Error States & Empty States:** What does Today page look like when user has zero tasks? What's the CTA?
- **Accessibility (a11y):** Keyboard navigation for drag-drop? Screen reader support? WCAG compliance level?
- **Data Export & Portability:** Can users export their data? Import from other tools?
- **Performance at Scale:** What happens when user has 50 projects and 500 tasks? Pagination? Infinite scroll?

### Recommended Follow-up Techniques
- **Empathy Mapping:** Understand Marie (target user persona) deeply - her frustrations, goals, daily context - to inform UX micro-decisions during development
- **Story Mapping:** Create user story map for each phase to ensure nothing falls through cracks during implementation
- **Feature Prioritization Matrix:** For V2 roadmap - plot post-MVP features on Impact vs Effort matrix to sequence V2 development
- **Assumption Validation Testing:** Once Phase 1 ships, run structured user testing to validate core assumptions (e.g., "Is side panel project selector intuitive?")

### Questions That Emerged
- How should task priority be represented? (Currently not in specs)
- What happens to recurring tasks? (Buy groceries every week - is this supported or manual re-creation?)
- Can projects be archived (vs deleted)? What's the lifecycle?
- Should there be a "Someday/Maybe" concept for projects not actively worked on?
- What's the ideal number of tasks in "To Do Today" before it becomes overwhelming? Should app provide guidance/warnings?
- How do users discover the side panel project selector? Is it visible by default or hidden until clicked?
- What analytics/metrics will the team track post-launch to measure product-market fit?

### Next Session Planning

**Suggested topics:**
1. **Architect Session:** System architecture design, database schema, API contracts, technology recommendations
2. **User Persona Deep Dive:** Create detailed personas for early adopters (students, freelancers, side project builders?) to inform UX decisions
3. **Go-to-Market Strategy:** Waitlist → Alpha → Beta → Launch sequence, pricing model, positioning messaging
4. **V2 Roadmap Prioritization:** Once MVP ships and user feedback comes in, revisit post-MVP feature list with data-driven prioritization

**Recommended timeframe:**
Architect session immediately (next 1-2 days), other sessions can wait until development phases progress

**Preparation needed:**
- Review this brainstorming document thoroughly before architect session
- Prepare any additional context about existing Figma mockups that might inform architecture decisions
- Think about target user persona characteristics (age, profession, pain points) for future persona session

---

*Session facilitated using the BMAD-METHOD™ brainstorming framework*
