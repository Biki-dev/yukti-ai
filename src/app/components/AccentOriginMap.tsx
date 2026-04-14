'use client';

import { motion } from 'framer-motion';

interface CityConfig {
  x: number;
  y: number;
  name: string;
  regionName: string;
}

// India outline path (simplified)
const INDIA_PATH = "M 155,30 L 175,35 L 195,50 L 205,75 L 215,95 L 220,120 L 210,145 L 195,165 L 175,180 L 155,185 L 130,180 L 110,165 L 95,145 L 85,120 L 80,95 L 85,70 L 100,50 L 125,35 Z";
const INDIA_VIEWBOX = "0 0 300 220";

// City coordinates within the India viewBox
const CITY_CONFIGS: Record<string, CityConfig> = {
  northeast: { x: 210, y: 85, name: 'Guwahati', regionName: 'Northeast India' },
  bengal: { x: 195, y: 110, name: 'Kolkata', regionName: 'West Bengal' },
  tamil: { x: 165, y: 160, name: 'Chennai', regionName: 'Tamil Nadu' },
  hindi: { x: 145, y: 85, name: 'Lucknow', regionName: 'North India' },
  punjab: { x: 115, y: 55, name: 'Amritsar', regionName: 'Punjab & Haryana' },
  maharashtra: { x: 115, y: 130, name: 'Mumbai', regionName: 'Maharashtra' },
  telugu: { x: 145, y: 145, name: 'Hyderabad', regionName: 'Andhra Pradesh' },
  karnataka: { x: 145, y: 158, name: 'Bengaluru', regionName: 'Karnataka' },
  kerala: { x: 135, y: 178, name: 'Thiruvananthapuram', regionName: 'Kerala' },
  gujarat: { x: 105, y: 115, name: 'Ahmedabad', regionName: 'Gujarat' },
  odisha: { x: 185, y: 125, name: 'Bhubaneswar', regionName: 'Odisha' },
  default: { x: 130, y: 72, name: 'New Delhi', regionName: 'India' },
};

// Approximate region highlight ellipses (cx, cy, rx, ry)
const REGION_HIGHLIGHTS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  northeast: { cx: 210, cy: 85, rx: 25, ry: 20 },
  bengal: { cx: 195, cy: 110, rx: 20, ry: 18 },
  tamil: { cx: 165, cy: 160, rx: 22, ry: 25 },
  hindi: { cx: 145, cy: 85, rx: 30, ry: 25 },
  punjab: { cx: 115, cy: 55, rx: 22, ry: 18 },
  maharashtra: { cx: 115, cy: 130, rx: 25, ry: 22 },
  telugu: { cx: 145, cy: 145, rx: 28, ry: 20 },
  karnataka: { cx: 145, cy: 158, rx: 22, ry: 20 },
  kerala: { cx: 135, cy: 178, rx: 15, ry: 18 },
  gujarat: { cx: 105, cy: 115, rx: 20, ry: 22 },
  odisha: { cx: 185, cy: 125, rx: 18, ry: 20 },
  default: { cx: 130, cy: 72, rx: 25, ry: 20 },
};

// World map context for non-India accents (simplified world outline)
const WORLD_PATH = "M 20,60 Q 40,30 80,35 Q 120,25 160,40 Q 200,30 240,45 Q 270,55 280,90 Q 275,130 250,150 Q 220,170 180,165 Q 140,170 100,160 Q 60,150 35,120 Q 15,90 20,60 Z";
const WORLD_VIEWBOX = "0 0 300 180";

// World locations for UK, USA, Australia
const WORLD_LOCATIONS: Record<string, CityConfig & { highlightCx: number; highlightCy: number; highlightR: number }> = {
  uk: { x: 135, y: 55, name: 'London', regionName: 'United Kingdom', highlightCx: 135, highlightCy: 55, highlightR: 18 },
  usa: { x: 60, y: 65, name: 'New York', regionName: 'United States', highlightCx: 70, highlightCy: 70, highlightR: 35 },
  australia: { x: 240, y: 125, name: 'Sydney', regionName: 'Australia', highlightCx: 235, highlightCy: 120, highlightR: 30 },
};

