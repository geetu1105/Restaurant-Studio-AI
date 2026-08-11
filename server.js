const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = __dirname;

const ideaDeck = [
  {
    restaurantName: 'Galaxy Taco Lab',
    theme: 'A space-station restaurant where kids build cosmic tacos',
    foodStyle: 'Tacos, bowls, and colorful space snacks',
    whyCustomersWouldLoveIt: 'Customers love assembling starry tacos, glowing drinks, and a futuristic atmosphere that feels like a mission to Mars.'
  },
  {
    restaurantName: 'Rainbow Noodle Garden',
    theme: 'A cheerful garden restaurant with twisty noodle bowls and bright colors',
    foodStyle: 'Noodle bowls, dumplings, and fresh fruit drinks',
    whyCustomersWouldLoveIt: 'Families enjoy the calm garden vibe, playful noodle shapes, and colorful food that looks as fun as it tastes.'
  },
  {
    restaurantName: 'Burger Bot Workshop',
    theme: 'A robot-themed burger restaurant with build-your-own meals',
    foodStyle: 'Burgers, fries, milkshakes, and snack boxes',
    whyCustomersWouldLoveIt: 'Guests can build custom meals, watch the robot mascot, and feel like they are inside a friendly invention lab.'
  },
  {
    restaurantName: 'Pancake Planet Café',
    theme: 'A breakfast planet filled with pancake adventures',
    foodStyle: 'Pancakes, waffles, smoothies, and sweet toppings',
    whyCustomersWouldLoveIt: 'Customers love making pancake stacks with fun toppings and exploring a playful planet full of breakfast surprises.'
  },
  {
    restaurantName: 'Mystery Forest Kitchen',
    theme: 'A storybook forest restaurant with hidden treats and magical meals',
    foodStyle: 'Sandwiches, soups, dessert jars, and herbal drinks',
    whyCustomersWouldLoveIt: 'The cozy forest decorations and surprise treats make every visit feel like stepping into a friendly fairy tale.'
  }
];

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
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
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeIdeaSource(payload) {
  return payload?.idea || payload?.selectedIdea || ideaDeck[0];
}

function buildIdeaResponse() {
  return ideaDeck;
}

function buildDesignResponse(payload) {
  const idea = normalizeIdeaSource(payload);
  const name = idea.restaurantName || idea.name || 'Creative Kitchen Club';
  const theme = idea.theme || 'A fun, colorful restaurant made for creative young chefs';
  return {
    restaurantName: name,
    theme,
    colors: ['Coral sunrise', 'Mint green', 'Sunny yellow', 'Ocean blue'],
    decorations: ['Wall murals', 'Hanging lights', 'Playful menu boards', 'Chef hats on the wall'],
    layout: 'A front greeting area, an open cook station, family tables, and a tasting corner for recipe reveals.',
    mascot: 'A smiling chef star named Tippy',
    specialFeatures: 'Build-your-own meal bar, secret ingredient unlocks, recipe sticker rewards, and a photo wall for customer reactions.',
    customerExperience: 'Friendly chefs greet every guest, help them choose food, and celebrate when a recipe is completed.',
    menu: {
      mainDishes: ['Star Sliders', 'Rainbow Noodle Bowls', 'Crunchy Taco Bites', 'Mini Pizza Clouds'],
      drinks: ['Galaxy Lemonade', 'Berry Sparkle Soda', 'Honey Milkshake', 'Tropical Fruit Splash'],
      desserts: ['Sprinkle Cupcakes', 'Cookie Sandwiches', 'Chocolate Pudding Jars', 'Fruit Sundae Swirls'],
      signatureFoodItems: ['Chef Tippy Special', 'Build-Your-Own Dream Plate', 'Mystery Snack Box']
    },
    recipes: [
      {
        foodName: 'Galaxy Lemonade',
        ingredients: ['Lemon juice', 'Sparkling water', 'Honey', 'Blueberry syrup', 'Ice'],
        cookingSteps: ['Fill a cup with ice.', 'Pour in lemon juice and honey.', 'Add sparkling water.', 'Stir in blueberry syrup for a galaxy swirl.', 'Serve cold with a bright straw.'],
        presentationIdea: 'Serve in a clear cup with a lemon wheel and a tiny paper star.',
        tools: ['Pitcher', 'Stirrer', 'Measuring cup'],
        decorationOptions: ['Lemon slice', 'Mint leaf', 'Blue sugar rim']
      },
      {
        foodName: 'Star Sliders',
        ingredients: ['Mini buns', 'Burger patties', 'Cheese stars', 'Lettuce', 'Tomato'],
        cookingSteps: ['Cook the patties.', 'Warm the buns.', 'Layer lettuce, tomato, and patty.', 'Add a cheese star on top.', 'Serve with fries or veggie sticks.'],
        presentationIdea: 'Stack two sliders on a tray with a tiny flag in the middle.',
        tools: ['Spatula', 'Serving tray', 'Plate'],
        decorationOptions: ['Tiny flag', 'Sesame seeds', 'Ketchup swirl']
      },
      {
        foodName: 'Sprinkle Cupcakes',
        ingredients: ['Cupcakes', 'Vanilla frosting', 'Rainbow sprinkles', 'Berry jam', 'Whipped cream'],
        cookingSteps: ['Bake or choose ready cupcakes.', 'Spread frosting on top.', 'Add berry jam in the center.', 'Cover with sprinkles.', 'Top with whipped cream if wanted.'],
        presentationIdea: 'Place on a bright plate with colorful candy confetti around it.',
        tools: ['Frosting knife', 'Bowl', 'Piping bag'],
        decorationOptions: ['Rainbow sprinkles', 'Tiny fruit pieces', 'Chocolate drizzle']
      }
    ]
  };
}

