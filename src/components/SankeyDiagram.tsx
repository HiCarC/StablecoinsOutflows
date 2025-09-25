import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  sankey,
  sankeyJustify,
  sankeyLinkHorizontal,
  SankeyLink,
  SankeyNode,
} from 'd3-sankey';
import { StablecoinFlow } from '../types/stablecoin';

interface SankeyDiagramProps {
  data: StablecoinFlow[];
  loading: boolean;
  error?: string | null;
  onHeightChange?: (height: number) => void;
}

type NodeType = 'stablecoin' | 'protocol';

interface SankeyNodeDatum {
  name: string;
  type: NodeType;
}

type SankeyLinkDatum = StablecoinFlow;

type SankeyGraphNode = SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
type SankeyGraphLink = SankeyLink<SankeyNodeDatum, SankeyLinkDatum>;

const STABLECOIN_COLORS: Record<string, string> = {
  USDT: '#26a17b',
  USDC: '#2775ca',
  DAI: '#f5ac37',
  BUSD: '#f0b90b',
  TUSD: '#4f46e5',
};

const BASE_STROKE_OPACITY = 0.45;
const NODE_CORNER_RADIUS = 5;
const LABEL_OFFSET = 14;

function extractName(entity: unknown): string {
  if (!entity) {
    return '';
  }

  if (typeof entity === 'string') {
    return entity;
  }

  if (typeof entity === 'object' && 'name' in entity && typeof (entity as { name: unknown }).name === 'string') {
    return (entity as { name: string }).name;
  }

  return '';
}

