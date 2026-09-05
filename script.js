/* ============================================================
   SANJAY SARASWAT — PORTFOLIO JAVASCRIPT
   Three.js 3D Scenes + Interactive Canvas Background + GSAP & Lenis
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const isSmall = window.innerWidth < 860;
let lenis = null; // Lenis smooth scroll (not used but referenced in overlay)

/* ---------------- PRELOADER & INTRO ---------------- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  if (prefersReducedMotion) {
    pre.style.opacity = '0';
    pre.style.visibility = 'hidden';
    startIntro();
    return;
  }

  if (window.gsap) {
    gsap.timeline()
      .to('.preloader-spinner', { scale: 1.2, opacity: 0, duration: 0.35, ease: 'power2.out' })
      .to('.preloader-word', { letterSpacing: '0.2em', opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2')
      .to(pre, {
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          pre.style.visibility = 'hidden';
        }
      })
      .add(startIntro, '-=0.2');
  } else {
    setTimeout(() => {
      pre.style.opacity = '0';
      pre.style.visibility = 'hidden';
      startIntro();
    }, 400);
  }
});

function startIntro() {
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) heroCanvas.style.opacity = '1';

  if (prefersReducedMotion) {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  if (window.gsap) {
    gsap.fromTo('.hero-badge',
      { opacity: 0, y: -50, scale: 0.6 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(2)' }
    );

    gsap.fromTo('.hero-name span',
      { opacity: 0, y: 80, rotateX: 25 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1.0, stagger: 0.15, ease: 'power4.out', delay: 0.1 }
    );

    gsap.fromTo('.hero-statement',
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 }
    );

    gsap.fromTo('.hero-actions .btn',
      { opacity: 0, scale: 0.5, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(2)', delay: 0.45 }
    );

    gsap.fromTo('.stat-card',
      { opacity: 0, scale: 0.3, y: 80, rotateY: 25 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateY: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: 'back.out(2.2)',
        delay: 0.6
      }
    );
  } else {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}

/* ============================================================
   SEAMLESS FULL-PAGE ANIMATED BACKGROUND (Dynamic Canvas)
   Optimized Neural Particle Mesh + Ambient Glowing Plasma Orbs
   ============================================================ */
