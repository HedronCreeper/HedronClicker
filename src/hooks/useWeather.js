import { useState, useEffect, useRef, useCallback } from 'react';

const WEATHER_ROLL = () => {
  const r = Math.random();
  if (r < 0.20) return 'thunderstorm';
  if (r < 0.70) return 'sun';
  return 'rain';
};

const WEATHER_DURATION  = 5 * 60 * 1000;
const WEATHER_INTERVAL  = 10 * 60 * 1000;
const SUN_BURN_DELAY    = 3 * 60 * 1000;
const RAIN_SHRINK_DELAY = 3 * 60 * 1000;

export function useWeather({ creeperHPRef, setCreeperHP, hasCapAccessory, showToast }) {
  const [weather,         setWeather]   = useState(null);
  const [isBurning,       setIsBurning] = useState(false);
  const [isShrunken,    setIsShrunken]  = useState(false);
  const [lightningStrike, setLightning] = useState(false);

  const weatherTimer      = useRef(null);
  const rollTimer         = useRef(null);
  const burnDelayTimer    = useRef(null);
  const burnTickTimer     = useRef(null);
  const shrinkDelayTimer  = useRef(null);
  const lightningInterval = useRef(null);
  const currentWeatherRef = useRef(null);

  // Keep hasCapAccessory accessible inside intervals without stale closure
  const hasCapRef = useRef(hasCapAccessory);
  useEffect(() => { hasCapRef.current = hasCapAccessory; }, [hasCapAccessory]);

  function clearAllWeatherTimers() {
    clearTimeout(burnDelayTimer.current);
    clearInterval(burnTickTimer.current);
    clearTimeout(shrinkDelayTimer.current);
    clearInterval(lightningInterval.current);
    clearTimeout(weatherTimer.current);
  }

  function endWeather() {
    clearAllWeatherTimers();
    setWeather(null);
    currentWeatherRef.current = null;
    setIsBurning(false);
    setIsShrunken(false);
    setLightning(false);
  }

  function triggerLightning() {
    setLightning(true);
    setTimeout(() => setLightning(false), 600);
    creeperHPRef.current = Math.max(0, creeperHPRef.current - 90);
    setCreeperHP(creeperHPRef.current);
    showToast('⚡ Lightning struck your Creeper! -90 HP!', 'error');
    if (creeperHPRef.current <= 0) {
      clearAllWeatherTimers();
      localStorage.clear();
      alert('⚡ Your Creeper was struck by lightning and died! All progress has been wiped.');
      window.location.reload();
    }
  }

  const startWeather = useCallback((type) => {
    clearAllWeatherTimers();
    setWeather(type);
    currentWeatherRef.current = type;
    setIsBurning(false);
    setIsShrunken(false);
    setLightning(false);

    showToast(
      type === 'sun'          ? '☀️ Sunny weather has arrived!' :
      type === 'rain'         ? "🌧️ It's starting to rain!"     :
                                '⛈️ Thunderstorm incoming!',
      type === 'thunderstorm' ? 'error' : ''
    );

    // SUN
    if (type === 'sun' && !hasCapRef.current) {
      burnDelayTimer.current = setTimeout(() => {
        if (currentWeatherRef.current !== 'sun') return;
        setIsBurning(true);
        showToast('🔥 Your Creeper is burning! Buy a Cap in Accessories!', 'error');
        burnTickTimer.current = setInterval(() => {
          creeperHPRef.current = Math.max(0, creeperHPRef.current - 1);
          setCreeperHP(creeperHPRef.current);
          if (creeperHPRef.current <= 0) {
            clearInterval(burnTickTimer.current);
            localStorage.clear();
            alert('🔥 Your Creeper burned to death! All progress has been wiped.');
            window.location.reload();
          }
        }, 1000);
      }, SUN_BURN_DELAY);
    }

    // RAIN
    if (type === 'rain') {
      shrinkDelayTimer.current = setTimeout(() => {
        if (currentWeatherRef.current !== 'rain') return;
        setIsShrunken(true);
        showToast('💧 The rain shrunk your Creeper! Harder to click!', '');
      }, RAIN_SHRINK_DELAY);
    }

    // THUNDERSTORM
    if (type === 'thunderstorm') {
      lightningInterval.current = setInterval(() => {
        if (Math.random() < 0.001) triggerLightning();
      }, 1000);
    }

    // Auto-end after duration
    weatherTimer.current = setTimeout(() => {
      endWeather();
      showToast('🌤️ Weather cleared.', '');
    }, WEATHER_DURATION);
  }, [creeperHPRef, setCreeperHP, showToast]);

  // Stop burning immediately when cap is purchased
  useEffect(() => {
    if (hasCapAccessory && isBurning) {
      setIsBurning(false);
      clearTimeout(burnDelayTimer.current);
      clearInterval(burnTickTimer.current);
      showToast('🧢 The cap is protecting your Creeper from the sun!', 'success');
    }
  }, [hasCapAccessory, isBurning, showToast]);

  // Roll weather on a schedule
  useEffect(() => {
    const scheduleRoll = () => {
      rollTimer.current = setTimeout(() => {
        startWeather(WEATHER_ROLL());
        scheduleRoll();
      }, WEATHER_INTERVAL);
    };
    scheduleRoll();
    return () => {
      clearTimeout(rollTimer.current);
      clearAllWeatherTimers();
    };
  }, [startWeather]);

  return { weather, isBurning, isShrunken, lightningStrike, startWeather };
}