export function SankeyDiagram({ data, loading, error, onHeightChange }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement && data.length > 0) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        const uniqueNodes = new Set(data.map(d => d.source).concat(data.map(d => d.target))).size;
        const calculatedHeight = Math.max(400, uniqueNodes * 35 + 100);
        const newDimensions = { width: Math.max(800, width - 40), height: calculatedHeight };
        setDimensions(newDimensions);
        onHeightChange?.(calculatedHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [data, onHeightChange]);

  useEffect(() => {
    if (!data.length || loading || !svgRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 220, bottom: 20, left: 220 };

    svg.attr('width', width).attr('height', height);

    const nodeTypeMap = new Map<string, NodeType>();
    data.forEach(flow => {
      if (!nodeTypeMap.has(flow.source)) {
        nodeTypeMap.set(flow.source, 'stablecoin');
      }
      if (!nodeTypeMap.has(flow.target)) {
        nodeTypeMap.set(flow.target, 'protocol');
      }
    });

    const sankeyData = {
      nodes: Array.from(nodeTypeMap, ([name, type]) => ({ name, type })) as SankeyNodeDatum[],
      links: data.map(flow => ({
        source: flow.source,
        target: flow.target,
        value: flow.value,
        percentage: flow.percentage,
      })) as SankeyLinkDatum[],
    };

    const inflowByProtocol = new Map<string, number>();
    const outflowByStablecoin = new Map<string, number>();

    sankeyData.links.forEach(link => {
      inflowByProtocol.set(link.target, (inflowByProtocol.get(link.target) ?? 0) + link.value);
      outflowByStablecoin.set(link.source, (outflowByStablecoin.get(link.source) ?? 0) + link.value);
    });

    const nodeSortComparator = (a: SankeyNodeDatum, b: SankeyNodeDatum) => {
      const aType = nodeTypeMap.get(a.name);
      const bType = nodeTypeMap.get(b.name);

      if (aType === 'protocol' && bType === 'protocol') {
        return (inflowByProtocol.get(b.name) ?? 0) - (inflowByProtocol.get(a.name) ?? 0);
      }

      if (aType === 'stablecoin' && bType === 'stablecoin') {
        return (outflowByStablecoin.get(b.name) ?? 0) - (outflowByStablecoin.get(a.name) ?? 0);
      }

      if (aType === bType) {
        return 0;
      }

      return aType === 'stablecoin' ? -1 : 1;
    };

    const sankeyGenerator = sankey<SankeyNodeDatum, SankeyLinkDatum>()
      .nodeId(node => node.name)
      .nodeAlign(sankeyJustify)
      .nodeSort((a, b) => nodeSortComparator(a as SankeyNodeDatum, b as SankeyNodeDatum))
      .nodeWidth(22)
      .nodePadding(22)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const graph = sankeyGenerator({
      nodes: sankeyData.nodes.map(node => ({ ...node })),
      links: sankeyData.links.map(link => ({ ...link })),
    });

    const nodes = graph.nodes as SankeyGraphNode[];
    const links = graph.links as SankeyGraphLink[];

    const fallbackDomain = Array.from(
      new Set(
        nodes.map((node, index) => {
          const name = extractName(node);
          return name || `node-${index}`;
        }),
      ),
    );

    const fallbackColorScale = d3.scaleOrdinal<string, string>(fallbackDomain, d3.schemeTableau10);

    const resolveNodeColor = (node: SankeyGraphNode) => {
      const name = extractName(node);
      return STABLECOIN_COLORS[name] || fallbackColorScale(name);
    };

    const resolveLinkColor = (link: SankeyGraphLink) => {
      const sourceName = extractName(link.source);
      return STABLECOIN_COLORS[sourceName] || fallbackColorScale(sourceName);
    };

    const linkPath = sankeyLinkHorizontal<SankeyNodeDatum, SankeyLinkDatum>();

    const linksGroup = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', BASE_STROKE_OPACITY)
      .attr('mix-blend-mode', 'multiply');

    const linkSelection = linksGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', linkPath as any)
      .attr('stroke', link => resolveLinkColor(link))
      .attr('stroke-width', link => Math.max(1, link.width ?? 0));

    linkSelection
      .on('mouseover', function (event, link) {
        d3.select(this)
          .attr('stroke-opacity', 0.75)
          .attr('stroke-width', Math.max(2, (link.width ?? 0) + 1));

        svg.select('.tooltip').remove();
        const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');

        const tooltipBg = tooltip
          .append('rect')
          .attr('fill', 'rgba(17, 24, 39, 0.9)')
          .attr('rx', 4)
          .attr('ry', 4);

        const tooltipText = tooltip
          .append('text')
          .attr('fill', '#F9FAFB')
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif');

        const text = `${extractName(link.source)} -> ${extractName(link.target)}\n$${((link.value ?? 0) / 1e6).toFixed(1)}M (${link.percentage?.toFixed(1) ?? '0.0'}%)`;
        tooltipText.text(text);

        const textBounds = tooltipText.node()?.getBBox();
        if (textBounds) {
          tooltipBg
            .attr('x', textBounds.x - 6)
            .attr('y', textBounds.y - 6)
            .attr('width', textBounds.width + 12)
            .attr('height', textBounds.height + 12);
        }

        const bounds = svgRef.current!.getBoundingClientRect();
        tooltip.attr(
          'transform',
          `translate(${event.pageX - bounds.left + 12}, ${event.pageY - bounds.top + 12})`,
        );
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke-opacity', BASE_STROKE_OPACITY)
          .attr('stroke-width', link => Math.max(1, (link as SankeyGraphLink).width ?? 0));
        svg.select('.tooltip').remove();
      });

    const isDarkMode = document.documentElement.classList.contains('dark');

    const nodesGroup = svg.append('g').attr('stroke-linejoin', 'round').attr('stroke-width', 1.2);

    const nodeSelection = nodesGroup
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', node => node.x0 ?? 0)
      .attr('y', node => node.y0 ?? 0)
      .attr('height', node => Math.max(1, (node.y1 ?? 0) - (node.y0 ?? 0)))
      .attr('width', node => Math.max(1, (node.x1 ?? 0) - (node.x0 ?? 0)))
      .attr('rx', NODE_CORNER_RADIUS)
      .attr('fill', node => resolveNodeColor(node))
      .attr('fill-opacity', 0.95)
      .attr('stroke', isDarkMode ? '#1f2937' : '#e5e7eb');

    nodeSelection
      .append('title')
      .text(node => `${extractName(node)}\n$${((node.value ?? 0) / 1e6).toFixed(1)}M`);

    nodeSelection
      .on('mouseover', function (event, node) {
        d3.select(this).attr('stroke-width', 2);

        svg.select('.tooltip').remove();
        const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');

        const tooltipBg = tooltip
          .append('rect')
          .attr('fill', 'rgba(17, 24, 39, 0.9)')
          .attr('rx', 4)
          .attr('ry', 4);

        const tooltipText = tooltip
          .append('text')
          .attr('fill', '#F9FAFB')
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif');

        const nodeName = extractName(node);
        const nodeMeta = sankeyData.nodes.find(baseNode => baseNode.name === nodeName);
        const totalValue = d3.sum(links, link => (link.source === node || link.target === node ? link.value ?? 0 : 0));

        const tooltipLines = [
          nodeName,
          `Type: ${nodeMeta?.type ?? 'unknown'}`,
          `Total: $${(totalValue / 1e6).toFixed(1)}M`,
        ];
        tooltipText.text(tooltipLines.join('\n'));

        const textBounds = tooltipText.node()?.getBBox();
        if (textBounds) {
          tooltipBg
            .attr('x', textBounds.x - 6)
            .attr('y', textBounds.y - 6)
            .attr('width', textBounds.width + 12)
            .attr('height', textBounds.height + 12);
        }

        const bounds = svgRef.current!.getBoundingClientRect();
        tooltip.attr(
          'transform',
          `translate(${event.pageX - bounds.left + 12}, ${event.pageY - bounds.top + 12})`,
        );
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 1.2);
        svg.select('.tooltip').remove();
      });

    const labelColor = isDarkMode ? '#E5E7EB' : '#111827';

    svg
      .append('g')
      .selectAll('text')
      .data(nodes.filter(node => (node.x0 ?? 0) < width / 2))
      .join('text')
      .attr('x', node => (node.x0 ?? 0) - LABEL_OFFSET)
      .attr('y', node => ((node.y1 ?? 0) + (node.y0 ?? 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', labelColor)
      .text(node => extractName(node));

    svg
      .append('g')
      .selectAll('text')
      .data(nodes.filter(node => (node.x0 ?? 0) >= width / 2))
      .join('text')
      .attr('x', node => (node.x1 ?? 0) + LABEL_OFFSET)
      .attr('y', node => ((node.y1 ?? 0) + (node.y0 ?? 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', labelColor)
      .text(node => extractName(node));
  }, [data, loading, dimensions]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error Loading Data</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading flow visualization...</div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No Data Available</div>
          <div className="text-gray-600">No stablecoin flows found for the selected criteria</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-full" />

      <div className="mt-4">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: STABLECOIN_COLORS.USDT }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">USDT</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: STABLECOIN_COLORS.USDC }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">USDC</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: STABLECOIN_COLORS.DAI }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">DAI</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: STABLECOIN_COLORS.BUSD }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">BUSD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: STABLECOIN_COLORS.TUSD }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">TUSD</span>
          </div>
        </div>
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">DeFi Protocols</span>
          </div>
        </div>
      </div>
    </div>
  );
}
