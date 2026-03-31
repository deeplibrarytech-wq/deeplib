const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactRecipientEmail = 'deeplibrarytech@gmail.com';

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (contactForm && formStatus) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const values = Object.fromEntries(formData.entries());

    if (!values.name || !values.email || !values.message) {
      formStatus.textContent = 'Llena todos los campos antes de enviar.';
      formStatus.style.color = '#ffc74f';
      return;
    }

    const subject = encodeURIComponent(`Solicitud DeepLib - ${values.service || 'Consulta general'}`);
    const body = encodeURIComponent(
      `Nombre: ${values.name}\n` +
      `Email: ${values.email}\n` +
      `Empresa/Proyecto: ${values.company || 'No especificado'}\n` +
      `Servicio: ${values.service || 'Consulta general'}\n\n` +
      `Mensaje:\n${values.message}`
    );

    const mailtoUrl = `mailto:${contactRecipientEmail}?subject=${subject}&body=${body}`;

    formStatus.textContent = `Se abrirá tu cliente de correo para enviar el mensaje a ${contactRecipientEmail}.`;
    formStatus.style.color = '#9ef6a8';

    if (submitButton) {
      submitButton.blur();
    }

    window.location.href = mailtoUrl;
  });
}

/* ============================================================================
   TECHNOLOGIES CAROUSEL - Infinite Loop Setup
   ============================================================================ */
const techCarouselTrack = document.getElementById('techCarouselTrack');
if (techCarouselTrack) {
  const slides = Array.from(techCarouselTrack.querySelectorAll('.tech-slide'));
  const slidesClone = slides.map(slide => slide.cloneNode(true));
  slidesClone.forEach(slide => techCarouselTrack.appendChild(slide));
}

/* ============================================================================
   VIDEO GALLERY - Interactive video/post cards
   ============================================================================ */
const videoCards = document.querySelectorAll('.video-card');
videoCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const videoEmbed = card.querySelector('.video-embed');
    const isHidden = videoEmbed.hasAttribute('hidden');

    // Close all other videos
    videoCards.forEach(otherCard => {
      if (otherCard !== card) {
        const otherEmbed = otherCard.querySelector('.video-embed');
        if (otherEmbed && !otherEmbed.hasAttribute('hidden')) {
          otherEmbed.setAttribute('hidden', '');
        }
      }
    });

    // Toggle this video
    if (isHidden) {
      videoEmbed.removeAttribute('hidden');
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      videoEmbed.setAttribute('hidden', '');
    }
  });
});

const revealElements = document.querySelectorAll('.reveal');

function initBackToTop() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Volver arriba');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 11L12 5L18 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(button);
  return button;
}

const backToTopButton = document.body ? initBackToTop() : null;

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 90) {
      el.classList.add('active');
    }
  });

  if (backToTopButton) {
    backToTopButton.classList.toggle('visible', window.scrollY > 260);
  }
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

function initTypewriter() {
  const typedElements = document.querySelectorAll('[data-typing-text]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  typedElements.forEach((element) => {
    const fullText = element.dataset.typingText?.trim() || element.textContent.trim();
    const speed = Number(element.dataset.typingSpeed || 45);
    const delay = Number(element.dataset.typingDelay || 250);

    if (reduceMotion) {
      element.textContent = fullText;
      return;
    }

    let index = 0;
    element.textContent = '';

    const typeNext = () => {
      element.textContent = fullText.slice(0, index);

      if (index < fullText.length) {
        index += 1;
        const nextDelay = fullText[index - 1] === ' ' ? speed * 0.6 : speed;
        window.setTimeout(typeNext, nextDelay);
      }
    };

    window.setTimeout(typeNext, delay);
  });
}

initTypewriter();

