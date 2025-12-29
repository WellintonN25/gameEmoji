// --- CORE DATA ---
const formatNum = (n) =>
  n >= 1e6
    ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k"
    : n;
const el = (id) => document.getElementById(id);
let uidCount = 2,
  runeIdCount = 1,
  currentUser = null,
  pendingAction = null,
  walletCache = { mana: 0, gems: 0 };

const MAX_LVL = { 1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 50 };
const EXPL_REGIONS = [
  { id: 1, name: "Floresta", icon: "🌲", color: "#10b981" },
  { id: 2, name: "Vulcão", icon: "🌋", color: "#ef4444" },
  { id: 3, name: "Ruínas", icon: "🏛️", color: "#fbbf24" },
  { id: 4, name: "Pico", icon: "⚡", color: "#a855f7" },
];
const SHOP_DB = [
  { id: "pot", name: "Poção XP", cost: 100, currency: "mana", icon: "🧪" },
  {
    id: "pot_pack",
    name: "Pack Poções (10)",
    cost: 900,
    currency: "mana",
    icon: "⚗️",
  },
  { id: "tix", name: "Ticket", cost: 1000, currency: "mana", icon: "🎫" },
  { id: "rare", name: "Ticket Raro", cost: 100, currency: "gems", icon: "🎟️" },
  { id: "grimoire", name: "Grimório", cost: 500, currency: "gems", icon: "📚" },
  {
    id: "xpboost",
    name: "Booster (7m)",
    cost: 50,
    currency: "gems",
    icon: "🚀",
  },
  {
    id: "tix_pack",
    name: "Pack Comum (11)",
    cost: 10000,
    currency: "mana",
    icon: "📦",
  },
  {
    id: "rare_pack",
    name: "Pack Raro (11)",
    cost: 1000,
    currency: "gems",
    icon: "👑",
  },
  {
    id: "xpboost_15",
    name: "Booster (15m)",
    cost: 90,
    currency: "gems",
    icon: "🚀",
  },
  {
    id: "food_5",
    name: "Rainbowmon",
    cost: 500000,
    currency: "mana",
    icon: "🥚",
  },
];
const MISSIONS_DB = [
  {
    id: "bat_3",
    desc: "Batalhar 3 Vezes",
    target: 3,
    r: { mana: 50000, gems: 10 },
    type: "win",
  },
  {
    id: "bat_10",
    desc: "Batalhar 10 Vezes",
    target: 10,
    r: { mana: 100000, gems: 30 },
    type: "win",
  },
  {
    id: "sum_1",
    desc: "Invocar 1 Monstro",
    target: 1,
    r: { mana: 30000, gems: 0 },
    type: "sum",
  },
  {
    id: "pup_3",
    desc: "Upar Nível 3x",
    target: 3,
    r: { mana: 40000, gems: 0 },
    type: "pup",
  },
  {
    id: "rup_3",
    desc: "Upar Runa 3x",
    target: 3,
    r: { mana: 60000, gems: 0 },
    type: "rup",
  },
  {
    id: "dun_5",
    desc: "Masmorra 5 Vezes",
    target: 5,
    r: { mana: 0, gems: 50 },
    type: "dun_win",
  },
  {
    id: "login",
    desc: "Login Diário",
    target: 1,
    r: { mana: 50000, gems: 20 },
    type: "login",
  },
];

