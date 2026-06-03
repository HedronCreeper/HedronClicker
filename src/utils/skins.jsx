// SVG generators for skins
export function getDefaultHedronSVG() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00f0ff" stopOpacity="0.9" />
          <stop offset="50%"  stopColor="#7b2fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff00e5" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#00f0ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff00e5" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="hg3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#7b2fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <polygon points="100,15 175,55 175,145 100,185 25,145 25,55"
               fill="none" stroke="url(#hg1)" strokeWidth="2" filter="url(#glow)" opacity="0.8"/>
      <polygon points="100,15 175,55 100,100"    fill="url(#hg2)" stroke="url(#hg1)" strokeWidth="1" opacity="0.7"/>
      <polygon points="175,55 175,145 100,100"   fill="url(#hg3)" stroke="url(#hg1)" strokeWidth="1" opacity="0.5"/>
      <polygon points="175,145 100,185 100,100"  fill="url(#hg2)" stroke="url(#hg1)" strokeWidth="1" opacity="0.6"/>
      <polygon points="100,185 25,145 100,100"   fill="url(#hg3)" stroke="url(#hg1)" strokeWidth="1" opacity="0.4"/>
      <polygon points="25,145 25,55 100,100"     fill="url(#hg2)" stroke="url(#hg1)" strokeWidth="1" opacity="0.55"/>
      <polygon points="25,55 100,15 100,100"     fill="url(#hg3)" stroke="url(#hg1)" strokeWidth="1" opacity="0.65"/>
      <circle cx="100" cy="100" r="15" fill="url(#hg1)" opacity="0.3" filter="url(#glow)"/>
      <circle cx="100" cy="100" r="6"  fill="#fff" opacity="0.6"/>
      <line x1="100" y1="15"  x2="100" y2="100" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5"/>
      <line x1="175" y1="55"  x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <line x1="175" y1="145" x2="100" y2="100" stroke="rgba(255,255,255,0.1)"  strokeWidth="0.5"/>
      <line x1="100" y1="185" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <line x1="25"  y1="145" x2="100" y2="100" stroke="rgba(255,255,255,0.1)"  strokeWidth="0.5"/>
      <line x1="25"  y1="55"  x2="100" y2="100" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5"/>
    </svg>
  );
}

export function getCreeperSVG(bodyColor, faceColor) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="0"   y="0"   width="200" height="200" fill={bodyColor} rx="10"/>
      <rect x="40"  y="60"  width="40"  height="40"  fill={faceColor}/>
      <rect x="120" y="60"  width="40"  height="40"  fill={faceColor}/>
      <rect x="80"  y="100" width="40"  height="40"  fill={faceColor}/>
      <rect x="60"  y="140" width="20"  height="40"  fill={faceColor}/>
      <rect x="120" y="140" width="20"  height="40"  fill={faceColor}/>
      <rect x="80"  y="140" width="40"  height="20"  fill={faceColor}/>
      <rect x="40"  y="60"  width="10"  height="10"  fill="rgba(0,0,0,0.2)"/>
      <rect x="120" y="60"  width="10"  height="10"  fill="rgba(0,0,0,0.2)"/>
    </svg>
  );
}

export function getSkinSVG(skinId, customColors) {
  if (skinId === 'default') return getDefaultHedronSVG();
  const colorMap = {
    creeper:  { body: '#00AA00', face: '#000000' },
    fire:     { body: '#CC0000', face: '#330000' },
    obsidian: { body: '#1a1a1a', face: '#000000' },
    gold:     { body: '#FFD700', face: '#B8860B' },
    custom:   customColors || { body: '#00AA00', face: '#000000' },
  };
  const colors = colorMap[skinId] || colorMap.creeper;
  return getCreeperSVG(colors.body, colors.face);
}
