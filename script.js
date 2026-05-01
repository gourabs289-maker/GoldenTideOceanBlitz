const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bg-music");

const hud = document.getElementById("hud");
const bossHud = document.getElementById("boss-hud");
const bossBar = document.getElementById("boss-bar");
const bossHpText = document.getElementById("boss-hp-text");
const bossLabel = document.getElementById("boss-label");

const menuScreen = document.getElementById("menu-screen");
const pauseScreen = document.getElementById("pause-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const soundBtn = document.getElementById("sound-btn");
const pauseBtn = document.getElementById("pause-btn");
const pauseResumeBtn = document.getElementById("pause-resume");
const pauseRestartBtn = document.getElementById("pause-restart");
const pauseMenuBtn = document.getElementById("pause-menu");
const endRestartBtn = document.getElementById("end-restart");
const endMenuBtn = document.getElementById("end-menu");

const boatStandardBtn = document.getElementById("boat-standard");
const boatGoldenBtn = document.getElementById("boat-golden");
const boatThirdBtn = document.getElementById("boat-third");
const menuStatus = document.getElementById("menu-status");

const hudLevel = document.getElementById("hud-level");
const hudDistance = document.getElementById("hud-distance");
const hudBiome = document.getElementById("hud-biome");
const hudLives = document.getElementById("hud-lives");
const hudScore = document.getElementById("hud-score");
const hudCombo = document.getElementById("hud-combo");
const hudPower = document.getElementById("hud-power");

const endEyebrow = document.getElementById("end-eyebrow");
const endTitle = document.getElementById("end-title");
const endSubtitle = document.getElementById("end-subtitle");
const endStats = document.getElementById("end-stats");
const endUnlock = document.getElementById("end-unlock");

const desktopControls = document.getElementById("desktop-controls");
const mobileControls = document.getElementById("mobile-controls");
const fireBtnDesktop = document.getElementById("btn-fire-desktop");
const fireBtnMobile = document.getElementById("btn-fire-mobile");

const GOAL_DISTANCE = 12000;
const WORLD_WIDTH = 1800;
const VIEW_DEPTH = 1800;
const MOBILE_VIEW_ZOOM = 1.16;
const PLAYER_RADIUS = 28;
const BASE_LIVES = 3;
const BIOME_BLEND_RANGE = 480;

const PLAYER_SPEED_FORWARD = 6.2;
const PLAYER_SPEED_BACKWARD = 4.2;
const PLAYER_SPEED_SIDE = 5.2;
const PLAYER_LERP = 0.18;

const SHOT_COOLDOWN = 210;
const RAPID_COOLDOWN = 95;
const BULLET_SPEED = 18;
const COMBO_WINDOW = 2400;
const INVULN_MS = 1100;
const SINK_TIME = 2400;
const BOSS_SINK_TIME = 3400;

const POWER_DURATION = {
  rapid: 7000,
  triple: 7000,
  shield: 10000
};

const STORAGE_KEYS = {
  level1Cleared: "golden_tide_level1_cleared",
  level2Cleared: "golden_tide_level2_cleared",
  level3Cleared: "golden_tide_level3_cleared",
  soundMuted: "golden_tide_sound_muted"
};

const LEVELS = {
  standard: {
    id: "standard",
    title: "Level 1",
    name: "Standard Battle Boat",
    menuName: "Level 1: Standard Battle Boat",
    menuCopy: "Balanced opening combat mission",
    bossHp: 20,
    bossName: "Golden Sea Guardian",
    boat: "standard"
  },
  golden: {
    id: "golden",
    title: "Level 2",
    name: "Golden Unlock Boat",
    menuName: "Level 2: Golden Unlock Boat",
    menuCopy: "Unlocked after beating Level 1",
    bossHp: 20,
    bossName: "Golden Sea Guardian",
    boat: "golden"
  },
  third: {
    id: "third",
    title: "Level 3",
    name: "Inferno Premium Ocean",
    menuName: "Level 3: Inferno Premium Ocean",
    menuCopy: "Unlocked after beating Level 1 and Level 2",
    bossHp: 30,
    bossName: "Apex Guardian Boss",
    boat: "third"
  }
};

const BIOMES = [
  { name: "Blue Open Sea", start: 0, end: 2000, skyTop: "#54caff", skyBottom: "#0f4eb8", glow: "#8af1ff", fog: "rgba(56, 176, 255, 0.12)" },
  { name: "Coral Hazard Zone", start: 2000, end: 4000, skyTop: "#57f0e7", skyBottom: "#0d857c", glow: "#b0fff2", fog: "rgba(78, 255, 224, 0.12)" },
  { name: "Crimson War Water", start: 4000, end: 6500, skyTop: "#ff7f6d", skyBottom: "#6e1225", glow: "#ffd7aa", fog: "rgba(255, 120, 120, 0.12)" },
  { name: "Storm Sea", start: 6500, end: 8500, skyTop: "#9db5d0", skyBottom: "#213247", glow: "#d6ecff", fog: "rgba(180, 212, 255, 0.1)" },
  { name: "Black Abyss", start: 8500, end: 10000, skyTop: "#2f3666", skyBottom: "#04070f", glow: "#b7a5ff", fog: "rgba(143, 110, 255, 0.12)" },
  { name: "Golden Legendary Sea", start: 10000, end: GOAL_DISTANCE + 2000, skyTop: "#fff4af", skyBottom: "#b67206", glow: "#fff5c0", fog: "rgba(255, 210, 75, 0.14)" }
];

const ENEMY_TYPES = {
  brown: { name: "Brown Hunter", color: "#78411d", fin: "#4b250f", eye: "#ffd4b0", hp: 1, radius: 28, points: 2 },
  red: { name: "Red Swarm Fish", color: "#ff5d5d", fin: "#b30024", eye: "#fff3d2", hp: 1, radius: 24, points: 1 },
  blue: { name: "Blue Dash Fish", color: "#58b6ff", fin: "#116fc7", eye: "#e7fbff", hp: 1, radius: 24, points: 1 },
  black: { name: "Black Armor Fish", color: "#101520", fin: "#474d5b", eye: "#ff5a5a", hp: 3, radius: 30, points: 2 },
  pink: { name: "Pink Trick Fish", color: "#ff74c7", fin: "#d62883", eye: "#fff6d8", hp: 1, radius: 24, points: 1 },
  violet: { name: "Violet Drifter", color: "#9a7eff", fin: "#5f41d8", eye: "#f9eeff", hp: 1, radius: 24, points: 1 },
  golden: { name: "Golden Bonus Fish", color: "#ffd24c", fin: "#d89800", eye: "#fffbe2", hp: 1, radius: 26, points: 4 },
  crocodile: { name: "Fire Crocodile", color: "#5d8d41", fin: "#3d5f27", eye: "#ffd37e", hp: 3, radius: 34, points: 3 },
  snake: { name: "Poison Snake", color: "#1b1b1b", fin: "#373737", eye: "#78ff78", hp: 2, radius: 22, points: 2 },
  turtle: { name: "Ocean Turtle", color: "#4f9e72", fin: "#2d6f4a", eye: "#e9ffef", hp: 2, radius: 30, points: 2 },
  octopus: { name: "Color Octopus", color: "#d97cff", fin: "#7421b5", eye: "#fff5ff", hp: 3, radius: 34, points: 4 },
  dragon: { name: "Sea Dragon", color: "#ff874d", fin: "#8c1f00", eye: "#fff4cf", hp: 4, radius: 42, points: 5 },
  spaceship: { name: "Oceanic Spaceship", color: "#89e5ff", fin: "#2f7cb4", eye: "#f7ffff", hp: 2, radius: 34, points: 4 },
  spacegiant: { name: "Space Giant", color: "#f59cff", fin: "#7940c0", eye: "#fff0ff", hp: 5, radius: 46, points: 6 }
};

const POWERUPS = {
  rapid: { label: "Rapid Fire", color: "#ff8f54", sub: "#fff1db" },
  triple: { label: "Triple Shot", color: "#d893ff", sub: "#f7ebff" },
  shield: { label: "Shield Bubble", color: "#59f1ff", sub: "#eaffff" }
};

const BOATS = {
  standard: { name: "Standard Battle Boat", body: "#ffe868", accent: "#1ef3ff", flame: "#ff9642" },
  golden: { name: "Golden Unlock Boat", body: "#ffd566", accent: "#fff6c0", flame: "#ffc247" },
  third: { name: "Inferno Premium Boat", body: "#ff7961", accent: "#ffd7a1", flame: "#ffec72" }
};

const game = {
  state: "menu",
  lastTime: 0,
  time: 0,
  input: {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false
  },
  selectedLevel: "standard",
  unlocks: {
    golden: false,
    third: false
  },
  muted: localStorage.getItem(STORAGE_KEYS.soundMuted) === "1",
  player: null,
  enemies: [],
  plants: [],
  powerups: [],
  ivories: [],
  flowers: [],
  hazards: [],
  bullets: [],
  enemyBullets: [],
  particles: [],
  popups: [],
  sparkles: [],
  boss: null,
  defeatReason: "",
  audioCtx: null,
  engine: null,
  shake: 0,
  flash: 0,
  flashColor: "255,255,255"
};

const BASE_COUNTS_BY_BIOME = {
  "Blue Open Sea": { brown: 2, red: 3, blue: 3, black: 1, pink: 2, violet: 2, turtle: 1, golden: 1 },
  "Coral Hazard Zone": { brown: 3, red: 3, blue: 3, black: 1, pink: 2, violet: 2, turtle: 1, snake: 1, golden: 1 },
  "Crimson War Water": { brown: 3, red: 4, blue: 3, black: 2, pink: 2, violet: 2, crocodile: 1, snake: 1, turtle: 1, golden: 1 },
  "Storm Sea": { brown: 4, red: 4, blue: 3, black: 2, pink: 2, violet: 2, crocodile: 2, snake: 2, turtle: 1, golden: 1 },
  "Black Abyss": { brown: 5, red: 4, blue: 4, black: 2, pink: 2, violet: 2, crocodile: 2, snake: 2, turtle: 1, golden: 2 },
  "Golden Legendary Sea": { brown: 3, red: 2, blue: 2, black: 1, pink: 1, violet: 1, crocodile: 1, snake: 1, turtle: 1, golden: 2 }
};

const THIRD_COUNTS_BY_BIOME = {
  "Blue Open Sea": { brown: 4, red: 5, blue: 5, black: 2, pink: 3, violet: 3, turtle: 2, snake: 1, crocodile: 1, golden: 2, octopus: 2, dragon: 1, spaceship: 1 },
  "Coral Hazard Zone": { brown: 5, red: 5, blue: 5, black: 2, pink: 3, violet: 3, turtle: 2, snake: 2, crocodile: 1, golden: 2, octopus: 2, dragon: 1, spaceship: 1 },
  "Crimson War Water": { brown: 5, red: 6, blue: 5, black: 3, pink: 3, violet: 3, turtle: 2, snake: 2, crocodile: 2, golden: 2, octopus: 3, dragon: 2, spaceship: 2 },
  "Storm Sea": { brown: 6, red: 6, blue: 6, black: 3, pink: 3, violet: 3, turtle: 2, snake: 2, crocodile: 2, golden: 2, octopus: 3, dragon: 2, spaceship: 2, spacegiant: 1 },
  "Black Abyss": { brown: 6, red: 6, blue: 6, black: 3, pink: 3, violet: 3, turtle: 2, snake: 3, crocodile: 3, golden: 3, octopus: 3, dragon: 2, spaceship: 2, spacegiant: 1 },
  "Golden Legendary Sea": { brown: 6, red: 5, blue: 5, black: 4, pink: 3, violet: 3, turtle: 2, snake: 3, crocodile: 3, golden: 3, octopus: 4, dragon: 3, spaceship: 3, spacegiant: 2 }
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distance(ax, az, bx, bz) {
  return Math.hypot(ax - bx, az - bz);
}

function isMobileDevice() {
  return window.innerWidth <= 980 || navigator.maxTouchPoints > 0 || matchMedia("(pointer: coarse)").matches;
}

function roundRectPath(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const expanded = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16)
  };
}

