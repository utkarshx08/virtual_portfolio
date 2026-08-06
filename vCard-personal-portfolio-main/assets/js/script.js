// Safe destructuring of OGL from global scope to support file:// protocol
const OGL_LIB = window.OGL || null;
const { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } = OGL_LIB || {};



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Limelight Navigation Highlight Functionality
const limelight = document.querySelector("[data-limelight]");
const navbar = document.querySelector(".navbar");

const updateLimelight = function () {
  const activeLink = document.querySelector(".navbar-link.active");
  if (activeLink && limelight && navbar) {
    const navbarRect = navbar.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    
    const newLeft = (linkRect.left - navbarRect.left) + (linkRect.width / 2) - (limelight.offsetWidth / 2);
    limelight.style.left = `${newLeft}px`;
    limelight.style.opacity = "1";
  }
};

// Skill Progress Fills Animation
const animateSkills = function () {
  const fills = document.querySelectorAll(".skill-progress-fill");
  fills.forEach(fill => {
    if (!fill.dataset.targetWidth) {
      fill.dataset.targetWidth = fill.style.width || "0%";
    }
    fill.style.width = "0%";
    fill.offsetHeight; // trigger browser reflow
    setTimeout(() => {
      fill.style.width = fill.dataset.targetWidth;
    }, 100);
  });
};

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);

        if (pages[i].dataset.page === "resume") {
          animateSkills();
        } else if (pages[i].dataset.page === "blog") {
          resizeBlogGallery();
        }
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    updateLimelight();

  });
}

// TrueFocus Custom Snapping Cursor Frame
function initTrueFocusCursor() {
  const focusFrame = document.getElementById("focusFrame");
  if (!focusFrame) return;

  let currentTarget = null;
  let isFrameActive = false;
  let animFrameId = null;

  // CSS selector for all elements that are interactive/selectable in the portfolio
  const selectablesSelector = `
    .navbar-link,
    .service-item,
    .project-item,
    .blog-post-item > a,
    .testimonials-item,
    .social-link,
    .form-btn,
    .info_more-btn,
    .form-input,
    .filter-item button,
    .clients-item a
  `;

  function updateFramePosition() {
    if (!isFrameActive || !currentTarget) {
      animFrameId = null;
      return;
    }
    
    const rect = currentTarget.getBoundingClientRect();
    
    // Position using hardware-accelerated transform to prevent layout reflows and jitter.
    // Querying bounding rect dynamically in a RAF loop aligns the frame with CSS animations and scales.
    focusFrame.style.width = `${rect.width}px`;
    focusFrame.style.height = `${rect.height}px`;
    focusFrame.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;

    animFrameId = requestAnimationFrame(updateFramePosition);
  }

  function showFrame(target) {
    currentTarget = target;
    isFrameActive = true;
    focusFrame.classList.add("active");
    
    // Start tracking position and dimension changes in animation loop
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updateFramePosition);
    }
  }

  function hideFrame() {
    currentTarget = null;
    isFrameActive = false;
    focusFrame.classList.remove("active");
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  // Use event delegation for mouseenter and mouseleave tracking
  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(selectablesSelector);
    if (target && target !== currentTarget) {
      showFrame(target);
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target.closest(selectablesSelector);
    if (target && target === currentTarget) {
      const related = e.relatedTarget;
      // Hide only if the mouse has truly exited the boundary of the interactive container
      if (!related || !target.contains(related)) {
        hideFrame();
      }
    }
  });

  // Re-align the frame on window resize (optional safeguard)
  window.addEventListener("resize", () => {
    if (isFrameActive && currentTarget) {
      updateFramePosition();
    }
  });
}

// Initial update on page load (with a small timeout to let the layout render)
window.addEventListener("load", function() {
  setTimeout(updateLimelight, 100);
  
  // If loaded directly on resume page, trigger initial skill animations
  const resumePage = document.querySelector('[data-page="resume"]');
  if (resumePage && resumePage.classList.contains("active")) {
    setTimeout(animateSkills, 300);
  }
  
  // Initialize full-screen WebGL background
  initLightfall();
  
  // Initialize WebGL circular gallery for blog posts (commented out to display tilted cards in blog grid)
  // initBlogGallery();

  // Initialize Portfolio Project detail modals
  initProjectModal();

  // Initialize interactive 3D Tilted Cards on portfolio & blog images
  initTiltedCards();

  // Initialize TrueFocus Snapping Cursor Frame
  initTrueFocusCursor();
});

