const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = __dirname;

const sampleIdeas = [
  {
    name: 'Adventure Arcade Café',
    theme: 'A playful video game and treasure hunt restaurant',
    why: 'Customers love the bright arcade games, treasure-themed snacks, and fun challenges with every meal.'
  },
  {
    name: 'Rainbow Garden Diner',
    theme: 'A colorful garden restaurant with friendly plant characters',
    why: 'Kids enjoy the rainbow food, cute decorations, and the happy garden atmosphere.'
  },
  {
    name: 'Rocket Taco Station',
    theme: 'A space travel taco restaurant for young explorers',
    why: 'Customers love the rocket-shaped tacos, cosmic drinks, and playful astronaut theme.'
  },
  {
    name: 'Mystery Forest Café',
    theme: 'A magical forest restaurant with storytelling meals',
    why: 'Families enjoy the enchanted desserts and the cozy woodland decorations that feel like a storybook.'
  },
  {
    name: 'Pancake Planet',
    theme: 'A breakfast planet full of sweet and savory pancake creations',
    why: 'Guests love creating their own pancake worlds and sharing fun, colorful toppings.'
  }
];

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'utf8'),
  });
  res.end(body);
}

function sendText(res, status, text) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(text, 'utf8'),
  });
  res.end(text);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function buildIdeaResponse() {
  return JSON.stringify(sampleIdeas);
}

function buildDesignResponse(idea) {
  const name = idea?.name || 'Cozy Corner Café';
  const theme = idea?.theme || 'A friendly, imaginative restaurant for young guests';
  // Return the exact schema expected by the client for Agent 2
  const response = {
    restaurantName: name,
    theme: theme,
    colors: ['Pastel blue', 'Sunny yellow', 'Mint green'],
    decorations: ['Wall murals', 'Hanging lanterns', 'Table tents'],
    menu: [
      { name: 'Star Sliders', category: 'Main', description: 'Mini burgers with star-shaped cheese' },
      { name: 'Rainbow Pizza Bites', category: 'Main', description: 'Build-your-own mini pizza bites' },
      { name: 'Fizzy Fruit Spritzer', category: 'Drinks', description: 'Sparkling fruit drink' },
      { name: 'Magic Sprinkle Cupcake', category: 'Dessert', description: 'Cupcake with colorful sprinkles' }
    ],
    recipes: [
      {
        name: 'Star Sliders',
        ingredients: ['Mini buns', 'Ground beef or veggie patty', 'Star-shaped cheese', 'Lettuce', 'Ketchup'],
        steps: ['Cook patties until done', 'Assemble on mini buns', 'Add star cheese on top', 'Serve with a side of colorful chips'],
        presentation: 'Serve on a small wooden board with a tiny flag.'
      },
      {
        name: 'Fizzy Fruit Spritzer',
        ingredients: ['Sparkling water', 'Mixed fruit syrup', 'Ice', 'Lemon slice'],
        steps: ['Add ice to glass', 'Pour syrup', 'Top with sparkling water', 'Garnish with lemon'],
        presentation: 'Serve in a clear cup with a colorful straw.'
      }
    ]
  };
  return JSON.stringify(response);
}

function buildReviewResponse(concept) {
  return `Critique:
- Make the menu items easier to imagine by adding one or two fun details that explain what makes them special.
- Add one more colorful drink idea so the restaurant feels exciting for guests ages 8 to 18.
- Explain one special feature in a way that students can picture it clearly and understand why it makes the restaurant memorable.

Improved Restaurant Concept:
Theme: ${concept.theme || 'A magical, kid-friendly restaurant with a bright and welcoming theme.'}

Menu Items: Serve mini burger sliders with star-shaped cheese, build-your-own pizza bites with colorful veggies, rainbow noodle cups, and surprise snack boxes with crunchy and sweet treats.

Drinks: Offer fizzy fruit spritzers, rainbow lemonade, hot chocolate with marshmallow clouds, sparkling berry water, and a bright tropical smoothie.

Desserts: Include chocolate pudding cups with cookie toppings, cookie sandwiches, soft-serve swirl cones, and magic sprinkle cupcakes.

Decorations: Use bright murals, playful table tents, hanging lanterns, and a large banner with the restaurant name and characters.

Colors: Combine pastel blues, warm oranges, sunny yellows, and soft greens for a cheerful atmosphere.

Layout: Create a welcoming dining area with family tables, a cozy corner for storytelling, and a small craft station for kids.

Customer Experience: Have friendly staff welcome guests, help them choose their meal, and offer a game or activity while they wait.

Special Features: Add a themed photo wall, interactive menu puzzles, and a surprise daily treat to make each visit feel special.

Logo Idea: Draw a smiling fork and spoon holding a colorful plate with the restaurant name above.

Slogan: "Taste the fun in every bite!"`;
}

function serveStaticFile(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  const resolvedPath = path.join(PUBLIC_DIR, filePath);
  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }
  fs.readFile(resolvedPath, (err, data) => {
    if (err) {
      sendText(res, 404, 'Not found');
      return;
    }
    const mime = resolvedPath.endsWith('.html') ? 'text/html' : 'text/plain';
    res.writeHead(200, { 'Content-Type': `${mime}; charset=utf-8` });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    return serveStaticFile(req, res);
  }

  if (req.method === 'POST' && req.url === '/classroom-proxy') {
    try {
      const body = await parseJsonBody(req);
      const persona = String(body.persona || '').toLowerCase();
      const payload = body.payload || {};

      if (persona.includes('restaurant idea generator')) {
        return sendJson(res, 200, { text: buildIdeaResponse() });
      }

      if (persona.includes('restaurant designer')) {
        return sendJson(res, 200, { text: buildDesignResponse(payload.idea) });
      }

      if (persona.includes('restaurant reviewer')) {
        return sendJson(res, 200, { text: buildReviewResponse(payload.concept || {}) });
      }

      return sendJson(res, 400, { text: 'Unknown persona.' });
    } catch (error) {
      return sendJson(res, 400, { text: error.message });
    }
  }

  sendText(res, 404, 'Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Serving index.html and proxying /classroom-proxy requests.');
});