function mixHex(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(lerp(ca.r, cb.r, t));
  const g = Math.round(lerp(ca.g, cb.g, t));
  const bl = Math.round(lerp(ca.b, cb.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

function currentBiome(progress) {
  return BIOMES.find((biome) => progress >= biome.start && progress < biome.end) || BIOMES[BIOMES.length - 1];
}

function biomeBlendInfo(progress) {
  const index = BIOMES.findIndex((biome) => progress >= biome.start && progress < biome.end);
  const currentIndex = index === -1 ? BIOMES.length - 1 : index;
  const current = BIOMES[currentIndex];
  const next = BIOMES[Math.min(currentIndex + 1, BIOMES.length - 1)];
  if (current === next) {
    return { current, next, blend: 0 };
  }
  const distToEnd = current.end - progress;
  const blend = clamp(1 - distToEnd / BIOME_BLEND_RANGE, 0, 1);
  return { current, next, blend };
}

function currentLevel() {
  return LEVELS[game.selectedLevel];
}

function getRank(victory, score, maxCombo, progress) {
  let rankScore = score + maxCombo * 2 + Math.floor(progress / 300);
  if (victory) rankScore += 30;
  if (rankScore >= 160) return "Mythic";
  if (rankScore >= 120) return "Diamond";
  if (rankScore >= 80) return "Gold";
  if (rankScore >= 45) return "Silver";
  return "Bronze";
}

function comboLabel(combo) {
  if (combo >= 12) return "Mythic";
  if (combo >= 8) return "Dominating";
  if (combo >= 5) return "Rampage";
  if (combo >= 3) return "Streak";
  return "";
}

function comboMilestoneText(combo) {
  if (combo === 3) return "STREAK";
  if (combo === 5) return "RAMPAGE";
  if (combo === 8) return "DOMINATING";
  if (combo === 12) return "MYTHIC";
  return "";
}

function addShake(amount = 8) {
  game.shake = Math.max(game.shake, amount);
}

function addFlash(color = "255,255,255", amount = 0.18) {
  game.flashColor = color;
  game.flash = Math.max(game.flash, amount);
}

function syncUnlocks() {
  const level1Cleared = localStorage.getItem(STORAGE_KEYS.level1Cleared) === "1";
  const level2Cleared = localStorage.getItem(STORAGE_KEYS.level2Cleared) === "1";

  game.unlocks.golden = level1Cleared;
  game.unlocks.third = level1Cleared && level2Cleared;

  if (!game.unlocks.golden && game.selectedLevel === "golden") {
    game.selectedLevel = "standard";
  }
  if (!game.unlocks.third && game.selectedLevel === "third") {
    game.selectedLevel = game.unlocks.golden ? "golden" : "standard";
  }
}

function setMenuBoatCards() {
  syncUnlocks();

  boatStandardBtn.classList.toggle("selected", game.selectedLevel === "standard");
  boatGoldenBtn.classList.toggle("selected", game.selectedLevel === "golden");
  boatThirdBtn.classList.toggle("selected", game.selectedLevel === "third");

  boatGoldenBtn.disabled = !game.unlocks.golden;
  boatGoldenBtn.classList.toggle("locked", !game.unlocks.golden);

  boatThirdBtn.disabled = !game.unlocks.third;
  boatThirdBtn.classList.toggle("locked", !game.unlocks.third);

  if (game.selectedLevel === "standard") {
    menuStatus.textContent = "Level 1 ready. Clear it to unlock Level 2.";
  } else if (game.selectedLevel === "golden") {
    menuStatus.textContent = game.unlocks.golden
      ? "Level 2 ready. Clear it to unlock the premium third level."
      : "Level 2 locked. Beat Level 1 first.";
  } else {
    menuStatus.textContent = game.unlocks.third
      ? "Level 3 unlocked. Premium danger, stronger boss, more enemies, lasers, dragons, octopus and fire circles are waiting."
      : "Level 3 locked. Clear Level 1 and Level 2 to unlock the third premium level.";
  }
}

function updateSoundButton() {
  soundBtn.textContent = `Sound: ${game.muted ? "Off" : "On"}`;
}

function updateControlVisibility() {
  const inGame = game.state === "playing" || game.state === "sinking";
  const mobile = isMobileDevice();
  mobileControls.classList.toggle("hidden", !(mobile && inGame));
  desktopControls.classList.toggle("hidden", !(!mobile && inGame));
}

function showOnlyScreen(screenName) {
  menuScreen.classList.toggle("hidden", screenName !== "menu");
  pauseScreen.classList.toggle("hidden", screenName !== "pause");
  endScreen.classList.toggle("hidden", screenName !== "end");
}

function activePowerText() {
  if (!game.player) return "None";
  const p = game.player;
  const labels = [];
  if (p.power.rapid > 0) labels.push("Rapid Fire");
  if (p.power.triple > 0) labels.push("Triple Shot");
  if (p.power.shield > 0) labels.push("Shield Bubble");
  return labels.length ? labels.join(" + ") : "None";
}

function updateHud() {
  if (!game.player) return;
  const p = game.player;
  const comboText = comboLabel(p.combo);
  hudLevel.textContent = `${currentLevel().title}`;
  hudDistance.textContent = `${Math.max(0, Math.floor(p.z)).toLocaleString()}m / ${GOAL_DISTANCE.toLocaleString()}m`;
  hudBiome.textContent = currentBiome(p.z).name;
  hudLives.textContent = `Lifelines: ${p.lives}`;
  hudScore.textContent = `Score: ${p.score} / ${p.nextLifeScore}`;
  hudCombo.textContent = `Combo: x${Math.max(1, p.combo)}${comboText ? ` • ${comboText}` : ""}`;
  hudPower.textContent = `Power-Up: ${activePowerText()}`;
}

function updateBossHud() {
  if (!game.boss) {
    bossHud.classList.add("hidden");
    return;
  }
  bossHud.classList.remove("hidden");
  bossLabel.textContent = currentLevel().bossName;
  bossBar.style.width = `${clamp((game.boss.hp / game.boss.maxHp) * 100, 0, 100)}%`;
  bossHpText.textContent = `Boss HP: ${Math.max(0, game.boss.hp)} / ${game.boss.maxHp}`;
}

function ensureAudio() {
  if (game.muted) return null;
  if (!game.audioCtx) {
    game.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (game.audioCtx.state === "suspended") {
    game.audioCtx.resume();
  }
  return game.audioCtx;
}

function startMusic() {
  if (game.muted) return;
  bgMusic.volume = 0.18;
  bgMusic.play().catch(() => {});
}

function pauseMusic() {
  bgMusic.pause();
}

function stopMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function startEngine() {
  if (game.muted) return;
  const audio = ensureAudio();
  if (!audio || game.engine) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.value = 46;
  filter.type = "lowpass";
  filter.frequency.value = 420;
  gain.gain.value = 0.0001;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  osc.start();

  game.engine = { osc, gain, filter };
}

function stopEngine() {
  if (!game.engine) return;
  try {
    game.engine.osc.stop();
  } catch (e) {}
  game.engine = null;
}

function updateEngine() {
  if (!game.engine || !game.player) return;
  const speed = Math.hypot(game.player.vx, game.player.vz);
  const audio = game.audioCtx;
  if (!audio) return;

  const targetFreq = 44 + speed * 18;
  const targetGain = game.state === "playing" ? 0.005 + speed * 0.0034 : 0.0001;

  game.engine.osc.frequency.setTargetAtTime(targetFreq, audio.currentTime, 0.08);
  game.engine.gain.gain.setTargetAtTime(Math.min(targetGain, 0.028), audio.currentTime, 0.12);
  game.engine.filter.frequency.setTargetAtTime(360 + speed * 68, audio.currentTime, 0.1);
}

function stopGameAudio() {
  stopMusic();
  stopEngine();
}

function playTone({ freq = 440, endFreq = null, duration = 0.2, type = "sine", volume = 0.12 }) {
  if (game.muted) return;
  const audio = ensureAudio();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.value = 2800;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, audio.currentTime + duration);
  }

  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + duration + 0.02);
}

function playLaserSound() {
  playTone({ freq: 1280, endFreq: 280, duration: 0.16, type: "sawtooth", volume: 0.06 });
  playTone({ freq: 980, endFreq: 210, duration: 0.12, type: "square", volume: 0.045 });
}

function playHitSound() {
  playTone({ freq: 380, endFreq: 110, duration: 0.18, type: "triangle", volume: 0.08 });
}

function playDamageSound() {
  playTone({ freq: 210, endFreq: 70, duration: 0.4, type: "sawtooth", volume: 0.1 });
}

function playPowerSound() {
  playTone({ freq: 520, endFreq: 980, duration: 0.18, type: "triangle", volume: 0.08 });
}

function playBossAlarm() {
  playTone({ freq: 180, endFreq: 120, duration: 0.55, type: "square", volume: 0.08 });
}

function playVictorySound() {
  playTone({ freq: 440, endFreq: 880, duration: 0.3, type: "triangle", volume: 0.09 });
  setTimeout(() => playTone({ freq: 660, endFreq: 1320, duration: 0.36, type: "triangle", volume: 0.1 }), 120);
}

function playFinalCrashSound() {
  playTone({ freq: 140, endFreq: 38, duration: 1.3, type: "sawtooth", volume: 0.24 });
  setTimeout(() => playTone({ freq: 90, endFreq: 28, duration: 1.1, type: "triangle", volume: 0.18 }), 80);
}

function playBossDefeatSinkSound() {
  playTone({ freq: 1280, endFreq: 190, duration: 1.1, type: "sawtooth", volume: 0.24 });
  setTimeout(() => playTone({ freq: 820, endFreq: 95, duration: 1.5, type: "square", volume: 0.2 }), 80);
  setTimeout(() => playTone({ freq: 1460, endFreq: 260, duration: 0.9, type: "triangle", volume: 0.18 }), 170);
  setTimeout(() => playTone({ freq: 420, endFreq: 70, duration: 1.8, type: "sawtooth", volume: 0.22 }), 260);
  setTimeout(() => playTone({ freq: 980, endFreq: 150, duration: 1.1, type: "square", volume: 0.14 }), 420);
}

function createSparkles() {
  game.sparkles = Array.from({ length: 62 }, () => ({
    x: rand(0, 1),
    y: rand(0, 1),
    size: rand(1.2, 3.6),
    alpha: rand(0.18, 0.95),
    speed: rand(0.2, 0.8),
    phase: rand(0, Math.PI * 2)
  }));
}
createSparkles();

function createPlayer() {
  const boat = BOATS[currentLevel().boat];
  return {
    x: WORLD_WIDTH / 2,
    z: 0,
    vx: 0,
    vz: 0,
    dirX: 0,
    dirZ: 1,
    lives: BASE_LIVES,
    score: 0,
    nextLifeScore: 10,
    combo: 0,
    maxCombo: 0,
    comboTimer: 0,
    invuln: 0,
    shieldFlash: 0,
    lastShot: -9999,
    power: { rapid: 0, triple: 0, shield: 0 },
    boat
  };
}

function createPlant(zMin, zMax) {
  return {
    x: rand(110, WORLD_WIDTH - 110),
    z: rand(zMin, zMax),
    h: rand(58, 112),
    w: rand(16, 24),
    armsLeft: Math.random() > 0.33,
    armsRight: Math.random() > 0.28,
    color: ["#3dc96c", "#5fd88d", "#71b85b", "#45d99d"][Math.floor(Math.random() * 4)],
    radius: rand(24, 32)
  };
}

function createFlower(zMin, zMax) {
  const colors = ["#ff6fae", "#ffb449", "#7ffff4", "#b694ff", "#ffeb72"];
  return {
    x: rand(120, WORLD_WIDTH - 120),
    z: rand(zMin, zMax),
    bob: rand(0, Math.PI * 2),
    radius: 26,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function createIvory(zMin, zMax) {
  return {
    x: rand(140, WORLD_WIDTH - 140),
    z: rand(zMin, zMax),
    radius: 26,
    bob: rand(0, Math.PI * 2)
  };
}

function createFireCircleHazard(zMin, zMax) {
  return {
    x: rand(170, WORLD_WIDTH - 170),
    z: rand(zMin, zMax),
    orbitRadius: rand(44, 74),
    angle: rand(0, Math.PI * 2),
    speed: rand(0.0014, 0.0023),
    ringRadius: rand(22, 30),
    color: Math.random() > 0.5 ? "red" : "blue",
    poleHeight: rand(70, 110)
  };
}

function fireCirclePosition(hazard) {
  return {
    x: hazard.x + Math.cos(hazard.angle) * hazard.orbitRadius,
    z: hazard.z + Math.sin(hazard.angle) * hazard.orbitRadius * 0.42
  };
}

function createEnemy(typeKey, zMin, zMax) {
  const def = ENEMY_TYPES[typeKey];
  const enemy = {
    type: typeKey,
    x: rand(140, WORLD_WIDTH - 140),
    z: rand(zMin, zMax),
    baseX: rand(140, WORLD_WIDTH - 140),
    baseZ: rand(zMin, zMax),
    hp: def.hp,
    maxHp: def.hp,
    radius: def.radius,
    seed: rand(0, 1000),
    phase: rand(0, Math.PI * 2),
    t: rand(0, 6),
    vx: 0,
    vz: 0,
    dashTimer: rand(800, 2200),
    dashVX: 0,
    dashVZ: 0,
    shotTimer: rand(1300, 2600)
  };

  if (typeKey === "octopus") {
    enemy.variant = ["#ff7fd5", "#7de9ff", "#9f8cff", "#ffb36b"][Math.floor(Math.random() * 4)];
  }
  if (typeKey === "dragon") {
    enemy.variant = ["#ff7c55", "#61b4ff", "#ffd55b"][Math.floor(Math.random() * 3)];
  }
  if (typeKey === "spaceship") {
    enemy.variant = ["#7ce3ff", "#ffd87a", "#f59cff"][Math.floor(Math.random() * 3)];
  }
  if (typeKey === "spacegiant") {
    enemy.variant = ["#f5a9ff", "#9fd0ff", "#ffe27b"][Math.floor(Math.random() * 3)];
  }

  return enemy;
}

function spawnPowerup(type, z) {
  game.powerups.push({
    type,
    x: rand(180, WORLD_WIDTH - 180),
    z,
    radius: 30,
    bob: rand(0, Math.PI * 2)
  });
}

function addPopup(text, color, x, z, size = 18) {
  game.popups.push({
    text,
    color,
    x,
    z,
    size,
    life: 1200,
    rise: rand(24, 44)
  });
}

function burst(x, z, color, count = 14, force = 1, kind = "burst") {
  for (let i = 0; i < count; i++) {
    game.particles.push({
      x,
      z,
      vx: rand(-3.6, 3.6) * force,
      vz: rand(-2.4, 2.8) * force,
      life: rand(420, 960),
      size: rand(2, 5),
      color,
      kind
    });
  }
}

function buildWorld() {
  game.enemies = [];
  game.plants = [];
  game.powerups = [];
  game.ivories = [];
  game.flowers = [];
  game.hazards = [];
  game.bullets = [];
  game.enemyBullets = [];
  game.particles = [];
  game.popups = [];
  game.boss = null;

  const level = currentLevel();
  const isThird = level.id === "third";
  const isGolden = level.id === "golden";

  BIOMES.forEach((biome) => {
    const spanStart = biome.start + 220;
    const spanEnd = Math.min(biome.end - 140, GOAL_DISTANCE - 180);

    const plantCount = isThird ? 16 : biome.name === "Golden Legendary Sea" ? 6 : 10;
    for (let i = 0; i < plantCount; i++) {
      game.plants.push(createPlant(spanStart, spanEnd));
    }

    const counts = isThird ? THIRD_COUNTS_BY_BIOME[biome.name] : BASE_COUNTS_BY_BIOME[biome.name];
    Object.entries(counts).forEach(([type, count]) => {
      let finalCount = count;
      if (isGolden && ["black", "snake", "crocodile", "golden"].includes(type)) {
        finalCount += 1;
      }
      for (let i = 0; i < finalCount; i++) {
        game.enemies.push(createEnemy(type, spanStart, spanEnd));
      }
    });

    const ivoryCount = isThird ? 2 : biome.name === "Golden Legendary Sea" ? 2 : 1;
    for (let i = 0; i < ivoryCount; i++) {
      game.ivories.push(createIvory(spanStart, spanEnd));
    }

    if (isThird) {
      const flowerCount = biome.name === "Golden Legendary Sea" ? 3 : 2;
      for (let i = 0; i < flowerCount; i++) {
        game.flowers.push(createFlower(spanStart, spanEnd));
      }

      const fireCount = biome.name === "Golden Legendary Sea" ? 3 : 2;
      for (let i = 0; i < fireCount; i++) {
        game.hazards.push(createFireCircleHazard(spanStart, spanEnd));
      }
    }
  });

  spawnPowerup("rapid", 1700);
  spawnPowerup("shield", 3300);
  spawnPowerup("triple", 5200);
  spawnPowerup("rapid", 7600);
  spawnPowerup("shield", 9800);
  spawnPowerup("triple", 11200);

  if (isGolden || isThird) {
    spawnPowerup("rapid", 2500);
    spawnPowerup("triple", 6400);
  }

  if (isThird) {
    spawnPowerup("shield", 2100);
    spawnPowerup("rapid", 9000);
    spawnPowerup("triple", 10800);
  }
}

function startGame() {
  showOnlyScreen("none");
  pauseScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  menuScreen.classList.add("hidden");

  game.player = createPlayer();
  buildWorld();
  game.state = "playing";
  game.defeatReason = "";
  game.shake = 0;
  game.flash = 0;

  hud.classList.remove("hidden");
  bossHud.classList.add("hidden");
  updateHud();
  updateBossHud();
  updateControlVisibility();

  ensureAudio();
  bgMusic.currentTime = 0;
  startMusic();
  startEngine();
}

function returnToMenu() {
  game.state = "menu";
  game.player = null;
  game.boss = null;
  hud.classList.add("hidden");
  bossHud.classList.add("hidden");
  showOnlyScreen("menu");
  updateControlVisibility();
  stopGameAudio();
}

function togglePause() {
  if (game.state === "playing") {
    game.state = "paused";
    pauseMusic();
    showOnlyScreen("pause");
    updateControlVisibility();
  } else if (game.state === "paused") {
    game.state = "playing";
    if (!game.muted) {
      startMusic();
      startEngine();
    }
    showOnlyScreen("none");
    updateControlVisibility();
  }
}

function registerLevelVictory() {
  let note = "";
  if (game.selectedLevel === "standard") {
    const already = localStorage.getItem(STORAGE_KEYS.level1Cleared) === "1";
    localStorage.setItem(STORAGE_KEYS.level1Cleared, "1");
    note = already ? "Level 2 is already available." : "Level 2 unlocked.";
  } else if (game.selectedLevel === "golden") {
    const already = localStorage.getItem(STORAGE_KEYS.level2Cleared) === "1";
    localStorage.setItem(STORAGE_KEYS.level2Cleared, "1");
    note = already ? "Level 3 is already available." : "Level 3 unlocked.";
  } else if (game.selectedLevel === "third") {
    localStorage.setItem(STORAGE_KEYS.level3Cleared, "1");
    note = "All three premium levels cleared.";
  }
  syncUnlocks();
  return note;
}

function showEnd(victory, reason = "") {
  const p = game.player;
  const progress = p ? Math.max(0, Math.floor(p.z)) : 0;
  const rank = getRank(victory, p.score, p.maxCombo, progress);

  const statsLines = [
    `<div><strong>Level:</strong> ${currentLevel().menuName}</div>`,
    `<div><strong>Distance:</strong> ${progress.toLocaleString()}m / ${GOAL_DISTANCE.toLocaleString()}m</div>`,
    `<div><strong>Score:</strong> ${p.score}</div>`,
    `<div><strong>Best Combo:</strong> x${p.maxCombo}</div>`,
    `<div><strong>Lifelines Remaining:</strong> ${Math.max(0, p.lives)}</div>`,
    `<div><strong>Rank:</strong> ${rank}</div>`
  ];

  if (victory) {
    endEyebrow.textContent = "Legendary Victory";
    endTitle.textContent = `${currentLevel().title} Cleared`;
    endSubtitle.textContent =
      game.selectedLevel === "third"
        ? "You survived the premium third level, overcame dragons, octopus, space giants, laser ships and the Apex Guardian Boss."
        : "You completed the mission and defeated the Guardian Boss of this level.";
    endUnlock.textContent = registerLevelVictory();
    playVictorySound();
  } else {
    endEyebrow.textContent = "Mission Failed";
    endTitle.textContent = "Run Lost";
    endSubtitle.textContent = reason || "Your battle craft was overwhelmed before the final victory.";
    endUnlock.textContent = "";
  }

  endStats.innerHTML = statsLines.join("");
  showOnlyScreen("end");
  updateControlVisibility();
  setMenuBoatCards();
  stopGameAudio();
}

function spawnBoss() {
  if (game.boss) return;
  const hp = currentLevel().bossHp;
  game.boss = {
    x: WORLD_WIDTH / 2,
    z: GOAL_DISTANCE + 560,
    hp,
    maxHp: hp,
    phase: 1,
    t: 0,
    shotTimer: 1200,
    summonTimer: 5200,
    specialTimer: 3200,
    wingPulse: 0,
    entryTimer: 1500,
    defeated: false,
    sinkTimer: 0,
    renderOffsetY: 0,
    sinkRotation: 0,
    fade: 1
  };
  burst(WORLD_WIDTH / 2, GOAL_DISTANCE + 520, "#ffe58a", 44, 1.7);
  addPopup("BOSS INCOMING", "#fff0a7", WORLD_WIDTH / 2, game.player.z + 600, 22);
  addShake(12);
  addFlash("255,238,162", 0.28);
  playBossAlarm();
  updateBossHud();
}

function startBossDefeatSequence() {
  if (!game.boss || game.boss.defeated) return;
  game.boss.defeated = true;
  game.boss.sinkTimer = 0;
  game.boss.renderOffsetY = 0;
  game.boss.sinkRotation = 0;
  game.boss.fade = 1;

  game.state = "bosssink";
  game.enemyBullets = [];
  game.enemies = [];
  game.bullets = [];
  pauseMusic();
  stopEngine();

  addPopup("GUARDIAN DOWN", "#ff8d8d", game.boss.x, game.boss.z - 30, 24);
  burst(game.boss.x, game.boss.z, "#ffb0a0", 52, 1.8);
  addShake(18);
  addFlash("255,120,120", 0.34);
  playBossDefeatSinkSound();
  updateBossHud();
}

function updateBossDefeatSequence(dt) {
  if (!game.boss) return;
  const boss = game.boss;
  const dt60 = dt / 16.6667;

  boss.sinkTimer += dt;
  boss.renderOffsetY += (2.4 + boss.sinkTimer * 0.0025) * dt60;
  boss.sinkRotation += 0.016 * dt60;
  boss.fade = clamp(1 - boss.sinkTimer / BOSS_SINK_TIME, 0, 1);

  if (Math.random() < 0.85) {
    burst(
      boss.x + rand(-45, 45),
      boss.z + rand(-20, 20),
      Math.random() < 0.55 ? "#fff0c0" : "#d8f7ff",
      2,
      0.5,
      "burst"
    );
  }

  updateParticles(dt);
  updateBossHud();

  if (boss.sinkTimer >= BOSS_SINK_TIME) {
    game.boss = null;
    game.state = "victory";
    showEnd(true);
  }
}

function activeShotCooldown() {
  return game.player.power.rapid > 0 ? RAPID_COOLDOWN : SHOT_COOLDOWN;
}

function fireBullet() {
  const p = game.player;
  const now = performance.now();
  if (!p || game.state !== "playing") return;
  if (now - p.lastShot < activeShotCooldown()) return;

  p.lastShot = now;
  playLaserSound();

  const shots = [];
  const baseDir = Math.atan2(p.dirX, p.dirZ);

  if (p.power.triple > 0) {
    shots.push(baseDir - 0.18, baseDir, baseDir + 0.18);
  } else {
    shots.push(baseDir);
  }

  shots.forEach((angle) => {
    const dx = Math.sin(angle);
    const dz = Math.cos(angle);
    game.bullets.push({
      x: p.x + dx * 18,
      z: p.z + dz * 40,
      vx: dx * BULLET_SPEED,
      vz: dz * BULLET_SPEED,
      life: 115,
      size: 8
    });
  });

  burst(p.x, p.z + 12, "#ffbf62", 8, 0.85);
}

function awardPoints(amount, x, z) {
  const p = game.player;
  p.score += amount;

  while (p.score >= p.nextLifeScore) {
    p.lives += 1;
    p.nextLifeScore += 10;
    addPopup("LIFELINE +1", "#7dffab", p.x, p.z + 30, 20);
    burst(p.x, p.z, "#6affac", 16, 1.15);
    addFlash("125,255,180", 0.12);
    playPowerSound();
  }

  addPopup(`+${amount}`, "#ffe48f", x, z, 17);
}

function registerKill(enemy) {
  const p = game.player;
  p.combo = p.comboTimer > 0 ? p.combo + 1 : 1;
  p.comboTimer = COMBO_WINDOW;
  p.maxCombo = Math.max(p.maxCombo, p.combo);

  const comboBonus = 1 + Math.floor((p.combo - 1) / 4) * 0.25;
  const basePoints = ENEMY_TYPES[enemy.type].points;
  const totalPoints = Math.max(1, Math.round(basePoints * comboBonus));

  awardPoints(totalPoints, enemy.x, enemy.z);
  burst(enemy.x, enemy.z, enemy.variant || ENEMY_TYPES[enemy.type].color, enemy.type === "golden" ? 28 : 14, enemy.type === "golden" ? 1.6 : 1);

  if (p.combo >= 2) {
    addPopup(`x${p.combo}`, currentBiome(p.z).glow, enemy.x, enemy.z - 18, 16 + Math.min(p.combo, 8));
  }

  const milestone = comboMilestoneText(p.combo);
  if (milestone) {
    addPopup(milestone, "#fff0a2", p.x, p.z + 80, 22);
    burst(p.x, p.z, currentBiome(p.z).glow, 22, 1.4);
    addShake(6 + p.combo * 0.4);
    addFlash("255,240,170", 0.16);
  }

  playHitSound();
}

function givePower(type, x, z) {
  const p = game.player;
  p.power[type] = POWER_DURATION[type];
  addPopup(POWERUPS[type].label.toUpperCase(), POWERUPS[type].color, x, z, 18);
  burst(x, z, POWERUPS[type].color, 18, 1.1);
  addFlash("170,245,255", 0.12);
  playPowerSound();
}

function damagePlayer(reason) {
  const p = game.player;
  if (!p || p.invuln > 0 || game.state !== "playing") return;

  if (p.power.shield > 0) {
    p.power.shield = 0;
    p.invuln = 400;
    p.shieldFlash = 420;
    addPopup("SHIELD BLOCK", "#7ff6ff", p.x, p.z + 16, 18);
    burst(p.x, p.z, "#6fffff", 18, 1.25);
    addFlash("135,246,255", 0.18);
    addShake(7);
    playPowerSound();
    return;
  }

  p.lives -= 1;
  p.invuln = INVULN_MS;
  p.combo = 0;
  p.comboTimer = 0;
  p.z = Math.max(0, p.z - 110);
  p.x = clamp(p.x + rand(-120, 120), 90, WORLD_WIDTH - 90);
  burst(p.x, p.z, "#ffbc62", 20, 1.2);
  addPopup("HIT", "#ff9a60", p.x, p.z + 20, 18);
  addFlash("255,160,110", 0.22);
  addShake(10);
  playDamageSound();

  if (p.lives <= 0) {
    game.defeatReason = reason;
    game.state = "sinking";
    p.sinkTimer = 0;
    pauseMusic();
    stopEngine();
    playFinalCrashSound();
  }
}

function updatePlayer(dt) {
  const p = game.player;
  if (!p) return;

  p.invuln = Math.max(0, p.invuln - dt);
  p.shieldFlash = Math.max(0, p.shieldFlash - dt);

  if (p.comboTimer > 0) {
    p.comboTimer -= dt;
    if (p.comboTimer <= 0) p.combo = 0;
  }

  Object.keys(p.power).forEach((key) => {
    if (p.power[key] > 0) {
      p.power[key] = Math.max(0, p.power[key] - dt);
    }
  });

  const dt60 = dt / 16.6667;
  const moveX = (game.input.right ? 1 : 0) - (game.input.left ? 1 : 0);
  const moveZ = (game.input.up ? 1 : 0) - (game.input.down ? 1 : 0);

  let nx = moveX;
  let nz = moveZ;

  if (nx !== 0 || nz !== 0) {
    const len = Math.hypot(nx, nz);
    nx /= len;
    nz /= len;
    p.dirX = lerp(p.dirX, nx, 0.2);
    p.dirZ = lerp(p.dirZ, nz, 0.2);
  } else {
    p.dirX = lerp(p.dirX, 0, 0.06);
    p.dirZ = lerp(p.dirZ, 1, 0.06);
  }

  const targetVX = nx * PLAYER_SPEED_SIDE;
  const targetVZ = nz > 0 ? nz * PLAYER_SPEED_FORWARD : nz * PLAYER_SPEED_BACKWARD;

  p.vx = lerp(p.vx, targetVX, PLAYER_LERP);
  p.vz = lerp(p.vz, targetVZ, PLAYER_LERP);

  p.x += p.vx * dt60;
  p.z += p.vz * dt60;

  const speed = Math.hypot(p.vx, p.vz);
  if (speed > 0.25) {
    game.particles.push({
      x: p.x - p.dirX * 10 + rand(-6, 6),
      z: p.z - p.dirZ * 38 + rand(-8, 8),
      vx: -p.dirX * 0.5 + rand(-0.2, 0.2),
      vz: -p.dirZ * 1.3 + rand(-0.25, 0.25),
      life: rand(520, 820),
      size: rand(5, 9),
      color: "#ffffff",
      kind: "smoke"
    });
    if (Math.random() < 0.26) {
      game.particles.push({
        x: p.x - p.dirX * 8 + rand(-8, 8),
        z: p.z - p.dirZ * 30 + rand(-10, 10),
        vx: rand(-0.35, 0.35),
        vz: -1.2 + rand(-0.2, 0.2),
        life: rand(360, 620),
        size: rand(1.4, 3.2),
        color: currentBiome(p.z).glow,
        kind: "burst"
      });
    }
  }

  if (game.boss) {
    p.z = clamp(p.z, GOAL_DISTANCE - 120, GOAL_DISTANCE + 220);
  } else {
    p.z = clamp(p.z, 0, GOAL_DISTANCE + 160);
  }

  if (p.x < 64) {
    p.x = 64;
    damagePlayer("You slammed into the left boundary.");
  } else if (p.x > WORLD_WIDTH - 64) {
    p.x = WORLD_WIDTH - 64;
    damagePlayer("You slammed into the right boundary.");
  }

  if (game.input.fire) {
    fireBullet();
  }

  if (!game.boss && p.z >= GOAL_DISTANCE - 30) {
    spawnBoss();
  }

  updateEngine();
}

function spawnEnemyProjectile(enemy, color, speed, effect, spread = 0, originOffsetX = 0, originOffsetZ = 0) {
  const ox = enemy.x + originOffsetX;
  const oz = enemy.z + originOffsetZ;
  const dx = game.player.x - ox;
  const dz = game.player.z - oz;
  const dist = Math.hypot(dx, dz) || 1;
  const baseAngle = Math.atan2(dx / dist, dz / dist);

  game.enemyBullets.push({
    x: ox,
    z: oz,
    vx: Math.sin(baseAngle + spread) * speed,
    vz: Math.cos(baseAngle + spread) * speed,
    life: 220,
    radius: effect === "fire" ? 18 : effect === "laser" ? 16 : 16,
    color,
    effect
  });
}

function updateEnemy(enemy, dt) {
  const dt60 = dt / 16.6667;
  enemy.t += dt * 0.001;
  enemy.shotTimer -= dt;

  if (enemy.type === "brown") {
    const dx = game.player.x - enemy.x;
    const dz = game.player.z - enemy.z;
    const dist = Math.hypot(dx, dz) || 1;
    enemy.vx += (dx / dist) * 0.18 * dt60;
    enemy.vz += (dz / dist) * 0.18 * dt60;

    const speed = Math.hypot(enemy.vx, enemy.vz);
    const maxSpeed = 3.7;
    if (speed > maxSpeed) {
      enemy.vx = (enemy.vx / speed) * maxSpeed;
      enemy.vz = (enemy.vz / speed) * maxSpeed;
    }

    enemy.x += enemy.vx * dt60;
    enemy.z += enemy.vz * dt60;
  } else if (enemy.type === "red") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 1.7 + enemy.phase) * 90;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 1.2 + enemy.phase) * 54;
  } else if (enemy.type === "blue") {
    enemy.dashTimer -= dt;
    if (enemy.dashTimer <= 0) {
      const dx = game.player.x - enemy.x;
      const dz = game.player.z - enemy.z;
      const dist = Math.hypot(dx, dz) || 1;
      enemy.dashVX = (dx / dist) * 4.6;
      enemy.dashVZ = (dz / dist) * 3.8;
      enemy.dashTimer = rand(1800, 3400);
    }
    enemy.x += enemy.dashVX * dt60;
    enemy.z += enemy.dashVZ * dt60;
    enemy.dashVX *= 0.92;
    enemy.dashVZ *= 0.92;
    enemy.x = lerp(enemy.x, enemy.baseX + Math.sin(enemy.t * 1.4 + enemy.phase) * 50, 0.06);
    enemy.z = lerp(enemy.z, enemy.baseZ + Math.cos(enemy.t * 1.1 + enemy.phase) * 36, 0.06);
  } else if (enemy.type === "black") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 0.6 + enemy.phase) * 52;
    enemy.z = enemy.baseZ + Math.sin(enemy.t * 0.46 + enemy.phase) * 22;
  } else if (enemy.type === "pink") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 2.4 + enemy.phase) * 110;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 1.8 + enemy.phase) * 28;
  } else if (enemy.type === "violet") {
    enemy.x = enemy.baseX + Math.cos(enemy.t * 1.05 + enemy.phase) * 78;
    enemy.z = enemy.baseZ + Math.sin(enemy.t * 1.35 + enemy.phase) * 42;
  } else if (enemy.type === "golden") {
    const dist = distance(enemy.x, enemy.z, game.player.x, game.player.z);
    if (dist < 240) {
      const dx = enemy.x - game.player.x;
      const dz = enemy.z - game.player.z;
      const len = Math.hypot(dx, dz) || 1;
      enemy.baseX = clamp(enemy.baseX + (dx / len) * 2.8, 120, WORLD_WIDTH - 120);
      enemy.baseZ = clamp(enemy.baseZ + (dz / len) * 2.1, 120, GOAL_DISTANCE - 160);
    }
    enemy.x = lerp(enemy.x, enemy.baseX + Math.sin(enemy.t * 2.1 + enemy.phase) * 62, 0.08);
    enemy.z = lerp(enemy.z, enemy.baseZ + Math.cos(enemy.t * 1.9 + enemy.phase) * 44, 0.08);
  } else if (enemy.type === "crocodile") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 0.9 + enemy.phase) * 95;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 0.8 + enemy.phase) * 26;
    if (Math.abs(enemy.z - game.player.z) < 700 && enemy.shotTimer <= 0) {
      spawnEnemyProjectile(enemy, "#ff8c33", 5.4, "fire");
      burst(enemy.x, enemy.z, "#ff9e47", 8, 0.8);
      enemy.shotTimer = rand(1800, 2600);
    }
  } else if (enemy.type === "snake") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 2.8 + enemy.phase) * 80;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 1.4 + enemy.phase) * 22;
    if (Math.abs(enemy.z - game.player.z) < 620 && enemy.shotTimer <= 0) {
      spawnEnemyProjectile(enemy, "#1a1a1a", 4.8, "poison", -0.09);
      spawnEnemyProjectile(enemy, "#2d2d2d", 4.8, "poison", 0.09);
      burst(enemy.x, enemy.z, "#303030", 6, 0.7);
      enemy.shotTimer = rand(1900, 2900);
    }
  } else if (enemy.type === "turtle") {
    enemy.x = enemy.baseX + Math.cos(enemy.t * 0.7 + enemy.phase) * 44;
    enemy.z = enemy.baseZ + Math.sin(enemy.t * 0.55 + enemy.phase) * 32;
  } else if (enemy.type === "octopus") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 1.8 + enemy.phase) * 86;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 1.15 + enemy.phase) * 34;
    if (Math.abs(enemy.z - game.player.z) < 720 && enemy.shotTimer <= 0) {
      spawnEnemyProjectile(enemy, enemy.variant, 5.1, "ink", -0.12);
      spawnEnemyProjectile(enemy, enemy.variant, 5.2, "ink", 0);
      spawnEnemyProjectile(enemy, enemy.variant, 5.1, "ink", 0.12);
      burst(enemy.x, enemy.z, enemy.variant, 10, 0.85);
      enemy.shotTimer = rand(1500, 2400);
    }
  } else if (enemy.type === "dragon") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 1.05 + enemy.phase) * 130;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 1.2 + enemy.phase) * 46;
    if (Math.abs(enemy.z - game.player.z) < 760 && enemy.shotTimer <= 0) {
      spawnEnemyProjectile(enemy, enemy.variant, 6.2, "fire", -0.07);
      spawnEnemyProjectile(enemy, enemy.variant, 6.4, "fire", 0.07);
      burst(enemy.x, enemy.z, enemy.variant, 12, 0.95);
      enemy.shotTimer = rand(1300, 2200);
    }
  } else if (enemy.type === "spaceship") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 1.6 + enemy.phase) * 118;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 0.8 + enemy.phase) * 22;
    if (Math.abs(enemy.z - game.player.z) < 820 && enemy.shotTimer <= 0) {
      spawnEnemyProjectile(enemy, enemy.variant, 6.6, "laser", -0.06, -16, 0);
      spawnEnemyProjectile(enemy, enemy.variant, 6.6, "laser", 0.06, 16, 0);
      burst(enemy.x, enemy.z, enemy.variant, 8, 0.8);
      enemy.shotTimer = rand(1200, 1800);
    }
  } else if (enemy.type === "spacegiant") {
    enemy.x = enemy.baseX + Math.sin(enemy.t * 0.9 + enemy.phase) * 150;
    enemy.z = enemy.baseZ + Math.cos(enemy.t * 0.7 + enemy.phase) * 30;
    if (Math.abs(enemy.z - game.player.z) < 900 && enemy.shotTimer <= 0) {
      spawnEnemyProjectile(enemy, enemy.variant, 7.2, "laser", -0.1, -24, 0);
      spawnEnemyProjectile(enemy, enemy.variant, 7.2, "laser", 0, 0, 0);
      spawnEnemyProjectile(enemy, enemy.variant, 7.2, "laser", 0.1, 24, 0);
      burst(enemy.x, enemy.z, enemy.variant, 16, 1.05);
      enemy.shotTimer = rand(1100, 1700);
    }
  }

  enemy.x = clamp(enemy.x, 80, WORLD_WIDTH - 80);
}