// Update layout on window resize
window.addEventListener("resize", updateLimelight);

// Ambient Cursor Glow & Dynamic Card Spotlights
const glow = document.getElementById("cursorGlow");
const interactiveCards = document.querySelectorAll(".service-item, .content-card, .blog-post-item > a, .project-item > a");

window.addEventListener("mousemove", function(e) {
  if (glow) {
    glow.style.setProperty("--x", `${e.clientX}px`);
    glow.style.setProperty("--y", `${e.clientY}px`);
  }
});

interactiveCards.forEach(card => {
  card.addEventListener("mousemove", function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// WebGL Lightfall Background Renderer
function initLightfall() {
  const canvas = document.getElementById("lightfall-canvas");
  if (!canvas) return;
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;
  
  const vsSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  
  const fsSource = `
    precision highp float;
    uniform vec3  iResolution;
    uniform vec2  iMouse;
    uniform float iTime;

    uniform vec3  uColor0;
    uniform vec3  uColor1;
    uniform vec3  uColor2;
    uniform vec3  uColor3;
    uniform vec3  uColor4;
    uniform vec3  uColor5;
    uniform vec3  uColor6;
    uniform vec3  uColor7;
    uniform int   uColorCount;

    uniform vec3  uBgColor;
    uniform vec3  uMouseColor;
    uniform float uSpeed;
    uniform int   uStreakCount;
    uniform float uStreakWidth;
    uniform float uStreakLength;
    uniform float uGlow;
    uniform float uDensity;
    uniform float uTwinkle;
    uniform float uZoom;
    uniform float uBgGlow;
    uniform float uOpacity;
    uniform float uMouseEnabled;
    uniform float uMouseStrength;
    uniform float uMouseRadius;

    varying vec2 vUv;

    vec3 palette(float h) {
      int count = uColorCount;
      if (count < 1) count = 1;
      int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
      if (idx <= 0) return uColor0;
      if (idx == 1) return uColor1;
      if (idx == 2) return uColor2;
      if (idx == 3) return uColor3;
      if (idx == 4) return uColor4;
      if (idx == 5) return uColor5;
      if (idx == 6) return uColor6;
      return uColor7;
    }

    vec3 tanhv(vec3 x) {
      vec3 e = exp(-2.0 * x);
      return (1.0 - e) / (1.0 + e);
    }

    vec2 sceneC(vec2 frag, vec2 r) {
      vec2 P = (frag + frag - r) / r.x;
      float z = 0.0;
      float d = 1e3;
      vec4 O = vec4(0.0);
      for (int k = 0; k < 39; k++) {
        if (d <= 1e-4) break;
        O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
        d = 1.0 - sqrt(length(O * O));
        z += d;
      }
      return vec2(O.x, atan(O.z, O.y));
    }

    void mainImage(out vec4 o, vec2 C) {
      vec2 r = iResolution.xy;
      vec2 uv0 = (C + C - r) / r.x;
      float T = 0.1 * iTime * uSpeed + 9.0;
      float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
      vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

      vec2 c0 = sceneC(C, r);
      vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
      vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
      vec2 dCx = cdx - c0;
      vec2 dCy = cdy - c0;
      dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
      dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
      vec2 fw = abs(dCx) + abs(dCy);
      C = c0;

      vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
      vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

      float mGlow = 0.0;
      if (uMouseEnabled > 0.5) {
        vec2 mN = (iMouse + iMouse - r) / r.x;
        float md = length(uv0 - mN);
        mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
        O.rgb += uMouseColor * mGlow * 0.25;
      }

      float zr = 5e-4 * uStreakWidth;
      vec2 rr = vec2(max(length(fw), 1e-5));
      float tail = 19.0 / max(uStreakLength, 0.05);

      for (int m = 0; m < 16; m++) {
        if (m >= uStreakCount) break;
        float jf = float(m) + 1.0;
        float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
        vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
        Pp -= floor(Pp / Y + 0.5) * Y;
        float h = fract(8663.0 * ic);
        vec3 col = palette(h);
        float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
        weight *= (1.0 + mGlow * 2.0);
        vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
        vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
        O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
        C.x += Y.x / 8.0;
      }

      vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
      o = vec4(colr, uOpacity);
    }

    void main() {
      vec4 color;
      mainImage(color, vUv * iResolution.xy);
      gl_FragColor = color;
    }
  `;

  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader Compile Error:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vs = compileShader(vsSource, gl.VERTEX_SHADER);
  const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program Link Error:", gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  const getLoc = name => gl.getUniformLocation(program, name);
  const uniforms = {
    resolution: getLoc("iResolution"),
    mouse: getLoc("iMouse"),
    time: getLoc("iTime"),
    colors: [
      getLoc("uColor0"), getLoc("uColor1"), getLoc("uColor2"), getLoc("uColor3"),
      getLoc("uColor4"), getLoc("uColor5"), getLoc("uColor6"), getLoc("uColor7")
    ],
    colorCount: getLoc("uColorCount"),
    bgColor: getLoc("uBgColor"),
    mouseColor: getLoc("uMouseColor"),
    speed: getLoc("uSpeed"),
    streakCount: getLoc("uStreakCount"),
    streakWidth: getLoc("uStreakWidth"),
    streakLength: getLoc("uStreakLength"),
    glow: getLoc("uGlow"),
    density: getLoc("uDensity"),
    twinkle: getLoc("uTwinkle"),
    zoom: getLoc("uZoom"),
    bgGlow: getLoc("uBgGlow"),
    opacity: getLoc("uOpacity"),
    mouseEnabled: getLoc("uMouseEnabled"),
    mouseStrength: getLoc("uMouseStrength"),
    mouseRadius: getLoc("uMouseRadius")
  };

  // Lightfall colors from usage example
  const streakColors = [
    [0.651, 0.784, 1.0],  // Light blue (#A6C8FF)
    [0.322, 0.153, 1.0],  // Indigo (#5227FF)
    [1.0, 0.624, 0.988],  // Pink (#FF9FFC)
    [0.651, 0.784, 1.0],
    [0.322, 0.153, 1.0],
    [1.0, 0.624, 0.988],
    [0.651, 0.784, 1.0],
    [0.322, 0.153, 1.0]
  ];
  const colorCount = 3;
  
  const avgColor = [0.658, 0.520, 0.996]; // Precomputed average of the colors

  for (let i = 0; i < 8; i++) {
    gl.uniform3fv(uniforms.colors[i], streakColors[i]);
  }
  gl.uniform1i(uniforms.colorCount, colorCount);
  gl.uniform3fv(uniforms.bgColor, [0.039, 0.161, 1.0]); // #0A29FF
  gl.uniform3fv(uniforms.mouseColor, avgColor);
  gl.uniform1f(uniforms.speed, 0.4);
  gl.uniform1i(uniforms.streakCount, 3);
  gl.uniform1f(uniforms.streakWidth, 1.0);
  gl.uniform1f(uniforms.streakLength, 1.8);
  gl.uniform1f(uniforms.glow, 1.0);
  gl.uniform1f(uniforms.density, 1.0);
  gl.uniform1f(uniforms.twinkle, 1.0);
  gl.uniform1f(uniforms.zoom, 2.0);
  gl.uniform1f(uniforms.bgGlow, 1.0);
  gl.uniform1f(uniforms.opacity, 1.0);
  gl.uniform1f(uniforms.mouseEnabled, 0.0); // mouseInteraction: false
  gl.uniform1f(uniforms.mouseStrength, 1.0);
  gl.uniform1f(uniforms.mouseRadius, 0.6);

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    gl.viewport(0, 0, width, height);
    gl.uniform3f(uniforms.resolution, width, height, 1);
  }
  window.addEventListener("resize", resize);
  resize();

  let mouseTargetX = width / 2;
  let mouseTargetY = height / 2;
  let currentMouseX = width / 2;
  let currentMouseY = height / 2;

  window.addEventListener("mousemove", function(e) {
    mouseTargetX = e.clientX;
    mouseTargetY = height - e.clientY;
  });

  let lastTime = 0;
  function render(time) {
    const dt = (time - lastTime) / 1000 || 0.016;
    lastTime = time;

    const factor = 1 - Math.exp(-dt / 0.15);
    currentMouseX += (mouseTargetX - currentMouseX) * factor;
    currentMouseY += (mouseTargetY - currentMouseY) * factor;

    gl.uniform2f(uniforms.mouse, currentMouseX, currentMouseY);
    gl.uniform1f(uniforms.time, time * 0.001);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// Previous particle renderer removed in favor of single premium Lightfall background.

// ==========================================
// --- WEBGL CIRCULAR GALLERY ENGINE ---
// ==========================================

let blogGalleryApp = null;

function initBlogGallery() {
  if (!OGL_LIB) {
    console.warn("CircularGallery: OGL library not loaded (running offline?). Keeping standard HTML list fallback.");
    return;
  }
  const container = document.getElementById("blog-gallery-container");
  const fallbackList = document.querySelector(".blog-posts-list");
  if (!container || !fallbackList) return;

  const items = [];
  const postElements = fallbackList.querySelectorAll(".blog-post-item");
  postElements.forEach(post => {
    const imgEl = post.querySelector(".blog-banner-box img");
    const titleEl = post.querySelector(".blog-item-title");
    const categoryEl = post.querySelector(".blog-category");
    const dateEl = post.querySelector(".blog-meta time");
    const descEl = post.querySelector(".blog-text");
    const linkEl = post.querySelector("a");

    items.push({
      image: imgEl ? imgEl.getAttribute("src") : "",
      text: titleEl ? titleEl.textContent.trim() : "",
      category: categoryEl ? categoryEl.textContent.trim() : "Design",
      date: dateEl ? dateEl.textContent.trim() : "",
      dateIso: dateEl ? dateEl.getAttribute("datetime") : "",
      description: descEl ? descEl.textContent.trim() : "",
      link: linkEl ? linkEl.getAttribute("href") : "#"
    });
  });

  if (items.length === 0) return;

  // Add fallback class to hide the normal list visually
  fallbackList.classList.add("hidden-fallback");

  const font = "bold 26px Outfit";
  const fontUrl = "https://fonts.googleapis.com/css2?family=Outfit:wght@700&display=swap";

  resolveFont(font, fontUrl).then(resolvedFont => {
    blogGalleryApp = new VanillaCircularGalleryApp(container, {
      items,
      bend: 2.2,
      textColor: '#FFD700',
      borderRadius: 0.05,
      font: resolvedFont,
      scrollSpeed: 1.8,
      scrollEase: 0.06
    });
  });

  initBlogModal();
}

function resizeBlogGallery() {
  if (blogGalleryApp) {
    setTimeout(() => {
      blogGalleryApp.onResize();
    }, 150);
  }
}

function initBlogModal() {
  const modalContainer = document.querySelector("[data-blog-modal-container]");
  const closeBtn = document.querySelector("[data-blog-modal-close-btn]");
  const overlay = document.querySelector("[data-blog-overlay]");

  if (!modalContainer || !closeBtn || !overlay) return;

  const closeModal = () => {
    modalContainer.classList.remove("active");
  };

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}

function showBlogModal(item) {
  const modalContainer = document.querySelector("[data-blog-modal-container]");
  const modalImg = document.querySelector("[data-blog-modal-img]");
  const modalCategory = document.querySelector("[data-blog-modal-category]");
  const modalDate = document.querySelector("[data-blog-modal-date]");
  const modalTitle = document.querySelector("[data-blog-modal-title]");
  const modalText = document.querySelector("[data-blog-modal-text] p");

  if (!modalContainer) return;

  if (modalImg) {
    modalImg.src = item.image;
    modalImg.alt = item.text;
  }
  if (modalCategory) modalCategory.textContent = item.category;
  if (modalDate) {
    modalDate.textContent = item.date;
    modalDate.setAttribute("datetime", item.dateIso);
  }
  if (modalTitle) modalTitle.textContent = item.text;
  if (modalText) modalText.textContent = item.description;

  modalContainer.classList.add("active");
}

// --- Font Utilities ---

function deriveFontFamilyFromUrl(url) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '');
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont';
}

async function loadFontFromStylesheet(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family = null;
  const fontFaces = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet');
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load();
      document.fonts.add(face);
    })
  );
  return family;
}

