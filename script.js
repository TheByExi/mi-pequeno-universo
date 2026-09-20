import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("#space");
const loading = document.querySelector("#loading");
const intro = document.querySelector("#intro");
const experience = document.querySelector("#experience");
const enterBtn = document.querySelector("#enterBtn");
const resetBtn = document.querySelector("#resetBtn");
const musicBtn = document.querySelector("#musicBtn");
const quote = document.querySelector("#quote");
const finalMessage = document.querySelector("#finalMessage");
const closeFinal = document.querySelector("#closeFinal");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07040d, 0.018);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 250);
camera.position.set(0, 1.8, 27);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.045;
controls.enablePan = false;
controls.minDistance = 9;
controls.maxDistance = 38;
controls.rotateSpeed = 0.42;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0x9c7a9d, 0.8));

const coreLight = new THREE.PointLight(0xffb9c6, 2.7, 55);
coreLight.position.set(0, 1, 2);
scene.add(coreLight);

const pinkLight = new THREE.PointLight(0x9f71c9, 1.7, 45);
pinkLight.position.set(-14, 5, -8);
scene.add(pinkLight);

const stars = new THREE.Group();
scene.add(stars);

function starField() {
  const count = innerWidth < 600 ? 900 : 1600;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = 35 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    sizes[i] = Math.random() * 2 + .4;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xffe8e0,
    size: .13,
    transparent: true,
    opacity: .72,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geo, mat);
  stars.add(points);
}
starField();

function makeFlower(color, scale = 1) {
  const group = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(.035, .055, 1.4, 7),
    new THREE.MeshStandardMaterial({ color: 0x526b45, roughness: .8 })
  );
  stem.position.y = -.7;
  group.add(stem);

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(.18, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xffd17e, roughness: .6 })
  );
  center.position.y = .08;
  group.add(center);

  for (let i = 0; i < 8; i++) {
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(.32, 12, 8),
      new THREE.MeshStandardMaterial({
        color,
        roughness: .5,
        metalness: .02,
        emissive: color,
        emissiveIntensity: .04
      })
    );
    const a = i * Math.PI / 4;
    petal.position.set(Math.cos(a) * .29, .08, Math.sin(a) * .29);
    petal.scale.set(.72, 1.2, .38);
    petal.rotation.y = -a;
    group.add(petal);
  }

  group.scale.setScalar(scale);
  return group;
}

const flowers = new THREE.Group();
scene.add(flowers);

const palette = [0xf3a7b5, 0xffc5d0, 0xf2d2e3, 0xdca5e9, 0xffb69f, 0xffd2a1];

for (let i = 0; i < 46; i++) {
  const flower = makeFlower(palette[i % palette.length], .55 + Math.random() * .55);

  const angle = Math.random() * Math.PI * 2;
  const radius = 4 + Math.random() * 13;
  const height = THREE.MathUtils.randFloatSpread(14);

  flower.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );

  flower.userData = {
    angle,
    radius,
    speed: .04 + Math.random() * .07,
    yBase: height,
    ySpeed: .25 + Math.random() * .45,
    phase: Math.random() * Math.PI * 2,
    float: .3 + Math.random() * .7
  };

  flowers.add(flower);
}

const heart = new THREE.Group();
scene.add(heart);

function heartPoint(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  return new THREE.Vector3(x * scale, y * scale, 0);
}

// Tiny glowing heart particles
const heartGeo = new THREE.BufferGeometry();
const hp = [];
for (let i = 0; i < 220; i++) {
  const t = Math.random() * Math.PI * 2;
  const p = heartPoint(t, .16);
  p.z = THREE.MathUtils.randFloatSpread(.8);
  hp.push(p.x, p.y, p.z);
}
heartGeo.setAttribute("position", new THREE.Float32BufferAttribute(hp, 3));
const heartMat = new THREE.PointsMaterial({
  color: 0xff9fae,
  size: .055,
  transparent: true,
  opacity: .6
});
const heartPoints = new THREE.Points(heartGeo, heartMat);
heartPoints.position.y = 1;
heart.add(heartPoints);

const phrases = [
  "Sos mi lugar favorito.",
  "Eres mi luz cuando todo se pone oscuro.",
  "Te amo más de lo que sé explicar.",
  "Con vos, hasta lo cotidiano se vuelve especial.",
  "Sos mi persona favorita.",
  "Mi mundo es más bonito desde que estás en él.",
  "Te elegiría en cualquier universo.",
  "Gracias por existir, amor.",
  "Sos mi sol, mi calma y mi hogar.",
  "Quiero seguir creando recuerdos con vos."
];

let phraseIndex = 0;
function nextPhrase() {
  quote.classList.add("fade");
  setTimeout(() => {
    quote.textContent = phrases[phraseIndex % phrases.length];
    phraseIndex++;
    quote.classList.remove("fade");
  }, 650);
}
nextPhrase();
setInterval(nextPhrase, 5200);

let started = false;
let elapsed = 0;

enterBtn.addEventListener("click", () => {
  if (started) return;
  started = true;
  intro.classList.add("fade-out");
  experience.classList.remove("hidden");
  canvas.classList.add("visible");
  setTimeout(() => {
    loading.classList.add("done");
  }, 500);
});

resetBtn.addEventListener("click", () => {
  camera.position.set(0, 1.8, 27);
  controls.target.set(0, 0, 0);
  controls.update();
});

closeFinal.addEventListener("click", () => {
  finalMessage.classList.add("hidden");
});

let audioCtx = null;
let musicOn = false;
let musicTimer = null;

function startMusic() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = 220;
  gain.gain.value = .012;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 2.5);
}

musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? "♫" : "♪";
  if (musicOn) {
    startMusic();
    musicTimer = setInterval(startMusic, 2400);
  } else {
    clearInterval(musicTimer);
  }
});

let touchStart = 0;
renderer.domElement.addEventListener("pointerdown", () => touchStart = performance.now());
renderer.domElement.addEventListener("pointerup", () => {
  if (performance.now() - touchStart < 300 && started) {
    // Small chance to show the final message after exploring
    if (Math.random() < .055) finalMessage.classList.remove("hidden");
  }
});

function animate() {
  requestAnimationFrame(animate);
  elapsed += .01;

  flowers.rotation.y += .00045;
  stars.rotation.y -= .00008;
  heart.rotation.y += .002;

  flowers.children.forEach((flower, i) => {
    const d = flower.userData;
    d.angle += d.speed * .0028;

    flower.position.x = Math.cos(d.angle) * d.radius;
    flower.position.z = Math.sin(d.angle) * d.radius;
    flower.position.y = d.yBase + Math.sin(elapsed * d.ySpeed + d.phase) * d.float;

    flower.rotation.z += .002;
    flower.rotation.y += .004;
  });

  coreLight.intensity = 2.35 + Math.sin(elapsed * .9) * .35;

  controls.update();
  renderer.render(scene, camera);
}

animate();

setTimeout(() => {
  loading.classList.add("done");
}, 700);

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
});