function updateHazards(dt) {
  for (const hazard of game.hazards) {
    hazard.angle += dt * hazard.speed;
  }
}

function bossFanAttack(boss, shots, speed, color, spreadStep) {
  const p = game.player;
  for (let i = 0; i < shots; i++) {
    const spread = (i - (shots - 1) / 2) * spreadStep;
    const baseAngle = Math.atan2(p.x - boss.x, p.z - boss.z) + spread;
    game.enemyBullets.push({
      x: boss.x,
      z: boss.z - 20,
      vx: Math.sin(baseAngle) * speed,
      vz: Math.cos(baseAngle) * speed,
      life: 220,
      radius: 16,
      color,
      effect: "guardian"
    });
  }
}

function bossRingAttack(boss, count, speed, color) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    game.enemyBullets.push({
      x: boss.x,
      z: boss.z - 6,
      vx: Math.sin(angle) * speed,
      vz: Math.cos(angle) * speed,
      life: 200,
      radius: 14,
      color,
      effect: "guardian"
    });
  }
  burst(boss.x, boss.z, color, 20, 1.1);
  addShake(9);
  addFlash("255,226,123", 0.16);
}

function updateBoss(dt) {
  if (!game.boss || game.boss.defeated) return;
  const boss = game.boss;
  const p = game.player;
  const dt60 = dt / 16.6667;

  boss.t += dt;
  boss.phase = boss.hp <= Math.ceil(boss.maxHp * 0.33) ? 3 : boss.hp <= Math.ceil(boss.maxHp * 0.66) ? 2 : 1;
  boss.wingPulse += dt * 0.003;
  boss.entryTimer = Math.max(0, boss.entryTimer - dt);

  const swing = currentLevel().id === "third" ? 420 : 330;
  const targetX = WORLD_WIDTH / 2 + Math.sin(boss.t * 0.0011 * (boss.phase + 0.4)) * (boss.phase === 3 ? swing + 80 : swing);
  const targetZ = GOAL_DISTANCE + 530 - boss.phase * 20 + Math.sin(boss.t * 0.0012) * 28;

  boss.x = lerp(boss.x, targetX, 0.03 * dt60);
  boss.z = lerp(boss.z, targetZ, 0.04 * dt60);

  boss.shotTimer -= dt;
  boss.summonTimer -= dt;
  boss.specialTimer -= dt;

  if (boss.shotTimer <= 0) {
    if (boss.phase === 1) {
      bossFanAttack(boss, currentLevel().id === "third" ? 4 : 3, 6.9, "#ffe27b", 0.16);
      boss.shotTimer = currentLevel().id === "third" ? 880 : 1120;
    } else if (boss.phase === 2) {
      bossFanAttack(boss, currentLevel().id === "third" ? 5 : 4, 7.15, "#ffd66f", 0.15);
      game.enemyBullets.push({
        x: boss.x - 62,
        z: boss.z + 2,
        vx: -1.8,
        vz: -4.8,
        life: 160,
        radius: 14,
        color: "#ffd66f",
        effect: "guardian"
      });
      game.enemyBullets.push({
        x: boss.x + 62,
        z: boss.z + 2,
        vx: 1.8,
        vz: -4.8,
        life: 160,
        radius: 14,
        color: "#ffd66f",
        effect: "guardian"
      });
      boss.shotTimer = currentLevel().id === "third" ? 680 : 820;
    } else {
      bossFanAttack(boss, currentLevel().id === "third" ? 7 : 5, 7.7, currentLevel().id === "third" ? "#ff6a6a" : "#ffb35a", 0.13);
      game.enemyBullets.push({
        x: boss.x - 72,
        z: boss.z + 10,
        vx: -2.2,
        vz: -5.1,
        life: 180,
        radius: 14,
        color: currentLevel().id === "third" ? "#ff6a6a" : "#ffb35a",
        effect: "guardian"
      });
      game.enemyBullets.push({
        x: boss.x + 72,
        z: boss.z + 10,
        vx: 2.2,
        vz: -5.1,
        life: 180,
        radius: 14,
        color: currentLevel().id === "third" ? "#6ab7ff" : "#ffb35a",
        effect: "guardian"
      });
      boss.shotTimer = currentLevel().id === "third" ? 500 : 620;
    }
    addShake(5);
  }

  if (boss.phase >= 2 && boss.specialTimer <= 0) {
    if (boss.phase === 2) {
      bossRingAttack(boss, currentLevel().id === "third" ? 10 : 8, 5.4, "#ffe27b");
      boss.specialTimer = currentLevel().id === "third" ? 2800 : 3900;
    } else {
      bossRingAttack(boss, currentLevel().id === "third" ? 16 : 12, 6.0, currentLevel().id === "third" ? "#ff6a6a" : "#ffbe63");
      boss.specialTimer = currentLevel().id === "third" ? 2200 : 2750;
    }
  }

  if (boss.phase >= 2 && boss.summonTimer <= 0) {
    const summonCount = currentLevel().id === "third" ? (boss.phase === 3 ? 4 : 3) : (boss.phase === 3 ? 2 : 1);
    const summonPool = currentLevel().id === "third" ? ["brown", "crocodile", "snake", "octopus", "dragon", "spaceship"] : ["brown"];
    for (let i = 0; i < summonCount; i++) {
      const summonType = summonPool[Math.floor(Math.random() * summonPool.length)];
      const minion = createEnemy(summonType, p.z + 280, p.z + 700);
      minion.x = clamp(boss.x + rand(-180, 180), 100, WORLD_WIDTH - 100);
      minion.z = boss.z - rand(80, 180);
      game.enemies.push(minion);
    }
    burst(boss.x, boss.z + 30, "#ffe48a", 16, 1.1);
    boss.summonTimer = currentLevel().id === "third" ? 3000 : boss.phase === 3 ? 4300 : 6200;
  }

  if (distance(boss.x, boss.z, p.x, p.z) < 96) {
    damagePlayer("The Guardian Boss overwhelmed your battle craft.");
  }

  if (boss.hp <= 0) {
    startBossDefeatSequence();
    return;
  }

  updateBossHud();
}

