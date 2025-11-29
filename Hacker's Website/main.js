// Simple morphing animation without MorphSVGPlugin
const { set, to, timeline } = gsap;

// Used to calculate distance of "tug"
let startX;
let startY;

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
};

const STATE = {
  ON: false,
};

const CORD_DURATION = 0.1;

const CORDS = document.querySelectorAll('.toggle-scene__cord');
const HIT = document.querySelector('.toggle-scene__hit-spot');
const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
const PROXY = document.createElement('div');
const WEBSITE_CONTENT = document.getElementById('websiteContent');
const DARK_OVERLAY = document.getElementById('darkOverlay');

// set init position
const ENDX = DUMMY_CORD.getAttribute('x2');
const ENDY = DUMMY_CORD.getAttribute('y2');

const RESET = () => {
  set(PROXY, {
    x: ENDX,
    y: ENDY,
  });
};

RESET();

const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON;
    set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });
    set([DUMMY, HIT], { display: 'none' });
    set(CORDS[0], { display: 'block' });

    // Toggle website visibility
    if (STATE.ON) {
      WEBSITE_CONTENT.classList.add('visible');
      DARK_OVERLAY.classList.add('hidden');
    } else {
      WEBSITE_CONTENT.classList.remove('visible');
      DARK_OVERLAY.classList.remove('hidden');
    }

    AUDIO.CLICK.play();
  },
  onComplete: () => {
    set([DUMMY, HIT], { display: 'block' });
    set(CORDS[0], { display: 'none' });
    RESET();
  },
});

// Simple cord animation without morphing
for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
    to(CORDS[0], {
      opacity: 0.5,
      duration: CORD_DURATION,
      repeat: 1,
      yoyo: true,
    })
  );
}

gsap.registerPlugin(Draggable);

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: (e) => {
    startX = e.x;
    startY = e.y;
  },
  onDrag: function () {
    set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: this.y,
      },
    });
  },
  onRelease: function (e) {
    const DISTX = Math.abs(e.x - startX);
    const DISTY = Math.abs(e.y - startY);
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
    to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50) {
          CORD_TL.restart();
        } else {
          RESET();
        }
      },
    });
  },
});

// Smooth scrolling for navigation links
document.addEventListener('click', function (e) {
  if (
    e.target.getAttribute('href') &&
    e.target.getAttribute('href').startsWith('#')
  ) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Form submission handler
document
  .querySelector('.contact-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    this.reset();
  });
