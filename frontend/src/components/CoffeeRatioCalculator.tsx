'use client';

import React, { useState, useRef, RefObject } from 'react';
import {
  ScaleIcon,
  ClockIcon,
  BeakerIcon,
  ShareIcon,
  BookmarkIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

/** Strong typings for keys used throughout */
type Strength = 'weak' | 'medium' | 'strong';
type MethodKey =
  | 'pour-over'
  | 'french-press'
  | 'espresso'
  | 'aeropress'
  | 'chemex'
  | 'cold-brew'
  | 'moka-pot'
  | 'v60';
type Units = 'metric' | 'imperial';

type RatioMeta = {
  name: string;
  icon: string;
  time: string;
  description: string;
  /** numeric brewing ratios (water : coffee) */
  values: Record<Strength, number>;
};

/** Coffee ratios by brewing method and strength (all numbers) */
const RATIOS: Record<MethodKey, RatioMeta> = {
  'pour-over': {
    values: { weak: 16, medium: 15, strong: 13 },
    name: 'Pour Over',
    icon: '☕',
    time: '3-4 min',
    description: 'Clean, bright flavors with good clarity'
  },
  'french-press': {
    values: { weak: 18, medium: 15, strong: 12 },
    name: 'French Press',
    icon: '🫖',
    time: '4-5 min',
    description: 'Full-bodied with rich, heavy mouthfeel'
  },
  espresso: {
    values: { weak: 3, medium: 2.2, strong: 1.8 },
    name: 'Espresso',
    icon: '☕',
    time: '25-30 sec',
    description: 'Concentrated, intense flavor with crema'
  },
  aeropress: {
    values: { weak: 17, medium: 14, strong: 11 },
    name: 'AeroPress',
    icon: '🔄',
    time: '2-3 min',
    description: 'Smooth, clean with low acidity'
  },
  chemex: {
    values: { weak: 17, medium: 15, strong: 13 },
    name: 'Chemex',
    icon: '⏳',
    time: '4-5 min',
    description: 'Clean, crisp with paper filter clarity'
  },
  'cold-brew': {
    values: { weak: 8, medium: 6, strong: 4 },
    name: 'Cold Brew',
    icon: '🧊',
    time: '12-24 hrs',
    description: 'Smooth, sweet, low acidity concentrate'
  },
  'moka-pot': {
    values: { weak: 12, medium: 10, strong: 8 },
    name: 'Moka Pot',
    icon: '⚡',
    time: '5-6 min',
    description: 'Strong, espresso-like with rich body'
  },
  v60: {
    values: { weak: 17, medium: 15, strong: 13 },
    name: 'V60',
    icon: '🌪️',
    time: '2.5-3.5 min',
    description: 'Bright, clean with excellent flavor clarity'
  }
};

/** Safe scroll (accepts nullables) */
const scrollToRef = <T extends HTMLElement>(ref: RefObject<T | null | undefined>) => {
  const el = ref?.current ?? null;
  if (!el) return;
  window.setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
};

/** Coerce custom ratio text to a valid positive number or NaN */
const coerceRatio = (input: string) => {
  const n = Number(input);
  return Number.isFinite(n) && n > 0 ? n : NaN;
};

export default function CoffeeRatioCalculator() {
  // State variables
  const [brewMethod, setBrewMethod] = useState<MethodKey | ''>('');
  const [servings, setServings] = useState<number>(2);
  const [strength, setStrength] = useState<Strength | ''>('');
  const [units, setUnits] = useState<Units | ''>('');
  const [customRatio, setCustomRatio] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [justSaved, setJustSaved] = useState(false);

  type SavedRecipe = {
    id: string;              // stable id for dedupe
    method: MethodKey;
    methodName: string;
    strength: Strength;
    servings: number;
    units: Units;
    ratio: number;
    water: number;           // ml
    coffee: number;          // g
    savedAt: number;         // epoch ms
  };
  
  const buildRecipe = (): SavedRecipe | null => {
    if (!brewMethod || !strength || !units) return null;
    const r = calculate();
    return {
      id: `${brewMethod}-${strength}-${servings}-${units}`,
      method: brewMethod,
      methodName: RATIOS[brewMethod].name,
      strength,
      servings,
      units,
      ratio: r.ratio,
      water: r.water,
      coffee: r.coffee,
      savedAt: Date.now(),
    };
  };
  
  const saveRecipe = () => {
    const recipe = buildRecipe();
    if (!recipe) return;
  
    try {
      const key = 'coffee-recipes';
      const existingRaw = localStorage.getItem(key);
      const existing: SavedRecipe[] = existingRaw ? JSON.parse(existingRaw) : [];
  
      // de-dupe by id; newest wins
      const filtered = existing.filter(r => r.id !== recipe.id);
      const updated = [recipe, ...filtered].slice(0, 50); // keep last 50
      localStorage.setItem(key, JSON.stringify(updated));
  
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1600);
    } catch {
      alert('Could not save recipe (storage not available).');
    }
  };  

  // Refs for scrolling - defined first
  const servingsRef = useRef<HTMLDivElement | null>(null);
  const strengthRef = useRef<HTMLDivElement | null>(null);
  const unitsRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Handler functions - defined after refs
  const handleMethodChange = (method: MethodKey) => {
    setBrewMethod(method);
    scrollToRef(servingsRef);
  };

  const handleServingsChange = (newServings: number) => {
    setServings(Math.max(1, Math.floor(Number(newServings) || 1)));
  };

  const handleStrengthChange = (newStrength: Strength) => {
    setStrength(newStrength);
    scrollToRef(unitsRef);
  };

  const handleUnitsChange = (newUnits: Units) => {
    setUnits(newUnits);
    scrollToRef(resultsRef);
  };

  // Calculations (all numeric & guarded)
  const calculate = () => {
    if (!brewMethod || !strength || !units) {
      return { water: 0, coffee: 0, ratio: 0 as number };
    }

    // base water per serving (ml). Espresso uses 30 ml singles; others ~240 ml mugs
    const baseWater = brewMethod === 'espresso' ? 30 : 240;
    const waterAmount = baseWater * servings;

    const custom = customRatio.trim() ? coerceRatio(customRatio.trim()) : NaN;
    const auto =
      brewMethod && strength ? RATIOS[brewMethod]?.values[strength] : undefined;

    // pick the first valid positive number
    const ratio = Number.isFinite(custom) && custom > 0 ? (custom as number)
      : typeof auto === 'number' && auto > 0
      ? auto
      : NaN;

    const coffeeAmount = Number.isFinite(ratio) && ratio > 0 ? waterAmount / ratio : 0;

    return {
      water: waterAmount,
      coffee: Math.round(coffeeAmount * 10) / 10,
      ratio: Number.isFinite(ratio) ? (ratio as number) : 0
    };
  };

  const convertUnits = (amount: number, type: 'water' | 'coffee') => {
    if (units === 'imperial') {
      if (type === 'water') {
        return {
          primary: `${Math.round(amount * 0.033814 * 10) / 10} fl oz`,
          secondary: `${Math.round((amount / 236.588) * 10) / 10} cups`
        };
      } else {
        return {
          primary: `${Math.round(amount * 0.035274 * 10) / 10} oz`,
          secondary: `${Math.round(amount * 0.00220462 * 100) / 100} lbs`
        };
      }
    }
    return {
      primary: type === 'water' ? `${amount} ml` : `${amount} g`,
      secondary:
        type === 'water'
          ? `${Math.round((amount / 1000) * 100) / 100} L`
          : `${Math.round((amount / 28.35) * 10) / 10} oz`
    };
  };

  const result = calculate();
  const waterDisplay = convertUnits(result.water, 'water');
  const coffeeDisplay = convertUnits(result.coffee, 'coffee');

  const shareRecipe = () => {
    const methodName = brewMethod ? RATIOS[brewMethod].name : 'coffee';
    const text = `Perfect ${methodName} recipe: ${result.coffee}g coffee + ${result.water}ml water = ${servings} perfect cup${servings > 1 ? 's' : ''}! ☕`;
    if (navigator.share) {
      navigator
        .share({
          title: 'Coffee Recipe',
          text,
          url: window.location.href
        })
        .catch(() => {
          /* ignore cancel */
        });
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('Recipe copied to clipboard!');
        })
        .catch(() => {
          alert(
            `Recipe to share:\n\n${text}\n\nCalculated using CoffeeLogik\u2019s Ratio Calculator!`
          );
        });
    }
  };

  const ProTips = ({ method }: { method: MethodKey | '' }) => {
    const tips: Record<MethodKey, string[]> = {
      'pour-over': [
        'Use a gooseneck kettle for precise pouring',
        'Bloom coffee for 30 seconds before continuing',
        'Pour in slow, circular motions'
      ],
      'french-press': [
        'Use coarse grind to prevent over-extraction',
        'Stir after 1 minute of steeping',
        'Press slowly to avoid bitter flavors'
      ],
      espresso: [
        'Aim for 25-30 second extraction time',
        'Water temperature: 200-205°F (93-96°C)',
        'Tamp with 30 lbs of pressure'
      ],
      aeropress: [
        'Use medium-fine grind size',
        'Water temperature: 195-205°F (90-96°C)',
        'Pre-wet filter to remove papery taste'
      ],
      chemex: [
        'Use medium-fine grind size',
        'Water temperature: 195-205°F (90-96°C)',
        'Pre-wet filter to remove papery taste'
      ],
      v60: [
        'Use medium-fine grind size',
        'Water temperature: 195-205°F (90-96°C)',
        'Pre-wet filter to remove papery taste'
      ],
      'cold-brew': [
        'Use coarse grind for best extraction',
        'Steep for 12-24 hours at room temperature',
        'Dilute concentrate 1:1 with water or milk'
      ],
      'moka-pot': [
        'Use medium-fine grind',
        'Fill water chamber to just below valve',
        'Remove from heat when coffee starts sputtering'
      ]
    };

    const list: string[] =
      (method && tips[method as MethodKey]) || tips['pour-over'];

    return (
      <ul className="space-y-2 text-sm text-gray-600">
        {list.map((tip, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <ScaleIcon className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  Perfect Ratios Every Time
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4 font-playfair">
              Coffee <span className="text-amber-600">Ratio Calculator</span>
            </h1>
            <p className="text-lg leading-8 text-gray-700 mb-6">
              Get the perfect coffee-to-water ratio for any brewing method. No more guessing, no more weak or bitter coffee.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Main Calculator */}
        <div className="-mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Let&rsquo;s make perfect coffee</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold ${
                      brewMethod ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {brewMethod ? <CheckIcon className="w-4 h-4" /> : '1'}
                  </div>
                  <span
                    className={`text-sm ${brewMethod ? 'text-green-600' : 'text-amber-600 font-semibold'}`}
                  >
                    Choose Method
                  </span>
                </div>
                <div className={`flex-1 h-0.5 ${brewMethod ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold ${
                      strength ? 'bg-green-500 text-white' : brewMethod ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {strength ? <CheckIcon className="w-4 h-4" /> : '2'}
                  </div>
                  <span
                    className={`text-sm ${
                      strength ? 'text-green-600' : brewMethod ? 'text-amber-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    Pick Strength
                  </span>
                </div>
                <div className={`flex-1 h-0.5 ${strength ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold ${
                      units ? 'bg-green-500 text-white' : strength ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {units ? <CheckIcon className="w-4 h-4" /> : '3'}
                  </div>
                  <span
                    className={`text-sm ${units ? 'text-green-600' : strength ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}
                  >
                    Choose Units
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Controls */}
              <div className="space-y-8">
                {/* Step 1: Brewing Method */}
                <div>
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                        brewMethod ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}
                    >
                      {brewMethod ? <CheckIcon className="w-4 h-4" /> : '1'}
                    </div>
                    <label className="text-base sm:text-lg font-semibold text-gray-900">
                      Choose Brewing Method
                    </label>
                    {brewMethod && <ChevronRightIcon className="w-5 h-5 text-green-500 ml-2" />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {Object.entries(RATIOS).map(([key, method]) => (
                      <button
                        key={key}
                        onClick={() => handleMethodChange(key as MethodKey)}
                        className={`group relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden min-h-[80px] sm:min-h-[90px] ${
                          brewMethod === key
                            ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 shadow-lg transform scale-105'
                            : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-700 hover:border-amber-300 hover:shadow-md hover:transform hover:scale-102'
                        }`}
                      >
                        <div
                          className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full transform translate-x-4 sm:translate-x-6 -translate-y-4 sm:-translate-y-6 transition-all duration-300 ${
                            brewMethod === key
                              ? 'bg-gradient-to-br from-amber-200 to-orange-200 opacity-60'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 opacity-40 group-hover:opacity-60'
                          }`}
                        ></div>

                        <div className="relative z-10">
                          <div className="font-semibold text-base sm:text-lg mb-2 leading-tight">
                            {method.name}
                          </div>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              brewMethod === key
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-amber-50 group-hover:text-amber-600'
                            }`}
                          >
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {method.time}
                          </div>
                          <div className="text-xs text-gray-500 mt-2 line-clamp-2 hidden sm:block">
                            {method.description}
                          </div>
                        </div>

                        {brewMethod === key && (
                          <div className="absolute top-3 right-3 w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Servings - Always visible and independent */}
                <div ref={servingsRef} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold bg-green-500 text-white">
                      <CheckIcon className="w-4 h-4" />
                    </div>
                    <label className="text-base font-semibold text-gray-700">Number of Servings</label>
                    <span className="ml-2 text-sm text-gray-500">
                      (Optional - adjust if needed, then continue below)
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-6">
                    <button
                      onClick={() => handleServingsChange(Math.max(1, servings - 1))}
                      disabled={servings === 1}
                      className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <div className="text-center min-w-[80px]">
                      <div className="text-2xl font-bold text-gray-700">{servings}</div>
                      <div className="text-xs text-gray-500">cup{servings !== 1 ? 's' : ''}</div>
                    </div>
                    <button
                      onClick={() => handleServingsChange(servings + 1)}
                      className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Step 2: Strength */}
                <div
                  ref={strengthRef}
                  className={`transition-all duration-500 ${brewMethod ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                        strength ? 'bg-green-500 text-white' : brewMethod ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {strength ? <CheckIcon className="w-4 h-4" /> : '2'}
                    </div>
                    <label className="text-base sm:text-lg font-semibold text-gray-900">Coffee Strength</label>
                    {brewMethod && !strength && (
                      <span className="ml-2 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        ← Choose one
                      </span>
                    )}
                    {strength && <ChevronRightIcon className="w-5 h-5 text-green-500 ml-2" />}
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {(['weak', 'medium', 'strong'] as Strength[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => handleStrengthChange(level)}
                        disabled={!brewMethod}
                        className={`py-3 sm:py-4 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 capitalize font-medium text-sm sm:text-base ${
                          strength === level
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : brewMethod
                            ? 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:shadow-md'
                            : 'border-gray-200 bg-white text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Units */}
                <div
                  ref={unitsRef}
                  className={`transition-all duration-500 ${strength ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                        units ? 'bg-green-500 text-white' : strength ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {units ? <CheckIcon className="w-4 h-4" /> : '3'}
                    </div>
                    <label className="text-base sm:text-lg font-semibold text-gray-900">Measurement Units</label>
                    {strength && !units && (
                      <span className="ml-2 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        ← Choose one
                      </span>
                    )}
                    {units && <ChevronRightIcon className="w-5 h-5 text-green-500 ml-2" />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'metric' as Units, label: 'Metric (g/ml)', desc: 'Grams & milliliters' },
                      { key: 'imperial' as Units, label: 'Imperial (oz/cups)', desc: 'Ounces & cups' }
                    ].map((unit) => (
                      <button
                        key={unit.key}
                        onClick={() => handleUnitsChange(unit.key)}
                        disabled={!strength}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          units === unit.key
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : strength
                            ? 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:shadow-md'
                            : 'border-gray-200 bg-white text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-medium text-sm sm:text-base">{unit.label}</div>
                        <div className="text-xs text-gray-600">{unit.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Options */}
                {units && (
                  <div>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
                    >
                      <ChartBarIcon className="mr-2 h-4 w-4" />
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                    </button>

                    {showAdvanced && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <label className="text-sm font-medium text-gray-900 mb-2 block">
                          Custom Ratio (1:{customRatio || 'auto'})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={customRatio}
                          onChange={(e) => setCustomRatio(e.target.value)}
                          placeholder={`${result.ratio} (current)`}
                          className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Override automatic ratio calculation
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Results */}
              <div ref={resultsRef} className="space-y-4 sm:space-y-6">
                {units && brewMethod && strength ? (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <CheckIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                          Perfect Recipe
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base">
                        For {servings} {strength}{' '}
                        {brewMethod ? RATIOS[brewMethod].name.toLowerCase() : 'coffee'} cup
                        {servings > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      {/* Coffee Amount */}
                      <div className="bg-white rounded-xl p-4 sm:p-6 text-center transform transition-all duration-300 hover:scale-105">
                        <div className="text-3xl sm:text-4xl lg:text-6xl mb-2">☕</div>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 mb-1">
                          {coffeeDisplay.primary}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">{coffeeDisplay.secondary}</div>
                        <div className="text-sm font-medium text-gray-900">Coffee</div>
                      </div>

                      {/* Water Amount */}
                      <div className="bg-white rounded-xl p-4 sm:p-6 text-center transform transition-all duration-300 hover:scale-105">
                        <div className="text-3xl sm:text-4xl lg:text-6xl mb-2">💧</div>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                          {waterDisplay.primary}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">{waterDisplay.secondary}</div>
                        <div className="text-sm font-medium text-gray-900">Water</div>
                      </div>

                      {/* Ratio Info */}
                      <div className="bg-white rounded-xl p-4 text-center">
                        <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                          Ratio: 1:{result.ratio}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">
                          {brewMethod ? RATIOS[brewMethod].description : ''}
                        </div>
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          {brewMethod ? RATIOS[brewMethod].time : ''}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                      <button
                        onClick={shareRecipe}
                        className="flex-1 bg-amber-600 text-white px-4 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                      >
                        <ShareIcon className="mr-2 h-4 w-4" />
                        Share Recipe
                      </button>
                      <button className="bg-white border-2 border-amber-600 text-amber-600 px-4 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-50 transition-colors flex items-center justify-center">
                        <BookmarkIcon className="mr-2 h-4 w-4" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <ScaleIcon className="w-16 h-16 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Your Perfect Recipe Awaits</h3>
                    <p className="text-gray-400 text-sm">Complete the steps above to see your coffee ratio</p>
                  </div>
                )}

                {/* Tips - Only show when we have a brewing method */}
                {brewMethod && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                      <BeakerIcon className="mr-2 h-4 sm:h-5 w-4 sm:w-5 text-amber-600" />
                      Pro Tips for {RATIOS[brewMethod].name}
                    </h4>
                    <ProTips method={brewMethod} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Why Coffee Ratios Matter</h2>
            <p className="text-lg text-gray-600">Understanding the science behind perfect coffee extraction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ScaleIcon className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consistency</h3>
              <p className="text-gray-600 text-sm">
                Using precise ratios ensures your coffee tastes the same every time you brew.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BeakerIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Extraction</h3>
              <p className="text-gray-600 text-sm">
                Proper ratios optimize extraction, balancing sweetness, acidity, and bitterness.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customization</h3>
              <p className="text-gray-600 text-sm">
                Adjust ratios to match your taste preferences and bean characteristics.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What&rsquo;s the golden ratio for coffee?</h4>
                <p className="text-gray-600 text-sm">
                  The &quot;golden ratio&quot; is generally 1:15 to 1:17 (coffee to water), but this varies by brewing
                  method and personal preference.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Should I weigh coffee and water?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! Weighing is much more accurate than volume measurements and leads to more consistent results.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How do I adjust for different bean types?</h4>
                <p className="text-gray-600 text-sm">
                  Darker roasts may need slightly less coffee (higher ratio number), while lighter roasts often benefit
                  from more coffee (lower ratio number).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