function detectRegion(accentIdentified: string): string {
  const accent = accentIdentified.toLowerCase();

  // Northeast India
  if (accent.includes('assamese') || accent.includes('assam') || accent.includes('northeast')) {
    return 'northeast';
  }

  // Bengal
  if (accent.includes('bengali') || accent.includes('west bengal') || accent.includes('kolkata') || accent.includes('bengal')) {
    return 'bengal';
  }

  // Tamil
  if (accent.includes('tamil') || accent.includes('chennai') || accent.includes('tamil')) {
    return 'tamil';
  }

  // Hindi/North
  if (accent.includes('hindi') || accent.includes('up ') || accent.includes('bihar') || accent.includes('north indian') || accent.includes('delhi')) {
    return 'hindi';
  }

  // Punjab
  if (accent.includes('punjabi') || accent.includes('haryana') || accent.includes('punjab')) {
    return 'punjab';
  }

  // Maharashtra
  if (accent.includes('marathi') || accent.includes('maharashtra') || accent.includes('mumbai')) {
    return 'maharashtra';
  }

  // Telugu
  if (accent.includes('telugu') || accent.includes('andhra') || accent.includes('hyderabad')) {
    return 'telugu';
  }

  // Karnataka
  if (accent.includes('kannada') || accent.includes('karnataka') || accent.includes('bangalore') || accent.includes('bengaluru')) {
    return 'karnataka';
  }

  // Kerala
  if (accent.includes('malayalam') || accent.includes('kerala')) {
    return 'kerala';
  }

  // Gujarat
  if (accent.includes('gujarati') || accent.includes('gujarat')) {
    return 'gujarat';
  }

  // Odisha
  if (accent.includes('odia') || accent.includes('odisha') || accent.includes('orissa')) {
    return 'odisha';
  }

  // UK/British
  if (accent.includes('british') || accent.includes('rp') || accent.includes('uk') || accent.includes('english')) {
    return 'uk';
  }

  // US/American
  if (accent.includes('american') || accent.includes('general american') || accent.includes('us ')) {
    return 'usa';
  }

  // Australian
  if (accent.includes('australian') || accent.includes('aussie')) {
    return 'australia';
  }

  // Default fallback
  return 'default';
}

function isWorldRegion(region: string): boolean {
  return ['uk', 'usa', 'australia'].includes(region);
}

export function AccentOriginMap({ accentIdentified }: { accentIdentified: string }) {
  const region = detectRegion(accentIdentified);
  const isWorld = isWorldRegion(region);

  if (isWorld) {
    const config = WORLD_LOCATIONS[region];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginTop: 14 }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Origin Region
        </div>

        <svg width={180} height={108} viewBox={WORLD_VIEWBOX} style={{ display: 'block' }}>
          {/* World map outline */}
          <path
            d={WORLD_PATH}
            fill="rgba(0,0,0,0.03)"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={1}
          />

          {/* Highlighted region */}
          <motion.ellipse
            cx={config.highlightCx}
            cy={config.highlightCy}
            rx={config.highlightR}
            ry={config.highlightR * 0.8}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            fill="rgba(20,184,166,0.15)"
            stroke="rgba(20,184,166,0.6)"
            strokeWidth={1.5}
          />

          {/* Pulsing city dot */}
          <motion.circle
            cx={config.x}
            cy={config.y}
            r={4}
            fill="var(--teal)"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Static center dot */}
          <circle cx={config.x} cy={config.y} r={3} fill="var(--teal)" />

          {/* City label */}
          <text
            x={config.x}
            y={config.y + 14}
            fontSize={8}
            fontFamily="var(--font-mono)"
            fill="rgba(0,0,0,0.5)"
            textAnchor="middle"
          >
            {config.name}
          </text>

          {/* Region label */}
          <text
            x={150}
            y={20}
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="rgba(0,0,0,0.4)"
            textAnchor="middle"
          >
            {config.regionName}
          </text>
        </svg>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--teal)',
          marginTop: 6,
          letterSpacing: '0.04em',
        }}>
          ● {config.name} · {config.regionName}
        </div>
      </motion.div>
    );
  }

  // India map
  const cityConfig = CITY_CONFIGS[region] || CITY_CONFIGS.default;
  const highlight = REGION_HIGHLIGHTS[region] || REGION_HIGHLIGHTS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 14 }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-secondary)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        Origin Region
      </div>

      <svg width={180} height={132} viewBox={INDIA_VIEWBOX} style={{ display: 'block' }}>
        {/* India outline */}
        <path
          d={INDIA_PATH}
          fill="rgba(0,0,0,0.03)"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={1}
        />

        {/* Highlighted region ellipse */}
        <motion.ellipse
          cx={highlight.cx}
          cy={highlight.cy}
          rx={highlight.rx}
          ry={highlight.ry}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          fill="rgba(20,184,166,0.2)"
          stroke="rgba(20,184,166,0.7)"
          strokeWidth={1.5}
        />

        {/* Pulsing city dot */}
        <motion.circle
          cx={cityConfig.x}
          cy={cityConfig.y}
          r={4}
          fill="var(--teal)"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Static center dot */}
        <circle cx={cityConfig.x} cy={cityConfig.y} r={3} fill="var(--teal)" />

        {/* City label */}
        <text
          x={cityConfig.x}
          y={cityConfig.y + 14}
          fontSize={8}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.5)"
          textAnchor="middle"
        >
          {cityConfig.name}
        </text>

        {/* Region label */}
        <text
          x={150}
          y={20}
          fontSize={9}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.4)"
          textAnchor="middle"
        >
          {cityConfig.regionName}
        </text>
      </svg>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--teal)',
        marginTop: 6,
        letterSpacing: '0.04em',
      }}>
        ● {cityConfig.name} · {cityConfig.regionName}
      </div>
    </motion.div>
  );
}