function updateProjectiles(dt) {
  const dt60 = dt / 16.6667;

  for (let i = game.bullets.length - 1; i >= 0; i--) {
    const bullet = game.bullets[i];
    bullet.x += bullet.vx * dt60;
    bullet.z += bullet.vz * dt60;
    bullet.life -= 1.2 * dt60;

    let removed = false;

    if (game.boss && !game.boss.defeated && distance(bullet.x, bullet.z, game.boss.x, game.boss.z) < 88) {
      game.boss.hp -= 1;
      burst(bullet.x, bullet.z, "#ff8d8d", 10, 0.9);
      addPopup("-1 HP", "#ff5a5a", game.boss.x, game.boss.z - 10, 18);
      if (game.boss.hp % 5 === 0 || game.boss.hp <= 5) {
        addShake(4);
      }
      updateBossHud();
      game.bullets.splice(i, 1);
      continue;
    }

    for (let j = game.enemies.length - 1; j >= 0 && !removed; j--) {
      const enemy = game.enemies[j];
      if (distance(bullet.x, bullet.z, enemy.x, enemy.z) < enemy.radius + 10) {
        enemy.hp -= 1;
        burst(bullet.x, bullet.z, enemy.variant || ENEMY_TYPES[enemy.type].color, 8, 0.75);
        game.bullets.splice(i, 1);
        removed = true;

        if (enemy.hp <= 0) {
          registerKill(enemy);
          game.enemies.splice(j, 1);
        } else {
          playHitSound();
        }
      }
    }

    if (removed) continue;

    if (
      bullet.life <= 0 ||
      bullet.x < -60 ||
      bullet.x > WORLD_WIDTH + 60 ||
      bullet.z < game.player.z - 200 ||
      bullet.z > game.player.z + VIEW_DEPTH + 400
    ) {
      game.bullets.splice(i, 1);
    }
  }

  for (let i = game.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = game.enemyBullets[i];
    bullet.x += bullet.vx * dt60;
    bullet.z += bullet.vz * dt60;
    bullet.life -= 1.1 * dt60;

    if (distance(bullet.x, bullet.z, game.player.x, game.player.z) < PLAYER_RADIUS + bullet.radius - 4) {
      game.enemyBullets.splice(i, 1);

      if (bullet.effect === "fire") {
        damagePlayer("A fire blast burned the boat.");
      } else if (bullet.effect === "poison") {
        damagePlayer("Snake poison struck the boat.");
      } else if (bullet.effect === "ink") {
        damagePlayer("An octopus ink blast hit the boat.");
      } else if (bullet.effect === "laser") {
        damagePlayer("A space laser struck the boat.");
      } else {
        damagePlayer("You were struck by guardian energy.");
      }
      continue;
    }

    if (
      bullet.life <= 0 ||
      bullet.x < -120 ||
      bullet.x > WORLD_WIDTH + 120 ||
      bullet.z < game.player.z - 160 ||
      bullet.z > game.player.z + VIEW_DEPTH + 220
    ) {
      game.enemyBullets.splice(i, 1);
    }
  }
}