/*
================================================================================
>>> GUIA PARA ADICIONAR IMAGENS CUSTOMIZADAS <<<
1. Encontre a variável "const DB = [...]" abaixo.
2. No campo "img", coloque o link direto de uma imagem PNG com fundo transparente.
   Exemplo: img: 'https://i.imgur.com/seumonstro.png'
3. Se o campo "img" estiver preenchido, o jogo usa a imagem. Se estiver vazio (''), usa o emoji.
================================================================================
*/
const DB = [
  {
    id: 101,
    nat: 1,
    n: "Slime",
    type: "Água",
    img: "",
    visual: "💧",
    s: [
      { n: "Hit", m: 1.2, cd: 0, ty: "atk" },
      { n: "Gosma", m: 1.1, cd: 2, ty: "debuff_spd" },
    ],
    hp: 50,
    atk: 10,
  },
  {
    id: 102,
    nat: 1,
    n: "Wisp",
    type: "Fogo",
    img: "",
    visual: "🔥",
    s: [
      { n: "Queimar", m: 1.2, cd: 0, ty: "atk" },
      { n: "Incêndio", m: 1.3, cd: 3, ty: "aoe" },
    ],
    hp: 45,
    atk: 12,
  },
  {
    id: 201,
    nat: 2,
    n: "Goblin",
    type: "Terra",
    img: "",
    visual: "👺",
    s: [
      { n: "Lança", m: 1.3, cd: 0, ty: "atk" },
      { n: "Fúria", m: 0, cd: 3, ty: "buff_atk" },
    ],
    hp: 80,
    atk: 18,
  },
  {
    id: 304,
    nat: 3,
    n: "Fairy",
    type: "Luz",
    img: "",
    visual: "🧚",
    s: [
      { n: "Raio", m: 1.3, cd: 0, ty: "atk" },
      { n: "Cura", m: 2.5, cd: 3, ty: "heal" },
    ],
    hp: 90,
    atk: 15,
  },
  {
    id: 503,
    nat: 3,
    n: "Dríade",
    type: "Vento",
    img: "",
    visual: "🌿",
    s: [
      { n: "Espinhos", m: 1.2, cd: 0, ty: "atk" },
      { n: "Vento Suave", m: 2.0, cd: 3, ty: "heal_aoe" },
    ],
    hp: 110,
    atk: 18,
  },
  {
    id: 509,
    nat: 3,
    n: "Ent Ancião",
    type: "Terra",
    img: "",
    visual: "🌳",
    s: [
      { n: "Esmagar", m: 1.2, cd: 0, ty: "atk" },
      { n: "Raízes", m: 1.3, cd: 3, ty: "aoe" },
    ],
    hp: 140,
    atk: 15,
  },
  {
    id: 505,
    nat: 3,
    n: "Sereia",
    type: "Água",
    img: "",
    visual: "🧜‍♀️",
    s: [
      { n: "Bolha", m: 1.2, cd: 0, ty: "atk" },
      { n: "Canto", m: 1.4, cd: 3, ty: "aoe" },
    ],
    hp: 100,
    atk: 18,
  },
  {
    id: 401,
    nat: 4,
    n: "Aelyra",
    type: "Fogo",
    img: "src/Aelyra.png",
    visual: "🦅",
    s: [
      { n: "Corte", m: 1.4, cd: 0, ty: "atk" },
      { n: "Explosao", m: 1.6, cd: 3, ty: "aoe" },
      { n: "Grito", m: 0, cd: 4, ty: "buff_atk" },
    ],
    hp: 150,
    atk: 25,
  },
  {
    id: 504,
    nat: 4,
    n: "Ninja",
    type: "Vento",
    img: "",
    visual: "🥷",
    s: [
      { n: "Shuriken", m: 1.4, cd: 0, ty: "atk" },
      { n: "Corte Sônico", m: 1.7, cd: 3, ty: "aoe" },
      { n: "Executar", m: 2.2, cd: 5, ty: "atk" },
    ],
    hp: 120,
    atk: 32,
  },
  {
    id: 506,
    nat: 4,
    n: "Mago Ígneo",
    type: "Fogo",
    img: "",
    visual: "🧙‍♂️",
    s: [
      { n: "Bola de Fogo", m: 1.5, cd: 0, ty: "atk" },
      { n: "Explosão", m: 1.8, cd: 3, ty: "aoe" },
      { n: "Meteoro", m: 2.0, cd: 5, ty: "aoe" },
    ],
    hp: 110,
    atk: 30,
  },
  {
    id: 510,
    nat: 4,
    n: "Paladino",
    type: "Luz",
    img: "",
    visual: "🛡️",
    s: [
      { n: "Golpe Divino", m: 1.3, cd: 0, ty: "atk" },
      { n: "Proteção", m: 0, cd: 3, ty: "buff_def" },
      { n: "Cura Maior", m: 3.0, cd: 4, ty: "heal" },
    ],
    hp: 160,
    atk: 20,
  },
  {
    id: 503,
    nat: 4,
    n: "Lobisomem",
    type: "Trevas",
    img: "",
    visual: "🐺",
    s: [
      { n: "Mordida", m: 1.4, cd: 0, ty: "atk" },
      { n: "Uivo", m: 1.6, cd: 3, ty: "aoe" },
      { n: "Fúria", m: 0, cd: 4, ty: "turn" },
    ],
    hp: 130,
    atk: 25,
  },
  {
    id: 511,
    nat: 5,
    n: "Lorde Vampiro",
    type: "Fogo",
    img: "",
    visual: "🧛",
    s: [
      { n: "Drenar", m: 1.5, cd: 0, ty: "atk" },
      { n: "Morcegos", m: 1.8, cd: 3, ty: "aoe" },
      { n: "Imortalidade", m: 0, cd: 5, ty: "turn" },
    ],
    hp: 160,
    atk: 35,
  },
  {
    id: 507,
    nat: 5,
    n: "Arcanjo",
    type: "Luz",
    img: "",
    visual: "👼",
    s: [
      { n: "Espada Sagrada", m: 1.5, cd: 0, ty: "atk" },
      { n: "Julgamento", m: 1.8, cd: 3, ty: "aoe" },
      { n: "Ressurreição", m: 0, cd: 6, ty: "heal_aoe" },
    ],
    hp: 170,
    atk: 28,
  },
  {
    id: 508,
    nat: 5,
    n: "Poseidon",
    type: "Água",
    img: "",
    visual: "🔱",
    s: [
      { n: "Tridente", m: 1.5, cd: 0, ty: "atk" },
      { n: "Tsunami", m: 1.8, cd: 3, ty: "aoe" },
      { n: "Maremoto", m: 2.0, cd: 5, ty: "aoe" },
    ],
    hp: 180,
    atk: 26,
  },
  {
    id: 990,
    nat: 5,
    n: "Rainbowmon",
    type: "Luz",
    img: "",
    visual: "🥚",
    s: [{ n: "-", m: 0, cd: 0, ty: "atk" }],
    hp: 100,
    atk: 10,
  },
  {
    id: 601,
    nat: 5,
    n: "Fênix",
    type: "Luz",
    img: "src/Dhorak.png",
    visual: "🐦‍🔥",
    s: [
      { n: "Energia", m: 1.3, cd: 0, ty: "aoe" },
      { n: "Renascer", m: 2.0, cd: 4, ty: "heal" },
      { n: "Supernova", m: 2.5, cd: 5, ty: "aoe" },
    ],
    hp: 170,
    atk: 40,
  },
  {
    id: 602,
    nat: 5,
    n: "Valeor",
    type: "Água",
    img: "src/Valeor.png",
    visual: "🦑",
    s: [
      { n: "Geada", m: 1.2, cd: 0, ty: "atk" },
      { n: "Granizo", m: 1.8, cd: 3, ty: "aoe" },
      { n: "Neblina", m: 1, cd: 3, ty: "debuff" },
    ],
    hp: 200,
    atk: 29,
  },
  {
    id: 603,
    nat: 4,
    n: "Teryn",
    type: "Vento",
    img: "src/Teryn.png",
    visual: "🦅",
    s: [
      { n: "Corte", m: 1.3, cd: 0, ty: "atk" },
      { n: "Ventania", m: 1.7, cd: 2, ty: "aoe" },
      { n: "Investida", m: 2.0, cd: 3, ty: "atk" },
    ],
    hp: 150,
    atk: 28,
  },
  {
    id: 604,
    nat: 4,
    n: "Kael",
    type: "Água",
    img: "src/Kael.png",
    visual: "❄️",
    s: [
      { n: "Tiro", m: 1.4, cd: 0, ty: "atk" },
      { n: "Bombardear", m: 1.4, cd: 2, ty: "stun" },
      { n: "Granada", m: 2.0, cd: 4, ty: "aoe" },
    ],
    hp: 180,
    atk: 26,
  },
  {
    id: 605,
    nat: 4,
    n: "Cérbero",
    type: "Fogo",
    img: "",
    visual: "🐕",
    s: [
      { n: "Mordida Tripla", m: 1.4, cd: 0, ty: "atk" },
      { n: "Uivo Infernal", m: 1.5, cd: 3, ty: "aoe" },
      { n: "Guardião", m: 0, cd: 4, ty: "buff_def" },
    ],
    hp: 150,
    atk: 32,
  },
  {
    id: 606,
    nat: 4,
    n: "Kaelthar",
    type: "Terra",
    img: "src/Kaelthar.png",
    visual: "🐍",
    s: [
      { n: "Esmagar", m: 1.2, cd: 0, ty: "atk" },
      { n: "Olhar Pétreo", m: 1.1, cd: 3, ty: "stun" },
      { n: "Veneno", m: 1.7, cd: 3, ty: "poison" },
    ],
    hp: 170,
    atk: 29,
  },
  {
    id: 607,
    nat: 3,
    n: "Esqueleto",
    type: "Trevas",
    img: "",
    visual: "💀",
    s: [
      { n: "Osso", m: 1.1, cd: 0, ty: "atk" },
      { n: "Susto", m: 1.3, cd: 3, ty: "debuff" },
    ],
    hp: 90,
    atk: 20,
  },
  {
    id: 608,
    nat: 4,
    n: "Lysara",
    type: "Trevas",
    img: "src/Lysara.png",
    visual: "👻",
    s: [
      { n: "Grito", m: 1.5, cd: 0, ty: "aoe" },
      { n: "Maldição", m: 1.5, cd: 3, ty: "debuff" },
      { n: "Lamento", m: 2.0, cd: 5, ty: "atk" },
    ],
    hp: 150,
    atk: 35,
  },
  {
    id: 609,
    nat: 4,
    n: "Brann",
    type: "Fogo",
    img: "src/Brann.png",
    visual: "👹",
    s: [
      { n: "Corte Pesado", m: 1.8, cd: 0, ty: "atk" },
      { n: "Corte Duplo", m: 2.0, cd: 3, ty: "atk" },
      { n: "Honra", m: 0, cd: 4, ty: "buff_atk" },
    ],
    hp: 150,
    atk: 38,
  },
  {
    id: 610,
    nat: 5,
    n: "Ravok",
    type: "Vento",
    img: "src/Ravok.png",
    visual: "🦌",
    s: [
      { n: "Bastão", m: 1.5, cd: 0, ty: "atk" },
      { n: "Raízes", m: 1.5, cd: 3, ty: "stun" },
      { n: "Cura da Natureza", m: 2.5, cd: 4, ty: "heal_aoe" },
    ],
    hp: 170,
    atk: 30,
  },
  {
    id: 611,
    nat: 4,
    n: "Neriah",
    type: "Agua",
    img: "src/Neriah.png",
    visual: "🧝‍♀️",
    s: [
      { n: "Bolhas", m: 1.6, cd: 0, ty: "atk" },
      { n: "Cura", m: 2.0, cd: 2, ty: "heal" },
      { n: "Proteção", m: 0, cd: 4, ty: "buff_def" },
    ],
    hp: 150,
    atk: 28,
  },
  {
    id: 612,
    nat: 3,
    n: "Minotauro",
    type: "Terra",
    img: "",
    visual: "🐂",
    s: [
      { n: "Machadada", m: 1.3, cd: 0, ty: "atk" },
      { n: "Investida", m: 1.5, cd: 3, ty: "stun" },
    ],
    hp: 160,
    atk: 20,
  },
  {
    id: 613,
    nat: 3,
    n: "Harpia",
    type: "Vento",
    img: "",
    visual: "🦇",
    s: [
      { n: "Garras", m: 1.2, cd: 0, ty: "atk" },
      { n: "Voo Rasante", m: 1.4, cd: 3, ty: "aoe" },
    ],
    hp: 100,
    atk: 25,
  },
  {
    id: 614,
    nat: 5,
    n: "Lioren",
    type: "Luz",
    img: "src/Lioren.png",
    visual: "🗡️",
    s: [
      { n: "Lança Sagrada", m: 1.6, cd: 0, ty: "atk" },
      { n: "Julgamento", m: 1.9, cd: 3, ty: "aoe" },
      { n: "Imortal", m: 0.8, cd: 4, ty: "buff_def" },
    ],
    hp: 190,
    atk: 38,
  },
];

const BOSS_DB = {
  golem: {
    id: 901,
    nat: 6,
    n: "Golem Ancestral",
    type: "Terra",
    img: "",
    visual: "🗿",
    s: [
      { n: "Esmagar", m: 1.5, cd: 0, ty: "atk" },
      { n: "Terremoto", m: 2.5, cd: 4, ty: "aoe" },
    ],
    hp: 5000,
    atk: 100,
  },
  dragon: {
    id: 902,
    nat: 6,
    n: "Dragão do Caos",
    type: "Fogo",
    img: "",
    visual: "🐲",
    s: [
      { n: "Baforada", m: 1.5, cd: 0, ty: "atk" },
      { n: "Apocalipse", m: 3.0, cd: 5, ty: "aoe" },
    ],
    hp: 4000,
    atk: 150,
  },
};

// DEFAULT STATE
const DEFAULT_STATE = {
  mana: 2000,
  gems: 50,
  pot: 5,
  tix: 0,
  rare_tix: 10,
  grimoires: 0,
  xp: 0,
  max_xp: 100,
  p_lvl: 1,
  maxStage: 1,
  maxTower: 1,
  cleared: [],
  runes_inv: [],
  roster: [],
  xp_boost_end_time: 0,
  first_summon_done: false,
  daily_missions: { last_reset: 0, progress: {}, claimed: [] },
  arena_wings: 10,
  arena_pts: 0,
  arena_opponents: [],
};

let s = {},
  tmp = {
    prep: [],
    selInv: null,
    mode: "story",
    lvl: 1,
    selRuneSlot: null,
    dungType: null,
    upRune: null,
    evoFodder: [],
    skillFodder: [],
    invFilter: "all",
  },
  b = {
    p: [],
    e: [],
    t: "p",
    idx: 0,
    spd: 1,
    auto: false,
    farmRuns: 0,
    skillPending: null,
    target: null,
  };