async function loadFontFromFile(url) {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

async function loadCustomFont(fontUrl) {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl);
}

async function resolveFont(font, fontUrl) {
  if (!fontUrl) {
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(font);
        await document.fonts.ready;
      } catch {
        // Fallback
      }
    }
    return font;
  }
  try {
    const family = await loadCustomFont(fontUrl);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px';
    const resolved = `${prefix} "${family}"`;
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(resolved);
      } catch {
        // Fallback
      }
    }
    return resolved;
  } catch (error) {
    console.error('CircularGallery: unable to load font', fontUrl, error);
    return font;
  }
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(getFontSize(font) * 1.25);
  canvas.width = textWidth + 24;
  canvas.height = textHeight + 24;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  context.shadowColor = "rgba(0, 0, 0, 0.9)";
  context.shadowBlur = 8;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#FFD700', font = '30px sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      transparent: true,
      uniforms: { tMap: { value: texture } }
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.16;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.08;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    img.src = this.image;
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (850 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (650 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.8;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class VanillaCircularGalleryApp {
  constructor(
    container,
    {
      items,
      bend = 3,
      textColor = '#ffffff',
      borderRadius = 0.05,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05
    } = {}
  ) {
    this.container = container;
    this.items = items;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    
    const debounce = (func, wait) => {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
    this.clickStart = null;
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items, bend, textColor, borderRadius, font) {
    this.mediasImages = items.concat(items);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
    this.clickStart = {
      x: e.touches ? e.touches[0].clientX : e.clientX,
      y: e.touches ? e.touches[0].clientY : e.clientY,
      time: Date.now()
    };
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp(e) {
    this.isDown = false;
    this.onCheck();
    
    if (this.clickStart) {
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const dx = x - this.clickStart.x;
      const dy = y - this.clickStart.y;
      const dt = Date.now() - this.clickStart.time;
      
      if (Math.sqrt(dx*dx + dy*dy) < 6 && dt < 250) {
        this.handleCanvasClick(x, y);
      }
    }
    this.clickStart = null;
  }
  handleCanvasClick(clientX, clientY) {
    const rect = this.gl.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const clickX = (x / rect.width) * this.viewport.width - this.viewport.width / 2;
    const clickY = (1 - (y / rect.height)) * this.viewport.height - this.viewport.height / 2;
    
    for (let i = 0; i < this.medias.length; i++) {
      const media = this.medias[i];
      const px = media.plane.position.x;
      const py = media.plane.position.y;
      const sx = media.plane.scale.x;
      const sy = media.plane.scale.y;
      
      if (clickX >= px - sx/2 && clickX <= px + sx/2 &&
          clickY >= py - sy/2 && clickY <= py + sy/2) {
        
        const originalItem = this.items[i % this.items.length];
        if (originalItem.link && originalItem.link !== "#") {
          window.location.href = originalItem.link;
        } else {
          showBlogModal(originalItem);
        }
        break;
      }
    }
  }
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;

      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;

      default:
        break;
    }
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    
    const canvas = this.gl.canvas;
    canvas.addEventListener('mousewheel', this.boundOnWheel, { passive: true });
    canvas.addEventListener('wheel', this.boundOnWheel, { passive: true });
    canvas.addEventListener('mousedown', this.boundOnTouchDown);
    canvas.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchend', this.boundOnTouchUp);

    this.container.addEventListener('keydown', this.boundOnKeyDown);
  }
}

// ==========================================
// --- PORTFOLIO PROJECT VIEW MODAL ---
// ==========================================

const projectDetailsDb = {
  "analyzer": {
    description: "An advanced personal finance tracking and budgeting application. Features interactive SVG data visualization charts, dynamic transaction filtering, monthly budget tracking alerts, and CSV import/export capabilities for seamless money management.",
    tags: ["HTML5", "CSS3", "JavaScript", "ChartJS", "Web Storage"],
    link: "https://github.com/utkarshxw08"
  },
  "orizon": {
    description: "A modern cloud computing service landing page and client console dashboard. Integrates real-time storage metrics, server load analytics panels, and automated billing management, built with glassmorphic dashboards.",
    tags: ["HTML5", "Sass", "JavaScript", "Analytics API", "Glassmorphism"],
    link: "https://github.com/utkarshxw08"
  },
  "personal use website": {
    description: "A creative, highly interactive personal blogging and utility site. Features clean custom dark-mode typography, smooth scroll animations, and a collection of web widgets like local notes, calculators, and task boards.",
    tags: ["HTML5", "CSS3", "Vanilla JS", "Local Storage", "Widget API"],
    link: "https://github.com/utkarshxw08"
  },
  "brawlhalla": {
    description: "An unofficial game companion app and statistics tracker for the popular platform fighter Brawlhalla. Parses player data, lists active tournament schedules, ranks legends by win rate, and showcases weapon combinations.",
    tags: ["HTML5", "CSS Modules", "JavaScript", "Game API", "JSON Parsing"],
    link: "https://github.com/utkarshxw08"
  },
  "dsm.": {
    description: "A digital design agency corporate portfolio website. Showcases branding design cases, fluid grid layouts, premium typography headers, and a case study gallery.",
    tags: ["HTML5", "CSS3", "JavaScript", "GSAP ScrollTrigger"],
    link: "https://github.com/utkarshxw08"
  },
  "gaming website": {
    description: "A tournament hosting portal and news hub for esports leagues. Features interactive brackets, player profile cards, registration forms, and live twitch stream integrations.",
    tags: ["HTML5", "CSS3", "JavaScript", "Twitch API", "Forms Validation"],
    link: "https://github.com/utkarshxw08"
  },
  "summary": {
    description: "An automated text summarization web application. Uses standard Natural Language Processing patterns to extract key sentences, keywords, and semantic sentiments from large text copies or PDF uploads.",
    tags: ["HTML5", "CSS3", "JavaScript", "Python API", "NLP Parser"],
    link: "https://github.com/utkarshxw08"
  },
  "task manager": {
    description: "A team collaboration and kanban task board tool. Enables creation of customized sprint boards, drag-and-drop task movements, priority tagging, email reminders, and team comment feeds.",
    tags: ["HTML5", "CSS3", "JavaScript", "Drag and Drop API"],
    link: "https://github.com/utkarshxw08"
  },
  "arrival": {
    description: "A real-time transport navigation and tracking portal. Maps active train and bus routes, estimates arrival durations using geolocation APIs, and suggests optimal paths to destinations.",
    tags: ["HTML5", "CSS3", "JavaScript", "Google Maps API", "Geolocation"],
    link: "https://github.com/utkarshxw08"
  }
};

function initProjectModal() {
  const projectItems = document.querySelectorAll(".project-item");
  const modalContainer = document.querySelector("[data-project-modal-container]");
  const closeBtn = document.querySelector("[data-project-modal-close-btn]");
  const overlay = document.querySelector("[data-project-overlay]");

  if (!modalContainer || !closeBtn || !overlay) return;

  const closeModal = () => {
    modalContainer.classList.remove("active");
  };

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  projectItems.forEach(item => {
    const link = item.querySelector("a");
    if (!link) return;

    link.addEventListener("click", function(e) {
      e.preventDefault();

      const img = item.querySelector(".project-img img");
      const title = item.querySelector(".project-title");
      const category = item.querySelector(".project-category");

      if (!title) return;

      const titleText = title.textContent.trim();
      const dbKey = titleText.toLowerCase();

      // Retrieve database entry or fall back to defaults
      const dbEntry = projectDetailsDb[dbKey] || {
        description: `Detailed project files and source code implementation for ${titleText}. Designed with responsive grid layouts, clean component separation, and interactive client widgets.`,
        tags: ["HTML5", "CSS3", "JavaScript"],
        link: "https://github.com/utkarshxw08"
      };

      // Populate Modal elements
      const modalImg = document.querySelector("[data-project-modal-img]");
      const modalCategory = document.querySelector("[data-project-modal-category]");
      const modalTitle = document.querySelector("[data-project-modal-title]");
      const modalTags = document.querySelector("[data-project-modal-tags]");
      const modalText = document.querySelector("[data-project-modal-text] p");
      const modalLink = document.querySelector("[data-project-modal-link]");

      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || titleText;
      }
      if (modalCategory && category) {
        modalCategory.textContent = category.textContent.trim();
      }
      if (modalTitle) {
        modalTitle.textContent = titleText;
      }
      if (modalText) {
        modalText.textContent = dbEntry.description;
      }
      if (modalLink) {
        modalLink.href = dbEntry.link;
      }

      // Populate stack tags
      if (modalTags) {
        modalTags.innerHTML = "";
        dbEntry.tags.forEach(tag => {
          const span = document.createElement("span");
          span.textContent = tag;
          modalTags.appendChild(span);
        });
      }

      // Open Modal
      modalContainer.classList.add("active");
    });
  });
}


// Interactive 3D Tilted Cards implementation
function initTiltedCards() {
  const cards = document.querySelectorAll('[data-tilted-card]');
  cards.forEach(card => {
    const amplitude = parseFloat(card.getAttribute('data-rotate-amplitude')) || 14;
    const scaleHover = parseFloat(card.getAttribute('data-scale-on-hover')) || 1.1;
    const captionText = card.getAttribute('data-caption') || '';
    const showTooltip = card.getAttribute('data-show-tooltip') !== 'false' && !!captionText;
    const showMobileWarning = card.getAttribute('data-show-mobile-warning') !== 'false';

    // Add perspective container class
    card.classList.add('tilted-card-figure');

    // Wrap child elements in a .tilted-card-inner wrapper to handle rotations and scaling
    let inner = card.querySelector('.tilted-card-inner');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'tilted-card-inner';
      while (card.firstChild) {
        inner.appendChild(card.firstChild);
      }
      card.appendChild(inner);
    }

    // Add mobile optimization note if configured
    if (showMobileWarning && !card.querySelector('.tilted-card-mobile-alert')) {
      const alertEl = document.createElement('div');
      alertEl.className = 'tilted-card-mobile-alert';
      alertEl.textContent = 'This effect is not optimized for mobile. Check on desktop.';
      card.appendChild(alertEl);
    }

    // Add tooltip/caption element if enabled
    let caption = null;
    if (showTooltip) {
      caption = card.querySelector('.tilted-card-caption');
      if (!caption) {
        caption = document.createElement('figcaption');
        caption.className = 'tilted-card-caption';
        caption.textContent = captionText;
        card.appendChild(caption);
      }
    }

    // Interactive state values
    let state = {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 0,
      x: 0,
      y: 0,
      tooltipRotate: 0
    };

    let target = {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 0,
      x: 0,
      y: 0,
      tooltipRotate: 0
    };

    let lastY = 0;
    let isHovered = false;
    let animFrameId = null;

    function updateAnimation() {
      if (!isHovered && Math.abs(state.rotateX) < 0.01 && Math.abs(state.rotateY) < 0.01 && Math.abs(state.scale - 1) < 0.001 && state.opacity < 0.01) {
        // Reset to default and pause animation loop when idle
        inner.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        if (caption) {
          caption.style.opacity = 0;
        }
        animFrameId = null;
        return;
      }

      // Smooth interpolation ease values
      const rotationEase = 0.08;
      const scaleEase = 0.08;
      const opacityEase = 0.15;
      const mouseEase = 0.1;
      const tooltipRotateEase = 0.1;

      state.rotateX += (target.rotateX - state.rotateX) * rotationEase;
      state.rotateY += (target.rotateY - state.rotateY) * rotationEase;
      state.scale += (target.scale - state.scale) * scaleEase;
      state.opacity += (target.opacity - state.opacity) * opacityEase;
      state.x += (target.x - state.x) * mouseEase;
      state.y += (target.y - state.y) * mouseEase;
      state.tooltipRotate += (target.tooltipRotate - state.tooltipRotate) * tooltipRotateEase;

      inner.style.transform = `rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) scale(${state.scale})`;
      if (caption) {
        caption.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.tooltipRotate}deg)`;
        caption.style.opacity = state.opacity;
      }

      animFrameId = requestAnimationFrame(updateAnimation);
    }

    function startLoop() {
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateAnimation);
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      target.scale = scaleHover;
      target.opacity = 1;
      startLoop();
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      target.rotateX = (offsetY / (rect.height / 2)) * -amplitude;
      target.rotateY = (offsetX / (rect.width / 2)) * amplitude;

      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;

      const velocityY = offsetY - lastY;
      target.tooltipRotate = -velocityY * 0.6;
      lastY = offsetY;

      startLoop();
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      target.scale = 1;
      target.rotateX = 0;
      target.rotateY = 0;
      target.opacity = 0;
      target.tooltipRotate = 0;
      startLoop();
    });
  });
}
