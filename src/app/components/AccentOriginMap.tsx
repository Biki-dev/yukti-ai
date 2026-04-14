'use client';

import { motion } from 'framer-motion';

interface MapConfig {
  highlightPaths: string[];
  contextPaths: string[];
  cityX: number;
  cityY: number;
  cityName: string;
  regionName: string;
  labelX: number;
  labelY: number;
}

const MAP_CONFIGS: Record<string, MapConfig> = {
  northeast: {
    highlightPaths: ['M 70,52 C 80,48 110,44 140,46 C 155,47 168,52 172,60 C 175,68 170,76 158,82 C 145,87 128,90 112,88 C 92,86 74,82 66,72 C 60,64 62,56 70,52 Z'],
    contextPaths: [
      'M 66,72 C 74,82 92,86 112,88 C 105,100 88,106 74,100 C 66,94 64,82 66,72 Z', // Meghalaya
      'M 70,52 C 62,56 60,64 66,72 C 55,68 50,58 54,48 C 58,40 66,44 70,52 Z', // Assam west  
      'M 70,52 C 80,48 110,44 140,46 C 138,36 130,28 112,26 C 88,24 74,36 70,52 Z', // Arunachal
      'M 158,82 C 170,76 175,68 172,60 C 178,70 178,88 168,100 C 156,112 140,116 128,110 C 136,100 148,90 158,82 Z' // Manipur/Nagaland
    ],
    cityX: 115,
    cityY: 68,
    cityName: 'Guwahati',
    regionName: 'Northeast India',
    labelX: 115,
    labelY: 55,
  },
  bengal: {
    highlightPaths: ['M 138,36 C 148,34 160,36 164,46 C 168,58 165,72 158,80 C 150,86 138,84 132,74 C 126,64 126,50 132,42 C 134,38 136,36 138,36 Z'],
    contextPaths: [
      'M 116,80 C 126,64 132,74 138,84 C 132,96 122,102 112,98 C 106,88 110,82 116,80 Z' // Odisha north
    ],
    cityX: 150,
    cityY: 60,
    cityName: 'Kolkata',
    regionName: 'West Bengal',
    labelX: 150,
    labelY: 45,
  },
  tamil: {
    highlightPaths: ['M 104,72 C 116,68 132,70 140,80 C 146,90 144,106 136,118 C 126,132 112,140 102,136 C 94,130 92,116 96,102 C 98,90 100,78 104,72 Z'],
    contextPaths: [
      'M 86,82 C 96,72 104,72 96,102 C 86,112 74,108 70,96 C 68,86 78,84 86,82 Z', // Kerala
      'M 72,62 C 84,54 104,58 104,72 C 100,78 98,90 96,102 C 80,98 68,90 66,78 C 64,70 68,64 72,62 Z', // Karnataka
      'M 104,72 C 116,68 132,70 140,80 C 148,70 150,58 142,50 C 130,42 114,46 104,54 C 100,60 100,66 104,72 Z' // Andhra
    ],
    cityX: 122,
    cityY: 108,
    cityName: 'Chennai',
    regionName: 'Tamil Nadu',
    labelX: 122,
    labelY: 95,
  },
  hindi: {
    highlightPaths: ['M 72,44 C 88,38 116,36 136,40 C 148,44 152,54 146,64 C 138,72 120,76 100,74 C 82,72 68,66 66,56 C 64,50 68,46 72,44 Z'],
    contextPaths: [
      'M 136,40 C 148,44 152,54 146,64 C 158,58 164,48 160,38 C 152,30 140,32 136,40 Z', // Bihar
      'M 44,36 C 56,28 72,32 72,44 C 68,46 64,50 66,56 C 54,56 42,50 40,42 C 38,38 40,36 44,36 Z', // Rajasthan east
      'M 66,56 C 68,66 82,72 100,74 C 104,84 100,94 88,96 C 72,94 60,84 58,72 C 56,62 60,56 66,56 Z' // MP
    ],
    cityX: 106,
    cityY: 52,
    cityName: 'Lucknow',
    regionName: 'North India',
    labelX: 105,
    labelY: 38,
  },
  punjab: {
    highlightPaths: [
      'M 52,28 C 62,22 76,24 80,32 C 82,40 76,48 66,50 C 56,50 48,44 48,36 C 48,32 50,28 52,28 Z',
      'M 68,44 C 78,40 88,42 92,50 C 94,58 88,66 78,66 C 68,66 62,58 64,50 C 66,46 66,44 68,44 Z'
    ],
    contextPaths: [
      'M 80,32 C 90,28 104,30 108,40 C 110,50 104,58 92,60 C 88,60 88,42 80,32 Z'
    ],
    cityX: 58,
    cityY: 36,
    cityName: 'Amritsar',
    regionName: 'Punjab & Haryana',
    labelX: 75,
    labelY: 25,
  },
  maharashtra: {
    highlightPaths: ['M 54,60 C 66,52 90,50 108,54 C 120,58 124,68 118,80 C 110,90 92,96 72,94 C 56,90 46,80 46,70 C 46,64 50,62 54,60 Z'],
    contextPaths: [
      'M 36,44 C 46,36 60,38 64,48 C 60,56 54,60 46,70 C 36,68 28,60 28,52 C 28,46 32,44 36,44 Z', // Gujarat
      'M 108,54 C 120,58 124,68 118,80 C 126,74 132,64 128,54 C 122,44 110,44 108,54 Z' // Telangana border
    ],
    cityX: 100,
    cityY: 72,
    cityName: 'Mumbai',
    regionName: 'Maharashtra',
    labelX: 95,
    labelY: 60,
  },
  telugu: {
    highlightPaths: ['M 112,52 C 126,46 142,50 148,62 C 152,72 148,86 138,96 C 126,106 112,108 104,98 C 98,90 100,76 106,64 C 108,58 110,54 112,52 Z'],
    contextPaths: [
      'M 72,62 C 84,54 104,58 106,64 C 100,76 98,90 104,98 C 90,100 76,96 70,84 C 64,72 68,64 72,62 Z', // Karnataka
      'M 104,98 C 112,108 126,106 138,96 C 142,110 136,124 122,130 C 108,132 96,124 96,110 C 100,104 104,102 104,98 Z' // Tamil border
    ],
    cityX: 136,
    cityY: 78,
    cityName: 'Hyderabad',
    regionName: 'Andhra Pradesh',
    labelX: 135,
    labelY: 68,
  },
  karnataka: {
    highlightPaths: ['M 68,60 C 80,52 102,52 114,62 C 122,70 120,84 110,94 C 98,104 80,106 68,98 C 58,90 56,76 62,66 C 64,62 66,60 68,60 Z'],
    contextPaths: [
      'M 58,74 C 56,76 62,66 68,60 C 58,58 46,62 44,72 C 42,82 50,88 58,86 C 58,86 58,80 58,74 Z', // Kerala north
      'M 114,62 C 122,70 120,84 110,94 C 120,92 130,84 132,72 C 130,62 122,58 114,62 Z' // Andhra west
    ],
    cityX: 96,
    cityY: 80,
    cityName: 'Bengaluru',
    regionName: 'Karnataka',
    labelX: 105,
    labelY: 70,
  },
  kerala: {
    highlightPaths: ['M 82,78 C 90,70 98,72 100,82 C 102,94 96,110 88,122 C 82,132 74,134 70,126 C 66,118 68,104 74,92 C 78,84 80,78 82,78 Z'],
    contextPaths: [
      'M 68,60 C 80,52 102,52 82,78 C 80,78 78,84 74,92 C 62,88 56,76 62,66 C 64,62 66,60 68,60 Z' // Karnataka west
    ],
    cityX: 84,
    cityY: 124,
    cityName: 'Thiruvananthapuram',
    regionName: 'Kerala',
    labelX: 100,
    labelY: 105,
  },
  gujarat: {
    highlightPaths: ['M 28,40 C 36,30 56,28 68,36 C 74,42 74,54 66,62 C 56,70 40,72 30,64 C 22,58 22,48 28,40 Z'],
    contextPaths: [
      'M 44,36 C 56,28 72,32 72,44 C 68,46 64,50 66,56 C 56,56 42,50 40,42 C 38,38 40,36 44,36 Z'
    ],
    cityX: 50,
    cityY: 50,
    cityName: 'Ahmedabad',
    regionName: 'Gujarat',
    labelX: 52,
    labelY: 42,
  },
  odisha: {
    highlightPaths: ['M 118,76 C 130,70 146,72 152,82 C 156,92 150,106 138,112 C 126,118 112,114 108,104 C 104,94 108,82 118,76 Z'],
    contextPaths: [
      'M 138,36 C 148,34 160,36 164,46 C 168,58 165,72 158,80 C 150,86 138,84 130,76 C 130,70 118,76 108,76 C 100,68 106,58 118,56 C 132,54 140,44 138,36 Z'
    ],
    cityX: 134,
    cityY: 96,
    cityName: 'Bhubaneswar',
    regionName: 'Odisha',
    labelX: 138,
    labelY: 70,
  },
  uk: {
    highlightPaths: ['M 88,80 C 92,72 102,68 110,72 C 118,76 120,88 116,100 C 110,114 96,122 86,118 C 78,114 76,102 80,90 C 82,84 86,80 88,80 Z'],
    contextPaths: [
      'M 86,52 C 90,44 100,42 106,48 C 110,54 108,64 102,70 C 96,74 88,72 86,64 C 84,58 84,54 86,52 Z', // Scotland
      'M 76,96 C 80,90 80,102 78,108 C 74,114 68,114 66,108 C 64,102 68,96 76,96 Z' // Wales
    ],
    cityX: 100,
    cityY: 106,
    cityName: 'London',
    regionName: 'United Kingdom',
    labelX: 95,
    labelY: 100,
  },
  usa: {
    highlightPaths: ['M 22,38 C 50,30 120,28 158,36 C 170,40 172,54 164,66 C 152,80 128,88 96,90 C 66,92 36,88 24,74 C 16,64 16,50 22,38 Z'],
    contextPaths: [
      'M 22,38 C 30,32 50,30 22,38 M 80,38 L 80,90 M 110,34 L 110,88 M 140,36 L 140,86', // state separators - draw as subtle lines
    ],
    cityX: 150,
    cityY: 50,
    cityName: 'New York',
    regionName: 'United States',
    labelX: 100,
    labelY: 75,
  },
  australia: {
    highlightPaths: ['M 44,42 C 68,30 120,28 148,40 C 162,48 166,66 156,84 C 144,102 118,112 88,112 C 62,112 40,100 32,84 C 26,70 28,54 44,42 Z'],
    contextPaths: [
      'M 148,40 C 162,48 166,66 158,80 C 162,72 170,66 168,54 C 166,44 158,36 148,40 Z', // Queensland
      'M 88,112 C 98,116 110,120 108,132 C 100,140 88,138 82,130 C 78,122 80,114 88,112 Z' // Tasmania
    ],
    cityX: 138,
    cityY: 84,
    cityName: 'Sydney',
    regionName: 'Australia',
    labelX: 100,
    labelY: 55,
  },
  default: {
    highlightPaths: [],
    contextPaths: ['M 38,22 C 60,14 110,16 140,28 C 158,36 168,54 165,78 C 160,102 140,122 112,132 C 86,140 60,134 44,116 C 30,100 26,76 30,56 C 32,44 34,30 38,22 Z'],
    cityX: 90,
    cityY: 68,
    cityName: 'New Delhi',
    regionName: 'India',
    labelX: 100,
    labelY: 50,
  },
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

export function AccentOriginMap({ accentIdentified }: { accentIdentified: string }) {
  const region = detectRegion(accentIdentified);
  const config = MAP_CONFIGS[region];

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

      <svg width={180} height={144} viewBox="0 0 200 160" style={{ display: 'block' }}>
        {/* Faded context regions */}
        {config.contextPaths.map((path, i) => (
          <path
            key={`ctx-${i}`}
            d={path}
            fill="rgba(0,0,0,0.04)"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={1}
          />
        ))}

        {/* Highlighted region */}
        {config.highlightPaths.map((path, i) => (
          <motion.path
            key={`hl-${i}`}
            d={path}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
            fill="rgba(20,184,166,0.2)"
            stroke="rgba(20,184,166,0.7)"
            strokeWidth={2}
          />
        ))}

        {/* Default case: pulsing dot on full map */}
        {region === 'default' && (
          <>
            {/* India outline for default */}
            <path
              d="M 40,30 L 160,25 L 175,50 L 165,90 L 140,120 L 100,130 L 60,120 L 35,80 Z"
              fill="rgba(0,0,0,0.02)"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
            />
          </>
        )}

        {/* Pulsing city dot */}
        <circle
          cx={config.cityX}
          cy={config.cityY}
          r={4}
          fill="var(--teal)"
        >
          <animate
            attributeName="r"
            values="4;8;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.2;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Static center dot */}
        <circle
          cx={config.cityX}
          cy={config.cityY}
          r={3}
          fill="var(--teal)"
        />

        {/* City label */}
        <text
          x={config.cityX}
          y={config.cityY + 14}
          fontSize={8}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.5)"
          textAnchor="middle"
        >
          {config.cityName}
        </text>

        {/* Region label */}
        <text
          x={config.labelX}
          y={config.labelY}
          fontSize={9}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.4)"
          textAnchor="middle"
        >
          {config.regionName}
        </text>

        {/* Compass N */}
        <text
          x={185}
          y={150}
          fontSize={8}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.25)"
        >
          N↑
        </text>
      </svg>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--teal)',
        marginTop: 6,
        letterSpacing: '0.04em',
      }}>
        ● {config.cityName} · {config.regionName}
      </div>
    </motion.div>
  );
}