// --- GAME OBJS ---
const Game = {
  login: function () {
    const u = el("inp-user").value.trim();
    if (!u) return;
    currentUser = u;
    const sav = localStorage.getItem(`gl_final_img_v3_${u}`); // Reset Key
    s = sav ? JSON.parse(sav) : JSON.parse(JSON.stringify(DEFAULT_STATE));
    if (!s.runes_inv) s.runes_inv = [];
    if (!s.daily_missions)
      s.daily_missions = { last_reset: 0, progress: {}, claimed: [] };
    if (!s.maxTower) s.maxTower = 1;
    if (!Array.isArray(s.roster)) s.roster = [];
    if (s.arena_wings === undefined) s.arena_wings = 10;
    if (s.arena_pts === undefined) s.arena_pts = 0;
    if (!s.arena_opponents) s.arena_opponents = [];
    const now = new Date(),
      last = new Date(s.daily_missions.last_reset);
    if (now.getDate() !== last.getDate()) {
      s.daily_missions = { last_reset: Date.now(), progress: {}, claimed: [] };
      s.arena_wings = 10;
    }
    Core.updateMission("login", 1);
    uidCount = s.roster.reduce((m, r) => Math.max(m, r.uid), 0) + 1;
    runeIdCount =
      Math.max(
        s.runes_inv.reduce((m, r) => Math.max(m, r.id), 0),
        100
      ) + 1;
    walletCache.mana = s.mana;
    walletCache.gems = s.gems;
    el("p-name").innerText = u;
    UI.upd();
    UI.nav("hub");
    setInterval(() => {
      const n = Date.now();
      if (s.xp_boost_end_time > n) {
        const m = Math.ceil((s.xp_boost_end_time - n) / 60000);
        el("boost-status").innerText = `XP Boost: ${m}m`;
        el("boost-status").style.color = "#10b981";
      } else {
        el("boost-status").innerText = `XP Boost Inativo`;
        el("boost-status").style.color = "#6b7280";
      }
    }, 1000);
  },
  save: function () {
    if (currentUser)
      localStorage.setItem(`gl_final_img_v3_${currentUser}`, JSON.stringify(s));
  },
  logout: function () {
    currentUser = null;
    document
      .querySelectorAll(".screen")
      .forEach((x) => x.classList.remove("active"));
    el("login").classList.add("active");
  },
};

const UI = {
  nav: function (scn) {
    document
      .querySelectorAll(".screen")
      .forEach((x) => x.classList.remove("active"));
    el(scn).classList.add("active");
    UI.upd();
    if (scn === "expl") Core.renExpl();
    if (scn === "dung") Core.renDung();
    if (scn === "tower") Core.renTower();
  },
  modal: function (id, o) {
    el(id).className = o ? "modal open" : "modal";
    if (o && id === "m-shop") Core.renShop();
    if (o && id === "m-gacha")
      el("btn-g-10").style.display = s.rare_tix >= 10 ? "block" : "none";
    if (o && id === "m-missions") Core.renMissions();
    if (o && id === "m-skill") Core.renSkill();
  },
  tab: function (t) {
    document
      .querySelectorAll(".tab-btn")
      .forEach((x) => x.classList.remove("active"));
    document
      .querySelectorAll(".dt-cont")
      .forEach((x) => x.classList.remove("active"));
    el(`tab-${t}`).classList.add("active");
    el(`cont-${t}`).classList.add("active");
  },
  toast: function (m) {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;top:10%;left:50%;transform:translate(-50%,-50%);background:#333;color:#fff;padding:10px;border-radius:10px;z-index:999`;
    d.innerText = m;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1500);
  },
  upd: function () {
    const dM = s.mana - walletCache.mana,
      dG = s.gems - walletCache.gems;
    if (dM !== 0) {
      const u = el("ui-mana"),
        su = el("shop-mana");
      if (u) u.classList.add(dM > 0 ? "pulse-g" : "pulse-r");
      if (su) su.innerText = formatNum(s.mana);
      setTimeout(() => u?.classList.remove("pulse-g", "pulse-r"), 500);
      el("h-mana").innerText = formatNum(s.mana);
      walletCache.mana = s.mana;
    } else {
      el("h-mana").innerText = formatNum(s.mana);
      const su = el("shop-mana");
      if (su) su.innerText = formatNum(s.mana);
    }
    if (dG !== 0) {
      const u = el("ui-gems"),
        su = el("shop-gems");
      if (u) u.classList.add(dG > 0 ? "pulse-g" : "pulse-r");
      if (su) su.innerText = formatNum(s.gems);
      setTimeout(() => u?.classList.remove("pulse-g", "pulse-r"), 500);
      el("h-gems").innerText = formatNum(s.gems);
      walletCache.gems = s.gems;
    } else {
      el("h-gems").innerText = formatNum(s.gems);
      const su = el("shop-gems");
      if (su) su.innerText = formatNum(s.gems);
    }
    el("p-lvl").innerText = s.p_lvl;
    el("g-tix").innerText = s.tix;
    el("g-rare").innerText = s.rare_tix;
    el("sk-grim").innerText = s.grimoires;

    const aW = el("arena-wings-display");
    if (aW) aW.innerText = s.arena_wings;
    const aP = el("arena-pts");
    const hA = el("h-arena");
    if (aP) aP.innerText = s.arena_pts;
    if (hA) hA.innerText = s.arena_wings;
  },
  getVis: function (d) {
    return d.img ? `<img src="${d.img}">` : d.visual;
  },
  renMon: function (m) {
    const d = DB.find((x) => x.id === m.id) || DB[0];
    const isMax = m.lvl >= MAX_LVL[m.star];
    const badgeClass = isMax ? "lvl-badge max" : "lvl-badge";
    const badgeText = isMax ? "MAX" : m.lvl;
    return `<div class="stars">${'<div class="star"></div>'.repeat(
      m.star
    )}</div><div class="hero-vis">${UI.getVis(
      d
    )}</div><div class="${badgeClass}">${badgeText}</div>`;
  },
};

const Prep = {
  render: function () {
    [0, 1, 2].forEach(
      (i) =>
        (el(`s${i}`).innerHTML = tmp.prep[i]
          ? UI.renMon(s.roster.find((x) => x.uid === tmp.prep[i]))
          : "+")
    );
    const g = el("prep-grid");
    g.innerHTML = "";
    s.roster.sort((a, b) => b.lvl - a.lvl || b.star - a.star);
    s.roster.forEach((m) => {
      const d = document.createElement("div");
      d.className = `hero-slot ${tmp.prep.includes(m.uid) ? "selected" : ""}`;
      d.innerHTML = UI.renMon(m);
      d.onclick = () => {
        if (tmp.prep.includes(m.uid))
          tmp.prep = tmp.prep.filter((x) => x !== m.uid);
        else if (tmp.prep.length < 3) tmp.prep.push(m.uid);
        Prep.render();
      };
      g.appendChild(d);
    });
    const sk =
      tmp.mode === "story"
        ? `s-${tmp.lvl}`
        : tmp.mode === "arena"
        ? ""
        : `d-${tmp.dungType}-${tmp.lvl}`;
    if (tmp.mode === "arena") el("btn-farm").style.display = "none";
    else
      el("btn-farm").style.display = s.cleared.includes(sk) ? "flex" : "none";
  },
  rem: function (i) {
    if (tmp.prep[i]) {
      tmp.prep.splice(i, 1);
      Prep.render();
    }
  },
};

