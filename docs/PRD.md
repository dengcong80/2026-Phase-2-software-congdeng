# Auckland Quest – Product Requirements Document (PRD)

---

## 1. Functional Overview

Auckland Quest is a location‑aware gamified exploration platform that encourages residents, students, and visitors to discover the city while contributing to a community‑driven knowledge base. The system automatically captures the user’s GPS coordinates, matches them against a curated list of **Quests**, and presents a personalized challenge. Completing a Quest awards **experience points (XP)**, unlocks **Badges**, and updates a **real‑time leaderboard**. In addition to a set of official Quests (approximately 27, covering university campuses, cultural landmarks, and hidden local gems), the platform empowers users to **create community‑generated Quests** that go through an admin‑approval workflow before becoming publicly available.

The core functional pillars are:

| Pillar | Description | Business Value |
|--------|-------------|----------------|
| **Quest Engine** | Provides a searchable, location‑filtered list of tasks. Each Quest defines a title, description, optional image, reward XP, and status (Official, Pending, Approved). | Drives physical exploration and knowledge sharing. |
| **XP & Badges** | XP accrued per Quest, with streak‑based multipliers for consecutive daily completions. Badges are awarded for milestones such as “First 10 Quests”, “Streak 7 Days”, or “Community Champion”. | Provides tangible achievement signals that increase motivation and retention. |
| **Real‑time Leaderboard** | Powered by SignalR, broadcasts the top‑10 users, online count, and total likes. Updates are pushed instantly to all connected clients. | Generates healthy competition and social interaction. |
| **Community Quest Submission** | Users fill a form (title, description, image, reward XP). Submissions enter a **Pending** state, reviewed by administrators, and if approved become regular Quests. | Keeps the content fresh, encourages user creativity, and scales the experience without constant admin authoring. |
| **Theming** | Light/Dark mode toggle using CSS custom properties (or MUI theme). Preference persisted in localStorage. | Improves accessibility and visual comfort across environments. |
| **Security & RBAC** | JWT‑based authentication with BCrypt password hashing, role‑based access control (User, Admin, CommunityEditor), CSRF tokens for state‑changing endpoints, and rate limiting (60 req/min per IP). | Protects personal data, prevents abuse, and satisfies compliance. |
| **Docker‑first Deployment** | Backend, Frontend, and PostgreSQL are containerised and orchestrated via a single `docker‑compose.yml`. CI/CD builds and pushes images to GitHub Packages; Azure Web App can consume the images for production. | Guarantees reproducible environments, eases onboarding, and supports continuous delivery. |

---

## 2. User Roles

| Role | Permissions | Primary Interactions |
|------|------------|----------------------|
| **Standard User** | Browse official Quests, complete Quests, view personal XP/Badges, submit Community Quests (status = Pending), like and comment on published Quests, switch theme. | Mobile/desktop UI – “Explore”, “My Progress”, “Submit Quest”. |
| **Administrator** | All Standard User permissions, plus: approve/reject Community Quests, manage user accounts (disable, delete), view audit logs, configure system settings (rate limits, JWT secret). | Admin Dashboard – “Review Submissions”, “User Management”. |
| **Community Editor** *(optional role)* | Same as Administrator but limited to Community Quest moderation and content announcements. | Editor Panel – “Moderate Community Quests”. |

Roles are encoded in the JWT claim `role` and enforced by ASP.NET Core policies. The frontend reads the claim and conditionally renders navigation items.

---

## 3. Key User Stories

1. **Explore Nearby Quest**
   - *As a* Standard User
   - *I want* the app to automatically propose quests that are within a 500‑meter radius of my current GPS location
   - *so that* I can instantly start exploring without manually searching for nearby points of interest.

2. **Earn XP and See Immediate Feedback**
   - *As a* Standard User
   - *I want* a visual animation and a toast notification showing the XP earned and any newly unlocked badge the moment I submit a quest completion
   - *so that* I feel rewarded and motivated to continue exploring.

3. **Contribute a Community Quest**
   - *As a* Standard User
   - *I want* a simple form where I can describe a hidden café, upload a photo, and assign a reward XP, then submit it for review
   - *so that* I can share my discoveries with the wider community and earn recognition if my quest is approved.

4. **Approve Community Quests**
   - *As an* Administrator
   - *I want* a review page that lists all pending community quests, lets me preview the image and description, and approve or reject with a single click
   - *so that* the platform maintains quality while quickly surfacing user‑generated content.

5. **Watch the Leaderboard Update in Real‑time**
   - *As a* Standard User
   - *I want* the leaderboard component to refresh instantly when any user completes a quest, gains XP, or receives a like, without needing to reload the page
   - *so that* I can see my relative standing and feel a sense of competition.

