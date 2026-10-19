import type { JSX } from 'react';
import { getCrew } from '@/data/crew';
import type { CrewId, CrewPalette, MascotMood, MascotProps } from '@/types/content';

const fallbackPalette: CrewPalette = {
  shirt: '#7c5cff',
  accent: '#ffc933',
  hat: '#5c3d2e',
};

function renderAccessory(crew: CrewId, palette: CrewPalette, isHeadOnly: boolean): JSX.Element {
  switch (crew) {
    case 'dev':
      return (
        <g>
          <ellipse
            cx="58"
            cy="22"
            rx="34"
            ry="7"
            fill={palette.hat ?? '#5c3d2e'}
          />
          <path
            d="M 38 22 C 38 7 78 7 78 22 Z"
            fill={palette.hat ?? '#5c3d2e'}
          />
          <rect x="39" y="19" width="38" height="3" fill={palette.accent} stroke="none" />
          {!isHeadOnly && (
            <g>
              <path
                d="M 48 96 L 55 116 L 62 96"
                fill="none"
                stroke={palette.accent}
              />
              <rect
                x="51"
                y="116"
                width="8"
                height="10"
                rx="1"
                fill="var(--surface)"
                strokeWidth="1.5"
              />
            </g>
          )}
        </g>
      );
    case 'pixel':
      return (
        <g>
          <path
            d="M 24 30 Q 56 14 88 30"
            fill={palette.hat ?? '#ff7a1a'}
          />
          <path
            d="M 16 34 Q 38 26 62 32"
            fill={palette.hat ?? '#ff7a1a'}
          />
          <path
            d="M 20 44 C 20 12 90 12 90 44"
            fill="none"
            strokeWidth="3"
          />
          <rect
            x="15"
            y="44"
            width="7"
            height="15"
            rx="2"
            fill={palette.accent}
            strokeWidth="1.5"
          />
          <rect
            x="88"
            y="44"
            width="7"
            height="15"
            rx="2"
            fill={palette.accent}
            strokeWidth="1.5"
          />
        </g>
      );
    case 'mutex':
      return (
        <g>
          {!isHeadOnly ? (
            <g>
              <line
                x1="43"
                y1="96"
                x2="43"
                y2="136"
                stroke={palette.accent}
                strokeWidth="3"
              />
              <line
                x1="67"
                y1="96"
                x2="67"
                y2="136"
                stroke={palette.accent}
                strokeWidth="3"
              />
              <path
                d="M 50 96 L 55 108 L 60 96"
                fill="none"
                strokeWidth="1.5"
              />
              <circle
                cx="55"
                cy="111"
                r="3"
                fill={palette.accent}
                strokeWidth="1.5"
              />
            </g>
          ) : (
            <path
              d="M 46 90 L 55 96 L 64 90"
              fill="none"
              strokeWidth="1.5"
            />
          )}
        </g>
      );
    case 'query':
      return (
        <g>
          <polygon
            points="36,54 51,54 49,64 38,64"
            fill="#1b1b1f"
            strokeWidth="1.5"
          />
          <polygon
            points="59,54 74,54 72,64 61,64"
            fill="#1b1b1f"
            strokeWidth="1.5"
          />
          <line x1="51" y1="56" x2="59" y2="56" />
          {!isHeadOnly && (
            <polygon
              points="53,98 57,98 58,114 55,119 52,114"
              fill={palette.accent}
              strokeWidth="1.5"
            />
          )}
        </g>
      );
    case 'cache':
      return (
        <g>
          {!isHeadOnly ? (
            <g>
              <line
                x1="48"
                y1="96"
                x2="48"
                y2="108"
                strokeWidth="1.5"
              />
              <line
                x1="62"
                y1="96"
                x2="62"
                y2="108"
                strokeWidth="1.5"
              />
              <line
                x1="34"
                y1="98"
                x2="86"
                y2="134"
                stroke={palette.accent}
                strokeWidth="4"
              />
              <rect
                x="76"
                y="120"
                width="14"
                height="16"
                rx="2"
                fill={palette.accent}
                strokeWidth="1.5"
              />
            </g>
          ) : (
            <path
              d="M 32 30 Q 55 18 78 30"
              fill="none"
              stroke={palette.shirt}
              strokeWidth="4"
            />
          )}
        </g>
      );
    case 'ping':
      return (
        <g>
          <path
            d="M 22 28 C 22 10 88 10 88 28 Z"
            fill={palette.hat ?? '#ffd65c'}
          />
          <rect
            x="18"
            y="26"
            width="74"
            height="5"
            rx="2"
            fill={palette.hat ?? '#ffd65c'}
          />
          <path
            d="M 88 52 Q 82 72 68 76"
            fill="none"
          />
          <circle
            cx="67"
            cy="76"
            r="2.5"
            fill={palette.shirt}
            strokeWidth="1"
          />
        </g>
      );
    case 'bug':
      return (
        <g>
          <path
            d="M 40 22 Q 32 8 26 12"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="26"
            cy="12"
            r="3"
            fill={palette.accent}
            strokeWidth="1.5"
          />
          <path
            d="M 70 22 Q 78 8 84 12"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="84"
            cy="12"
            r="3"
            fill={palette.accent}
            strokeWidth="1.5"
          />
          {!isHeadOnly && (
            <g>
              <circle
                cx="94"
                cy="116"
                r="6"
                fill="none"
              />
              <line
                x1="98"
                y1="120"
                x2="105"
                y2="127"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      );
    case 'sec':
      return (
        <g>
          <path
            d="M 22 34 Q 55 24 88 34"
            fill="none"
            stroke={palette.shirt}
            strokeWidth="3"
          />
          {!isHeadOnly && (
            <g>
              <path
                d="M 88 98 L 104 98 Q 104 116 96 124 Q 88 116 88 98 Z"
                fill={palette.accent}
              />
              <line
                x1="96"
                y1="103"
                x2="96"
                y2="114"
                strokeWidth="1.5"
              />
              <line
                x1="91"
                y1="108"
                x2="101"
                y2="108"
                strokeWidth="1.5"
              />
            </g>
          )}
        </g>
      );
    case 'ops':
      return (
        <g>
          <ellipse
            cx="55"
            cy="28"
            rx="20"
            ry="4"
            fill={palette.hat ?? '#2b6cb0'}
            strokeWidth="1.5"
          />
          {!isHeadOnly && (
            <g>
              <line
                x1="92"
                y1="102"
                x2="105"
                y2="125"
                stroke={palette.accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="92"
                cy="102"
                r="4"
                fill="none"
              />
            </g>
          )}
        </g>
      );
    case 'intern':
      return (
        <g>
          {!isHeadOnly && (
            <g>
              <path
                d="M 44 96 L 55 116 L 66 96"
                fill="none"
                stroke={palette.accent}
                strokeWidth="2.5"
              />
              <rect
                x="47"
                y="116"
                width="16"
                height="18"
                rx="2"
                fill="var(--surface)"
              />
              <rect x="50" y="119" width="10" height="7" fill="var(--muted)" stroke="none" />
              <text
                x="55"
                y="131"
                textAnchor="middle"
                fontSize="6"
                fontWeight="bold"
                fill="var(--ink)"
                stroke="none"
              >
                ?
              </text>
            </g>
          )}
        </g>
      );
  }
}

function renderMoodFace(mood: MascotMood): JSX.Element {
  switch (mood) {
    case 'idle':
      return (
        <g>
          <g className="mascot-eyes" stroke="none">
            <rect x="42" y="58" width="6" height="7" rx="1" fill="var(--ink)" />
            <rect x="62" y="58" width="6" height="7" rx="1" fill="var(--ink)" />
          </g>
          <line
            x1="49"
            y1="76"
            x2="61"
            y2="76"
            strokeLinecap="round"
          />
        </g>
      );
    case 'happy':
      return (
        <g fill="none">
          <path
            d="M 40 62 Q 45 54 50 62"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 60 62 Q 65 54 70 62"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 47 74 Q 55 82 63 74"
            strokeLinecap="round"
          />
        </g>
      );
    case 'thinking':
      return (
        <g>
          <line
            x1="39"
            y1="52"
            x2="49"
            y2="52"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="61"
            y1="54"
            x2="71"
            y2="48"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g className="mascot-eyes" stroke="none">
            <rect x="42" y="58" width="6" height="6" rx="1" fill="var(--ink)" />
            <circle cx="66" cy="60" r="3" fill="var(--ink)" />
          </g>
          <path
            d="M 49 76 Q 55 73 61 76"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case 'confused':
      return (
        <g>
          <g stroke="none">
            <circle cx="44" cy="60" r="4.5" fill="var(--ink)" />
            <circle cx="66" cy="60" r="2.5" fill="var(--ink)" />
          </g>
          <path
            d="M 46 76 Q 51 72 55 76 T 64 76"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case 'panic':
      return (
        <g>
          <circle cx="43" cy="60" r="5" fill="none" />
          <circle cx="43" cy="60" r="2" fill="var(--ink)" stroke="none" />
          <circle cx="67" cy="60" r="5" fill="none" />
          <circle cx="67" cy="60" r="2" fill="var(--ink)" stroke="none" />
          <path
            d="M 76 46 Q 78 40 80 46 Q 80 50 78 50 Q 76 50 76 46 Z"
            fill="var(--info)"
            stroke="none"
          />
          <ellipse cx="55" cy="78" rx="4" ry="6" fill="var(--ink)" stroke="none" />
        </g>
      );
    case 'celebrate':
      return (
        <g>
          <path
            d="M 40 62 Q 45 54 50 62"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 60 62 Q 65 54 70 62"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 47 73 Q 55 85 63 73 Z"
            fill="var(--accent)"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

export function MascotSvg({
  crew,
  mood = 'idle',
  size,
  variant = 'full',
  flip = false,
  animated = false,
  label,
  embed,
  className,
}: MascotProps): JSX.Element {
  const member = getCrew(crew);
  const palette = member?.palette ?? fallbackPalette;
  const isHeadOnly = variant === 'head';

  const animationClasses = animated
    ? `mascot-animated mascot-${mood}`
    : '';
  const combinedClassName = [animationClasses, className]
    .filter(Boolean)
    .join(' ');

  const innerSvgContent = (
    <g stroke="var(--ink)" strokeWidth="2">
      {!isHeadOnly && (
        <ellipse
          cx="60"
          cy="152"
          rx="34"
          ry="6"
          fill="var(--ink)"
          opacity="0.18"
          stroke="none"
        />
      )}

      {!isHeadOnly && (
        <g fill="var(--surface)">
          <rect
            x="38"
            y="132"
            width="16"
            height="18"
            rx="4"
          />
          <rect
            x="66"
            y="132"
            width="16"
            height="18"
            rx="4"
          />
        </g>
      )}

      {!isHeadOnly && (
        <g fill={palette.shirt}>
          <rect
            x="34"
            y="96"
            width="52"
            height="40"
            rx="8"
          />
          <rect
            x="22"
            y="98"
            width="12"
            height="30"
            rx="6"
          />
          <rect
            x="86"
            y="98"
            width="12"
            height="30"
            rx="6"
          />
        </g>
      )}

      <polygon
        points="22,34 38,18 104,18 88,34"
        fill="var(--mascot-skin-light)"
        strokeLinejoin="round"
      />
      <polygon
        points="88,34 104,18 104,80 88,96"
        fill="var(--mascot-skin-dark)"
        strokeLinejoin="round"
      />
      <rect
        x="22"
        y="34"
        width="66"
        height="62"
        rx="6"
        fill="var(--mascot-skin)"
        strokeLinejoin="round"
      />

      {renderMoodFace(mood)}
      {renderAccessory(crew, palette, isHeadOnly)}
    </g>
  );

  const orientedContent = flip ? (
    <g transform="translate(120, 0) scale(-1, 1)">{innerSvgContent}</g>
  ) : (
    innerSvgContent
  );

  if (embed) {
    return (
      <g
        transform={`translate(${embed.x}, ${embed.y}) scale(${embed.scale})`}
        className={combinedClassName || undefined}
      >
        {orientedContent}
      </g>
    );
  }

  const viewBox = isHeadOnly ? '10 8 100 96' : '0 0 120 160';
  const width = size ?? (isHeadOnly ? 72 : 120);
  const height = size
    ? isHeadOnly
      ? size
      : Math.round((size * 160) / 120)
    : isHeadOnly
      ? 72
      : 160;

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={combinedClassName || undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {orientedContent}
    </svg>
  );
}