function updateCollectibles(dt) {
  for (const power of game.powerups) power.bob += dt * 0.003;
  for (const ivory of game.ivories) ivory.bob += dt * 0.0024;
  for (const flower of game.flowers) flower.bob += dt * 0.0032;

  for (let i = game.powerups.length - 1; i >= 0; i--) {
    const power = game.powerups[i];
    if (distance(power.x, power.z, game.player.x, game.player.z) < 54) {
      givePower(power.type, power.x, power.z);
      game.powerups.splice(i, 1);
    }
  }

  for (let i = game.ivories.length - 1; i >= 0; i--) {
    const ivory = game.ivories[i];
    if (distance(ivory.x, ivory.z, game.player.x, game.player.z) < 52) {
      awardPoints(3, ivory.x, ivory.z);
      addPopup("IVORY +3", "#fff4dc", ivory.x, ivory.z, 17);
      burst(ivory.x, ivory.z, "#fff6e2", 12, 0.9);
      addFlash("255,244,220", 0.08);
      game.ivories.splice(i, 1);
      playPowerSound();
    }
  }

  for (let i = game.flowers.length - 1; i >= 0; i--) {
    const flower = game.flowers[i];
    if (distance(flower.x, flower.z, game.player.x, game.player.z) < 52) {
      game.player.lives += 1;
      awardPoints(2, flower.x, flower.z);
      addPopup("FLOWER LIFE +1", flower.color, flower.x, flower.z, 18);
      burst(flower.x, flower.z, flower.color, 16, 1);
      addFlash("255,210,210", 0.1);
      game.flowers.splice(i, 1);
      playPowerSound();
    }
  }
}

function updateParticles(dt) {
  const dt60 = dt / 16.6667;
  game.shake = Math.max(0, game.shake - dt * 0.03);
  game.flash = Math.max(0, game.flash - dt * 0.0016);

  for (let i = game.particles.length - 1; i >= 0; i--) {
    const p = game.particles[i];
    p.x += p.vx * dt60;
    p.z += p.vz * dt60;
    p.vx *= 0.98;
    p.vz *= 0.98;

    if (p.kind === "smoke") {
      p.size *= 1.012;
      p.vx *= 0.992;
      p.vz *= 0.992;
    }

    p.life -= 16 * dt60;
    if (p.life <= 0) game.particles.splice(i, 1);
  }

  for (let i = game.popups.length - 1; i >= 0; i--) {
    const pop = game.popups[i];
    pop.z += 0.55 * dt60;
    pop.life -= 16 * dt60;
    if (pop.life <= 0) game.popups.splice(i, 1);
  }
}