(function fullPageInteractiveBackground() {
  const canvas = document.getElementById('bgField');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width, height;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  let mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  }, { passive: true });

  // Floating ambient colored glow orbs
  const orbs = [
    { x: 0.15, y: 0.2, radius: 340, color: '255, 56, 56', vx: 0.0003, vy: 0.0002, phase: 0 },
    { x: 0.85, y: 0.35, radius: 380, color: '56, 189, 248', vx: 0.00025, vy: 0.0003, phase: 2 },
    { x: 0.3, y: 0.8, radius: 400, color: '129, 140, 248', vx: 0.0002, vy: 0.00025, phase: 4 }
  ];

  // Neural particles (optimized count)
  const particleCount = isSmall ? 24 : 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8,
      baseAlpha: Math.random() * 0.4 + 0.2,
      isCyan: Math.random() > 0.45
    });
  }

  const maxDist = isSmall ? 85 : 120;
  const maxDistSq = maxDist * maxDist;
  const mouseDist = 140;
  const mouseDistSq = mouseDist * mouseDist;

  function animate(timestamp) {
    if (document.hidden) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Draw glowing ambient plasma orbs
    for (let o = 0; o < orbs.length; o++) {
      const orb = orbs[o];
      const ox = (orb.x + Math.sin(timestamp * orb.vx + orb.phase) * 0.08) * width;
      const oy = (orb.y + Math.cos(timestamp * orb.vy + orb.phase) * 0.08) * height;

      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.radius);
      grad.addColorStop(0, `rgba(${orb.color}, 0.08)`);
      grad.addColorStop(0.5, `rgba(${orb.color}, 0.025)`);
      grad.addColorStop(1, `rgba(${orb.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Update & Draw Neural Particles with squared distance optimization
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouseDistSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseDist) * 0.4;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;

          const mouseLineAlpha = (1 - dist / mouseDist) * 0.2;
          ctx.strokeStyle = `rgba(56, 189, 248, ${mouseLineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw particle
      ctx.fillStyle = p.isCyan
        ? `rgba(56, 189, 248, ${p.baseAlpha})`
        : `rgba(255, 56, 56, ${p.baseAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Connect neighbor particles using squared distance check
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const alpha = (1 - distSq / maxDistSq) * 0.12;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
})();

/* ---------------- CUSTOM CURSOR & CURSOR GLOW ---------------- */
if (!isTouch) {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorLabel = document.getElementById('cursorLabel');

  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    }
    if (cursorGlow) {
      cursorGlow.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    }
  }, { passive: true });

  (function loopCursor() {
    cx += (mx - cx) * 0.25;
    cy += (my - cy) * 0.25;
    if (cursor) {
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(loopCursor);
  })();

  function bindHover(elements) {
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
        if (cursorLabel) cursorLabel.textContent = el.getAttribute('data-cursor') || 'VIEW';
      });
      el.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });
  }

  bindHover(document.querySelectorAll('[data-cursor], a, button, .project-card, .skill-card, .contact-card'));
}

/* ---------------- TOAST NOTIFICATION ---------------- */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(msg = 'Copied to clipboard! ✨') {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function copyText(text, successMsg = 'Copied to clipboard! ✨') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(successMsg));
  } else {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(successMsg);
  }
}

// Hero copy email button
const heroCopyEmail = document.getElementById('heroCopyEmail');
if (heroCopyEmail) {
  heroCopyEmail.addEventListener('click', () => {
    copyText('sanjaysaraswat299@gmail.com', 'Email copied: sanjaysaraswat299@gmail.com ✉️');
  });
}

// Contact card copy email
const contactCopyCard = document.getElementById('contactCopyCard');
if (contactCopyCard) {
  contactCopyCard.addEventListener('click', () => {
    copyText('sanjaysaraswat299@gmail.com', 'Email copied: sanjaysaraswat299@gmail.com ✉️');
  });
}

/* ---------------- NAVIGATION SCROLL & BURGER ---------------- */
const navWrapper = document.querySelector('.nav-wrapper');
let navScrolled = false;
window.addEventListener('scroll', () => {
  const isPast = window.scrollY > 40;
  if (isPast !== navScrolled) {
    navScrolled = isPast;
    if (navWrapper) navWrapper.classList.toggle('scrolled', navScrolled);
  }
}, { passive: true });

const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (burger) burger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ---------------- SIDE INDEX RAIL ---------------- */
(function setupRail() {
  const dots = document.querySelectorAll('.rail-dot');
  if (!dots.length) return;

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const target = document.querySelector(d.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const sections = Array.from(dots).map(d => document.querySelector(d.dataset.target)).filter(Boolean);
  let ticking = false;

  function updateRail() {
    let activeIdx = 0;
    const triggerPoint = window.innerHeight * 0.45;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= triggerPoint) {
        activeIdx = i;
      }
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateRail);
      ticking = true;
    }
  }, { passive: true });
  updateRail();
})();

/* ---------------- FAST HARDWARE ACCELERATED ANCHOR SCROLL ---------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      closeMobileMenu();
    }
  });
});

/* ---------------- GSAP SCROLL REVEALS & PARALLAX ---------------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Parallax ghost typography with will-change
  gsap.utils.toArray('.bg-ghost').forEach(el => {
    if (prefersReducedMotion) return;
    const speed = parseFloat(el.dataset.parallaxBg || 0.2);
    gsap.fromTo(el,
      { yPercent: -50 - speed * 50 },
      {
        yPercent: -50 + speed * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // Section headers & tags dramatic upward reveal
  gsap.utils.toArray('.section-tag-wrap, .section-title, .work-headline, .about-headline').forEach(el => {
    if (prefersReducedMotion) return;
    gsap.fromTo(el,
      { opacity: 0, y: 60, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%'
        }
      }
    );
  });

  // 1. About Cards (High-Movement Far Left & Far Right 3D Swoop)
  const aboutCards = document.querySelectorAll('.about-card');
  if (aboutCards.length >= 2 && !prefersReducedMotion) {
    gsap.fromTo(aboutCards[0],
      { opacity: 0, x: -260, rotateY: 30, rotateZ: -5, scale: 0.75 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        duration: 1.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top 85%'
        }
      }
    );

    gsap.fromTo(aboutCards[1],
      { opacity: 0, x: 260, rotateY: -30, rotateZ: 5, scale: 0.75 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        duration: 1.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top 85%'
        }
      }
    );
  }

  // 2. Timeline Item (High-Movement Left 3D Fly-In)
  const timelineItem = document.querySelector('.timeline-item');
  if (timelineItem && !prefersReducedMotion) {
    gsap.fromTo(timelineItem,
      { opacity: 0, x: -280, rotateY: 25, scale: 0.78 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 85%'
        }
      }
    );
  }

  // 3. Skill Cards (Explosive 3D Flip & Spring Pop-Up)
  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length && !prefersReducedMotion) {
    gsap.fromTo(skillCards,
      { opacity: 0, scale: 0.35, y: 120, rotateX: -30, rotateY: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: 'back.out(1.9)',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 82%'
        }
      }
    );
  }

  // 4. Contact Container & Cards Pop-in with high movement
  const contactBox = document.querySelector('.contact-container');
  if (contactBox && !prefersReducedMotion) {
    gsap.fromTo(contactBox,
      { opacity: 0, scale: 0.7, y: 90, rotateX: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo('.contact-card',
      { opacity: 0, scale: 0.4, y: 70, rotateY: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateY: 0,
        duration: 0.85,
        stagger: 0.13,
        ease: 'back.out(2.0)',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 84%'
        }
      }
    );
  }
}

/* ============================================================
   PROJECT DATA & RICH INTERACTIVE CARDS
   ============================================================ */
const PROJECTS = [
  {
    index: '01',
    name: 'KisanSetu — Agri-Tech Decision Engine',
    shortDesc: 'End-to-end marketplace & ML sell-decision engine calculating net crop realizations with SHAP explanations and voice AI assistant.',
    tags: ['AI/ML', 'Full-Stack', 'FastAPI', 'React', 'PostgreSQL', 'LangGraph'],
    tech: ['FastAPI', 'React 19', 'PostgreSQL', 'Supabase', 'Redis', 'LangGraph', 'Google Gemini AI', 'SHAP'],
    metricVal: '⚡ LIVE APP',
    metric: 'Real-time Mandi Spreads & SHAP Attribution',
    problem: "Farmers typically sell produce to whichever buyer quotes the day's spot price without understanding price trend momentum or how transportation and cold storage costs quietly erase profit margins.",
    solution: "KisanSetu features a Sell Decision Engine that evaluates real-time mandi spreads, transport overheads, weather indicators, and warehouse availability. It delivers explainable recommendations (SELL NOW, WAIT, STORE, or AGGREGATE) backed by SHAP feature attributions and computes exact Net Realization payouts.",
    role: "Architected and engineered the full platform — ML decision engine, marketplace contracts, escrow workflows, and conversational multi-modal AI agents.",
    features: [
      'Machine learning Sell Decision Engine with SHAP feature interpretability',
      'Cost-aware Net Realization calculator (freight, storage & transaction deductions)',
      'Produce quality grading computer vision with digital certification',
      'Marketplace with automated offer / counter-offer workflows',
      'FPO aggregation pools for collaborative bulk selling with transparent splits',
      'Warehouse & cold storage discovery, e-NWR pledge-loan calculator',
      'Multi-stage escrow transaction tracking and digital invoicing',
      'Voice + Conversational AI assistant (LangGraph + Gemini) for regional mandi queries'
    ],
    result: "Unified agricultural decision support, turning raw mandi price feeds into actionable, cost-conscious trade decisions.",
    github: 'https://github.com/SanjaySaraswat0/KisanSetu',
    live: 'https://kisan-setu-gilt.vercel.app/'
  },
  {
    index: '02',
    name: 'AI-Powered Trading Journal & Analytics Platform',
    shortDesc: 'Full-stack analytics suite utilizing Gemini AI for behavioral trade pattern detection, predictive equity metrics, and automated coaching.',
    tags: ['AI/ML', 'Next.js', 'TypeScript', 'Supabase', 'Gemini AI'],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Google Gemini AI', 'Recharts', 'Redis', 'NextAuth', 'Zod'],
    metricVal: '📈 80% AUTOMATION',
    metric: 'Cognitive Bias Detection & Equity Metrics',
    problem: "Active traders log historical executions but fail to extract actionable insights, causing cognitive biases and risk-management leaks to repeatedly manifest into financial losses.",
    solution: "A normalized relational performance analytics suite with real-time Recharts dashboards, automated CSV/Excel batch processing, and Gemini AI integration to identify risk skew, rule violations, and provide personalized historical coaching.",
    role: "Solo design & development — schema architecture, interactive dashboards, Gemini analytics pipeline, and security enforcement.",
    features: [
      'Normalized relational schema for trade logging, execution metrics & risk factors',
      'Interactive financial dashboards with dynamic equity curves and drawdown analytics',
      'Gemini AI pattern recognition for cognitive bias and revenge trading detection',
      'Bulk CSV/Excel trading statement ingestion automation',
      'Role-based access control, Redis rate limiting, NextAuth session management'
    ],
    result: 'Reduced manual trade entry time by 80% with automated statement ingestion and enterprise security standards.',
    github: 'https://github.com/SanjaySaraswat0/trading-journal',
    live: null
  },
  {
    index: '03',
    name: 'Brain Tumor Detection using Deep CNN',
    shortDesc: 'Deep convolutional neural network trained on MRI scans with image augmentation, achieving 94.2% diagnostic accuracy behind a web interface.',
    tags: ['AI/ML', 'Computer Vision', 'TensorFlow', 'Python'],
    tech: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'Flask', 'NumPy'],
    metricVal: '🧠 94.2% ACCURACY',
    metric: 'Neuroimaging Vision & Confidence Scoring',
    problem: 'Manual MRI scan interpretation for tumor presence is time-intensive and heavily reliant on specialized radiologist availability.',
    solution: 'Engineered and trained a Convolutional Neural Network (CNN) architecture with extensive data augmentation techniques to classify MRI neuroimaging scans, deployed via a lightweight Flask web interface for instant self-service classification.',
    role: 'Dataset curation, model architecture tuning, validation benchmarks, and Flask inference deployment.',
    features: [
      'Optimized CNN architecture with convolutional, pooling & dropout regularization layers',
      'Data augmentation pipeline (rotation, zoom, contrast normalization) for robust generalization',
      'Real-time web portal for fast DICOM/MRI image upload and inference',
      'Confidence score calibration for predictive transparency'
    ],
    result: 'Achieved 94.2% test accuracy on MRI classification benchmark datasets.',
    github: 'https://github.com/SanjaySaraswat0',
    live: null
  },
  {
    index: '04',
    name: 'Hospital Management System',
    shortDesc: 'Role-based multi-dashboard medical platform streamlining patient scheduling, clinical records, and billing with intelligent autofill.',
    tags: ['Full-Stack', 'Flask', 'Vue.js', 'SQLite'],
    tech: ['Flask', 'SQLite', 'Vue.js', 'JavaScript', 'CSS3', 'REST API'],
    metricVal: '🏥 3-TIER PORTAL',
    metric: '40% Time Saved · Transactional Autofill',
    problem: 'Hospital administrative pipelines involve disparate workflows for doctors, administrators, and patients that cause clerical friction and data entry bottlenecks.',
    solution: 'Designed an integrated full-stack management system with distinct role-based access portals, automated appointment scheduling, intelligent form autofill, and transactional validation.',
    role: 'Solo full-stack architect — backend API development, frontend component architecture, database modeling.',
    features: [
      'Triple role-based dashboards (Administrator / Physician / Patient)',
      'Automated appointment slot booking and clinical consultation history',
      'Intelligent autofill and schema validation for rapid record creation',
      'Billing automation and pharmacy prescription generation'
    ],
    result: 'Decreased repetitive patient record entry overhead by 40% through real-time field validation and autofill.',
    github: 'https://github.com/SanjaySaraswat0/mad1_project',
    live: null
  },
  {
    index: '05',
    name: 'Tenali — Kaprekar\'s Constant Interactive Module',
    shortDesc: 'Interactive mathematical exploration component built during an internship at IIT Ropar\'s VLED Lab for an open-source educational platform.',
    tags: ['Frontend', 'React 19', 'Framer Motion', 'Open Source'],
    tech: ['React 19', 'Framer Motion', 'TypeScript', 'MERN Stack'],
    metricVal: '🎓 IIT ROPAR PRODUCTION',
    metric: 'Framer Motion Physics & Algorithmic State',
    problem: 'Educational modules explaining Kaprekar\'s Constant suffered from static presentation and long unskippable animation sequences that degraded student engagement.',
    solution: 'Engineered a dynamic, highly responsive module (KaprekarApp.jsx) with smooth Framer Motion choreographies, including a UX skip-to-result mechanism and rigorous multi-scenario algorithmic validation.',
    role: 'Feature owner — design, animation sequencing, UX enhancements, and unit testing within a fast-paced daily agile internship team.',
    features: [
      'Interactive mathematical state machine and step-by-step arithmetic visualizer',
      'Framer Motion spring physics and timeline orchestration',
      'UX skip-to-final-calculation feature for long animation iterations',
      'Full test coverage across four-digit edge cases'
    ],
    result: 'Successfully merged and deployed to the production open-source educational suite at IIT Ropar.',
    github: 'https://github.com/SanjaySaraswat0',
    live: null
  }
];

/* ---------------- RENDER PROJECT CARDS WITH METRICS & BADGES ---------------- */
let currentFilter = 'all';

function renderProjects(filter = 'all') {
  const projectsList = document.getElementById('projectsList');
  if (!projectsList) { console.warn('projectsList element not found!'); return; }
  projectsList.innerHTML = '';

  const filtered = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card glass-panel';
    card.dataset.index = i;
    card.setAttribute('data-cursor', 'EXPLORE');

    card.innerHTML = `
      <div class="p-num">${p.index}</div>
      <div class="p-content">
        <div class="p-top-meta">
          <span class="p-metric-badge">${p.metricVal}</span>
          <span class="p-featured-note">${p.metric}</span>
        </div>
        <h3 class="p-title">${p.name}</h3>
        <p class="p-desc-short">${p.shortDesc}</p>
        <div class="p-tags">
          ${p.tags.map(t => `<span class="p-tag"><span class="p-tag-dot"></span>${t}</span>`).join('')}
        </div>
      </div>
      <div class="p-arrow-btn">↗</div>
      <div class="card-shine"></div>
    `;

    card.addEventListener('click', () => openOverlay(p));
    projectsList.appendChild(card);
  });

  // Scroll Entry Animation using IntersectionObserver (more reliable for dynamic elements)
  if (!prefersReducedMotion) {
    const allCards = projectsList.querySelectorAll('.project-card');
    allCards.forEach((card, idx) => {
      // Start hidden for animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(80px) scale(0.85)';
      card.style.transition = 'none';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, idx * 100);
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      observer.observe(card);
    });
  }

  if (window.bindCardSpotlights) bindCardSpotlights();
  if (window.bind3DTilt) bind3DTilt();
}

// 3D Card Tilt Interaction
function bind3DTilt() {
  if (isTouch) return;
  const tiltElements = document.querySelectorAll('.project-card, .skill-card, .about-card, .stat-card');
  tiltElements.forEach(el => {
    if (el._tiltBound) return;
    el._tiltBound = true;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------------- PROJECT DETAIL MODAL ---------------- */
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlayContent');
const overlayClose = document.getElementById('overlayClose');
const overlayBackdrop = document.getElementById('overlayBackdrop');

function openOverlay(p) {
  if (!overlay || !overlayContent) return;

  overlayContent.innerHTML = `
    <p class="ov-tag">${p.tags.join(' · ')}</p>
    <h2>${p.name}</h2>
    
    <div class="ov-links">
      ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="ov-btn ov-btn-primary">Live Application ↗</a>` : ''}
      <a href="${p.github}" target="_blank" rel="noopener" class="ov-btn ov-btn-secondary">GitHub Repository ↗</a>
    </div>

    <div class="ov-block">
      <h4>The Challenge</h4>
      <p>${p.problem}</p>
    </div>

    <div class="ov-block">
      <h4>The Engineered Solution</h4>
      <p>${p.solution}</p>
    </div>

    <div class="ov-block">
      <h4>My Role &amp; Contribution</h4>
      <p>${p.role}</p>
    </div>

    <div class="ov-block">
      <h4>Key Architectural Features</h4>
      <ul>
        ${p.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="ov-block">
      <h4>Impact &amp; Benchmark</h4>
      <p>${p.result}</p>
    </div>

    <div class="ov-block">
      <h4>Tech Stack</h4>
      <div class="ov-tech">
        ${p.tech.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');

  const container = document.getElementById('overlayContainer');
  if (container) {
    container.scrollTop = 0;
    setTimeout(() => container.focus(), 50);
  }

  if (lenis && typeof lenis.stop === 'function') lenis.stop();
}

function closeOverlay() {
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');

  if (lenis && typeof lenis.start === 'function') lenis.start();
}

if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
if (overlayBackdrop) overlayBackdrop.addEventListener('click', closeOverlay);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
    closeOverlay();
  }
});

/* ============================================================
   THREE.JS — HERO 3D DECISION SCENE
   Interactive Node Graph & Rotating Geodesic Crystal
   ============================================================ */
(function heroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // 1. Crystal core
  const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0e1424,
    wireframe: false,
    transparent: true,
    opacity: 0.5,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.7,
    thickness: 1.5,
    clearcoat: 0.8
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  rootGroup.add(core);

  // Wireframe outer cage
  const wireGeo = new THREE.IcosahedronGeometry(1.22, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  rootGroup.add(wire);

  // 2. Decision Cluster Nodes
  const nodeCount = isSmall ? 32 : 54;
  const radius = 3.2;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    const r = radius * (0.85 + Math.random() * 0.3);
    const v = new THREE.Vector3(
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi)
    );
    nodes.push(v);
  }

  // Node Points
  const pointsGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  const pointsMat = new THREE.PointsMaterial({
    color: 0xff3838,
    size: 0.08,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  rootGroup.add(points);

  // Edges
  const edgePositions = [];
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: nodes[i].distanceTo(n) }))
      .filter(o => o.j !== i)
      .sort((a, b) => a.d - b.d);

    const neighbours = dists.slice(0, 2);
    neighbours.forEach(nb => {
      edgePositions.push(
        nodes[i].x, nodes[i].y, nodes[i].z,
        nodes[nb.j].x, nodes[nb.j].y, nodes[nb.j].z
      );
    });
  }

  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25
  });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);
  rootGroup.add(edges);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const redLight = new THREE.PointLight(0xff3838, 2, 20);
  redLight.position.set(4, 3, 4);
  scene.add(redLight);

  const cyanLight = new THREE.PointLight(0x38bdf8, 2, 20);
  cyanLight.position.set(-4, -2, -3);
  scene.add(cyanLight);

  let targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', e => {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.45;
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.3;
  }, { passive: true });

  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    scrollProgress = Math.min(window.scrollY / window.innerHeight, 1.2);
  }, { passive: true });

  const clock = new THREE.Clock();
  let isHeroVisible = true;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible && !prefersReducedMotion) {
        renderHero();
      }
    });
  }, { threshold: 0.05 });
  const heroSection = document.querySelector('.hero');
  if (heroSection) heroObserver.observe(heroSection);

  function renderHero() {
    if (!isHeroVisible) return;
    requestAnimationFrame(renderHero);
    const elapsed = clock.getElapsedTime();

    rootGroup.rotation.y += (targetRotY + elapsed * 0.05 - rootGroup.rotation.y) * 0.04;
    rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.04;

    rootGroup.position.y = -scrollProgress * 2.5;
    rootGroup.position.z = -scrollProgress * 1.5;

    core.rotation.y -= 0.003;
    wire.rotation.y += 0.002;

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) renderHero();
  else renderer.render(scene, camera);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
})();

/* ============================================================
   THREE.JS — CONTACT 3D PARTICLE NEBULA
   ============================================================ */
(function contactScene() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

  const container = canvas.closest('.contact');
  function resize() {
    if (!container) return;
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  resize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, (container ? container.clientWidth / container.clientHeight : 1), 0.1, 50);
  camera.position.z = 7;

  const count = 75;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.045,
    transparent: true,
    opacity: 0.6
  });
  const pointCloud = new THREE.Points(geo, mat);
  scene.add(pointCloud);

  let isContactVisible = false;
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isContactVisible = entry.isIntersecting;
      if (isContactVisible && !prefersReducedMotion) {
        animate();
      }
    });
  }, { threshold: 0.05 });
  if (container) contactObserver.observe(container);

  function animate() {
    if (!isContactVisible) return;
    requestAnimationFrame(animate);
    pointCloud.rotation.y += 0.001;
    pointCloud.rotation.x += 0.0005;
    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) animate();
  else renderer.render(scene, camera);

  window.addEventListener('resize', () => {
    resize();
    if (container) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    }
  }, { passive: true });
})();

/* ============================================================
   SPOTLIGHT MOUSE TRACKING FOR CARDS (Optimized Event Delegation)
   ============================================================ */
function bindCardSpotlights() {
  document.querySelectorAll('.glass-panel, .project-card, .skill-card, .about-card, .contact-container, .timeline-item').forEach(card => {
    if (card._spotlightBound) return;
    card._spotlightBound = true;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, { passive: true });
  });
}
bindCardSpotlights();
bind3DTilt();

// Ensure DOM is ready before rendering projects
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
} else {
  renderProjects();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

