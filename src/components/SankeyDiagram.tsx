import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey } from 'd3-sankey';

interface StablecoinFlow {
  source: string;
  target: string;
  value: number;
  percentage: number;
}

interface SankeyDiagramProps {
  data: StablecoinFlow[];
  loading: boolean;
  error?: string | null;
  onHeightChange?: (height: number) => void;
}

interface SankeyData {
  nodes: Array<{ name: string; type: 'stablecoin' | 'protocol' }>;
  links: Array<{ source: string; target: string; value: number; percentage: number }>;
}

export function SankeyDiagram({ data, loading, error, onHeightChange }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement && data.length > 0) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        
        // Calculate height based on number of unique nodes
        const uniqueNodes = new Set(data.map(d => d.source).concat(data.map(d => d.target))).size;
        const calculatedHeight = Math.max(400, uniqueNodes * 35 + 100);
        
        const newDimensions = { width: Math.max(800, width - 40), height: calculatedHeight };
        setDimensions(newDimensions);
        
        // Notify parent component of height change
        if (onHeightChange) {
          onHeightChange(calculatedHeight);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [data, onHeightChange]);

  useEffect(() => {
    if (!data.length || loading || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 200, bottom: 20, left: 200 };

    svg.attr('width', width).attr('height', height);

    // Prepare data for Sankey
    const allNodes = new Set<string>();
    data.forEach(d => {
      allNodes.add(d.source);
      allNodes.add(d.target);
    });

    const sankeyData: SankeyData = {
      nodes: Array.from(allNodes).map(name => ({
        name,
        type: data.find(d => d.source === name) ? 'stablecoin' : 'protocol'
      })),
      links: data
    };

    // Create Sankey generator with better spacing
    const sankeyGenerator = sankey<any, any>()
      .nodeId(d => d.name)
      .nodeWidth(25)
      .nodePadding(20)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const { nodes, links } = sankeyGenerator(sankeyData);


    // Color scale for different stablecoins
    const stablecoinColors: { [key: string]: string } = {
      'USDT': '#26a17b',  // Green
      'USDC': '#2775ca',  // Blue
      'DAI': '#f5ac37',   // Orange
      'BUSD': '#f0b90b',  // Yellow
      'TUSD': '#4f46e5',  // Indigo
    };

    // Add links
    svg.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', (d: any) => {
        // Create proper Sankey link paths that align with node edges
        const sourceY = d.y0;
        const targetY = d.y1;
        
        // Use horizontal lines with proper control points for smooth curves
        const controlX1 = d.source.x1 + (d.target.x0 - d.source.x1) * 0.5;
        const controlX2 = controlX1;
        
        return `M${d.source.x1},${sourceY}C${controlX1},${sourceY} ${controlX2},${targetY} ${d.target.x0},${targetY}`;
      })
      .attr('stroke', (d: any) => {
        // Use stablecoin-specific colors
        return stablecoinColors[d.source.name] || '#6b7280';
      })
      .attr('stroke-opacity', 0.7)
      .attr('fill', 'none')
      .attr('stroke-width', (d: any) => Math.max(2, d.width))
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('stroke-opacity', 0.8).attr('stroke-width', Math.max(2, d.width + 1));
        
        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .style('pointer-events', 'none');

        const tooltipBg = tooltip.append('rect')
          .attr('fill', 'rgba(0, 0, 0, 0.8)')
          .attr('rx', 4)
          .attr('ry', 4);

        const tooltipText = tooltip.append('text')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif');

        const text = `${d.source.name} → ${d.target.name}\n$${(d.value / 1e6).toFixed(1)}M (${d.percentage?.toFixed(1) || 0}%)`;
        tooltipText.text(text);

        const textBounds = tooltipText.node()?.getBBox();
        if (textBounds) {
          tooltipBg
            .attr('x', textBounds.x - 4)
            .attr('y', textBounds.y - 4)
            .attr('width', textBounds.width + 8)
            .attr('height', textBounds.height + 8);
        }

        tooltip.attr('transform', `translate(${event.pageX - svgRef.current!.getBoundingClientRect().left + 10}, ${event.pageY - svgRef.current!.getBoundingClientRect().top + 10})`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-opacity', 0.6).attr('stroke-width', (d: any) => Math.max(1, d.width));
        svg.select('.tooltip').remove();
      });

    // Add nodes
    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => {
        const nodeData = sankeyData.nodes.find(n => n.name === d.name);
        if (nodeData?.type === 'stablecoin') {
          return stablecoinColors[d.name] || '#3B82F6';
        }
        return '#10B981'; // Protocol color
      })
      .attr('stroke', () => {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '#374151' : '#000';
      })
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('stroke-width', 2);
        
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .style('pointer-events', 'none');

        const tooltipBg = tooltip.append('rect')
          .attr('fill', 'rgba(0, 0, 0, 0.8)')
          .attr('rx', 4)
          .attr('ry', 4);

        const tooltipText = tooltip.append('text')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif');

        const nodeData = sankeyData.nodes.find(n => n.name === d.name);
        const totalValue = d3.sum(links.filter(l => l.source === d || l.target === d), (l: any) => l.value);
        const text = `${d.name}\nType: ${nodeData?.type || 'unknown'}\nTotal: $${(totalValue / 1e6).toFixed(1)}M`;
        tooltipText.text(text);

        const textBounds = tooltipText.node()?.getBBox();
        if (textBounds) {
          tooltipBg
            .attr('x', textBounds.x - 4)
            .attr('y', textBounds.y - 4)
            .attr('width', textBounds.width + 8)
            .attr('height', textBounds.height + 8);
        }

        tooltip.attr('transform', `translate(${event.pageX - svgRef.current!.getBoundingClientRect().left + 10}, ${event.pageY - svgRef.current!.getBoundingClientRect().top + 10})`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 1);
        svg.select('.tooltip').remove();
      });

    // Add labels for left side (stablecoins)
    svg.append('g')
      .selectAll('text')
      .data(nodes.filter((d: any) => d.x0 < width / 2))
      .join('text')
      .attr('x', (d: any) => d.x0 - 12)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', () => {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '#E5E7EB' : '#374151';
      })
      .text((d: any) => d.name);

    // Add labels for right side (protocols)
    svg.append('g')
      .selectAll('text')
      .data(nodes.filter((d: any) => d.x0 >= width / 2))
      .join('text')
      .attr('x', (d: any) => d.x1 + 12)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', () => {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '#E5E7EB' : '#374151';
      })
      .text((d: any) => d.name);

  }, [data, loading, dimensions]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️ Error Loading Data</div>
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
          <div className="text-gray-500 text-lg mb-2">📊 No Data Available</div>
          <div className="text-gray-600">No stablecoin flows found for the selected criteria</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="mt-4">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#26a17b' }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">USDT</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2775ca' }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">USDC</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f5ac37' }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">DAI</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f0b90b' }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">BUSD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4f46e5' }}></div>
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
