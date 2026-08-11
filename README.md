# Restaurant-Studio-AI

Start to End Restaurant Studio is a single-page app for students ages 8–18. It feels like a mix of a restaurant tycoon, a cooking game, and an AI creative studio. Students begin with a simple idea, work with three AI agents, edit and cook their creations, and approve every handoff before the next agent runs.

## Project Overview

The app uses one reusable async function, `askAgentPersona()`, for every AI agent call. Each request posts to `/classroom-proxy`, which makes the project easy to run locally with the included Node server stub.

## Setup Instructions

1. Make sure Node.js is installed.
2. Install the project dependencies:
   ```bash
   cd /workspaces/Restaurant-Studio-AI
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open `http://localhost:8000` in your browser.

## How the Three Agents Work

- **Agent 1: Restaurant Idea Generator**
  - Persona: A creative restaurant brainstorming partner who helps students imagine exciting restaurant concepts.
  - Output: Exactly 5 clickable restaurant ideas with a name, theme, food style, and one sentence explaining why customers would love it.
  - App behavior: Runs on load and can be rerun with the **More Ideas** button.

- **Agent 2: Chef and Restaurant Builder**
  - Persona: A creative chef and restaurant designer who turns an idea into a complete restaurant experience.
  - Output: Restaurant design, menu, and recipes for interactive cooking.
  - App behavior: Runs after the student chooses an idea, then the student can edit the draft, save the official version, and complete recipes in the cooking game.

- **Agent 3: Chef Critic**
  - Persona: A strict but encouraging professional chef and restaurant expert.
  - Output: Short bullet-point feedback and an improved final restaurant version.
  - App behavior: Runs only after the student approves the saved restaurant version.

## Approval Workflow

1. The app loads and Agent 1 creates 5 restaurant ideas.
2. The student selects one idea and sends it to Agent 2.
3. Agent 2 creates the restaurant design, menu, recipes, and cooking game content.
4. The student edits the draft, saves the official version, and completes recipes.
5. The student approves the restaurant and sends it to Agent 3.
6. Agent 3 returns feedback and an improved final showcase.

## Running Locally

The easiest way to run the project is with the built-in Node server stub:

```bash
cd /workspaces/Restaurant-Studio-AI
npm install
npm start
```

Then open `http://localhost:8000`.

## Notes

- The app expects the classroom proxy endpoint at `/classroom-proxy` to return JSON with a `text` field.
- The provided `server.js` file serves the SPA and returns stubbed AI responses for all three agents.
- If you already have your own classroom proxy, you can replace the stub while keeping the same request format.
