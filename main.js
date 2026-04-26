// ============================================================
// main.js — 何宏祥个人网站
// ============================================================

// Nav: 滚动超过 80px 添加磨砂背景
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// Reveal: IntersectionObserver 触发入场动画
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger: 为容器内子元素依次设置延迟
document.querySelectorAll('.info-grid, .exp-grid, .ai-stack, .ai-workflow, .vault-domains, .topic-steps, .method-steps, .hero-content, .contact-info, .kn-sources-grid').forEach(parent => {
  parent.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 90}ms`;
  });
});

// ① 数字计数动效
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ② 微信号点击复制
const wechatEl = document.getElementById('wechat-num');
if (wechatEl) {
  const copyHandler = () => {
    const text = wechatEl.dataset.wechat;
    navigator.clipboard.writeText(text).then(() => {
      wechatEl.dataset.tip = '已复制 ✓';
      wechatEl.classList.add('copied');
      setTimeout(() => wechatEl.classList.remove('copied'), 2000);
    }).catch(() => {
      // 降级：创建临时 input 复制
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      wechatEl.dataset.tip = '已复制 ✓';
      wechatEl.classList.add('copied');
      setTimeout(() => wechatEl.classList.remove('copied'), 2000);
    });
  };
  wechatEl.addEventListener('click', copyHandler);
  wechatEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') copyHandler(); });
}

// ④ 页面阅读进度条
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ⑤ 导航高亮当前区块
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

// ⑥ 证书 Lightbox
const lightbox   = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.cert-link').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openLightbox(el.dataset.src, el.querySelector('img')?.alt);
  });
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

// ④ SpotlightCard — 鼠标追踪径向高光（经历卡片 + 信息源卡片）
document.querySelectorAll('.exp-card, .kn-source-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
  }, { passive: true });
});

// ⑤ 证书 3D 倾斜
document.querySelectorAll('.cert-featured, .cert-thumb').forEach(cert => {
  cert.addEventListener('mousemove', (e) => {
    const rect = cert.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    cert.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 3}deg) translateY(-3px)`;
  }, { passive: true });
  cert.addEventListener('mouseleave', () => { cert.style.transform = ''; });
});

// ⑥ 汉堡菜单（移动端）
const hamburgerBtn     = document.getElementById('nav-hamburger');
const navLinksContainer = document.getElementById('nav-links');
if (hamburgerBtn && navLinksContainer) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    navLinksContainer.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      navLinksContainer.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ⑦ 回到顶部
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.hidden = window.scrollY < 400;
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ⑧ 角色 3D 视差（鼠标移动时轻微跟随倾斜）
const charImg = document.getElementById('hero-char-img');
if (charImg) {
  let floatY = 0, frameId;
  const heroEl = document.querySelector('.hero');
  heroEl && heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const dx = (e.clientX / rect.width  - 0.5) * 2;  // -1 ~ 1
    const dy = (e.clientY / rect.height - 0.5) * 2;
    // 浮动动画 + 3D 视差叠加
    charImg.style.animationPlayState = 'paused';
    charImg.style.transform = `
      perspective(900px)
      rotateY(${dx * 8}deg)
      rotateX(${-dy * 5}deg)
      translateY(${floatY}px)
      scale(1.02)
    `;
  }, { passive: true });
  heroEl && heroEl.addEventListener('mouseleave', () => {
    charImg.style.animationPlayState = 'running';
    charImg.style.transform = '';
  });
}

// ③ Hero 鼠标聚光灯
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', x + '%');
    hero.style.setProperty('--my', y + '%');
  }, { passive: true });
}