function handleWorldCollisions() {
  for (const plant of game.plants) {
    if (Math.abs(plant.z - game.player.z) > 90) continue;
    if (distance(plant.x, plant.z, game.player.x, game.player.z) < plant.radius + PLAYER_RADIUS - 3) {
      damagePlayer("Your boat hit a razor cactus plant.");
      break;
    }
  }

  for (const hazard of game.hazards) {
    const pos = fireCirclePosition(hazard);
    if (Math.abs(pos.z - game.player.z) > 80) continue;
    if (distance(pos.x, pos.z, game.player.x, game.player.z) < hazard.ringRadius + PLAYER_RADIUS - 6) {
      damagePlayer(hazard.color === "red" ? "A red fire circle burned the boat." : "A blue fire circle shocked the boat.");
      break;
    }
  }

  for (const enemy of game.enemies) {
    if (Math.abs(enemy.z - game.player.z) > 100) continue;
    if (distance(enemy.x, enemy.z, game.player.x, game.player.z) < enemy.radius + PLAYER_RADIUS - 4) {
      if (enemy.type === "brown") damagePlayer("A Brown Hunter locked onto you.");
      else if (enemy.type === "crocodile") damagePlayer("You crashed into a fire crocodile.");
      else if (enemy.type === "snake") damagePlayer("You crashed into a poison snake.");
      else if (enemy.type === "turtle") damagePlayer("You slammed into a giant turtle.");
      else if (enemy.type === "octopus") damagePlayer("A giant octopus wrapped around the boat.");
      else if (enemy.type === "dragon") damagePlayer("A sea dragon smashed the boat.");
      else if (enemy.type === "spaceship") damagePlayer("An oceanic spaceship rammed the boat.");
      else if (enemy.type === "spacegiant") damagePlayer("A space giant crushed the boat.");
      else damagePlayer("You collided with an enemy fish.");
      break;
    }
  }
}

function updateGame(dt) {
  if (game.state === "playing") {
    updatePlayer(dt);

    for (const enemy of game.enemies) {
      if (Math.abs(enemy.z - game.player.z) < VIEW_DEPTH + 320) {
        updateEnemy(enemy, dt);
      }
    }

    if (game.hazards.length) updateHazards(dt);
    if (game.boss) updateBoss(dt);

    updateProjectiles(dt);
    updateCollectibles(dt);
    updateParticles(dt);
    handleWorldCollisions();
    updateHud();
    updateBossHud();
  } else if (game.state === "bosssink") {
    updateBossDefeatSequence(dt);
    updateHud();
  } else if (game.state === "sinking") {
    const p = game.player;
    const dt60 = dt / 16.6667;
    p.sinkTimer += dt;
    p.vz *= 0.97;
    p.vx *= 0.96;
    p.z -= 0.5 * dt60;
    updateParticles(dt);

    if (Math.random() < 0.6) {
      burst(p.x + rand(-12, 12), p.z + rand(-8, 8), "#dffcff", 2, 0.45);
    }

    if (p.sinkTimer >= SINK_TIME) {
      game.state = "gameover";
      showEnd(false, game.defeatReason || "Your battle craft sank beneath the mythic ocean.");
    }
  }
}

function worldToScreen(x, z) {
  const p = game.player;
  const centerX = canvas.width * 0.5;
  const boatY = canvas.height * 0.76;
  const dz = z - p.z;
  const zoom = isMobileDevice() ? MOBILE_VIEW_ZOOM : 1;
  const scale = clamp((1.34 - dz / VIEW_DEPTH) * zoom, 0.34, 1.5 * zoom);
  const spread = 0.52 + scale * 0.42;

  return {
    x: centerX + (x - p.x) * spread,
    y: boatY - dz * 0.48 * zoom,
    scale,
    dz
  };
}

