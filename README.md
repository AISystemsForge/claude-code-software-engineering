# Claude Code Software Engineering

This repository contains **Expenzo**, a client-side expense tracker developed as
the course project for **Claude Code: Software Engineering with Generative AI
Agents**, offered by **Vanderbilt University** on **Coursera**.

Expenzo helps an individual record, review, analyze, and export expenses without
creating an account or sending financial data to a server. Application data is
stored in the browser that created it.

## Purpose

The project applies AI-assisted software engineering practices to a complete web
application while retaining human review, explicit repository governance, and
reproducible validation. It is both a course deliverable and a maintained
AISystemsForge engineering project.

## Implemented features

- Dashboard summaries for total spending, current-month spending, top category,
  and average expense.
- Category breakdown and six-month spending trend visualizations.
- Add, edit, and delete operations with confirmation for destructive changes.
- Validation for required fields, positive amounts, future dates, categories,
  and description length.
- Search, category and date filters, and date or amount sorting.
- CSV export of the currently filtered expense collection.
- Browser persistence with defensive validation of stored records.
- Responsive desktop and mobile navigation and expense views.
- Loading, empty, toast, modal, and confirmation states.

## Technology stack

| Concern | Technology |
| --- | --- |
| Application framework | Next.js 14 with the App Router |
| UI language | React 18 and TypeScript in strict mode |
| Styling | Tailwind CSS 3 and PostCSS |
| State management | React Context and hooks |
| Persistence | Browser `localStorage` |
| Charts | Project-owned SVG and CSS components |
| Package management | npm with a committed lockfile |

## Architecture

The application is a client-side Next.js system with no backend service:

- `src/app/` defines the root layout, dashboard, expenses route, and global
  styles.
- `src/components/` contains user interface composition, forms, lists, feedback,
  and chart components.
- `src/context/ExpenseContext.tsx` owns the in-memory expense collection and
  coordinates browser persistence.
- `src/lib/` contains domain types, validation, analytics, formatting, storage,
  category metadata, and CSV serialization.

The storage boundary validates records read from `localStorage`. UI components
consume domain operations through context rather than accessing storage
directly. No network API or environment variable is required.

## Installation

Requirements:

- Node.js 18.17 or newer
- npm compatible with the committed `package-lock.json`

Install the exact dependency graph:

```bash
npm ci
```

## Development commands

```bash
npm run dev    # start the development server
npm run lint   # run the configured Next.js lint command
npm run build  # create and validate a production build
npm run start  # serve the production build
```

The development server is available at `http://localhost:3000` by default.

## Usage

1. Open the dashboard and add an expense, or load the built-in sample records to
   inspect the populated views.
2. Use **Expenses** to create, update, delete, search, filter, and sort records.
3. Export the current filtered collection when a CSV copy is needed.
4. Return to the dashboard to review totals, category distribution, and recent
   trends.

Data is stored under the browser key `expense-tracker-ai:expenses:v1`. Clearing
site data or using another browser or device starts with an independent empty
collection.

## Repository structure

```text
.
├── .github/                 # Collaboration and dependency automation
├── docs/                    # Architecture and AISystemsForge standards
├── src/
│   ├── app/                 # Next.js routes, layout, and global styles
│   ├── components/          # UI and visualization components
│   ├── context/             # Expense state and persistence coordination
│   └── lib/                 # Domain logic and browser integrations
├── AGENTS.md                # Repository instructions for engineering agents
├── PROJECT.md               # Scope, maturity, and success criteria
├── CONTRIBUTING.md          # Contribution and review contract
├── SECURITY.md              # Vulnerability reporting and security policy
└── package.json             # Application dependencies and commands
```

## AI-assisted engineering disclosure

The application was developed with Claude Code as part of the course exercise.
Codex assisted with migrating it into the official repository and integrating
AISystemsForge documentation and governance. AI-produced work remains subject to
human review, repository instructions, and the validation requirements in the
[AI-assisted engineering standard](docs/standards/ai-assisted-engineering.md).

## Current status

The core expense-management workflow is implemented and suitable for local use
and continued course development. The project has not declared a stable release
or production support commitment.

## Known limitations

- Data exists only in one browser profile and is not synchronized or backed up.
- There is no authentication, multi-user support, server-side persistence, or
  cloud deployment configuration.
- Currency formatting is fixed to USD.
- CSV export is one-way; CSV import is not implemented.
- Automated tests are not currently configured.
- The current Next.js 14 dependency line has unresolved high and moderate audit
  advisories; migrate to a supported major before any production deployment.

## Contributing and standards

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Organization
standards and the governance hierarchy are indexed in
[docs/standards/README.md](docs/standards/README.md).

## License

This project is available under the [MIT License](LICENSE).
