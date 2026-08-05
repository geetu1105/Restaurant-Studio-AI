# Restaurant-Studio-AI
Create your dream restaurant with AI teammates! Start to End Restaurant Studio lets students ages 8–18 brainstorm restaurant ideas, design menus, create themes, and improve their concepts with three AI agents. Students stay in control by approving every step while building creative restaurants from imagination to final design.

## Project Overview

This standalone single-page app uses three cooperating AI agents to guide students from a simple restaurant idea to a polished final concept. The school proxy endpoint at `/classroom-proxy` handles every AI POST request, and the student approves each handoff before the next agent runs.

## Setup Instructions

1. Open `index.html` in a web browser, or run a simple local server:
   - Python 3: `python3 -m http.server 8000`
   - Node.js: `npx http-server .`
2. Visit `http://localhost:8000` in your browser.
3. Ensure the classroom proxy is available at `/classroom-proxy` for the AI agent POST requests.

## How the Three Agents Work

- **Agent 1: Restaurant Idea Generator**
  - Persona: A creative restaurant brainstorming partner.
  - Task: Generate exactly 5 restaurant concepts, each with a name, theme, and one sentence explaining why customers would love it.
  - Output: Shows five clickable ideas and includes a "More Ideas" button to regenerate ideas.

- **Agent 2: Restaurant Designer**
  - Persona: A creative restaurant designer.
  - Task: Take the approved idea and create a complete restaurant concept with theme, menu items, drinks, desserts, decorations, colors, layout, customer experience, special features, logo idea, and slogan.
  - Output: Returns only the restaurant concept in a structured plain text format.

- **Agent 3: Restaurant Reviewer**
  - Persona: A strict but encouraging restaurant expert.
  - Task: Review the approved restaurant concept and return a short bullet-point critique plus an improved final version.
  - Output: Provides clear feedback and an improved concept, with suggestions written for an 8–18 year old student.

## Approval Workflow

1. On load, Agent 1 runs and displays five restaurant ideas.
2. The student selects one idea to send to Agent 2.
3. Agent 2 generates the restaurant concept.
4. The student can click `Edit` to modify concept sections inline and then save the official version.
5. After approval, the approved concept is sent to Agent 3.
6. The final screen shows the review critique, the improved restaurant version, a copy button, and a button to start a new restaurant.

## Running the App Locally

The app works best when served from a local web server because it sends AI requests to `/classroom-proxy`.

### Using the built-in proxy stub

1. Install Node.js if needed.
2. Install dependencies:
   ```bash
   cd /workspaces/Restaurant-Studio-AI
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open `http://localhost:8000` in your browser.

This server serves `index.html` and handles the `/classroom-proxy` requests with stubbed AI responses.

### Using a simple static server instead

If you already have a proxy available, you can use any static server:
```bash
cd /workspaces/Restaurant-Studio-AI
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

> Note: The app expects the classroom proxy endpoint at `/classroom-proxy` to handle the AI request POSTs and return a JSON response with a `text` field. The provided `server.js` stub implements that contract.