function drawBackground(progress) {
  const biomeInfo = biomeBlendInfo(progress);
  const topColor = mixHex(biomeInfo.current.skyTop, biomeInfo.next.skyTop, biomeInfo.blend);
  const bottomColor = mixHex(biomeInfo.current.skyBottom, biomeInfo.next.skyBottom, biomeInfo.blend);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(0.55, bottomColor);
  gradient.addColorStop(1, "#020915");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.2,
    20,
    canvas.width * 0.5,
    canvas.height * 0.25,
    canvas.width * 0.82
  );
  glow.addColorStop(0, biomeInfo.current.fog);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (biomeInfo.blend > 0) {
    const nextGlow = ctx.createRadialGradient(
      canvas.width * 0.68,
      canvas.height * 0.22,
      20,
      canvas.width * 0.68,
      canvas.height * 0.22,
      canvas.width * 0.62
    );
    nextGlow.addColorStop(0, biomeInfo.next.fog.replace("0.12", `${0.18 * biomeInfo.blend}`).replace("0.1", `${0.16 * biomeInfo.blend}`).replace("0.14", `${0.2 * biomeInfo.blend}`));
    nextGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = nextGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (progress >= 10000) {
    const goldGlow = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.25,
      40,
      canvas.width * 0.5,
      canvas.height * 0.25,
      canvas.width * 0.65
    );
    goldGlow.addColorStop(0, "rgba(255, 241, 170, 0.32)");
    goldGlow.addColorStop(0.4, "rgba(255, 205, 92, 0.16)");
    goldGlow.addColorStop(1, "rgba(255, 205, 92, 0)");
    ctx.fillStyle = goldGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)";
    ctx.lineWidth = 2 + i * 0.8;
    ctx.beginPath();
    const yBase = canvas.height * (0.2 + i * 0.13);
    for (let x = -40; x <= canvas.width + 40; x += 24) {
      const wave = Math.sin((x + game.time * 0.06 + i * 90) * 0.02) * (10 + i * 2);
      const shimmer = Math.sin(game.time * 0.0016 + i) * 3;
      const y = yBase + wave + shimmer;
      if (x === -40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 2; i++) {
    ctx.strokeStyle = i === 0 ? `rgba(255,255,255,${0.05 + biomeInfo.blend * 0.04})` : `rgba(255,223,150,${progress >= 10000 ? 0.09 : 0.03})`;
    ctx.lineWidth = 1.4 + i;
    ctx.beginPath();
    const yBase = canvas.height * (0.3 + i * 0.18);
    for (let x = -40; x <= canvas.width + 40; x += 14) {
      const y = yBase + Math.sin((x + game.time * 0.14 + i * 60) * 0.03) * (5 + i * 1.5);
      if (x === -40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (const s of game.sparkles) {
    const alpha = 0.3 + Math.abs(Math.sin(game.time * 0.001 * s.speed + s.phase)) * 0.7;
    ctx.fillStyle = `rgba(255,255,255,${alpha * s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x * canvas.width, s.y * canvas.height, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlants() {
  const visible = game.plants
    .filter((plant) => {
      const dz = plant.z - game.player.z;
      return dz > -120 && dz < VIEW_DEPTH;
    })
    .sort((a, b) => a.z - b.z);

  visible.forEach((plant) => {
    const pos = worldToScreen(plant.x, plant.z);
    if (pos.y > canvas.height + 80 || pos.y < -120) return;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(pos.scale, pos.scale);

    const trunkW = plant.w;
    const trunkH = plant.h;

    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = plant.color;
    roundRectPath(-trunkW / 2, -trunkH, trunkW, trunkH, trunkW * 0.45);
    ctx.fill();

    if (plant.armsLeft) {
      roundRectPath(-trunkW / 2 - trunkW * 1.1, -trunkH * 0.7, trunkW, trunkW * 0.72, trunkW * 0.3);
      ctx.fill();
      roundRectPath(-trunkW / 2 - trunkW * 1.1, -trunkH * 0.7 - trunkH * 0.26, trunkW * 0.62, trunkH * 0.26, trunkW * 0.2);
      ctx.fill();
    }

    if (plant.armsRight) {
      roundRectPath(trunkW / 2, -trunkH * 0.54, trunkW, trunkW * 0.72, trunkW * 0.3);
      ctx.fill();
      roundRectPath(trunkW / 2 + trunkW * 0.38, -trunkH * 0.54 - trunkH * 0.25, trunkW * 0.62, trunkH * 0.25, trunkW * 0.2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    roundRectPath(-trunkW * 0.16, -trunkH + 8, trunkW * 0.18, trunkH * 0.78, trunkW * 0.08);
    ctx.fill();

    ctx.restore();
  });
}

function drawIvories() {
  for (const ivory of game.ivories) {
    const pos = worldToScreen(ivory.x, ivory.z);
    if (pos.dz < -100 || pos.dz > VIEW_DEPTH || pos.y < -50 || pos.y > canvas.height + 50) continue;

    ctx.save();
    ctx.translate(pos.x, pos.y + Math.sin(ivory.bob) * 5);
    ctx.scale(pos.scale, pos.scale);

    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 24);
    glow.addColorStop(0, "rgba(255,255,255,0.9)");
    glow.addColorStop(0.45, "rgba(255,243,220,0.85)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff7ec";

    ctx.beginPath();
    ctx.moveTo(-10, 8);
    ctx.quadraticCurveTo(-18, -10, -4, -20);
    ctx.quadraticCurveTo(-2, -4, -1, 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, 8);
    ctx.quadraticCurveTo(18, -10, 4, -20);
    ctx.quadraticCurveTo(2, -4, 1, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

function drawFlowers() {
  for (const flower of game.flowers) {
    const pos = worldToScreen(flower.x, flower.z);
    if (pos.dz < -100 || pos.dz > VIEW_DEPTH || pos.y < -50 || pos.y > canvas.height + 50) continue;

    ctx.save();
    ctx.translate(pos.x, pos.y + Math.sin(flower.bob) * 5);
    ctx.scale(pos.scale, pos.scale);

    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
    glow.addColorStop(0, "rgba(255,255,255,0.92)");
    glow.addColorStop(0.45, flower.color);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      ctx.fillStyle = flower.color;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 11, Math.sin(a) * 11, 6, 10, a, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#fff2a8";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#5cd57e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(0, 28);
    ctx.stroke();

    ctx.restore();
  }
}

function drawPowerups() {
  for (const power of game.powerups) {
    const pos = worldToScreen(power.x, power.z);
    if (pos.dz < -100 || pos.dz > VIEW_DEPTH || pos.y < -50 || pos.y > canvas.height + 50) continue;

    const def = POWERUPS[power.type];
    const pulse = 1 + Math.sin(power.bob) * 0.08;

    ctx.save();
    ctx.translate(pos.x, pos.y + Math.sin(power.bob) * 6);
    ctx.scale(pos.scale * pulse, pos.scale * pulse);
    ctx.rotate(Math.sin(power.bob * 0.8) * 0.08);

    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
    glow.addColorStop(0, def.sub);
    glow.addColorStop(0.4, def.color);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = def.sub;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = def.color;
    if (power.type === "rapid") {
      ctx.beginPath();
      ctx.moveTo(-9, 6);
      ctx.lineTo(-1, -10);
      ctx.lineTo(6, -2);
      ctx.lineTo(1, -2);
      ctx.lineTo(9, 10);
      ctx.lineTo(0, 2);
      ctx.lineTo(-6, 2);
      ctx.closePath();
      ctx.fill();
    } else if (power.type === "triple") {
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 8, -10);
        ctx.lineTo(i * 8 + 4, 8);
        ctx.lineTo(i * 8 - 4, 8);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawFireCircles() {
  for (const hazard of game.hazards) {
    const basePos = worldToScreen(hazard.x, hazard.z);
    const ringWorld = fireCirclePosition(hazard);
    const ringPos = worldToScreen(ringWorld.x, ringWorld.z);
    if (ringPos.dz < -120 || ringPos.dz > VIEW_DEPTH || ringPos.y < -60 || ringPos.y > canvas.height + 60) continue;

    ctx.save();
    ctx.strokeStyle = "rgba(90,255,180,0.45)";
    ctx.lineWidth = 3 * ringPos.scale;
    ctx.beginPath();
    ctx.moveTo(basePos.x, basePos.y);
    ctx.lineTo(basePos.x, basePos.y - hazard.poleHeight * basePos.scale);
    ctx.stroke();

    ctx.strokeStyle = hazard.color === "red" ? "rgba(255,80,80,0.95)" : "rgba(80,170,255,0.95)";
    ctx.lineWidth = 5 * ringPos.scale;
    ctx.beginPath();
    ctx.arc(ringPos.x, ringPos.y, hazard.ringRadius * ringPos.scale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = hazard.color === "red" ? "rgba(255,200,120,0.8)" : "rgba(200,240,255,0.8)";
    ctx.lineWidth = 2 * ringPos.scale;
    ctx.beginPath();
    ctx.arc(ringPos.x, ringPos.y, (hazard.ringRadius - 8) * ringPos.scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFishLike(enemy) {
  const def = ENEMY_TYPES[enemy.type];
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -110 || pos.dz > VIEW_DEPTH || pos.y < -100 || pos.y > canvas.height + 100) return;

  const angle = Math.atan2(enemy.x - enemy.baseX, enemy.z - enemy.baseZ);
  const swim = Math.sin(game.time * 0.01 + enemy.seed) * 0.12;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);
  ctx.rotate(angle * 0.25 + swim);

  ctx.shadowColor = enemy.type === "golden" ? "rgba(255, 214, 96, 0.45)" : "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = enemy.type === "golden" ? 20 : 12;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = def.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, enemy.radius * 0.8, enemy.radius * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = def.fin;
  ctx.beginPath();
  ctx.moveTo(-enemy.radius * 0.6, 0);
  ctx.lineTo(-enemy.radius * 1.2, -enemy.radius * 0.44);
  ctx.lineTo(-enemy.radius * 1.2, enemy.radius * 0.44);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(enemy.radius * 0.3, -enemy.radius * 0.64);
  ctx.lineTo(enemy.radius * 0.48, -6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.lineTo(enemy.radius * 0.28, enemy.radius * 0.62);
  ctx.lineTo(enemy.radius * 0.52, 8);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.beginPath();
  ctx.ellipse(enemy.radius * 0.15, -enemy.radius * 0.12, enemy.radius * 0.28, enemy.radius * 0.12, -0.1, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.type === "black") {
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-enemy.radius * 0.35, -enemy.radius * 0.2);
    ctx.lineTo(enemy.radius * 0.45, -enemy.radius * 0.2);
    ctx.moveTo(-enemy.radius * 0.25, 0);
    ctx.lineTo(enemy.radius * 0.48, 0);
    ctx.moveTo(-enemy.radius * 0.2, enemy.radius * 0.2);
    ctx.lineTo(enemy.radius * 0.4, enemy.radius * 0.2);
    ctx.stroke();
  }

  ctx.fillStyle = def.eye;
  ctx.beginPath();
  ctx.arc(enemy.radius * 0.4, -enemy.radius * 0.08, enemy.radius * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.arc(enemy.radius * 0.42, -enemy.radius * 0.08, enemy.radius * 0.04, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -enemy.radius - 10);
  }

  ctx.restore();
}

function drawCrocodile(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -110 || pos.dz > VIEW_DEPTH || pos.y < -100 || pos.y > canvas.height + 100) return;

  const jawPulse = 1 + Math.sin(game.time * 0.03 + enemy.seed) * 0.18;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = "#4c7833";
  roundRectPath(-26, -18, 72, 36, 14);
  ctx.fill();

  ctx.fillStyle = "#365321";
  roundRectPath(36, -9, 34, 18, 6);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-32, -16);
  ctx.lineTo(-64, -12);
  ctx.lineTo(-62, 12);
  ctx.lineTo(-28, 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#6a9d49";
  roundRectPath(-10, -12, 24, 10, 5);
  ctx.fill();

  ctx.fillStyle = "#8cbc62";
  ctx.beginPath();
  ctx.moveTo(-60, -4);
  ctx.lineTo(-72, -14 * jawPulse);
  ctx.lineTo(-58, -8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ff9938";
  ctx.beginPath();
  ctx.moveTo(-72, 0);
  ctx.lineTo(-94, -12 * jawPulse);
  ctx.lineTo(-108, 0);
  ctx.lineTo(-94, 12 * jawPulse);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffdd7e";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-48 - i * 8, -8);
    ctx.lineTo(-44 - i * 8, -2);
    ctx.lineTo(-52 - i * 8, -2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-48 - i * 8, 8);
    ctx.lineTo(-44 - i * 8, 2);
    ctx.lineTo(-52 - i * 8, 2);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#ffd37e";
  ctx.beginPath();
  ctx.arc(-36, -7, 4, 0, Math.PI * 2);
  ctx.arc(-36, 7, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0c0c0c";
  ctx.beginPath();
  ctx.arc(-36, -7, 2, 0, Math.PI * 2);
  ctx.arc(-36, 7, 2, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 6, -34);
  }

  ctx.restore();
}

function drawSnake(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -110 || pos.dz > VIEW_DEPTH || pos.y < -100 || pos.y > canvas.height + 100) return;

  const wave = Math.sin(game.time * 0.025 + enemy.seed) * 7;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-30, wave);
  ctx.bezierCurveTo(-10, -18, 4, 18, 18, -4);
  ctx.bezierCurveTo(30, -18, 38, 8, 46, 0);
  ctx.stroke();

  ctx.strokeStyle = "#303030";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-22, wave + 2);
  ctx.lineTo(-4, 0);
  ctx.lineTo(16, -2);
  ctx.stroke();

  ctx.fillStyle = "#1c1c1c";
  ctx.beginPath();
  ctx.moveTo(38, -10);
  ctx.lineTo(54, 0);
  ctx.lineTo(38, 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#7cff7c";
  ctx.beginPath();
  ctx.arc(42, -4, 2.6, 0, Math.PI * 2);
  ctx.arc(42, 4, 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#a90000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(54, 0);
  ctx.lineTo(66, -4);
  ctx.moveTo(54, 0);
  ctx.lineTo(66, 4);
  ctx.stroke();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -24);
  }

  ctx.restore();
}

function drawTurtle(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -110 || pos.dz > VIEW_DEPTH || pos.y < -100 || pos.y > canvas.height + 100) return;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = "#35684c";
  ctx.beginPath();
  ctx.arc(-28, 0, 9, 0, Math.PI * 2);
  ctx.arc(-14, -16, 8, 0, Math.PI * 2);
  ctx.arc(-14, 16, 8, 0, Math.PI * 2);
  ctx.arc(18, -14, 8, 0, Math.PI * 2);
  ctx.arc(18, 14, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3f7d59";
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 23, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#63ba84";
  ctx.beginPath();
  ctx.ellipse(0, 0, 21, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(28,74,44,0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(18, 0);
  ctx.moveTo(0, -12);
  ctx.lineTo(0, 12);
  ctx.moveTo(-12, -8);
  ctx.lineTo(12, 8);
  ctx.moveTo(-12, 8);
  ctx.lineTo(12, -8);
  ctx.stroke();

  ctx.fillStyle = "#5a946d";
  ctx.beginPath();
  ctx.arc(-34, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e9ffef";
  ctx.beginPath();
  ctx.arc(-36, -2, 2.2, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -30);
  }

  ctx.restore();
}

function drawOctopus(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -110 || pos.dz > VIEW_DEPTH || pos.y < -120 || pos.y > canvas.height + 120) return;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  const bodyColor = enemy.variant || "#d97cff";
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, -4, 24, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 4;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 6, 10);
    ctx.bezierCurveTo(i * 8, 18, i * 10, 24, i * 4, 30);
    ctx.stroke();
  }

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-8, -8, 5, 0, Math.PI * 2);
  ctx.arc(8, -8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-8, -8, 2, 0, Math.PI * 2);
  ctx.arc(8, -8, 2, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -36);
  }

  ctx.restore();
}

function drawDragon(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -120 || pos.dz > VIEW_DEPTH || pos.y < -120 || pos.y > canvas.height + 120) return;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  const c = enemy.variant || "#ff874d";
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-10, -6);
  ctx.lineTo(10, -36);
  ctx.lineTo(4, -6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-8, 6);
  ctx.lineTo(12, 34);
  ctx.lineTo(4, 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffc27d";
  ctx.beginPath();
  ctx.moveTo(20, -8);
  ctx.lineTo(56, -18);
  ctx.lineTo(42, -2);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(20, 8);
  ctx.lineTo(56, 18);
  ctx.lineTo(42, 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff7ce";
  ctx.beginPath();
  ctx.arc(-18, -4, 4, 0, Math.PI * 2);
  ctx.arc(-18, 4, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-18, -4, 2, 0, Math.PI * 2);
  ctx.arc(-18, 4, 2, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -34);
  }

  ctx.restore();
}

function drawSpaceship(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -120 || pos.dz > VIEW_DEPTH || pos.y < -100 || pos.y > canvas.height + 100) return;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  const c = enemy.variant || "#89e5ff";
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.beginPath();
  ctx.ellipse(0, -8, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-16, 10);
  ctx.lineTo(-24, 18);
  ctx.moveTo(16, 10);
  ctx.lineTo(24, 18);
  ctx.stroke();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -24);
  }

  ctx.restore();
}

function drawSpaceGiant(enemy) {
  const pos = worldToScreen(enemy.x, enemy.z);
  if (pos.dz < -120 || pos.dz > VIEW_DEPTH || pos.y < -110 || pos.y > canvas.height + 110) return;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pos.scale, pos.scale);

  const c = enemy.variant || "#f59cff";
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(0, 0, 40, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(0, -4, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = c;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-28, 16);
  ctx.lineTo(-42, 34);
  ctx.moveTo(28, 16);
  ctx.lineTo(42, 34);
  ctx.moveTo(-14, 20);
  ctx.lineTo(-18, 42);
  ctx.moveTo(14, 20);
  ctx.lineTo(18, 42);
  ctx.stroke();

  if (enemy.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(enemy.hp, 0, -34);
  }

  ctx.restore();
}

function drawEnemy(enemy) {
  if (enemy.type === "crocodile") drawCrocodile(enemy);
  else if (enemy.type === "snake") drawSnake(enemy);
  else if (enemy.type === "turtle") drawTurtle(enemy);
  else if (enemy.type === "octopus") drawOctopus(enemy);
  else if (enemy.type === "dragon") drawDragon(enemy);
  else if (enemy.type === "spaceship") drawSpaceship(enemy);
  else if (enemy.type === "spacegiant") drawSpaceGiant(enemy);
  else drawFishLike(enemy);
}

function drawBoss() {
  if (!game.boss) return;
  const boss = game.boss;
  const pos = worldToScreen(boss.x, boss.z);
  if (pos.y < -180 || pos.y > canvas.height + 220) return;

  const wing = 150 + Math.sin(boss.wingPulse) * 10;
  const body = 74;
  const pulse = 1 + Math.sin(game.time * 0.01) * 0.04;
  const defeatProgress = boss.defeated ? clamp(boss.sinkTimer / BOSS_SINK_TIME, 0, 1) : 0;

  ctx.save();
  ctx.translate(pos.x, pos.y + (boss.renderOffsetY || 0));
  ctx.rotate((boss.defeated ? boss.sinkRotation : 0) + Math.sin(game.time * 0.003) * 0.03);
  ctx.globalAlpha = boss.defeated ? boss.fade : 1;
  ctx.scale(
    pos.scale * 1.5 * pulse * (1 - defeatProgress * 0.22),
    pos.scale * 1.5 * pulse * (1 - defeatProgress * 0.22)
  );

  const glow = ctx.createRadialGradient(0, 0, 20, 0, 0, 160);
  glow.addColorStop(0, boss.defeated ? "rgba(255, 120, 120, 0.34)" : currentLevel().id === "third" ? "rgba(255, 120, 120, 0.35)" : "rgba(255, 245, 180, 0.35)");
  glow.addColorStop(0.6, currentLevel().id === "third" ? "rgba(255, 90, 90, 0.24)" : boss.phase === 3 ? "rgba(255, 152, 90, 0.22)" : "rgba(255, 210, 80, 0.18)");
  glow.addColorStop(1, "rgba(255, 210, 80, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.fill();

  if (boss.entryTimer > 0 && !boss.defeated) {
    ctx.globalAlpha = boss.entryTimer / 1500;
    ctx.strokeStyle = currentLevel().id === "third" ? "rgba(255,120,120,0.7)" : "rgba(255,248,188,0.7)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 110 + (1 - boss.entryTimer / 1500) * 80, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = boss.defeated ? boss.fade : 1;
  }

  ctx.fillStyle = boss.defeated ? "#ff9e9e" : currentLevel().id === "third" ? "#ff7f7f" : "#ffdb6d";
  ctx.beginPath();
  ctx.moveTo(-wing, -10);
  ctx.quadraticCurveTo(-30, -92, 0, -55);
  ctx.quadraticCurveTo(30, -92, wing, -10);
  ctx.quadraticCurveTo(80, 16, 0, 62);
  ctx.quadraticCurveTo(-80, 16, -wing, -10);
  ctx.fill();

  ctx.fillStyle = boss.defeated ? "#a82222" : currentLevel().id === "third" ? "#a01313" : "#c88a00";
  ctx.beginPath();
  ctx.ellipse(0, 4, body, 52, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, -8, 56, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff7cc";
  ctx.beginPath();
  ctx.arc(-24, -6, 8, 0, Math.PI * 2);
  ctx.arc(24, -6, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1b1200";
  ctx.beginPath();
  ctx.arc(-24, -6, 4, 0, Math.PI * 2);
  ctx.arc(24, -6, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = boss.defeated ? "rgba(255, 90, 90, 0.9)" : currentLevel().id === "third" ? "rgba(255, 115, 115, 0.9)" : boss.phase === 3 ? "rgba(255, 194, 120, 0.85)" : "rgba(255, 244, 210, 0.7)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-110, 4);
  ctx.quadraticCurveTo(0, 36, 110, 4);
  ctx.stroke();

  if (boss.defeated) {
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 68, 40 + defeatProgress * 46, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBullets() {
  for (const bullet of game.bullets) {
    const pos = worldToScreen(bullet.x, bullet.z);
    if (pos.y < -60 || pos.y > canvas.height + 60) continue;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(pos.scale, pos.scale);

    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 22);
    glow.addColorStop(0, "rgba(255,255,240,0.95)");
    glow.addColorStop(0.38, "rgba(255,185,65,0.95)");
    glow.addColorStop(1, "rgba(255,100,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffd572";
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  for (const bullet of game.enemyBullets) {
    const pos = worldToScreen(bullet.x, bullet.z);
    if (pos.y < -60 || pos.y > canvas.height + 60) continue;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(pos.scale, pos.scale);

    if (bullet.effect === "fire") {
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 32);
      glow.addColorStop(0, "rgba(255,245,205,0.98)");
      glow.addColorStop(0.34, bullet.color);
      glow.addColorStop(0.72, "rgba(255,80,20,0.65)");
      glow.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();
    } else if (bullet.effect === "poison") {
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
      glow.addColorStop(0, "rgba(120,120,120,0.85)");
      glow.addColorStop(0.32, "rgba(45,45,45,0.92)");
      glow.addColorStop(0.72, "rgba(0,0,0,0.55)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
    } else if (bullet.effect === "ink") {
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
      glow.addColorStop(0, "rgba(255,255,255,0.8)");
      glow.addColorStop(0.4, bullet.color);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
    } else if (bullet.effect === "laser") {
      ctx.strokeStyle = bullet.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
      glow.addColorStop(0, "rgba(255,246,220,0.98)");
      glow.addColorStop(0.45, bullet.color);
      glow.addColorStop(1, "rgba(255,190,90,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawParticles() {
  for (const p of game.particles) {
    const pos = worldToScreen(p.x, p.z);
    if (pos.y < -40 || pos.y > canvas.height + 40) continue;

    if (p.kind === "smoke") {
      const alpha = clamp(p.life / 820, 0, 1) * 0.55;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * pos.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      const alpha = clamp(p.life / 900, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * pos.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

function drawPopups() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const pop of game.popups) {
    const pos = worldToScreen(pop.x, pop.z);
    if (pos.y < -40 || pos.y > canvas.height + 40) continue;

    const alpha = clamp(pop.life / 1000, 0, 1);
    const scaleUp = 1 + (1 - alpha) * 0.22;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = pop.color;
    ctx.font = `900 ${Math.max(14, pop.size * pos.scale * scaleUp)}px Trebuchet MS`;
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 12;
    ctx.fillText(pop.text, pos.x, pos.y - (1 - alpha) * pop.rise);
  }

  ctx.restore();
}

function drawBoat() {
  if (!game.player) return;
  const p = game.player;
  const bob = Math.sin(game.time * 0.0065) * 4;
  const centerX = canvas.width * 0.5;
  const centerY = canvas.height * 0.76 + bob;
  const boatRoll = p.dirX * 0.18;
  const boatPitch = -p.dirZ * 0.08;
  const blink = p.invuln > 0 && Math.floor(game.time / 90) % 2 === 0;
  const sinking = game.state === "sinking";
  const sinkProgress = sinking ? clamp(p.sinkTimer / SINK_TIME, 0, 1) : 0;

  ctx.save();
  ctx.translate(centerX, centerY + sinkProgress * 120);
  ctx.rotate(boatRoll + boatPitch + sinkProgress * 0.6);
  if (blink) ctx.globalAlpha = 0.38;

  if (p.power.shield > 0 || p.shieldFlash > 0) {
    const shieldAlpha = p.power.shield > 0 ? 0.55 : clamp(p.shieldFlash / 420, 0, 1);
    ctx.strokeStyle = `rgba(115, 249, 255, ${shieldAlpha})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -4, 36 + Math.sin(game.time * 0.02) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  const engineGlow = ctx.createRadialGradient(0, 38, 2, 0, 38, 24);
  engineGlow.addColorStop(0, "rgba(255,205,110,0.7)");
  engineGlow.addColorStop(1, "rgba(255,205,110,0)");
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(0, 38, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = p.boat.body;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(26, 24);
  ctx.lineTo(16, 34);
  ctx.lineTo(-16, 34);
  ctx.lineTo(-26, 24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = p.boat.accent;
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.lineTo(10, 8);
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.moveTo(-6, -26);
  ctx.lineTo(0, 0);
  ctx.lineTo(-2, 6);
  ctx.lineTo(-10, -16);
  ctx.closePath();
  ctx.fill();

  const flamePulse = 1 + Math.sin(game.time * 0.035) * 0.12;
  ctx.fillStyle = p.boat.flame;
  ctx.beginPath();
  ctx.moveTo(-8, 32);
  ctx.lineTo(0, 48 * flamePulse);
  ctx.lineTo(8, 32);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  const wakeColor = currentBiome(p.z).glow;
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${0.15 - i * 0.02})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 18 - i * 10, centerY + 28 + i * 8);
    ctx.quadraticCurveTo(centerX - 38 - i * 14, centerY + 62 + i * 12, centerX - 52 - i * 18, centerY + 86 + i * 14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 18 + i * 10, centerY + 28 + i * 8);
    ctx.quadraticCurveTo(centerX + 38 + i * 14, centerY + 62 + i * 12, centerX + 52 + i * 18, centerY + 86 + i * 14);
    ctx.stroke();
  }

  ctx.fillStyle = wakeColor;
  ctx.globalAlpha = 0.16;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 54, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawWorld() {
  const progress = game.player ? game.player.z : (game.time * 0.1) % GOAL_DISTANCE;
  drawBackground(progress);

  if (!game.player) return;

  const shakeX = game.shake > 0 ? rand(-game.shake, game.shake) : 0;
  const shakeY = game.shake > 0 ? rand(-game.shake * 0.5, game.shake * 0.5) : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawPlants();
  drawFireCircles();
  drawIvories();
  drawFlowers();
  drawPowerups();

  const visibleEnemies = game.enemies
    .filter((enemy) => {
      const dz = enemy.z - game.player.z;
      return dz > -140 && dz < VIEW_DEPTH + 120;
    })
    .sort((a, b) => a.z - b.z);

  visibleEnemies.forEach(drawEnemy);

  drawBoss();
  drawBullets();
  drawParticles();
  drawBoat();
  drawPopups();

  if (game.state === "sinking") {
    const alpha = clamp(game.player.sinkTimer / SINK_TIME, 0, 0.55);
    ctx.fillStyle = `rgba(2, 8, 18, ${alpha})`;
    ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);
  }

  if (game.state === "bosssink" && game.boss) {
    const overlayAlpha = clamp(game.boss.sinkTimer / BOSS_SINK_TIME, 0, 0.28);
    ctx.fillStyle = `rgba(55, 0, 0, ${overlayAlpha})`;
    ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);
  }

  ctx.restore();

  if (game.flash > 0) {
    ctx.fillStyle = `rgba(${game.flashColor}, ${game.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const vignette = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.45,
    canvas.width * 0.08,
    canvas.width * 0.5,
    canvas.height * 0.45,
    canvas.width * 0.82
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function menuBackdrop() {
  drawBackground((game.time * 0.12) % GOAL_DISTANCE);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font = "900 24px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("MYTHIC NEON OCEAN", canvas.width / 2, canvas.height * 0.2);
  ctx.restore();
}

function loop(timestamp) {
  if (!game.lastTime) game.lastTime = timestamp;
  const dt = Math.min(34, timestamp - game.lastTime);
  game.lastTime = timestamp;
  game.time += dt;

  if (game.state === "playing" || game.state === "sinking" || game.state === "bosssink") {
    updateGame(dt);
    drawWorld();
  } else {
    menuBackdrop();
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function bindHoldButton(id, key) {
  const el = document.getElementById(id);
  if (!el) return;

  const down = (e) => {
    e.preventDefault();
    game.input[key] = true;
  };

  const up = (e) => {
    e.preventDefault();
    game.input[key] = false;
  };

  el.addEventListener("pointerdown", down);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointerleave", up);
  el.addEventListener("pointercancel", up);
}

function bindFireButton(el) {
  if (!el) return;

  const down = (e) => {
    e.preventDefault();
    game.input.fire = true;
    if (game.state === "playing") fireBullet();
  };

  const up = (e) => {
    e.preventDefault();
    game.input.fire = false;
  };

  el.addEventListener("pointerdown", down);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointerleave", up);
  el.addEventListener("pointercancel", up);
}

bindHoldButton("mob-up", "up");
bindHoldButton("mob-down", "down");
bindHoldButton("mob-left", "left");
bindHoldButton("mob-right", "right");
bindFireButton(fireBtnMobile);
bindFireButton(fireBtnDesktop);

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === "arrowup" || key === "w") game.input.up = true;
  if (key === "arrowdown" || key === "s") game.input.down = true;
  if (key === "arrowleft" || key === "a") game.input.left = true;
  if (key === "arrowright" || key === "d") game.input.right = true;

  if (key === " " || key === "spacebar") {
    e.preventDefault();
    game.input.fire = true;
    if (game.state === "playing" && !e.repeat) fireBullet();
  }

  if (key === "escape") {
    if (game.state === "playing" || game.state === "paused") {
      togglePause();
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();

  if (key === "arrowup" || key === "w") game.input.up = false;
  if (key === "arrowdown" || key === "s") game.input.down = false;
  if (key === "arrowleft" || key === "a") game.input.left = false;
  if (key === "arrowright" || key === "d") game.input.right = false;

  if (key === " " || key === "spacebar") {
    game.input.fire = false;
  }
});

startBtn.addEventListener("click", () => {
  startGame();
});

soundBtn.addEventListener("click", () => {
  game.muted = !game.muted;
  localStorage.setItem(STORAGE_KEYS.soundMuted, game.muted ? "1" : "0");
  updateSoundButton();

  if (game.muted) {
    stopGameAudio();
  } else if (game.state === "playing") {
    ensureAudio();
    startMusic();
    startEngine();
  }
});

pauseBtn.addEventListener("click", () => { if (game.state === "playing" || game.state === "paused") togglePause(); });

pauseResumeBtn.addEventListener("click", () => {
  if (game.state === "paused") togglePause();
});

pauseRestartBtn.addEventListener("click", () => { startGame(); });

pauseMenuBtn.addEventListener("click", () => {
  returnToMenu();
});

endRestartBtn.addEventListener("click", () => {

  const callbacks = {
    adFinished: () => startGame(),
    adError: () => startGame(),
    adStarted: () => console.log("Start midgame ad"),
  };

  window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
  
// ✅ Fallback (IMPORTANT)
  setTimeout(() => {
    if (!done) startGame();
  }, 1500);
});

endMenuBtn.addEventListener("click", () => {

  const callbacks = {
    adFinished: () => returnToMenu(),   // go to menu AFTER ad
    adError: () => returnToMenu(),      // fallback if ad fails
    adStarted: () => console.log("Start midgame ad"),
  };

  window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
  
  // ✅ Fallback
  setTimeout(() => {
    if (!done) returnToMenu();
  }, 1500);
  
});

boatStandardBtn.addEventListener("click", () => {
  game.selectedLevel = "standard";
  setMenuBoatCards();
});

boatGoldenBtn.addEventListener("click", () => {
  if (!game.unlocks.golden) return;
  game.selectedLevel = "golden";
  setMenuBoatCards();
});

boatThirdBtn.addEventListener("click", () => {
  if (!game.unlocks.third) return;
  game.selectedLevel = "third";
  setMenuBoatCards();
});

window.addEventListener("resize", () => {
  resizeCanvas();
  updateControlVisibility();
});

syncUnlocks();
updateSoundButton();
setMenuBoatCards();
showOnlyScreen("menu");
updateControlVisibility();