const Core = {
  updateMission: function (t, a = 1) {
    if (!s.daily_missions) return;
    MISSIONS_DB.forEach((m) => {
      if (m.type === t) {
        if (!s.daily_missions.progress[m.id])
          s.daily_missions.progress[m.id] = 0;
        if (s.daily_missions.progress[m.id] < m.target)
          s.daily_missions.progress[m.id] += a;
      }
    });
    Game.save();
  },
  renMissions: function () {
    const l = el("mission-list");
    l.innerHTML = "";
    MISSIONS_DB.forEach((m) => {
      const p = s.daily_missions.progress[m.id] || 0;
      const done = p >= m.target;
      const claimed = s.daily_missions.claimed.includes(m.id);
      const rw = m.r.mana ? `${formatNum(m.r.mana)} 💠` : `${m.r.gems} 💎`;
      const div = document.createElement("div");
      div.className = "mis-row";
      div.innerHTML = `<div class="mis-desc">${
        m.desc
      }</div><div style="font-size:0.8rem;margin-top:5px">Progresso: ${p}/${
        m.target
      }</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:5px"><span class="mis-rw">${rw}</span><button class="btn-claim" onclick="Core.claimMission('${
        m.id
      }')" ${claimed ? "disabled" : done ? "" : "disabled"}>${
        claimed ? "Recebido" : "Resgatar"
      }</button></div>`;
      l.appendChild(div);
    });
  },
  claimMission: function (mid) {
    if (s.daily_missions.claimed.includes(mid)) return;
    s.daily_missions.claimed.push(mid);
    const m = MISSIONS_DB.find((x) => x.id === mid);
    s.mana += m.r.mana;
    s.gems += m.r.gems;
    Game.save();
    UI.upd();
    Core.renMissions();
    UI.toast("Resgatado!");
  },
  setInvFilter: function (f, b) {
    tmp.invFilter = f;
    document
      .querySelectorAll(".filt-btn")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    Core.openInv();
    UI.modal("m-filter", 0);
  },
  openInv: function () {
    UI.nav("inv");
    const g = el("inv-grid");
    g.innerHTML = "";
    const list = s.roster.filter(
      (m) =>
        tmp.invFilter === "all" ||
        DB.find((x) => x.id === m.id).type === tmp.invFilter
    );
    list
      .sort((a, b) => b.lvl - a.lvl || b.star - a.star)
      .forEach((m) => {
        const d = document.createElement("div");
        d.className = "hero-slot";
        if (m.star === 5) d.classList.add("leg-glow");
        d.innerHTML = UI.renMon(m);
        d.onclick = () => Core.selInv(m.uid);
        g.appendChild(d);
      });
  },
  openDex: function () {
    UI.nav("dex");
    const g = el("dex-grid");
    g.innerHTML = "";
    DB.filter((x) => x.id < 900)
      .sort((a, b) => b.nat - a.nat)
      .forEach((d) => {
        const o = s.roster.some((m) => m.id === d.id);
        const div = document.createElement("div");
        div.className = `dx-sl ${o ? "" : "unk"}`;
        div.onclick = () => Core.showDexDetail(d.id);
        div.innerHTML = `<div style="font-size:2rem">${UI.getVis(
          d
        )}</div><div class="dx-name-mini">${
          d.n
        }</div><div class="stars">${'<div class="star"></div>'.repeat(
          d.nat
        )}</div>`;
        g.appendChild(div);
      });
  },
  showDexDetail: function (did) {
    const d = DB.find((x) => x.id === did);
    el("dxd-vis").innerHTML = UI.getVis(d);
    el("dxd-name").innerText = d.n;
    el("dxd-stars").innerHTML = '<div class="star"></div>'.repeat(d.nat);
    el("dxd-badge").innerText = d.type;
    el("dxd-hp").innerText = d.hp;
    el("dxd-atk").innerText = d.atk;
    el("dxd-skills").innerHTML = d.s
      .map(
        (k) =>
          `<div class="dex-skill-row"><div class="dex-skill-icon">${
            k.ty && k.ty.includes("heal") ? "💊" : "⚔️"
          }</div><div><b>${k.n}</b><br><small>${
            k.ty || "ATK"
          }</small></div></div>`
      )
      .join("");
    UI.modal("m-dex-detail", 1);
  },
  selInv: function (uid) {
    tmp.selInv = uid;
    const m = s.roster.find((x) => x.uid === uid),
      d = DB.find((x) => x.id === m.id);
    UI.nav("mon_detail");
    let c =
      d.type === "Fogo" ? "#ef4444" : d.type === "Água" ? "#3b82f6" : "#10b981";
    el("mon_detail").style.setProperty("--elem-bg", c);
    el("md-vis").innerHTML = UI.getVis(d);
    el("md-name").innerText = d.n;

    const isMax = m.lvl >= MAX_LVL[m.star];
    el("md-badge").className = isMax ? "mon-bdg max-lvl" : "mon-bdg";
    el("md-badge").innerHTML = `${d.type} Nv.${m.lvl} ${isMax ? "(MAX)" : ""}`;

    el("md-stars").innerHTML = '<div class="star"></div>'.repeat(m.star);
    let sm = 1 + m.lvl * 0.1,
      bn = { hp: 0, atk: 0, def: 0, crit: 0 };
    m.runes.forEach((r) => {
      if (r) bn[r.type] += r.val;
    });
    el("st-hp").innerText = Math.floor(d.hp * sm);
    el("bn-hp").innerText = `(+${bn.hp})`;
    el("st-atk").innerText = Math.floor(d.atk * sm);
    el("bn-atk").innerText = `(+${bn.atk})`;
    el("st-def").innerText = Math.floor(10 + m.lvl);
    el("bn-def").innerText = `(+${bn.def})`;
    el("st-crit").innerText = 15;
    [0, 1, 2, 3].forEach((i) => {
      const r = m.runes[i],
        rx = el(`rs-${i}`);
      rx.className = `rn-sl ${r ? "fil" : ""}`;
      rx.innerHTML = r
        ? `<div style="color:${
            r.type === "hp" ? "#f44" : "#44f"
          }">⬢</div><small>+${r.lvl}</small>`
        : "⬡";
    });
    if (!m.skLvl || m.skLvl.length !== d.s.length) m.skLvl = d.s.map(() => 1);
    el("skill-desc-list").innerHTML = d.s
      .map(
        (k, i) =>
          `<div class="sk-cd"><div class="sk-nm">${
            k.n
          } <span style="font-size:0.7rem;background:#333;color:#fff;padding:2px 6px;border-radius:4px;margin-left:5px">Lv.${
            m.skLvl[i]
          }</span></div><div class="sk-inf"><span>CD: ${k.cd}</span><span>${
            k.ty ? k.ty.toUpperCase() : "ATK"
          }</span></div><div class="sk-desc">${
            k.ty.includes("heal")
              ? "Recupera HP aliado."
              : k.ty === "stun"
              ? "Chance de atordoar."
              : k.ty.includes("buff")
              ? "Aplica melhoria."
              : "Causa dano ao inimigo."
          } <br><span style="color:#d97706;font-size:0.7rem">Nível +: +10% Eficiência</span></div></div>`
      )
      .join("");
  },
  backToInv: function () {
    Core.openInv();
  },
  pup: function () {
    const m = s.roster.find((x) => x.uid === tmp.selInv);
    if (s.pot > 0 && m.lvl < MAX_LVL[m.star]) {
      s.pot--;
      m.lvl++;
      Game.save();
      Core.selInv(m.uid);
      UI.upd();
      Core.updateMission("pup");
    }
  },
  openEvo: function () {
    const m = s.roster.find((x) => x.uid === tmp.selInv);
    if (m.star < 6) {
      tmp.evoTarget = tmp.selInv;
      tmp.evoFodder = [];
      UI.modal("m-evo", 1);
      Core.renEvo();
    }
  },
  renEvo: function () {
    const t = s.roster.find((x) => x.uid === tmp.evoTarget),
      g = el("evo-grid");
    g.innerHTML = "";
    s.roster
      .filter((m) => m.star === t.star && m.uid !== t.uid)
      .forEach((m) => {
        const d = document.createElement("div");
        d.className = `hero-slot ${
          tmp.evoFodder.includes(m.uid) ? "selected" : ""
        }`;
        d.innerHTML = UI.renMon(m);
        d.onclick = () => {
          if (tmp.evoFodder.includes(m.uid))
            tmp.evoFodder = tmp.evoFodder.filter((x) => x !== m.uid);
          else if (tmp.evoFodder.length < t.star) tmp.evoFodder.push(m.uid);
          Core.renEvo();
        };
        g.appendChild(d);
      });
    el("btn-do-evo").disabled = tmp.evoFodder.length < t.star;
  },
  doEvolution: function () {
    const t = s.roster.find((x) => x.uid === tmp.evoTarget);
    s.roster = s.roster.filter((m) => !tmp.evoFodder.includes(m.uid));
    tmp.prep = tmp.prep.filter((u) => !tmp.evoFodder.includes(u));
    t.star++;
    t.lvl = 1;
    Game.save();
    UI.modal("m-evo", 0);
    Core.selInv(t.uid);
    UI.toast("Evoluído!");
  },
  openSkill: function () {
    tmp.skillFodder = [];
    UI.modal("m-skill", 1);
    Core.renSkill();
  },
  renSkill: function () {
    const t = s.roster.find((x) => x.uid === tmp.selInv),
      g = el("skill-grid");
    g.innerHTML = "";
    // Only show duplicates (Same ID, different UID)
    s.roster
      .filter((m) => m.id === t.id && m.uid !== t.uid)
      .forEach((m) => {
        const d = document.createElement("div");
        d.className = `hero-slot ${
          tmp.skillFodder.includes(m.uid) ? "selected" : ""
        }`;
        d.innerHTML = UI.renMon(m);
        d.onclick = () => {
          tmp.skillFodder = tmp.skillFodder.includes(m.uid) ? [] : [m.uid];
          Core.renSkill();
        };
        g.appendChild(d);
      });
    el("btn-do-skill").disabled = tmp.skillFodder.length === 0;
  },
  doSkill: function () {
    const t = s.roster.find((x) => x.uid === tmp.selInv);
    s.roster = s.roster.filter((m) => !tmp.skillFodder.includes(m.uid));
    tmp.prep = tmp.prep.filter((u) => !tmp.skillFodder.includes(u));
    let av = [];
    t.skLvl.forEach((l, i) => {
      if (l < 5) av.push(i);
    });
    if (av.length > 0) {
      t.skLvl[av[Math.floor(Math.random() * av.length)]]++;
      UI.toast("Skill UP!");
    } else {
      UI.toast("Max Skills!");
    }
    Game.save();
    UI.modal("m-skill", 0);
    Core.selInv(t.uid);
  },
  useGrimoire: function () {
    if (s.grimoires < 1) return;
    const t = s.roster.find((x) => x.uid === tmp.selInv);
    let av = [];
    t.skLvl.forEach((l, i) => {
      if (l < 5) av.push(i);
    });
    if (av.length > 0) {
      s.grimoires--;
      t.skLvl[av[Math.floor(Math.random() * av.length)]]++;
      UI.toast("Skill UP!");
      Game.save();
      UI.modal("m-skill", 0);
      UI.upd();
      Core.selInv(t.uid);
    } else {
      UI.toast("Max Skills!");
    }
  },
  openRuneBag: function () {
    UI.nav("rune_bag");
    const g = el("rune-bag-grid");
    g.innerHTML = "";
    s.runes_inv.forEach((r) => {
      const d = document.createElement("div");
      d.className = "rune-slot-bag";
      d.innerHTML = `<div class="rune-content"><div class="rune-img" style="color:${
        r.type === "hp" ? "#f44" : "#44f"
      }">⬢</div></div><div class="rune-lvl-tag">+${
        r.lvl
      }</div><div class="rune-set-icon">${r.type.toUpperCase()}</div>`;
      d.onclick = () => Core.popRuneUp(r.id);
      g.appendChild(d);
    });
  },
  popRuneUp: function (rid) {
    let r = s.runes_inv.find((x) => x.id === rid);
    if (!r)
      s.roster.forEach((m) =>
        m.runes.forEach((eq) => {
          if (eq && eq.id === rid) r = eq;
        })
      );
    if (!r) return;
    tmp.upRune = r;
    el("up-rune-visual").innerHTML = `<div style="color:${
      r.type === "hp" ? "#f44" : "#44f"
    }">⬢</div>`;
    el("up-rune-type").innerText = r.type;
    el("up-rune-lvl").innerText = `+${r.lvl}`;
    el(
      "up-stats-comp"
    ).innerHTML = `<div class="stat-ln"><span>VAL</span><div>${
      r.val
    } ➜ <span class="new-v">${Math.ceil(r.val * 1.1)}</span></div></div>`;
    let cost = 500 + r.lvl * 500;
    el("up-cost").innerText = formatNum(cost);
    let ch = 100 - r.lvl * 5;
    el("up-chance").innerText = `${Math.max(5, ch)}%`;
    UI.modal("m-rune-up", 1);
  },
  doUpgrade: function () {
    const r = tmp.upRune,
      cost = 500 + r.lvl * 500;
    if (s.mana < cost) return UI.toast("Mana!");
    s.mana -= cost;
    UI.upd();
    Core.updateMission("rup");
    let ch = 100 - r.lvl * 5;
    if (Math.random() * 100 < Math.max(5, ch)) {
      r.lvl++;
      r.val = Math.ceil(r.val * 1.1);
      if (r.lvl % 3 === 0) {
        if (!r.subs) r.subs = [];
        r.subs.push({ type: "atk", val: 5 });
      }
      Game.save();
      Core.popRuneUp(r.id);
      UI.toast("Sucesso!");
    } else {
      UI.toast("Falha...");
    }
  },
  renShop: function () {
    const c = el("shop-container");
    c.innerHTML = "";
    SHOP_DB.forEach((i) => {
      c.innerHTML += `<div class="shop-card"><div class="shop-icon">${
        i.icon
      }</div><div class="shop-name">${
        i.name
      }</div><button class="shop-price" onclick="Core.buy('${i.id}',${
        i.cost
      },'${i.currency}')">${formatNum(i.cost)}${
        i.currency === "mana" ? "💠" : "💎"
      }</button></div>`;
    });
  },
  buy: function (id, c, curr) {
    if ((curr === "mana" && s.mana < c) || (curr === "gems" && s.gems < c))
      return UI.toast("Falta grana");
    if (id.includes("boost")) {
      s.xp_boost_end_time =
        Math.max(Date.now(), s.xp_boost_end_time) +
        (id.includes("15") ? 15 : 7) * 60000;
      s.gems -= c;
      UI.toast("Booster Ativo!");
    } else if (id === "tix_pack") {
      s.mana -= c;
      s.tix += 11;
    } else if (id === "rare_pack") {
      s.gems -= c;
      s.rare_tix += 11;
    } else if (id === "pot_pack") {
      s.mana -= c;
      s.pot += 10;
    } else if (id === "food_5") {
      s.mana -= c;
      s.roster.push({
        uid: uidCount++,
        id: 990,
        lvl: 1,
        star: 5,
        skLvl: [1],
        runes: [null, null, null, null],
      });
    } else {
      if (curr === "mana") s.mana -= c;
      else s.gems -= c;
      if (id === "pot") s.pot++;
      else if (id === "tix") s.tix++;
      else if (id === "rare") s.rare_tix++;
      else s.grimoires++;
    }
    Game.save();
    UI.upd();
    UI.toast("Comprado!");
  },
  spin: function (t, n) {
    let k = t === "common" ? "tix" : "rare_tix";
    if (s[k] < n) return UI.toast("Sem tickets");
    s[k] -= n;
    UI.upd();
    el("portal-visual").style.animation = "spin .2s linear infinite";
    setTimeout(() => {
      el("portal-visual").style.animation = "none";
      let rs = [],
        hl = false;
      for (let i = 0; i < n; i++) {
        let nat = 1,
          r = Math.random() * 100;
        if (t === "common") {
          if (r > 98) nat = 3;
          else if (r > 75) nat = 2;
        } else {
          if (!s.first_summon_done) {
            nat = 5;
            s.first_summon_done = true;
          } else {
            if (r > 99.5) nat = 5;
            else if (r > 91.5) nat = 4;
            else nat = 3;
          }
        }
        if (nat === 5) hl = true;
        let p = DB.filter((x) => x.nat === nat && x.id < 900);
        if (!p.length) p = DB.filter((x) => x.nat === 1);
        let m = p[Math.floor(Math.random() * p.length)];
        s.roster.push({
          uid: uidCount++,
          id: m.id,
          lvl: 1,
          star: nat,
          skLvl: m.s.map(() => 1),
          runes: [null, null, null, null],
        });
        rs.push(m);
      }
      if (hl) {
        el("flash-fx").classList.add("active");
        setTimeout(() => el("flash-fx").classList.remove("active"), 1500);
      }
      Game.save();
      const g = el("gacha-result-grid");
      g.innerHTML = "";
      rs.forEach(
        (r) =>
          (g.innerHTML += `<div class="gacha-unit ${
            r.nat === 5 ? "nat5" : ""
          }"><div class="gacha-stars">${'<div class="star"></div>'.repeat(
            r.nat
          )}</div><div class="gacha-vis">${UI.getVis(
            DB.find((x) => x.id === r.id)
          )}</div><div class="gacha-name">${
            DB.find((x) => x.id === r.id).n
          }</div></div>`)
      );
      UI.modal("m-gacha-results", 1);
      Core.updateMission("sum", n);
    }, 400);
  },

  // --- ARENA ---
  openArena: function () {
    UI.nav("arena");
    if (s.arena_opponents.length === 0) Core.genArenaList();
    else Core.renArenaList();
  },

  refreshArena: function () {
    // Simple logic: free refresh for now or small mana cost
    if (s.mana < 100) return UI.toast("Precisa de 100 Mana");
    s.mana -= 100;
    Core.genArenaList();
    UI.upd();
  },

  genArenaList: function () {
    s.arena_opponents = [];
    const names = [
      "SummonerX",
      "DarkLord",
      "LightHope",
      "RuneMaster",
      "GigaChad",
      "NoobSlayer",
    ];
    for (let i = 0; i < 5; i++) {
      // Generate opponents near player level
      const lvl = Math.max(1, s.p_lvl + Math.floor(Math.random() * 5) - 2);
      // Generate random team of 3 monsters
      let team = [];
      for (let j = 0; j < 3; j++) {
        const mon = DB[Math.floor(Math.random() * (DB.length - 2))]; // Exclude bosses
        team.push({
          ...mon,
          lvl: lvl * 2,
          star: Math.min(5, Math.ceil(lvl / 5) + 2),
        });
      }
      s.arena_opponents.push({
        id: i,
        name: names[i] || "Unknown",
        lvl: lvl,
        rank: 1000 + lvl * 10,
        team: team,
      });
    }
    Game.save();
    Core.renArenaList();
  },

  renArenaList: function () {
    const l = el("arena-list");
    l.innerHTML = "";
    s.arena_opponents.forEach((op) => {
      let teamHtml = op.team.map((t) => UI.getVis(t)).join(" ");
      l.innerHTML += `
            <div class="opp-card">
                <div class="opp-info">
                    <div class="opp-avatar">⚔️</div>
                    <div class="opp-details">
                        <div class="opp-name">${op.name} (Lv.${op.lvl})</div>
                        <div class="opp-rank">Rank: ${op.rank}</div>
                    </div>
                </div>
                <div>
                    <div style="font-size:1.2rem; margin-bottom:5px">${teamHtml}</div>
                    <button class="btn btn-d" style="padding:5px 15px; font-size:0.7rem" onclick="Core.prep('arena', ${op.id})">Lutar</button>
                </div>
            </div>`;
    });
  },

  renExpl: function () {
    const c = el("expl-regions");
    c.innerHTML = "";
    EXPL_REGIONS.forEach((r) => {
      const d = document.createElement("div");
      d.className = "panel";
      d.style.cssText = `padding:15px;border-left:4px solid ${r.color};cursor:pointer;display:flex;align-items:center;gap:10px`;
      d.innerHTML = `<div style="font-size:1.5rem">${r.icon}</div><div><b>${r.name}</b></div>`;
      d.onclick = () => {
        el("expl-regions").style.display = "none";
        el("expl-stages-list").style.display = "flex";
        Core.renStageList(r.id);
      };
      c.appendChild(d);
    });
  },
  backToExplRegions: function () {
    el("expl-stages-list").style.display = "none";
    el("expl-regions").style.display = "flex";
  },
  renStageList: function (rid) {
    const c = el("expl-list-container");
    c.innerHTML = "";
    for (let i = 1; i <= 8; i++) {
      const gid = (rid - 1) * 8 + i,
        l = gid > s.maxStage;
      const d = document.createElement("div");
      d.className = `stg-row ${l ? "locked" : "u"} ${
        s.cleared.includes(`s-${gid}`) && !l ? "c" : ""
      }`;
      d.innerHTML = `<div class="stg-inf"><div class="stg-tit">Fase ${rid}-${i}</div><div class="stg-dsc">${
        l
          ? "Bloqueado"
          : s.cleared.includes(`s-${gid}`)
          ? "Concluído"
          : "Disponível"
      }</div></div><div>${
        l ? "🔒" : s.cleared.includes(`s-${gid}`) ? "✅" : "⚔️"
      }</div>`;
      if (!l) d.onclick = () => Core.prep("story", gid);
      c.appendChild(d);
    }
  },
  renDung: function () {
    el("dung-select").style.display = "block";
    el("dung-floors").style.display = "none";
  },
  selectDung: function (t) {
    tmp.dungType = t;
    el("dung-select").style.display = "none";
    el("dung-floors").style.display = "flex";
    const c = el("dung-list-container");
    c.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const l = i > 1 && !s.cleared.includes(`d-${t}-${i - 1}`),
        boss = i === 10;
      const d = document.createElement("div");
      d.className = `stg-row ${l ? "locked" : "u"} ${boss ? "b" : ""} ${
        s.cleared.includes(`d-${t}-${i}`) && !l ? "c" : ""
      }`;
      d.innerHTML = `<div class="stg-inf"><div class="stg-tit">${
        boss ? "👑 " : ""
      }B${i}</div></div><div>${
        l ? "🔒" : s.cleared.includes(`d-${t}-${i}`) ? "✅" : "⚔️"
      }</div>`;
      if (!l) d.onclick = () => Core.prep("dung", i);
      c.appendChild(d);
    }
  },
  backToDungSelect: function () {
    el("dung-floors").style.display = "none";
    el("dung-select").style.display = "block";
  },
  renTower: function () {
    const c = el("tower-list-container");
    c.innerHTML = "";
    for (let i = 1; i <= 50; i++) {
      const l = i > s.maxTower,
        boss = i % 10 === 0;
      const d = document.createElement("div");
      d.className = `stg-row ${l ? "locked" : "u"} ${boss ? "tb" : ""}`;
      d.innerHTML = `<div class="stg-inf"><div class="stg-tit">${
        boss ? "👑 " : ""
      }Andar ${i}</div></div><div>${l ? "🔒" : "⚔️"}</div>`;
      if (!l) d.onclick = () => Core.prep("tower", i);
      c.appendChild(d);
    }
  },
  prep: function (m, l) {
    tmp.mode = m;
    tmp.lvl = l;
    tmp.prep = [];
    UI.nav("prep");
    Prep.render();
  },
  reqConfirm: function (m, a) {
    el("confirm-msg").innerText = m;
    pendingAction = a;
    UI.modal("m-confirm", 1);
  },
  execConfirm: function () {
    if (pendingAction) pendingAction();
    UI.modal("m-confirm", 0);
  },
  renStages: (rid) => {
    Core.renStageList(rid);
  },
  openRuneSelect: function (s) {
    tmp.selRuneSlot = s;
    UI.modal("m-rune", 1);
    Core.renRuneList();
  },
  renRuneList: function () {
    const l = el("rune-list");
    l.innerHTML = "";
    const m = s.roster.find((x) => x.uid === tmp.selInv);
    if (m.runes[tmp.selRuneSlot]) {
      const btn = document.createElement("div");
      btn.className = "panel";
      btn.style.cssText =
        "padding:10px;border-left:4px solid red;cursor:pointer";
      btn.innerText = "Remover Atual";
      btn.onclick = () => Core.unequipRune();
      l.appendChild(btn);
    }
    s.runes_inv.forEach((r) => {
      const d = document.createElement("div");
      d.className = "panel";
      d.style.cssText = "padding:10px;cursor:pointer;margin-bottom:5px";
      d.innerHTML = `+${r.lvl} ${r.type} <small>${r.rarity}</small>`;
      d.onclick = () => Core.equipRune(r.id);
      l.appendChild(d);
    });
  },
  equipRune: function (rid) {
    const m = s.roster.find((x) => x.uid === tmp.selInv);
    const idx = s.runes_inv.findIndex((r) => r.id === rid);
    if (m.runes[tmp.selRuneSlot]) s.runes_inv.push(m.runes[tmp.selRuneSlot]);
    m.runes[tmp.selRuneSlot] = s.runes_inv[idx];
    s.runes_inv.splice(idx, 1);
    Game.save();
    UI.modal("m-rune", 0);
    Core.selInv(m.uid);
  },
  unequipRune: function () {
    if (s.mana < 1000) return UI.toast("Mana!");
    s.mana -= 1000;
    const m = s.roster.find((x) => x.uid === tmp.selInv);
    s.runes_inv.push(m.runes[tmp.selRuneSlot]);
    m.runes[tmp.selRuneSlot] = null;
    Game.save();
    UI.modal("m-rune", 0);
    Core.selInv(m.uid);
    UI.upd();
  },
};

