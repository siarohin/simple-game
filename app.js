// Create the canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


// Background image
let bgReady = false;
let heroReady = false;
let monsterReady = false;

const bgImage = new Image();
const heroImage = new Image();
const monsterImage = new Image();

bgImage.onload = () => {
  bgReady = true;
};
heroImage.onload = () => {
  heroReady = true;
};
monsterImage.onload = () => {
  monsterReady = true;
};

bgImage.src = './images/background.png';
heroImage.src = './images/hero.png';
monsterImage.src = './images/monster.png';


// Game objects
const hero = {
  speed: 256, // movement in pixels per second
  x: 0,
  y: 0,
};

const monster = {
  x: 0,
  y: 0,
};

let monstersCaught = 0;


// Handle keyboard controls
const keysPress = {};

document.addEventListener('keydown', (e) => {
  keysPress[e.code] = true;
}, false);

document.addEventListener('keyup', (e) => {
  delete keysPress[e.code];
}, false);


// Reset the game when the player catches a monster
const reset = () => {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
};


// Update game objects
const update = (modifier) => {
  if ('ArrowUp' in keysPress) { // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if ('ArrowDown' in keysPress) { // Player holding down
    hero.y += hero.speed * modifier;
  }
  if ('ArrowLeft' in keysPress) { // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if ('ArrowRight' in keysPress) { // Player holding right
    hero.x += hero.speed * modifier;
  }

  // Are they touching?
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    monstersCaught += 1;
    reset();
  }
};


// Draw everything
const render = () => {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // Score
  ctx.fillStyle = 'rgb(250, 250, 250)';
  ctx.font = '24px Helvetica';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Monsterrs caught: ${monstersCaught}`, 32, 32);
};


// The main game loop
let then = Date.now();
const main = () => {
  const now = Date.now();
  const delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};


// Let's play this game!
reset();
main();
