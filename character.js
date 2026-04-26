// ============================================================
// character.js — 低多边形 3D 角色 · Three.js
// ============================================================

(function () {
  'use strict';

  const canvas = document.getElementById('hero-character');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── 渲染器 ── */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── 场景 / 相机 ── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.1, 5.8);
  camera.lookAt(0, 0.9, 0);

  /* ── 灯光 ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.position.set(3, 5, 4);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x4A7FC1, 0.4);
  fill.position.set(-3, 1, -2);
  scene.add(fill);
  const rimLight = new THREE.DirectionalLight(0x1E4D8C, 0.25);
  rimLight.position.set(0, -2, -4);
  scene.add(rimLight);

  /* ── 材质工厂（flatShading = 低多边形关键） ── */
  const mat = (hex) =>
    new THREE.MeshPhongMaterial({ color: hex, flatShading: true });

  /* ── 配色（与网站保持一致） ── */
  const C = {
    skin:  0xE8C5A2,  // 暖肤色
    hair:  0x0E0905,  // 深黑发
    suit:  0x1E4D8C,  // 网站钢铁蓝
    shirt: 0xF4F4F2,  // 网站暖白
    pants: 0x0C1525,  // 深蓝黑裤
    shoe:  0x141414,  // 近黑鞋
    tie:   0x8B0000,  // 深红领带（和证件照一致）
  };

  /* ── 构建角色 ── */
  function buildCharacter() {
    const group = new THREE.Group();

    const add = (geo, color, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const mesh = new THREE.Mesh(geo, mat(color));
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      group.add(mesh);
      return mesh;
    };

    // ── 头部 ──
    add(new THREE.IcosahedronGeometry(0.48, 1), C.skin, 0, 1.7, 0);

    // ── 头发（帽型半球） ──
    const hairDome = new THREE.SphereGeometry(0.505, 6, 5, 0, Math.PI * 2, 0, Math.PI * 0.53);
    add(hairDome, C.hair, 0, 1.78, 0);

    // ── 刘海 ──
    add(new THREE.BoxGeometry(0.74, 0.13, 0.2),  C.hair, 0, 1.92, 0.34, 0.28);
    add(new THREE.BoxGeometry(0.38, 0.08, 0.12), C.hair, -0.22, 1.88, 0.40, 0.35, 0, 0.15);

    // ── 耳朵 ──
    add(new THREE.BoxGeometry(0.07, 0.15, 0.07), C.skin, -0.47, 1.67, 0.02);
    add(new THREE.BoxGeometry(0.07, 0.15, 0.07), C.skin,  0.47, 1.67, 0.02);

    // ── 脖子 ──
    add(new THREE.CylinderGeometry(0.12, 0.14, 0.24, 5), C.skin, 0, 1.32, 0);

    // ── 躯干（西装） ──
    add(new THREE.CylinderGeometry(0.28, 0.34, 0.8, 6), C.suit, 0, 0.84, 0);

    // ── 衬衫领 ──
    add(new THREE.BoxGeometry(0.16, 0.35, 0.06), C.shirt, 0, 1.1, 0.27);

    // ── 领带 ──
    add(new THREE.BoxGeometry(0.07, 0.38, 0.04), C.tie, 0, 0.95, 0.29);

    // ── 左臂 ──
    add(new THREE.CylinderGeometry(0.09, 0.075, 0.64, 5), C.suit, -0.41, 0.79, 0, 0, 0,  0.22);
    // ── 右臂 ──
    add(new THREE.CylinderGeometry(0.09, 0.075, 0.64, 5), C.suit,  0.41, 0.79, 0, 0, 0, -0.22);

    // ── 手 ──
    add(new THREE.IcosahedronGeometry(0.09, 0), C.skin, -0.5,  0.46, 0);
    add(new THREE.IcosahedronGeometry(0.09, 0), C.skin,  0.5,  0.46, 0);

    // ── 腰部过渡 ──
    add(new THREE.CylinderGeometry(0.31, 0.28, 0.18, 6), C.pants, 0, 0.38, 0);

    // ── 左腿 ──
    add(new THREE.CylinderGeometry(0.12, 0.09, 0.82, 5), C.pants, -0.15, -0.1, 0);
    // ── 右腿 ──
    add(new THREE.CylinderGeometry(0.12, 0.09, 0.82, 5), C.pants,  0.15, -0.1, 0);

    // ── 鞋（左） ──
    add(new THREE.BoxGeometry(0.18, 0.09, 0.3), C.shoe, -0.15, -0.57, 0.05);
    // ── 鞋（右） ──
    add(new THREE.BoxGeometry(0.18, 0.09, 0.3), C.shoe,  0.15, -0.57, 0.05);

    return group;
  }

  const character = buildCharacter();
  scene.add(character);

  /* ── 尺寸自适应 ── */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── 鼠标追踪（Hero 区内跟随） ── */
  let targetRotY = 0;
  let currentRotY = 0;
  document.addEventListener('mousemove', (e) => {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.6;
  }, { passive: true });

  /* ── 动画循环 ── */
  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // 浮动感
    character.position.y = Math.sin(t * 0.85) * 0.065;

    // 鼠标方向缓动跟随
    currentRotY += (targetRotY - currentRotY) * 0.045;
    character.rotation.y = currentRotY;

    renderer.render(scene, camera);
  })();
})();
