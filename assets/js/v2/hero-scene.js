// Cena 3D do hero (Three.js) — mesmas regras de performance aplicadas no case Wisionary Lab:
// 1. carregada via import() dinâmico após o load + idle (fora do caminho crítico do LCP);
// 2. um único render loop, pausado quando o hero sai da viewport ou a aba fica oculta;
// 3. devicePixelRatio limitado e geometria procedural (zero download de modelos).

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js";
const GOLD = 0xdaa520;

export async function initHeroScene(container) {
  const THREE = await import(THREE_URL);

  const canvasProbe = document.createElement("canvas");
  if (!canvasProbe.getContext("webgl2") && !canvasProbe.getContext("webgl")) return;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: dpr < 1.5,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(dpr);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 7;

  const group = new THREE.Group();
  scene.add(group);

  // núcleo: icosaedro em wireframe
  const core = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.9, 1)),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 })
  );
  group.add(core);

  // órbita: anel de partículas
  const count = isMobile ? 700 : 1600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.6 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const spread = (Math.random() - 0.5) * 0.9;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = spread;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
  }
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({ color: GOLD, size: 0.018, transparent: true, opacity: 0.8, depthWrite: false })
  );
  particles.rotation.x = 0.35;
  group.add(particles);

  // posição: à direita no desktop, centralizado e recuado no mobile
  function layout() {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    group.position.set(isMobile ? 0 : 2.4, isMobile ? 1.4 : 0.3, 0);
    group.scale.setScalar(isMobile ? 0.75 : 1);
  }
  new ResizeObserver(layout).observe(container);
  layout();

  // ponteiro normalizado com amortecimento
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let visible = true;
  let rafId = null;
  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    const scrollRatio = Math.min(window.scrollY / window.innerHeight, 1);
    core.rotation.y = t * 0.12 + pointer.x * 0.4;
    core.rotation.x = t * 0.06 + pointer.y * 0.3;
    particles.rotation.y = -t * 0.04;
    group.position.y = (isMobile ? 1.4 : 0.3) + scrollRatio * 1.2;
    core.material.opacity = 0.55 * (1 - scrollRatio * 0.8);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  }

  function start() {
    if (rafId === null && visible && !document.hidden) {
      rafId = requestAnimationFrame(render);
    }
  }
  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }).observe(container);

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  start();
  container.classList.add("is-ready");
}