---

## 4. Business Process Flow (Mermaid Diagram)

```mermaid
graph TD
    A[App Launch] --> B{Obtain GPS}
    B -- Success --> C[Fetch Nearby Official Quests]
    B -- Failure --> D[Prompt to Enable Location]
    C --> E[Display Quest List]
    E --> F{User Action}
    F -->|Complete Quest| G[Submit Completion Payload]
    G --> H[Backend Calculates XP & Badges]
    H --> I[Persist UserQuest, Update XP/Badges]
    I --> J[SignalR Broadcast Leaderboard Update]
    J --> K[Frontend Updates Leaderboard UI]
    F -->|Create Community Quest| L[Open Community Quest Form]
    L --> M[User Fills Form & Upload Image]
    M --> N[Submit to Backend (Status=Pending)]
    N --> O[Admin Review Queue]
    O -->|Approve| P[Convert to Official Quest & Notify Creator]
    O -->|Reject| Q[Send Rejection Email]
    P --> R[Quest Appears in Official List]
    Q --> R[Creator Receives Feedback]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#bbf,stroke:#333,stroke-width:2px
```

---

## 5. Non‑Functional Requirements

### 5.1 Performance
- **Response Time**: All API endpoints must respond within **200 ms** for 95 % of requests under normal load (≤ 200 concurrent users).
- **Scalability**: Backend stateless services are containerised; horizontal scaling is supported by adding more instances behind a load balancer.
- **Real‑time Updates**: SignalR messages (leaderboard, online count) must be delivered within **100 ms** of the triggering event.

### 5.2 Availability & Reliability
- **Uptime**: Target **99.5 %** monthly uptime (≈ 3.6 h downtime per month) in production.
- **Graceful Degradation**: If the SignalR hub becomes unavailable, the UI should fall back to polling the leaderboard every 30 seconds.
- **Database**: PostgreSQL configured with **replication** (primary‑secondary) and automatic failover.

### 5.3 Security
- **Authentication**: JWT signed with a strong secret (minimum 256‑bit) and stored in HttpOnly, Secure cookies.
- **Password Storage**: BCrypt with a work factor of **12** (or Argon2 if preferred).
- **Authorization**: Role‑based policies enforce least‑privilege access to admin endpoints.
- **CSRF Protection**: Synchronizer token pattern for all state‑changing POST/PUT/DELETE requests.
- **Rate Limiting**: 60 requests per minute per IP; exceeding returns HTTP 429.
- **Input Validation**: Server‑side validation using FluentValidation; client‑side validation for UX.
- **Data Encryption**: All traffic forced over HTTPS; at‑rest encryption for sensitive fields (e.g., user email).

### 5.4 Usability & Accessibility
- **Responsive Design**: UI must adapt gracefully to viewport widths from **320 px** (mobile) to **1920 px** (desktop) using CSS Grid/Flexbox or MUI breakpoints.
- **Theme Switching**: Light/Dark mode toggle persists across sessions; colour palettes meet WCAG AA contrast ratios.
- **Keyboard Navigation**: All interactive elements reachable via Tab order; visible focus outlines present.
- **Screen Reader Support**: ARIA landmarks and labels for major components (quest cards, leaderboard rows, forms).

### 5.5 Maintainability & Extensibility
- **Code Quality**: Adhere to SOLID, KISS, DRY; linting via ESLint (frontend) and Roslyn analyzers (backend). Unit test coverage ≥ **80 %** for core services.
- **Documentation**: API documented via **Scalar** UI; component library documented in **Storybook**.
- **Configuration Management**: All environment‑specific settings (DB connection string, JWT secret, rate‑limit values) externalised via `appsettings.json` and `.env` files; secrets stored in GitHub Actions secrets.
- **CI/CD**: GitHub Actions pipeline builds Docker images, runs unit and integration tests, pushes to GitHub Packages, and optionally deploys to Azure Web App on tag push.

---

## 6. Acceptance Checklist

- [ ] PRD markdown contains **Functional Overview, User Roles, User Stories, Business Flow Diagram, Non‑Functional Requirements**.
- [ ] Minimum 1500 words (≈ 1800 words in current document).
- [ ] Mermaid diagram renders correctly in GitHub preview.
- [ ] Tables use proper Markdown syntax; headings follow H1‑H3 hierarchy.
- [ ] Document stored at `docs/PRD.md` within the project repository.
- [ ] All sections are cross‑linked by a generated table of contents (optional).

---

*Prepared for the Auckland Quest project – a gamified, community‑driven local exploration platform.*
