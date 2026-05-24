/**
 * Game constants and data
 */

export const BOSS_NAMES = [
  'Shadow Lord','Void Beast','Dark Titan','Chaos Wraith',
  'Doom Herald','Nightmare King','Abyss Walker','Infernal Guard',
  'Frost Phantom','Storm Colossus'
];
export const BOSS_SYMBOLS = ['👹','🐉','💀','👾','🦇','🔥','⚡','🌑','👻','🗡️'];

export const DAILY_BASE_REWARDS = [100, 200, 500, 1000, 10000, 50000, 100000];

export const SKINS = [
  { id: 'default',   name: 'Default',  cost: 0,       type: 'preset' },
  { id: 'creeper',   name: 'Creeper',  cost: 1000,    type: 'preset' },
  { id: 'fire',      name: 'Fire',     cost: 20000,   type: 'preset' },
  { id: 'obsidian',  name: 'Obsidian', cost: 50000,   type: 'preset' },
  { id: 'gold',      name: 'Gold',     cost: 100000,  type: 'preset' },
  { id: 'custom',    name: 'Custom',   cost: 1000000, type: 'custom'  },
];

export const THEMES = [
  { id: 'default',    label: 'Neon',     dots: ['#00f0ff','#ff00e5','#7b2fff'] },
  { id: 'warm',       label: 'Warm',     dots: ['#ff6b35','#ff006e','#ffbe0b'] },
  { id: 'matrix',     label: 'Matrix',   dots: ['#00ff41','#00cc33','#39ff14'] },
  { id: 'ocean',      label: 'Ocean',    dots: ['#00b4d8','#0077b6','#48cae4'] },
  { id: 'sunset',     label: 'Sunset',   dots: ['#ff9a9e','#fecfef','#feada6'] },
  { id: 'cyberpunk',  label: 'Cyber',    dots: ['#fcee0a','#00f0ff','#ff003c'] },
  { id: 'royal',      label: 'Royal',    dots: ['#ffd700','#c0c0c0','#9370db'] },
  { id: 'forest',     label: 'Forest',   dots: ['#2ecc71','#27ae60','#1abc9c'] },
  { id: 'ice',        label: 'Ice',      dots: ['#0288d1','#03a9f4','#4fc3f7'] },
  { id: 'mono',       label: 'Mono',     dots: ['#ffffff','#cccccc','#999999'] },
  { id: 'vapor',      label: 'Vapor',    dots: ['#ff71ce','#01cdfe','#05ffa1'] },
  { id: 'halloween',  label: 'Spooky',   dots: ['#ff7518','#8a2be2','#00ff00'] },
  { id: 'blood',      label: 'Blood',    dots: ['#ff0000','#8b0000','#dc143c'] },
  { id: 'gold_theme', label: 'Gold',     dots: ['#ffd700','#ffaa00','#ffea00'] },
];

