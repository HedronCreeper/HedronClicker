import React, { useEffect, useRef, useState } from 'react';
import './WeatherLayer.css';

/* ─── Raindrop generator ─── */
function RainLayer({ heavy }) {
  const [drops, setDrops] = useState([]);
  const nextId = useRef(0);
  const count  = heavy ? 120 : 60;

  useEffect(() => {
    // Generate a fixed set of drops on mount
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 0.4 + Math.random() * 0.5,
      delay: -(Math.random() * 2),
      opacity: heavy ? 0.55 + Math.random() * 0.45 : 0.3 + Math.random() * 0.3,
      width: heavy ? 2 + Math.random() * 2 : 1 + Math.random(),
      height: heavy ? 18 + Math.random() * 14 : 12 + Math.random() * 8,
    }));
    setDrops(generated);
  }, [count]);

  return (
    <div className={`rain-layer${heavy ? ' heavy' : ''}`}>
      {drops.map(d => (
        <div
          key={d.id}
          className="raindrop"
          style={{
            left: d.left + '%',
            animationDuration: d.duration + 's',
            animationDelay: d.delay + 's',
            opacity: d.opacity,
            width: d.width + 'px',
            height: d.height + 'px',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Storm clouds ─── */
function StormClouds() {
  return (
    <div className="storm-clouds">
      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="cloud c3" />
      <div className="cloud c4" />
    </div>
  );
}

/* ─── Sun overlay ─── */
function SunOverlay() {
  return (
    <>
      <div className="sun-overlay" />
      <div className="sun-orb">
        <div className="sun-core" />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 45}deg)` }} />
        ))}
      </div>
    </>
  );
}

/* ─── Lightning flash ─── */
function LightningFlash({ active }) {
  return (
    <div className={`lightning-flash${active ? ' active' : ''}`}>
      <svg className="lightning-bolt" viewBox="0 0 60 200" xmlns="http://www.w3.org/2000/svg">
        <polyline
          points="35,0 15,90 28,90 10,200 50,80 34,80 55,0"
          fill="#fffb00"
          stroke="#ffffff"
          strokeWidth="2"
          filter="url(#lglow)"
        />
        <defs>
          <filter id="lglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Weather status indicator ─── */
function WeatherIndicator({ weather, isBurning, isShrunken }) {
  if (!weather) return null;
  const label =
    weather === 'sun'          ? '☀️ Sunny'       :
    weather === 'rain'         ? '🌧️ Raining'      :
                                 '⛈️ Thunderstorm';
  return (
    <div className={`weather-indicator weather-${weather}`}>
      <span className="weather-label">{label}</span>
      {isBurning  && <span className="weather-status burning">🔥 BURNING</span>}
      {isShrunken && <span className="weather-status shrunken">💧 SHRUNKEN</span>}
    </div>
  );
}

/* ─── Main export ─── */
export default function WeatherLayer({ weather, isBurning, isShrunken, lightningStrike }) {
  return (
    <>
      {/* Per-weather background effects */}
      {weather === 'sun'          && <SunOverlay />}
      {weather === 'rain'         && <RainLayer heavy={false} />}
      {weather === 'thunderstorm' && (
        <>
          <StormClouds />
          <RainLayer heavy={true} />
          <LightningFlash active={lightningStrike} />
        </>
      )}
      <WeatherIndicator weather={weather} isBurning={isBurning} isShrunken={isShrunken} />
    </>
  );
}
