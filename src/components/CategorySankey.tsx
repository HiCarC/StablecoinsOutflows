import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, Sankey } from 'recharts';

export interface CategorySankeyItem {
  slug: string;
  name: string;
  share: number;
  annualisedVolume: number;
  isTrading: boolean;
}

interface CategorySankeyProps {
  categories: CategorySankeyItem[];
}

interface SankeyNodePayload {
  name: string;
  color: string;
  share?: number;
  isTrading?: boolean;
  index?: number;
  slug?: string;
}

interface SankeyLinkPayload {
  color: string;
  slug: string;
  name: string;
  share: number;
  annualisedVolume: number;
  isTrading: boolean;
}

const ROOT_COLOR = '#0f172a';
const CATEGORY_COLORS: Record<string, string> = {
  'defi-protocols': '#2baae3',
  'centralised-exchanges': '#1d4ed8',
  'mev-arbitrage': '#3b82f6',
  'cross-border': '#065f46',
  payments: '#10b981',
};

const LABEL_PRIMARY = 'rgba(226,232,240,0.92)';

function formatShare(value: number | undefined): string {
  return typeof value === 'number' ? `${value.toFixed(1)}%` : '';
}

export function CategorySankey({ categories }: CategorySankeyProps) {
  const navigate = useNavigate();

  const { nodes, links } = useMemo(() => {
    const mappedNodes: SankeyNodePayload[] = [
      { name: 'Stablecoin flows', color: ROOT_COLOR, index: 0 },
      ...categories.map((category, index) => ({
        name: category.name,
        color: CATEGORY_COLORS[category.slug] ?? '#0ea5e9',
        share: category.share,
        isTrading: category.isTrading,
        index: index + 1,
        slug: category.slug,
      })),
    ];

    const mappedLinks = categories.map((category, index) => ({
      source: 0,
      target: index + 1,
      value: category.share,
      color: CATEGORY_COLORS[category.slug] ?? '#0ea5e9',
      slug: category.slug,
      name: category.name,
      share: category.share,
      annualisedVolume: category.annualisedVolume,
      isTrading: category.isTrading,
    }));

    return { nodes: mappedNodes, links: mappedLinks };
  }, [categories]);

  const renderNode = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (x == null || y == null || width == null || height == null || !payload) {
      return null;
    }

    const color = payload.color ?? ROOT_COLOR;
    const shareText = formatShare(payload.share);
    const name: string = payload.name ?? '';
    const nodeIndex = typeof payload.index === 'number' ? payload.index : 0;
    const isRoot = nodeIndex === 0;
    const textX = isRoot ? x + width + 12 : x + width - 12;
    const textAnchor = isRoot ? 'start' : 'end';
    const label = shareText ? `${name} (${shareText})` : name;
    const isNavigable = !isRoot && typeof payload.slug === 'string';

    const handleClick = () => {
      if (isNavigable) {
        navigate(`/use-cases/${payload.slug}`);
      }
    };

    return (
      <g onClick={handleClick} style={isNavigable ? { cursor: 'pointer' } : undefined}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          fillOpacity={0.7}
          stroke={color}
          rx={10}
          ry={10}
        />
        <text
          x={textX}
          y={y + height / 2}
          dominantBaseline="middle"
          textAnchor={textAnchor}
          fontSize={13}
          fontWeight={600}
          fill={LABEL_PRIMARY}
        >
          {label}
        </text>
      </g>
    );
  };

  const renderLink = (props: any) => {
    const { sourceY, targetY, sourceX, targetX, linkWidth, payload } = props;
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

    const curvature = 0.5;
    const xi = sourceX + (targetX - sourceX) * curvature;
    const yi = sourceY;
    const xj = targetX - (targetX - sourceX) * curvature;
    const yj = targetY;
    const path = `M${sourceX},${sourceY} C${xi},${yi} ${xj},${yj} ${targetX},${targetY}`;
    const linkPayload = payload as SankeyLinkPayload;

    const handleClick = () => {
      if (linkPayload?.slug) {
        navigate(`/use-cases/${linkPayload.slug}`);
      }
    };

    return (
      <path
        d={path}
        stroke={linkPayload.color}
        strokeWidth={Math.max(1, linkWidth)}
        fill="none"
        strokeOpacity={0.28}
        onClick={handleClick}
        style={linkPayload.slug ? { cursor: 'pointer' } : undefined}
      />
    );
  };

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer>
        <Sankey
          data={{ nodes, links }}
          nodePadding={36}
          nodeWidth={18}
          linkCurvature={0.5}
          node={renderNode as any}
          link={renderLink as any}
        />
      </ResponsiveContainer>
    </div>
  );
}