export const THEME_VARS = {
  default:    { bg: '#0a0a1a', bg2: '#12122a', panel: 'rgba(20,20,50,0.7)',   a1: '#00f0ff', a2: '#ff00e5', a3: '#7b2fff', a4: '#ff6b35', text: '#e8e8ff', text2: '#8888bb' },
  warm:       { bg: '#1a0a0a', bg2: '#2a1212', panel: 'rgba(50,20,20,0.7)',   a1: '#ff6b35', a2: '#ff006e', a3: '#ffbe0b', a4: '#ff00e5', text: '#ffe8e8', text2: '#bb8888' },
  matrix:     { bg: '#0a1a0a', bg2: '#122a12', panel: 'rgba(20,50,20,0.7)',   a1: '#00ff41', a2: '#00cc33', a3: '#39ff14', a4: '#00ff41', text: '#e8ffe8', text2: '#88bb88' },
  ocean:      { bg: '#0a0a2e', bg2: '#12124a', panel: 'rgba(20,20,70,0.7)',   a1: '#00b4d8', a2: '#0077b6', a3: '#48cae4', a4: '#90e0ef', text: '#e8f0ff', text2: '#8899bb' },
  sunset:     { bg: '#2d1b2e', bg2: '#442638', panel: 'rgba(68,38,56,0.7)',   a1: '#ff9a9e', a2: '#fecfef', a3: '#feada6', a4: '#f5efef', text: '#fff0f5', text2: '#dcb0c0' },
  cyberpunk:  { bg: '#050505', bg2: '#111111', panel: 'rgba(20,20,20,0.8)',   a1: '#fcee0a', a2: '#00f0ff', a3: '#ff003c', a4: '#00ff9f', text: '#ffffff', text2: '#aaaaaa' },
  royal:      { bg: '#1a0b2e', bg2: '#2d1b4e', panel: 'rgba(45,27,78,0.7)',  a1: '#ffd700', a2: '#c0c0c0', a3: '#9370db', a4: '#daa520', text: '#f0e6ff', text2: '#b0a0d0' },
  forest:     { bg: '#0f1a0f', bg2: '#1a2e1a', panel: 'rgba(26,46,26,0.7)',  a1: '#2ecc71', a2: '#27ae60', a3: '#1abc9c', a4: '#f1c40f', text: '#e8f5e9', text2: '#81c784' },
  ice:        { bg: '#e3f2fd', bg2: '#bbdefb', panel: 'rgba(255,255,255,0.6)',a1: '#0288d1', a2: '#03a9f4', a3: '#4fc3f7', a4: '#b3e5fc', text: '#01579b', text2: '#0277bd' },
  mono:       { bg: '#121212', bg2: '#1e1e1e', panel: 'rgba(30,30,30,0.8)',   a1: '#ffffff', a2: '#cccccc', a3: '#999999', a4: '#666666', text: '#ffffff', text2: '#aaaaaa' },
  vapor:      { bg: '#2b0f54', bg2: '#461880', panel: 'rgba(70,24,128,0.6)',  a1: '#ff71ce', a2: '#01cdfe', a3: '#05ffa1', a4: '#b967ff', text: '#fffbff', text2: '#dcb0ff' },
  halloween:  { bg: '#1a0505', bg2: '#2e0a0a', panel: 'rgba(46,10,10,0.7)',  a1: '#ff7518', a2: '#8a2be2', a3: '#00ff00', a4: '#ffff00', text: '#ffe0b2', text2: '#cc8855' },
  blood:      { bg: '#200000', bg2: '#3a0000', panel: 'rgba(58,0,0,0.7)',     a1: '#ff0000', a2: '#8b0000', a3: '#dc143c', a4: '#ff4500', text: '#ffcccc', text2: '#cc6666' },
  gold_theme: { bg: '#1a1500', bg2: '#2e2600', panel: 'rgba(46,38,0,0.7)',   a1: '#ffd700', a2: '#ffaa00', a3: '#ffea00', a4: '#b8860b', text: '#fff8dc', text2: '#daa520' },
};

export const SKIN_COLORS = {
  default:  null,
  creeper:  { body: '#00AA00', face: '#000000' },
  fire:     { body: '#CC0000', face: '#330000' },
  obsidian: { body: '#1a1a1a', face: '#000000' },
  gold:     { body: '#FFD700', face: '#B8860B' },
};

export const DEFAULT_UPGRADES = [
  { name: 'Faster Clicks',    baseCost: 100,   cost: 100,   level: 0, effect: 1, type: 'click' },
  { name: 'Faster Clicks Pro',baseCost: 1000,  cost: 1000,  level: 0, effect: 5, type: 'click_pro' }, // NEW
  { name: 'Auto Clicker',     baseCost: 500,   cost: 500,   level: 0, effect: 1, type: 'auto'  },
  { name: 'Auto Clicker Pro', baseCost: 10000, cost: 10000, level: 0, effect: 5, type: 'auto'  },
  { name: 'Critical Chance',  baseCost: 10000, cost: 10000, level: 0, effect: 1, type: 'crit'  },
  { name: 'Super Critical Hit', baseCost: 10000, cost: 10000, level: 0, effect: 0.1, type: 'super_crit' },
  { name: 'Heal Creeper',     baseCost: 1000,  cost: 1000,  level: 0, effect: 1, type: 'heal'  },
];

export const UPGRADE_ICONS = ['👆','⚡','🤖','⚙','💥','🔮','❤️']; // Added '⚡'
export const UPGRADE_ICON_TYPES = ['icon-click','icon-click-pro','icon-auto','icon-pro','icon-crit','icon-supercrit','icon-heal']; // Added 'icon-click-pro'
export const UPGRADE_DESCS = [
  '+1 click power per purchase',
  '+5 click power per purchase', // NEW description
  '+1 point per second',
  '+5 points per second',
  '+1% critical hit chance (2x damage)',
  'When a normal crit lands, each level adds +0.1% chance to escalate it into a super crit — 5× the crit’s payout (10× your boosted tap). Unlocks once you reach 50% crit chance. Watch for the violet flash.',
  'Restore 1 HP to your Creeper',
];