const Anim = {
    play: function(key, targetEl) {
        const fx = document.createElement('div');
        fx.className = 'fx';
        let icon = '💥';
        let animClass = 'fx-slash';

        if(key === 'slash') { icon = '⚔️'; animClass = 'fx-slash'; }
        else if(key === 'fire') { icon = '🔥'; animClass = 'fx-rise'; }
        else if(key === 'water') { icon = '🌊'; animClass = 'fx-splash'; }
        else if(key === 'wind') { icon = '🌪️'; animClass = 'fx-spin'; }
        else if(key === 'rock') { icon = '🪨'; animClass = 'fx-drop'; }
        else if(key === 'light') { icon = '✨'; animClass = 'fx-pulse'; }
        else if(key === 'dark') { icon = '💀'; animClass = 'fx-shake'; }
        else if(key === 'heal') { icon = '💚'; animClass = 'fx-rise'; }
        else if(key === 'buff') { icon = '⬆️'; animClass = 'fx-rise'; }
        else if(key === 'aoe') { icon = '💥'; animClass = 'fx-pulse'; }

        fx.innerText = icon;
        fx.classList.add(animClass);
        targetEl.appendChild(fx);
        setTimeout(() => fx.remove(), 600);
    }
};

const Battle = {
  spd: function () {
    let n = b.spd === 1 ? 2 : b.spd === 2 ? 3 : 1;
    if (n === 3 && s.p_lvl < 5) {
      UI.toast("Nv.5 para 3x");
      n = 1;
    }
    b.spd = n;
    el("btn-spd").innerText = "x" + b.spd;
  },
  toggleAuto: function () {
    if (s.p_lvl < 2) return UI.toast("Nv.2 para Auto");
    b.auto = !b.auto;
    el("btn-auto").classList.toggle("active", b.auto);
    if (b.auto) Battle.turn();
  },
  start: function (n) {
    if (!tmp.prep.length) return UI.toast("Selecione monstros!");

    // Arena Check
    if (tmp.mode === "arena") {
      if (s.arena_wings <= 0) return UI.toast("Sem Asas!");
      s.arena_wings--;
      UI.upd();
    }

    b.farmRuns = n;
    b.auto = n > 0;
    b.spd = s.p_lvl >= 5 ? 3 : 2;
    el("btn-spd").innerText = "x" + b.spd;
    el("btn-auto").classList.toggle("active", b.auto);
    el("farm-ui").style.display = n > 0 ? "block" : "none";

    b.p = tmp.prep.map((uid, i) => {
      const m = s.roster.find((x) => x.uid === uid),
        d = DB.find((x) => x.id === m.id);
      let sm = 1 + m.lvl * 0.1,
        rs = { hp: 0, atk: 0, def: 0, crit: 0 };
      m.runes.forEach((r) => {
        if (r) {
          rs[r.type] += r.val;
          if (r.subs) r.subs.forEach((s) => (rs[s.type] += s.val));
        }
      });
      return {
        ...d,
        max: Math.floor(d.hp * sm + rs.hp),
        cur: Math.floor(d.hp * sm + rs.hp),
        atk: Math.floor(d.atk * sm + rs.atk),
        idx: i,
        side: "p",
        dead: false,
        cds: d.s.map(() => 0),
        skLvl: m.skLvl,
        buffs: [],
      };
    });

    if (tmp.mode === "arena") {
      const opp = s.arena_opponents.find((o) => o.id === tmp.lvl);
      b.e = opp.team.map((m, i) => {
        let sm = 1 + m.lvl * 0.1;
        return {
          ...m,
          max: Math.floor(m.hp * sm),
          cur: Math.floor(m.hp * sm),
          atk: Math.floor(m.atk * sm),
          idx: i,
          side: "e",
          dead: false,
          cds: m.s.map(() => 0),
          skLvl: [1],
          buffs: [],
        };
      });
    } else {
      b.e = Array(tmp.mode === "story" ? 3 : 1)
        .fill(0)
        .map((_, i) => {
          let d, sm;
          if (tmp.mode === "dung") {
            d = tmp.dungType === "golem" ? BOSS_DB.golem : BOSS_DB.dragon;
            sm = 1 + tmp.lvl * 0.5;
          } else if (tmp.mode === "tower") {
            if (tmp.lvl % 10 === 0) {
              d = BOSS_DB.dragon;
              sm = 1 + tmp.lvl * 0.3;
            } else {
              const cdb = DB.filter(
                (x) => x.id !== 901 && x.id !== 902 && x.id !== 990
              );
              d = cdb[Math.floor(Math.random() * cdb.length)];
              sm = 1 + tmp.lvl * 0.15;
            }
          } else {
            if (tmp.lvl % 8 === 0 && i === 1) {
              const bosses = DB.filter((x) => x.nat === 5 && x.id < 900);
              d = bosses[Math.floor(Math.random() * bosses.length)];
              sm = 1 + tmp.lvl * 0.25;
            } else {
              const cdb = DB.filter(
                (x) =>
                  x.id !== 901 && x.id !== 902 && x.id !== 990 && x.nat <= 4
              );
              d = cdb[Math.floor(Math.random() * cdb.length)];
              sm = 1 + tmp.lvl * 0.2;
            }
          }
          return {
            ...d,
            max: Math.floor(d.hp * sm),
            cur: Math.floor(d.hp * sm),
            atk: Math.floor(d.atk * sm),
            idx: i,
            side: "e",
            dead: false,
            cds: d.s.map(() => 0),
            skLvl: [1],
            buffs: [],
          };
        });
    }

    b.t = "p";
    b.idx = 0;
    UI.nav("battle");
    Battle.initBoard();
    Battle.turn();
  },
  initBoard: function () {
    el("r-pla").innerHTML = b.p
      .map(
        (u) =>
          `<div id="p${u.idx}" class="b-u" onclick="Battle.clk('p',${
            u.idx
          })"><div class="hp-bw"><div class="hp-fill" style="width:100%"></div></div><div class="bfs" id="bf-p${
            u.idx
          }"></div><div class="vis">${UI.getVis(u)}</div></div>`
      )
      .join("");
    el("r-ene").innerHTML = b.e
      .map(
        (u) =>
          `<div id="e${u.idx}" class="b-u" onclick="Battle.clk('e',${
            u.idx
          })"><div class="hp-bw"><div class="hp-fill" style="width:100%"></div></div><div class="bfs" id="bf-e${
            u.idx
          }"></div><div class="vis">${UI.getVis(u)}</div><div id="tgt-${
            u.idx
          }" class="tgt-mk" style="display:none">▼</div></div>`
      )
      .join("");
  },
  updateVisuals: function () {
    const upd = (l) => {
      l.forEach((u) => {
        const d = el(`${u.side}${u.idx}`);
        if (d) {
          d.querySelector(".hp-fill").style.width = `${(u.cur / u.max) * 100}%`;
          if (u.dead) {
            d.classList.add("dead");
            d.querySelector(".hp-bw").style.display = "none";
          } else {
            d.classList.remove("dead");
            d.querySelector(".hp-bw").style.display = "block";
          }
          const bf = el(`bf-${u.side}${u.idx}`);
          bf.innerHTML = "";
          u.buffs.forEach(
            (b) =>
              (bf.innerHTML += `<div class="bf-ic ${b.type}">${b.type
                .substring(0, 3)
                .toUpperCase()}<span class="buff-turn">${b.turns}</span></div>`)
          );
          if (u.side === "e")
            el(`tgt-${u.idx}`).style.display =
              b.target === u.idx ? "block" : "none";
        }
      });
    };
    upd(b.p);
    upd(b.e);
  },
  clk: function (s, i) {
    if (b.skillPending && s === "p") {
      const u = b.p[b.idx],
        si = b.skillPending.sIdx;
      Battle.execSkill(u, b.p[i], si);
      b.skillPending = null;
      el("act-msg").innerText = `Turno de ${u.n}`;
      document
        .querySelectorAll(".b-u.act-t")
        .forEach((e) => e.classList.remove("act-t"));
      return;
    }
    if (b.t !== "p" || b.auto) return;
    if (s === "e" && !b.e[i].dead) {
      b.target = i;
      Battle.updateVisuals();
    }
  },
  turn: function () {
    if (b.e.every((x) => x.dead)) return Battle.end(1);
    if (b.p.every((x) => x.dead)) return Battle.end(0);
    document.querySelectorAll(".b-u").forEach((u) => {
      u.classList.remove("actor");
      u.classList.remove("act-t");
    });
    const sl = b.t === "p" ? b.p : b.e;
    if (b.idx >= sl.length) {
      b.t = b.t === "p" ? "e" : "p";
      b.idx = 0;
      return Battle.turn();
    }
    const u = sl[b.idx];
    if (u.dead) {
      b.idx++;
      return Battle.turn();
    }
    let skip = false;
    u.buffs = u.buffs.filter((bf) => {
      if (bf.type === "poison") {
        u.cur -= Math.floor(u.max * 0.05);
        const p = document.createElement("div");
        p.className = "dmg-pop";
        p.innerText = "POISON";
        p.style.color = "#10b981";
        el(`${u.side}${u.idx}`)?.appendChild(p);
        setTimeout(() => p.remove(), 800);
      }
      if (bf.type === "stun") skip = true;
      bf.turns--;
      return bf.turns > 0;
    });
    if (u.cur <= 0) u.dead = true;
    Battle.updateVisuals();
    if (u.dead || skip) {
      b.idx++;
      setTimeout(Battle.turn, 500 / b.spd);
      return;
    }
    u.cds = u.cds.map((c) => Math.max(0, c - 1));
    if (b.t === "p") {
      if (b.auto) {
        el("btl-ui").classList.remove("active");
        setTimeout(() => {
          let t = null,
            si = 0;
          const hl = u.s.findIndex(
            (sk) =>
              (sk.ty === "heal" || sk.ty === "heal_aoe") &&
              u.cds[u.s.indexOf(sk)] === 0
          );
          if (hl !== -1 && b.p.some((a) => !a.dead && a.cur < a.max * 0.6)) {
            t = b.p.find((a) => !a.dead && a.cur < a.max * 0.6);
            si = hl;
          } else {
            const trg = b.e.filter((e) => !e.dead);
            const adv = trg.find((e) => {
              const at = u.type,
                dt = e.type;
              return (
                (at == "Água" && dt == "Fogo") ||
                (at == "Fogo" && dt == "Vento") ||
                (at == "Vento" && dt == "Terra") ||
                (at == "Terra" && dt == "Água") ||
                (at == "Luz" && dt == "Trevas") ||
                (at == "Trevas" && dt == "Luz")
              );
            });
            t = adv || trg[0];
            for (let k = u.s.length - 1; k >= 0; k--)
              if (
                u.cds[k] === 0 &&
                (u.s[k].ty === "atk" ||
                  u.s[k].ty === "aoe" ||
                  u.s[k].ty.includes("debuff"))
              ) {
                si = k;
                break;
              }
          }
          Battle.execSkill(u, t, si);
        }, 500 / b.spd);
      } else {
        el("act-msg").innerText = `Turno de ${u.n}`;
        el(`${u.side}${u.idx}`).classList.add("act-t");
        el("skill-list").innerHTML = u.s
          .map(
            (s, i) =>
              `<div class="sk-btn ${u.cds[i] > 0 ? "cd" : ""}" onclick="${
                u.cds[i] > 0 ? "" : "Battle.act(" + i + ")"
              }"><div style="font-size:1.5rem">${
                i === 0 ? "⚔️" : i === 1 ? "⚡" : "🔥"
              }</div><div class="dk-badge">${
                s.ty ? s.ty.toUpperCase() : "ATK"
              }</div>${
                u.cds[i] > 0
                  ? `<div style="position:absolute;font-size:2rem;color:white;font-weight:900;text-shadow:0 0 5px #000">${u.cds[i]}</div>`
                  : ""
              }</div>`
          )
          .join("");
        el("btl-ui").classList.add("active");
      }
    } else {
      el("btl-ui").classList.remove("active");
      setTimeout(() => {
        const t = b.p.find((x) => !x.dead);
        Battle.execSkill(u, t || u, 0);
      }, 800 / b.spd);
    }
  },
  act: function (i) {
    const u = b.p[b.idx],
      sk = u.s[i];
    if (sk.ty === "heal") {
      b.skillPending = { sIdx: i };
      el("act-msg").innerText = "Selecione Aliado";
      return;
    }
    if (sk.ty === "heal_aoe" || sk.ty.includes("buff")) {
      el("btl-ui").classList.remove("active");
      Battle.execSkill(u, u, i);
      return;
    }
    let t = null;
    if (b.target !== null && b.e[b.target] && !b.e[b.target].dead)
      t = b.e[b.target];
    else t = b.e.find((x) => !x.dead);
    if (!t) return;
    el("btl-ui").classList.remove("active");
    Battle.execSkill(u, t, i);
  },
  execSkill: function (atk, def, si) {
    const sk = atk.s[si];
    atk.cds[si] = sk.cd + 1;
    const elA = el(`${atk.side}${atk.idx}`);
    elA.classList.remove("act-t");
    elA.classList.add("actor");
    setTimeout(() => {
      if (elA) elA.classList.remove("actor");
      let trgs = [def];
      if (sk.ty.includes("aoe"))
        trgs =
          atk.side === "p"
            ? sk.ty.includes("heal")
              ? b.p
              : b.e
            : sk.ty.includes("heal")
            ? b.e
            : b.p;
      else if (sk.ty.includes("buff") || sk.ty === "heal") trgs = [def];

      trgs.forEach((t) => {
        if (t && !t.dead) {
          const elT = el(`${t.side}${t.idx}`);
          if (elT) {
            // ANIMATION TRIGGER
            let anim = sk.anim;
            if(!anim) {
                if(sk.ty.includes('heal')) anim = 'heal';
                else if(sk.ty.includes('buff') || sk.ty === 'turn') anim = 'buff';
                else if(sk.ty.includes('aoe')) anim = 'aoe';
                else if(atk.type === 'Fogo') anim = 'fire';
                else if(atk.type === 'Água') anim = 'water';
                else if(atk.type === 'Vento') anim = 'wind';
                else if(atk.type === 'Terra') anim = 'rock';
                else if(atk.type === 'Luz') anim = 'light';
                else if(atk.type === 'Trevas') anim = 'dark';
                else anim = 'slash';
            }
            Anim.play(anim, elT);

            if (sk.ty.includes("heal")) {
              const h = Math.floor(atk.atk * sk.m);
              t.cur = Math.min(t.max, t.cur + h);
              const p = document.createElement("div");
              p.className = "dmg-pop";
              p.innerHTML = `+${h}`;
              p.style.color = "#22c55e";
              elT.appendChild(p);
              setTimeout(() => p.remove(), 800);
            } else if (sk.ty.startsWith("buff_")) {
              t.buffs.push({ type: sk.ty, turns: 3 });
              const p = document.createElement("div");
              p.className = "dmg-pop";
              p.innerHTML = "BUFF!";
              p.style.color = "#3b82f6";
              elT.appendChild(p);
              setTimeout(() => p.remove(), 800);
            } else if (sk.ty === "turn") {
              t.buffs.push({ type: "atk_buff", turns: 2 });
              const p = document.createElement("div");
              p.className = "dmg-pop";
              p.innerHTML = "FÚRIA!";
              p.style.color = "#ef4444";
              elT.appendChild(p);
              setTimeout(() => p.remove(), 800);
            } else {
              elT.classList.add("hit");
              setTimeout(() => elT.classList.remove("hit"), 300);
              let m = 1,
                tc = "#fff",
                ex = "",
                at = atk.type,
                dt = t.type;
              if (
                (at == "Água" && dt == "Fogo") ||
                (at == "Fogo" && dt == "Vento") ||
                (at == "Vento" && dt == "Terra") ||
                (at == "Terra" && dt == "Água") ||
                (at == "Luz" && dt == "Trevas") ||
                (at == "Trevas" && dt == "Luz")
              ) {
                m = 1.2;
                tc = "#facc15";
                ex = "CRUSH! ";
              } else if (
                (at == "Fogo" && dt == "Água") ||
                (at == "Vento" && dt == "Fogo") ||
                (at == "Terra" && dt == "Vento") ||
                (at == "Água" && dt == "Terra")
              ) {
                m = 0.8;
                tc = "#9ca3af";
                ex = "Glance... ";
              }
              let ap = atk.atk;
              if (atk.buffs.some((b) => b.type === "atk_buff")) ap *= 1.5;
              let dp = 1;
              if (t.buffs.some((b) => b.type === "def_buff")) dp = 0.7;
              let slm = 1 + ((atk.skLvl[si] || 1) - 1) * 0.1;
              const dmg = Math.floor(ap * sk.m * m * dp * slm);
              t.cur = Math.max(0, t.cur - dmg);
              if (t.cur === 0) t.dead = true;
              let ch = 0.3 + ((atk.skLvl[si] || 1) - 1) * 0.05;
              if (
                (sk.ty.includes("debuff") ||
                  sk.ty === "poison" ||
                  sk.ty === "stun") &&
                Math.random() < ch
              ) {
                if (sk.ty === "stun") t.buffs.push({ type: "stun", turns: 1 });
                else t.buffs.push({ type: "poison", turns: 2 });
              }
              const p = document.createElement("div");
              p.className = "dmg-pop";
              p.innerHTML = `<span style="font-size:.5em">${ex}</span>${dmg}`;
              p.style.color = tc;
              elT.appendChild(p);
              setTimeout(() => p.remove(), 800);
            }
          }
        }
      });
      Battle.updateVisuals();
      b.idx++;
      setTimeout(Battle.turn, 500 / b.spd);
    }, 300 / b.spd);
  },
  end: function (w) {
    setTimeout(() => {
      if (w) {
        if (tmp.mode === "arena") {
          s.arena_pts += 10;
          UI.toast("Vitória! +10 Glória");
        }
        const ba = s.xp_boost_end_time && Date.now() < s.xp_boost_end_time,
          gs = tmp.lvl || 1;
        const rM = (2500 + gs * 100) * (ba ? 1.5 : 1),
          rX = (100 + gs * 20) * (ba ? 2 : 1);
        const sk =
          tmp.mode === "story"
            ? `s-${tmp.lvl}`
            : `d-${tmp.dungType}-${tmp.lvl}`;
        if (!s.cleared.includes(sk)) s.cleared.push(sk);
        if (tmp.mode === "story" && tmp.lvl === s.maxStage) {
          s.maxStage++;
          UI.toast("Nova Fase!");
        }
        if (tmp.mode === "tower" && tmp.lvl === s.maxTower) s.maxTower++;

        s.mana += rM;
        s.xp += rX;
        s.gems += 5;
        Core.updateMission("win");
        if (tmp.mode === "dung") Core.updateMission("dun_win");

        if (s.xp >= s.max_xp) {
          s.xp -= s.max_xp;
          s.p_lvl++;
          s.gems += 100;
          s.max_xp = Math.floor(s.max_xp * 1.5);
          UI.toast("LEVEL UP!");
        }

        el("end-mana").innerText = `+${formatNum(Math.floor(rM))}`;
        el("end-gems").innerText = "+5";
        el("rune-drop-msg").innerText = `+${Math.floor(rX)} XP`;

        if (tmp.mode === "dung") {
          let rt = "Raro",
            r = Math.random() * 100;
          if (tmp.lvl <= 3) {
            if (r > 90) rt = "Epico";
          } else if (tmp.lvl <= 7) {
            if (r > 95) rt = "Lendario";
            else if (r > 60) rt = "Epico";
          } else {
            if (r > 80) rt = "Lendario";
            else if (r > 40) rt = "Epico";
          }

          const ru = {
            id: runeIdCount++,
            type: ["hp", "atk", "def"][Math.floor(Math.random() * 3)],
            val: 10 + tmp.lvl * 2,
            lvl: 0,
            rarity: rt,
          };
          s.runes_inv.push(ru);
          el("rune-drop-msg").innerText += ` | ${ru.type} ${ru.rarity}`;
        }

        if (b.farmRuns > 1) {
          b.farmRuns--;
          el("farm-count").innerText = b.farmRuns;
          setTimeout(() => Battle.start(b.farmRuns), 1000);
          return;
        }
      }
      el("end-title").innerText = w ? "VITÓRIA" : "DERROTA";
      UI.modal("m-end", 1);
      Game.save();
      UI.upd();
    }, 1000);
  },
  close: function () {
    UI.modal("m-end", 0);
    if (tmp.mode === "story") {
      UI.nav("expl");
      const rid = Math.ceil(tmp.lvl / 8);
      el("expl-regions").style.display = "none";
      el("expl-stages-list").style.display = "flex";
      Core.renStageList(rid);
    } else if (tmp.mode === "dung") {
      UI.nav("dung");
      Core.selectDung(tmp.dungType);
    } else if (tmp.mode === "tower") {
      UI.nav("tower");
    } else if (tmp.mode === "arena") {
      Core.openArena();
    } else {
      UI.nav("hub");
    }
  },
};