function buildReviewResponse(payload) {
  const concept = payload?.concept || {};
  const recipeCount = Array.isArray(concept.recipes) ? concept.recipes.length : 0;
  return {
    critique: [
      'What is great: the restaurant idea is playful, colorful, and easy for students to imagine.',
      'What could improve: the menu should name a few more signature foods so customers can remember the restaurant faster.',
      'What customers would enjoy more: adding one more clear decoration idea or mascot action would make the experience feel even more alive.'
    ],
    improved: {
      restaurantName: concept.restaurantName || 'Creative Kitchen Club',
      theme: concept.theme || 'A bright, friendly restaurant where kids can cook, build, and share fun meals',
      colors: concept.colors || ['Coral sunrise', 'Mint green', 'Sunny yellow', 'Ocean blue'],
      decorations: concept.decorations || ['Wall murals', 'Menu lights', 'Photo wall', 'Chef star banners'],
      layout: concept.layout || 'A front greeting area, an open cook station, family tables, and a recipe showcase wall.',
      mascot: concept.mascot || 'Chef Tippy the smiling star chef',
      specialFeatures: concept.specialFeatures || 'Recipe stickers, secret ingredient unlocks, and customer reaction cards.',
      customerExperience: concept.customerExperience || 'Guests pick a dish, watch it come together, and cheer when their meal is finished.',
      menu: concept.menu || {
        mainDishes: ['Star Sliders', 'Rainbow Noodle Bowls', 'Mini Pizza Clouds'],
        drinks: ['Galaxy Lemonade', 'Berry Sparkle Soda'],
        desserts: ['Sprinkle Cupcakes', 'Chocolate Pudding Jars'],
        signatureFoodItems: ['Chef Tippy Special', 'Build-Your-Own Dream Plate']
      },
      recipes: Array.isArray(concept.recipes) && recipeCount
        ? concept.recipes
        : [
            {
              foodName: 'Galaxy Lemonade',
              ingredients: ['Lemon juice', 'Sparkling water', 'Honey', 'Blueberry syrup', 'Ice'],
              cookingSteps: ['Fill a cup with ice.', 'Pour in lemon juice and honey.', 'Add sparkling water.', 'Stir in blueberry syrup.', 'Serve cold.'],
              presentationIdea: 'Serve in a clear cup with a lemon wheel and a tiny paper star.',
              tools: ['Pitcher', 'Stirrer', 'Measuring cup'],
              decorationOptions: ['Lemon slice', 'Mint leaf', 'Blue sugar rim']
            }
          ]
    }
  };
}

function serveStaticFile(req, res) {
  const safePath = req.url === '/' ? '/index.html' : req.url;
  const resolvedPath = path.join(PUBLIC_DIR, safePath);
  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }
  fs.readFile(resolvedPath, (error, data) => {
    if (error) {
      sendText(res, 404, 'Not found');
      return;
    }
    const contentType = resolvedPath.endsWith('.html') ? 'text/html' : 'text/plain';
    res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    serveStaticFile(req, res);
    return;
  }

  if (req.method === 'POST' && req.url === '/classroom-proxy') {
    try {
      const body = await parseJsonBody(req);
      const persona = String(body.persona || '').toLowerCase();
      const payload = body.payload || {};

      if (persona.includes('restaurant brainstorming partner')) {
        sendJson(res, 200, { text: JSON.stringify(buildIdeaResponse()) });
        return;
      }

      if (persona.includes('creative chef and restaurant designer')) {
        sendJson(res, 200, { text: JSON.stringify(buildDesignResponse(payload)) });
        return;
      }

      if (persona.includes('strict but encouraging professional chef')) {
        sendJson(res, 200, { text: JSON.stringify(buildReviewResponse(payload)) });
        return;
      }

      sendJson(res, 400, { text: 'Unknown persona.' });
      return;
    } catch (error) {
      sendJson(res, 400, { text: error.message });
      return;
    }
  }

  sendText(res, 404, 'Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Serving index.html and proxying /classroom-proxy requests.');
});
