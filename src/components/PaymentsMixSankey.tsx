import { useMemo } from 'react';
import { ResponsiveContainer, Sankey } from 'recharts';
import type { PaymentBreakdownItem } from '../data/useCases';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentsMixSankeyProps {
  breakdown: PaymentBreakdownItem[];
}

interface SankeyNodePayload {
  name: string;
  color: string;
  index?: number;
}

interface SankeyLinkPayload {
  color: string;
}

const ROOT_COLORS: Record<'light' | 'dark', string> = {
  light: '#065f46',
  dark: '#22c55e',
};

const LABEL_COLORS: Record<'light' | 'dark', string> = {
  light: 'rgba(15,23,42,0.85)',
  dark: 'rgba(226,250,240,0.92)',
};

const PALETTES: Record<'light' | 'dark', string[]> = {
  light: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'],
  dark: ['#34d399', '#4ade80', '#22d3ee', '#5eead4', '#a7f3d0'],
};

const LINK_OPACITY: Record<'light' | 'dark', number> = {
  light: 0.35,
  dark: 0.28,
};

export function PaymentsMixSankey({ breakdown }: PaymentsMixSankeyProps) {
  const { theme } = useTheme();
  const mode: 'light' | 'dark' = theme === 'dark' ? 'dark' : 'light';

  const rootColor = ROOT_COLORS[mode];
  const palette = PALETTES[mode];
  const labelColor = LABEL_COLORS[mode];
  const linkOpacity = LINK_OPACITY[mode];

  const { nodes, links } = useMemo(() => {
    const mappedNodes: SankeyNodePayload[] = [
      {
        name: 'Payments & Treasury',
        color: rootColor,
        index: 0,
      },
      ...breakdown.map((item, index) => ({
        name: `${item.label} (${item.shareOfPayments.toFixed(1)}%)`,
        color: palette[index % palette.length],
        index: index + 1,
      })),
    ];

    const mappedLinks = breakdown.map((item, index) => ({
      source: 0,
      target: index + 1,
      value: item.runRateUsdBillions,
      color: palette[index % palette.length],
    }));

    return { nodes: mappedNodes, links: mappedLinks };
  }, [breakdown, palette, rootColor]);

  const renderNode = (props: any) => {
    const { x, y, width, height, payload } = props;

    if (x == null || y == null || width == null || height == null || !payload) {
      return null;
    }

    const nodePayload = payload as SankeyNodePayload;
    const isRoot = nodePayload.index === 0;
    const color = nodePayload.color ?? rootColor;
    const textX = isRoot ? x + width + 14 : x + width - 12;
    const textAnchor = isRoot ? 'start' : 'end';

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          fillOpacity={isRoot ? 0.8 : 0.75}
          rx={12}
          ry={12}
        />
        <text
          x={textX}
          y={y + height / 2}
          dominantBaseline="middle"
          textAnchor={textAnchor}
          fontSize={13}
          fontWeight={600}
          fill={labelColor}
        >
          {nodePayload.name}
        </text>
      </g>
    );
  };

  const renderLink = (props: any) => {
    const { sourceX, sourceY, targetX, targetY, linkWidth, payload } = props;
    if (
      sourceX == null ||
      targetX == null ||
      sourceY == null ||
      targetY == null ||
      linkWidth == null ||
      !payload
    ) {
      return null;
    }

    const curvature = 0.45;
    const xi = sourceX + (targetX - sourceX) * curvature;
    const yi = sourceY;
    const xj = targetX - (targetX - sourceX) * curvature;
    const yj = targetY;
    const path = `M${sourceX},${sourceY} C${xi},${yi} ${xj},${yj} ${targetX},${targetY}`;
    const linkPayload = payload as SankeyLinkPayload;

    return (
      <path
        d={path}
        stroke={linkPayload.color}
        strokeWidth={Math.max(1, linkWidth)}
        fill="none"
        strokeOpacity={linkOpacity}
        style={{ pointerEvents: 'none' }}
      />
    );
  };

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <Sankey
          data={{ nodes, links }}
          nodePadding={36}
          nodeWidth={20}
          linkCurvature={0.5}
          node={renderNode as any}
          link={renderLink as any}
        />
      </ResponsiveContainer>
    </div>
  );
}