function initCourseCarousel() {
  const carousel = document.querySelector('[data-course-carousel]');
  if (!carousel) return;

  const posters = Array.from(carousel.querySelectorAll('[data-course-poster]'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  if (!posters.length) return;

  let activeIndex = 0;
  let autoRotate = null;

  function closeAllDetails() {
    posters.forEach((poster) => {
      poster.classList.remove('is-open');
      const details = poster.querySelector('.course-details');
      const toggle = poster.querySelector('.course-toggle');
      if (details) details.hidden = true;
      if (toggle) {
        toggle.textContent = '+';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function getPosition(offset) {
    if (offset === 0) return 'active';
    if (offset === -1 || offset === posters.length - 1) return 'left';
    if (offset === 1 || offset === -(posters.length - 1)) return 'right';
    if (offset < 0) return 'back-left';
    return 'back-right';
  }

  function renderCarousel() {
    posters.forEach((poster, index) => {
      let offset = index - activeIndex;
      if (offset > posters.length / 2) offset -= posters.length;
      if (offset < -posters.length / 2) offset += posters.length;

      poster.dataset.position = getPosition(offset);
      poster.setAttribute('aria-hidden', String(offset !== 0));
    });
  }

  function goTo(index) {
    activeIndex = (index + posters.length) % posters.length;
    closeAllDetails();
    renderCarousel();
  }

  function startAutoRotate() {
    window.clearInterval(autoRotate);
    autoRotate = window.setInterval(() => {
      goTo(activeIndex + 1);
    }, 4200);
  }

  prevButton?.addEventListener('click', () => {
    goTo(activeIndex - 1);
    startAutoRotate();
  });

  nextButton?.addEventListener('click', () => {
    goTo(activeIndex + 1);
    startAutoRotate();
  });

  posters.forEach((poster, index) => {
    poster.addEventListener('click', (event) => {
      if (event.target.closest('.course-toggle')) return;
      goTo(index);
      startAutoRotate();
    });

    const toggle = poster.querySelector('.course-toggle');
    const details = poster.querySelector('.course-details');

    toggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      goTo(index);
      const isOpen = !poster.classList.contains('is-open');
      closeAllDetails();
      poster.classList.toggle('is-open', isOpen);
      if (details) details.hidden = !isOpen;
      toggle.textContent = isOpen ? '−' : '+';
      toggle.setAttribute('aria-expanded', String(isOpen));
      startAutoRotate();
    });
  });

  carousel.addEventListener('mouseenter', () => window.clearInterval(autoRotate));
  carousel.addEventListener('mouseleave', startAutoRotate);

  renderCarousel();
  startAutoRotate();
}

initCourseCarousel();

function initInteractiveStarfield(canvas) {
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const STAR_COLOR = '#ffffff';
  const STAR_SIZE = 3;
  const STAR_MIN_SCALE = 0.2;
  const OVERFLOW_THRESHOLD = 50;

  let scale = 1;
  let width = 0;
  let height = 0;
  let stars = [];
  let pointerX = null;
  let pointerY = null;
  let touchInput = false;

  const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

  function getStarCount() {
    return Math.max(80, Math.floor((canvas.clientWidth + canvas.clientHeight) / 8));
  }

  function generate() {
    stars = [];
    for (let i = 0; i < getStarCount(); i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
      });
    }
  }

  function recycleStar(star) {
    let direction = 'z';
    const vx = Math.abs(velocity.x);
    const vy = Math.abs(velocity.y);

    if (vx > 1 || vy > 1) {
      let axis;
      if (vx > vy) {
        axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
      } else {
        axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
      }

      if (axis === 'h') {
        direction = velocity.x > 0 ? 'l' : 'r';
      } else {
        direction = velocity.y > 0 ? 't' : 'b';
      }
    }

    star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

    if (direction === 'z') {
      star.z = 0.1;
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    } else if (direction === 'l') {
      star.x = -OVERFLOW_THRESHOLD;
      star.y = height * Math.random();
    } else if (direction === 'r') {
      star.x = width + OVERFLOW_THRESHOLD;
      star.y = height * Math.random();
    } else if (direction === 't') {
      star.x = width * Math.random();
      star.y = -OVERFLOW_THRESHOLD;
    } else if (direction === 'b') {
      star.x = width * Math.random();
      star.y = height + OVERFLOW_THRESHOLD;
    }
  }

  function resizeStarfield() {
    scale = window.devicePixelRatio || 1;
    width = Math.max(1, Math.floor(canvas.clientWidth * scale));
    height = Math.max(1, Math.floor(canvas.clientHeight * scale));
    canvas.width = width;
    canvas.height = height;
    generate();
  }

  function update() {
    velocity.tx *= 0.96;
    velocity.ty *= 0.96;

    velocity.x += (velocity.tx - velocity.x) * 0.8;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    stars.forEach((star) => {
      star.x += velocity.x * star.z;
      star.y += velocity.y * star.z;
      star.x += (star.x - width / 2) * velocity.z * star.z;
      star.y += (star.y - height / 2) * velocity.z * star.z;
      star.z += velocity.z;

      if (
        star.x < -OVERFLOW_THRESHOLD ||
        star.x > width + OVERFLOW_THRESHOLD ||
        star.y < -OVERFLOW_THRESHOLD ||
        star.y > height + OVERFLOW_THRESHOLD
      ) {
        recycleStar(star);
      }
    });
  }

  function render() {
    context.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      context.beginPath();
      context.lineCap = 'round';
      context.lineWidth = STAR_SIZE * star.z * scale;
      context.globalAlpha = 0.5 + 0.5 * Math.random();
      context.strokeStyle = STAR_COLOR;
      context.moveTo(star.x, star.y);

      let tailX = velocity.x * 2;
      let tailY = velocity.y * 2;

      if (Math.abs(tailX) < 0.1) tailX = 0.5;
      if (Math.abs(tailY) < 0.1) tailY = 0.5;

      context.lineTo(star.x + tailX, star.y + tailY);
      context.stroke();
    });
  }

  function stepStarfield() {
    update();
    render();
    window.requestAnimationFrame(stepStarfield);
  }

  function movePointer(x, y) {
    if (typeof pointerX === 'number' && typeof pointerY === 'number') {
      const ox = x - pointerX;
      const oy = y - pointerY;
      velocity.tx += (ox / (8 * scale)) * (touchInput ? 1 : -1);
      velocity.ty += (oy / (8 * scale)) * (touchInput ? 1 : -1);
    }

    pointerX = x;
    pointerY = y;
  }

  function handlePointerMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    movePointer((clientX - rect.left) * scale, (clientY - rect.top) * scale);
  }

  function onPointerLeave() {
    pointerX = null;
    pointerY = null;
  }

  canvas.addEventListener('mousemove', (event) => {
    touchInput = false;
    handlePointerMove(event.clientX, event.clientY);
  });

  canvas.addEventListener('touchmove', (event) => {
    touchInput = true;
    if (event.touches[0]) {
      handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
    }
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', onPointerLeave);
  canvas.addEventListener('mouseleave', onPointerLeave);
  window.addEventListener('resize', resizeStarfield);

  resizeStarfield();
  stepStarfield();
}

function createParticles(canvas, particleCount = 80, color = 'rgba(47, 213, 248, 0.7)') {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const w = () => canvas.width = canvas.clientWidth;
  const h = () => canvas.height = canvas.clientHeight;

  function reset() {
    w();
    h();
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        r: Math.random() * 2 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.strokeStyle = `rgba(47, 213, 248, ${1 - dist / 100})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', reset);
  reset();
  draw();
}

createParticles(document.getElementById('heroParticlesCanvas'), 110, 'rgba(159, 255, 255, 0.9)');
initInteractiveStarfield(document.getElementById('coursesHeroCanvas'));

// TubesCursor para Iniciativas de vanguardia
const bannerCanvas = document.getElementById('canvas');

if (bannerCanvas) {
  (async () => {
    const { default: TubesCursor } = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');

    const app = TubesCursor(bannerCanvas, {
      tubes: {
        colors: ["#f967fb", "#53bc28", "#6958d5"],
        lights: {
          intensity: 200,
          colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
        }
      }
    });

    document.body.addEventListener('click', () => {
      const colors = randomColors(3);
      const lightsColors = randomColors(4);
      console.log(colors, lightsColors);
      app.tubes.setColors(colors);
      app.tubes.setLightsColors(lightsColors);
    });

    function randomColors(count) {
      return new Array(count)
        .fill(0)
        .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    }
  })();
}

/* ============================================================================
   MATRIX RAIN EFFECT - Microservicios Hero Background
   ============================================================================ */
(async () => {
  const { Pane } = await import('https://esm.sh/tweakpane@4.0.3');

  // Configuration state for the Matrix effect
  const state = {
    fps: 30,
    bgOpacity: 0.08,
    color: "#2fd5f8",
    charset: "01",
    size: 16
  };

  // Create control panel GUI (hidden by default, can be toggled)
  const gui = new Pane({
    title: "Matrix Settings"
  });
  gui.addBinding(state, "fps", { min: 1, max: 120, step: 1 });
  gui.addBinding(state, "bgOpacity", { min: 0, max: 1, step: 0.01 });
  gui.addBinding(state, "color");
  gui.addBinding(state, "charset");
  gui.addBinding(state, "size", { min: 1, max: 120, step: 1 });

  // Hide Tweakpane by default
  const paneContainer = document.querySelector('.tp-dfwv');
  if (paneContainer) {
    paneContainer.style.display = 'none';
  }

  // Get canvas and drawing context
  const canvas = document.getElementById("codingCanvas");
  const ctx = canvas.getContext("2d");

  // Canvas dimensions and column positions
  let w, h, colYPos;

  // Resize canvas to fit window and reinitialize column positions
  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    
    const numCols = Math.ceil(w / state.size);
    colYPos = Array(numCols).fill(0);
  };

  // Listen for window resize
  window.addEventListener("resize", resize);

  // Initial setup
  resize();

  // Helper function to pick random item from array
  const random = (items) => items[Math.floor(Math.random() * items.length)];
  const randomRange = (start, end) => start + end * Math.random();

  // Draw one frame of the Matrix effect
  const draw = () => {
    ctx.fillStyle = `rgba(1,2,7,${state.bgOpacity})`;
    ctx.fillRect(0, 0, w, h);
    
    ctx.fillStyle = state.color;
    ctx.font = state.size + "px monospace";
    
    for (let i = 0; i < colYPos.length; i++) {
      const yPos = colYPos[i];
      const xPos = i * state.size;
      
      ctx.fillText(random(state.charset.split('')), xPos, yPos);
      
      const reachedBottom = yPos >= h;
      const randomReset = yPos >= randomRange(100, 5000);
      
      if (reachedBottom || randomReset) {
        colYPos[i] = 0;
      } else {
        colYPos[i] = yPos + state.size;
      }
    }
  };

  // Animation loop with FPS control
  let intervalId = setInterval(draw, 1000 / state.fps);

  // Update interval when FPS changes
  gui.on("change", (ev) => {
    if (ev.presetKey === "fps") {
      clearInterval(intervalId);
      intervalId = setInterval(draw, 1000 / state.fps);
    }
  });

  // Toggle Tweakpane visibility with Ctrl+Shift+M
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
      const paneContainer = document.querySelector('.tp-dfwv');
      if (paneContainer) {
        paneContainer.style.display = paneContainer.style.display === 'none' ? 'block' : 'none';
      }
    }
  });
})();

/* ============================================================================
   PROJECT CARDS SCROLL ANIMATION - Microservicios
   ============================================================================ */
(() => {
  // Smooth scroll animation for project cards on microservicios page
  const initProjectCardAnimations = () => {
    const cards = document.querySelectorAll('.project-card, .proximamente-card');
    if (cards.length === 0) return;

    // Create Intersection Observer for smooth scroll reveal
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for multiple cards
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 80);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Initial state: cards are hidden and translated down
    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(card);
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectCardAnimations);
  } else {
    initProjectCardAnimations();
  }
})();

/* ============================================================================
   METABALLS WEBGL EFFECT - Web.html Hero
   ============================================================================ */
(() => {
  const canvas = document.getElementById('metaballsCanvas');
  if (!canvas) return;

  const heroSection = canvas.parentElement;
  const numMetaballs = 30;
  const metaballs = [];

  canvas.width = heroSection.offsetWidth;
  canvas.height = heroSection.offsetHeight;

  const gl = canvas.getContext('webgl', { alpha: true });
  if (!gl) return;

  // Initialize metaballs
  for (let i = 0; i < numMetaballs; i++) {
    const radius = Math.random() * 60 + 10;
    metaballs.push({
      x: Math.random() * (canvas.width - 2 * radius) + radius,
      y: Math.random() * (canvas.height - 2 * radius) + radius,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      r: radius * 0.75
    });
  }

  const vertexShaderSrc = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSrc = `
    precision highp float;
    const float WIDTH = ${canvas.width}.0;
    const float HEIGHT = ${canvas.height}.0;
    uniform vec3 metaballs[${numMetaballs}];

    void main(){
      float x = gl_FragCoord.x;
      float y = gl_FragCoord.y;
      float sum = 0.0;

      for (int i = 0; i < ${numMetaballs}; i++) {
        vec3 metaball = metaballs[i];
        float dx = metaball.x - x;
        float dy = metaball.y - y;
        float radius = metaball.z;
        sum += (radius * radius) / (dx * dx + dy * dy);
      }

      if (sum >= 0.99) {
        float glow = min(1.0, (sum - 0.99) * 5.0);
        gl_FragColor = vec4(
          mix(vec3(0.2, 0.8, 1.0), vec3(0.5, 0.2, 1.0), glow),
          glow * 0.6
        );
        return;
      }
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
  `;

  function compileShader(shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function getUniformLocation(program, name) {
    const uniformLocation = gl.getUniformLocation(program, name);
    if (uniformLocation === -1) {
      console.error('Can not find uniform ' + name + '.');
      return null;
    }
    return uniformLocation;
  }

  function getAttribLocation(program, name) {
    const attributeLocation = gl.getAttribLocation(program, name);
    if (attributeLocation === -1) {
      console.error('Can not find attribute ' + name + '.');
      return null;
    }
    return attributeLocation;
  }

  const vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertexData = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
  ]);

  const vertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  const positionHandle = getAttribLocation(program, 'position');
  if (positionHandle !== null) {
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, gl.FALSE, 2 * 4, 0);
  }

  const metaballsHandle = getUniformLocation(program, 'metaballs');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let animationId = null;

  function loop() {
    for (let i = 0; i < numMetaballs; i++) {
      const metaball = metaballs[i];
      metaball.x += metaball.vx;
      metaball.y += metaball.vy;

      if (metaball.x < metaball.r || metaball.x > canvas.width - metaball.r) {
        metaball.vx *= -1;
      }
      if (metaball.y < metaball.r || metaball.y > canvas.height - metaball.r) {
        metaball.vy *= -1;
      }
    }

    const dataToSendToGPU = new Float32Array(3 * numMetaballs);
    for (let i = 0; i < numMetaballs; i++) {
      const baseIndex = 3 * i;
      const mb = metaballs[i];
      dataToSendToGPU[baseIndex + 0] = mb.x;
      dataToSendToGPU[baseIndex + 1] = mb.y;
      dataToSendToGPU[baseIndex + 2] = mb.r;
    }

    if (metaballsHandle) {
      gl.uniform3fv(metaballsHandle, dataToSendToGPU);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationId = requestAnimationFrame(loop);
  }

  loop();

  // Handle window resize
  window.addEventListener('resize', () => {
    if (heroSection && canvas) {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  });

  // Cleanup on navigation
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
})();

/* ===== STARS ANIMATION FOR HERO ===== */
(() => {
  // Check if stars canvas exists
  if (!document.getElementById('starsCanvas')) return;

  // To ensure we use native resolution of screen
  var dpr = window.devicePixelRatio || 1;

  // getting canvases with native resolution
  const canvas = document.getElementById("starsCanvas");
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const canvasMw = document.getElementById("milkyWayCanvas");
  canvasMw.width = window.innerWidth * dpr;
  canvasMw.height = window.innerHeight * dpr;
  const ctxMw = canvasMw.getContext('2d');
  ctxMw.scale(dpr, dpr);

  // constants for the behavior of the model
  const sNumber = 600;
  const sSize = 0.3;
  const sSizeR = 0.6;
  const sAlphaR = 0.5;
  const sMaxHueProportion = 0.6;

  // Shooting stars parameters
  const shootingStarDensity = 0.01;
  const shootingStarBaseXspeed = 30;
  const shootingStarBaseYspeed = 15;
  const shootingStarBaseLength = 8;
  const shootingStarBaseLifespan = 60;

  // Shooting star colors
  const shootingStarsColors = [
    "#a1ffba",
    "#a1d2ff",
    "#fffaa1",
    "#ffa1a1"
  ];

  // milky way constants
  const mwStarCount = 100000;
  const mwRandomStarProp = 0.2;
  const mwClusterCount = 300;
  const mwClusterStarCount = 1500;
  const mwClusterSize = 120;
  const mwClusterSizeR = 80;
  const mwClusterLayers = 10;
  const mwAngle = 0.6;
  const mwHueMin = 150;
  const mwHueMax = 300;
  const mwWhiteProportionMin = 50;
  const mwWhiteProportionMax = 65;

  // array containing random numbers
  let randomArray;
  const randomArrayLength = 1000;
  let randomArrayIterator = 0;

  // array containing random hues
  let hueArray;
  const hueArrayLength = 1000;

  // arrays containing all Stars
  let StarsArray;
  let ShootingStarsArray;

  // Star creation
  class Star {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.alpha = size / (sSize + sSizeR);
      this.baseHue = hueArray[Math.floor(Math.random() * hueArrayLength)];
      this.baseHueProportion = Math.random();
      this.randomIndexa = Math.floor(Math.random() * randomArrayLength);
      this.randomIndexh = this.randomIndexa;
      this.randomValue = randomArray[this.randomIndexa];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      let rAlpha = this.alpha + Math.min((this.randomValue - 0.5) * sAlphaR, 1);
      let rHue = randomArray[this.randomIndexh] > this.baseHueProportion ? hueArray[this.randomIndexa] : this.baseHue;
      this.color = "hsla(" + rHue + ",100%,85%," + rAlpha + ")";
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.randomIndexh = this.randomIndexa;
      this.randomIndexa = (this.randomIndexa >= 999) ? 0 : this.randomIndexa + 1;
      this.randomValue = randomArray[this.randomIndexa];
      this.draw();
    }
  }

  // Shooting Star creation
  class ShootingStar {
    constructor(x, y, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.speedY = speedY;
      this.framesLeft = shootingStarBaseLifespan;
      this.color = color;
    }

    goingOut() {
      return this.framesLeft <= 0;
    }

    ageModifier() {
      let halfLife = shootingStarBaseLifespan / 2.0;
      return Math.pow(1.0 - Math.abs(this.framesLeft - halfLife) / halfLife, 2);
    }

    draw() {
      let am = this.ageModifier();
      let endX = this.x - this.speedX * shootingStarBaseLength * am;
      let endY = this.y - this.speedY * shootingStarBaseLength * am;

      let gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
      gradient.addColorStop(0, "#fff");
      gradient.addColorStop(Math.min(am, 0.7), this.color);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    update() {
      this.framesLeft--;
      this.x += this.speedX;
      this.y += this.speedY;
      this.draw();
    }
  }

  // star cluster in the milky way
  class MwStarCluster {
    constructor(x, y, size, hue, baseWhiteProportion, brigthnessModifier) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.hue = hue;
      this.baseWhiteProportion = baseWhiteProportion;
      this.brigthnessModifier = brigthnessModifier;
    }

    draw() {
      let starsPerLayer = Math.floor(mwClusterStarCount / mwClusterLayers);
      for (let layer = 1; layer < mwClusterLayers; layer++) {
        let layerRadius = (this.size * layer) / mwClusterLayers;
        for (let i = 1; i < starsPerLayer; i++) {
          let posX = this.x + 2 * layerRadius * (Math.random() - 0.5);
          let posY = this.y + 2 * Math.sqrt(Math.pow(layerRadius, 2) - Math.pow(this.x - posX, 2)) * (Math.random() - 0.5);
          let size = 0.05 + Math.random() * 0.15;
          let alpha = 0.3 + Math.random() * 0.4;
          let whitePercentage = this.baseWhiteProportion + 15 + 15 * this.brigthnessModifier + Math.floor(Math.random() * 10);
          ctxMw.beginPath();
          ctxMw.arc(posX, posY, size, 0, Math.PI * 2, false);
          ctxMw.fillStyle = "hsla(" + this.hue + ",100%," + whitePercentage + "%," + alpha + ")";
          ctxMw.fill();
        }
      }

      let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, "hsla(" + this.hue + ",100%," + this.baseWhiteProportion + "%,0.002)");
      gradient.addColorStop(0.25, "hsla(" + this.hue + ",100%," + (this.baseWhiteProportion + 30) + "%," + (0.01 + 0.01 * this.brigthnessModifier) + ")");
      gradient.addColorStop(0.4, "hsla(" + this.hue + ",100%," + (this.baseWhiteProportion + 15) + "%,0.005)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctxMw.beginPath();
      ctxMw.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctxMw.fillStyle = gradient;
      ctxMw.fill();
    }
  }

  // create Star array
  function init() {
    // init random array
    randomArray = [];
    for (let i = 0; i < randomArrayLength; i++) {
      randomArray[i] = Math.random();
    }

    // init hueArray
    hueArray = [];
    for (let i = 0; i < hueArrayLength; i++) {
      let rHue = Math.floor(Math.random() * 160);
      if (rHue > 60) rHue += 110;
      hueArray[i] = rHue;
    }

    StarsArray = [];
    for (let i = 0; i < sNumber; i++) {
      let size = (Math.random() * sSizeR) + sSize;
      let x = Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2;
      let y = Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2;
      StarsArray.push(new Star(x, y, size));
    }

    ShootingStarsArray = [];

    DrawMilkyWayCanvas();
  }

  // animation
  function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < StarsArray.length; i++) {
      StarsArray[i].update();
    }

    // pushing a new shooting star randomly
    if (randomArray[randomArrayIterator] < shootingStarDensity) {
      let posX = Math.floor(Math.random() * canvas.width);
      let posY = Math.floor(Math.random() * 150);
      let speedX = Math.floor((Math.random() - 0.5) * shootingStarBaseXspeed);
      let speedY = Math.floor(Math.random() * shootingStarBaseYspeed);
      let color = shootingStarsColors[Math.floor(Math.random() * shootingStarsColors.length)];
      ShootingStarsArray.push(new ShootingStar(posX, posY, speedX, speedY, color));
    }

    // removing out of frame or dead shooting stars
    let arrayIterator = ShootingStarsArray.length - 1;
    while (arrayIterator >= 0) {
      if (ShootingStarsArray[arrayIterator].goingOut() === true) {
        ShootingStarsArray.splice(arrayIterator, 1);
      } else {
        ShootingStarsArray[arrayIterator].update();
      }
      arrayIterator--;
    }

    // moving through random array
    if (randomArrayIterator + 1 >= randomArrayLength) {
      randomArrayIterator = 0;
    } else {
      randomArrayIterator++;
    }
  }

  // to get x position of a star or cluster in the milky way
  function MilkyWayX() {
    return Math.floor(Math.random() * innerWidth);
  }

  // to get y position of a star or cluster in the milky way depending on x position
  function MilkyWayYFromX(xPos, mode) {
    let offset = ((innerWidth / 2) - xPos) * mwAngle;
    if (mode === "star") {
      return Math.floor(Math.pow(Math.random(), 1.2) * innerHeight * (Math.random() - 0.5) + innerHeight / 2 + (Math.random() - 0.5) * 100) + offset;
    } else {
      return Math.floor(Math.pow(Math.random(), 1.5) * innerHeight * 0.6 * (Math.random() - 0.5) + innerHeight / 2 + (Math.random() - 0.5) * 100) + offset;
    }
  }

  // To draw the milkyWay
  function DrawMilkyWayCanvas() {
    // at first we draw unclustered stars
    for (let i = 0; i < mwStarCount; i++) {
      ctxMw.beginPath();
      let xPos = MilkyWayX();
      let yPos = Math.random() < mwRandomStarProp ? Math.floor(Math.random() * innerHeight) : MilkyWayYFromX(xPos, "star");
      let size = Math.random() * 0.27;
      ctxMw.arc(xPos, yPos, size, 0, Math.PI * 2, false);
      let alpha = 0.4 + Math.random() * 0.6;
      ctxMw.fillStyle = "hsla(0,100%,100%," + alpha + ")";
      ctxMw.fill();
    }

    // now we draw clusters
    for (let i = 0; i < mwClusterCount; i++) {
      let xPos = MilkyWayX();
      let yPos = MilkyWayYFromX(xPos, "cluster");
      let distToCenter = (1 - (Math.abs(xPos - innerWidth / 2) / (innerWidth / 2))) * (1 - (Math.abs(yPos - innerHeight / 2) / (innerHeight / 2)));
      let size = mwClusterSize + Math.random() * mwClusterSizeR;
      let hue = mwHueMin + Math.floor((Math.random() * 0.5 + distToCenter * 0.5) * (mwHueMax - mwHueMin));
      let baseWhiteProportion = mwWhiteProportionMin + Math.random() * (mwWhiteProportionMax - mwWhiteProportionMin);
      new MwStarCluster(xPos, yPos, size, hue, baseWhiteProportion, distToCenter).draw();
    }
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    canvasMw.width = window.innerWidth * dpr;
    canvasMw.height = window.innerHeight * dpr;
    ctxMw.scale(dpr, dpr);

    // Reinitialize
    init();
  });

  // Start animation
  init();
  animate();
})();

/* ===== LIQUID BACKGROUND FOR HERO ===== */
(() => {
  // Check if liquid canvas exists
  const liquidCanvas = document.getElementById('liquidCanvas');
  if (!liquidCanvas) return;

  // Import and initialize LiquidBackground
  import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js')
    .then((module) => {
      const LiquidBackground = module.default;
      
      try {
        const app = LiquidBackground(liquidCanvas);
        
        // Configure liquid effect
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 5;
        app.setRain(false);
        
        // Handle window resize
        window.addEventListener('resize', () => {
          if (app && app.camera) {
            app.camera.aspect = window.innerWidth / window.innerHeight;
            app.camera.updateProjectionMatrix();
            app.renderer.setSize(window.innerWidth, window.innerHeight);
          }
        });
      } catch (error) {
        console.log('Liquid background initialization skipped');
      }
    })
    .catch((error) => {
      console.log('Liquid background library not available');
    });
})();

