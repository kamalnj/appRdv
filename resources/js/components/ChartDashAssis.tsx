import React from 'react';

// Interface defining the structure of chart data
interface ChartData {
    totalCompletedRdvs: number;    // Total completed appointments
    totalScheduledRdvs: number;    // Total scheduled appointments
    totalanceledRdvs: number;      // Total cancelled appointments 
    performanceData: {
        growthPercentage: number;   // Growth percentage metric
        successRate: number;        // Success rate percentage
    };
    historicalData?: HistoricalPointsData[];  // Optional array of historical data points
}

// Interface for individual historical data points
interface HistoricalPointsData {
    date: string;       // Date string for the data point
    completed: number;  // Number of completed appointments on this date
    scheduled: number;  // Number of scheduled appointments on this date
    cancelled: number;  // Number of cancelled appointments on this date
}

// Props interface for the component
interface Props {
    chartData: ChartData;  // Chart data passed from parent component
}

/**
 * Converts a raw maximum value to a "nice" rounded number for better visual display
 * Examples: 87 → 100, 23 → 25, 156 → 200
 * This makes the chart scale more readable and visually appealing
 */
function getNiceMax(value: number): number {
    if (value <= 5) return 5;  // Handle very small values
    
    // Calculate the order of magnitude (e.g., 156 has magnitude 100)
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    
    // Get the first significant digit (e.g., 156/100 = 1.56)
    const residual = value / magnitude;

    // Round up to nice values: 1, 2, 5, or 10
    let niceResidual = 1;
    if (residual > 5) {
        niceResidual = 10;
    } else if (residual > 2) {
        niceResidual = 5;
    } else if (residual > 1) {
        niceResidual = 2;
    }

    // Return the nice value (e.g., 2 * 100 = 200)
    return niceResidual * magnitude;
}

/**
 * Generates evenly spaced Y-axis labels from 0 to maxValue
 * @param maxValue - Maximum value for the Y-axis
 * @param numTicks - Number of tick marks (default: 4)
 * @returns Array of numbers representing Y-axis labels in descending order
 */
function generateYLabels(maxValue: number, numTicks = 4): number[] {
    const step = maxValue / numTicks;
    // Create array from max to 0 (top to bottom of chart)
    return Array.from({ length: numTicks + 1 }, (_, i) => Math.round(step * (numTicks - i)));
}

export default function ChartDashAssis({ chartData }: Props) {
    // Calculate the maximum value from all data points across all metrics
    // This determines the Y-axis scale
    const rawMax =
        chartData.historicalData && chartData.historicalData.length > 0
            ? Math.max(...chartData.historicalData.map((d) => Math.max(d.completed, d.scheduled, d.cancelled)))
            : 100; // Default fallback if no data exists

    // Convert raw max to a nice round number for better visualization
    const niceMax = getNiceMax(rawMax);
    
    // Generate Y-axis labels based on the nice maximum value
    const yLabels = generateYLabels(niceMax);

    /**
     * Generates SVG polyline points for a specific metric
     * Converts data values to SVG coordinates within the chart area
     */
    const generateChartPoints = (data: HistoricalPointsData[], metric: 'completed' | 'scheduled' | 'cancelled') => {
        // Chart dimensions and margins
        const chartHeight = 150; // Usable chart height in pixels
        const chartTop = 25;     // Top margin for labels
        const chartWidth = 340;  // Usable chart width in pixels
        const chartLeft = 40;    // Left margin for Y-axis labels
        
        // Calculate horizontal spacing between data points
        const stepX = chartWidth / Math.max(data.length - 1, 1);

        return data
            .map((point, index) => {
                // Calculate X coordinate (horizontal position)
                const x = chartLeft + index * stepX;
                
                // Get the value for the current metric
                const value = point[metric];
                
                // Scale value to chart height (flip Y because SVG Y=0 is at top)
                // Higher values appear at the top of the chart
                const scaledY = chartTop + chartHeight - (value / niceMax) * chartHeight;
                
                return `${x},${scaledY}`;
            })
            .join(' '); // Join coordinates with spaces for SVG polyline format
    };

    /**
     * Generates data points for the latest values (rightmost points on chart)
     * These are displayed as circles with hover tooltips
     */
    const generateDataPoints = (data: HistoricalPointsData[]) => {
        if (data.length === 0) return [];

        // Get the most recent data point
        const lastPoint = data[data.length - 1];
        const chartHeight = 150;
        const chartTop = 25;
        const x = 380; // X position for the rightmost data points

        // Create data point objects for each metric
        return [
            {
                x,
                y: chartTop + chartHeight - (lastPoint.completed / niceMax) * chartHeight,
                color: '#3B82F6', // Blue color for completed
                value: lastPoint.completed,
                label: 'Completed'
            },
            {
                x,
                y: chartTop + chartHeight - (lastPoint.scheduled / niceMax) * chartHeight,
                color: '#10B981', // Green color for scheduled
                value: lastPoint.scheduled,
                label: 'Scheduled'
            },
            {
                x,
                y: chartTop + chartHeight - (lastPoint.cancelled / niceMax) * chartHeight,
                color: '#F59E0B', // Yellow/Orange color for cancelled
                value: lastPoint.cancelled,
                label: 'Cancelled'
            },
        ];
    };

    // Check if we have real data to display or should show demo data
    const hasRealData = chartData.historicalData && chartData.historicalData.length > 0;

    return (
        <div className="relative h-64 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 p-4 dark:from-neutral-800 dark:to-blue-900/20">
            {/* SVG container for the entire chart */}
            <svg className="h-full w-full" viewBox="0 0 400 200">
                {/* Define reusable patterns and gradients */}
                <defs>
                    {/* Grid pattern for chart background */}
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1" />
                    </pattern>
                </defs>
                
                {/* Grid background - provides visual reference lines */}
                <rect x="40" y="25" width="340" height="150" fill="url(#grid)" />

                {/* Chart lines section */}
                {hasRealData ? (
                    <>
                        {/* Completed appointments line (blue) */}
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={generateChartPoints(chartData.historicalData!, 'completed')}
                        >
                            {/* Animated line drawing effect */}
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="2s" fill="freeze" />
                        </polyline>

                        {/* Scheduled appointments line (green) */}
                        <polyline
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={generateChartPoints(chartData.historicalData!, 'scheduled')}
                        >
                            {/* Animated line drawing with 0.5s delay */}
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="2s" begin="0.5s" fill="freeze" />
                        </polyline>

                        {/* Cancelled appointments line (orange/yellow) */}
                        <polyline
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={generateChartPoints(chartData.historicalData!, 'cancelled')}
                        >
                            {/* Animated line drawing with 1s delay */}
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="2s" begin="1s" fill="freeze" />
                        </polyline>

                        {/* Data points (circles) at the end of each line */}
                        <g className="data-points">
                            {generateDataPoints(chartData.historicalData!).map((point, i) => (
                                <g key={i}>
                                    {/* Circle marker for data point */}
                                    <circle 
                                        cx={point.x} 
                                        cy={point.y} 
                                        r="4" 
                                        fill={point.color} 
                                        className="drop-shadow-sm"
                                    >
                                        {/* Animated circle appearance with staggered timing */}
                                        <animate attributeName="r" values="0;6;4" dur="0.6s" begin={`${1.5 + i * 0.1}s`} fill="freeze" />
                                    </circle>
                                    {/* Tooltip text showing the value (appears on hover) */}
                                    <text 
                                        x={point.x + 8} 
                                        y={point.y - 8} 
                                        className="fill-gray-600 text-xs font-medium opacity-0 hover:opacity-100 transition-opacity"
                                    >
                                        {point.value}
                                    </text>
                                </g>
                            ))}
                        </g>
                    </>
                ) : (
                    <>
                        {/* Demo/placeholder lines when no real data is available */}
                        {/* These show sample upward trends */}
                        
                        {/* Demo completed line */}
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="40,150 100,130 180,120 260,110 340,100 380,95"
                        >
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="2s" fill="freeze" />
                        </polyline>
                        
                        {/* Demo scheduled line */}
                        <polyline
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="40,160 100,140 180,135 260,125 340,115 380,110"
                        >
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="2s" begin="0.5s" fill="freeze" />
                        </polyline>
                        
                        {/* Demo cancelled line (relatively flat) */}
                        <polyline
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="40,170 100,168 180,165 260,163 340,160 380,158"
                        >
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="2s" begin="1s" fill="freeze" />
                        </polyline>
                        
                        {/* Demo data points */}
                        <g className="data-points">
                            {[
                                { x: 380, y: 95, color: '#3B82F6' },   // Blue point
                                { x: 380, y: 110, color: '#10B981' },  // Green point
                                { x: 380, y: 158, color: '#F59E0B' },  // Orange point
                            ].map((point, i) => (
                                <circle key={i} cx={point.x} cy={point.y} r="4" fill={point.color} className="drop-shadow-sm">
                                    <animate attributeName="r" values="0;6;4" dur="0.6s" begin={`${1.5 + i * 0.1}s`} fill="freeze" />
                                </circle>
                            ))}
                        </g>
                    </>
                )}

                {/* Y-axis labels (vertical scale) */}
                <g className="fill-gray-500 text-xs">
                    {yLabels.map((label, index) => {
                        // Calculate Y position for each label
                        const y = 25 + (150 / (yLabels.length - 1)) * index;
                        return (
                            <text key={index} x="35" y={y + 4} textAnchor="end">
                                {label}
                            </text>
                        );
                    })}
                </g>

                {/* X-axis labels (time periods) */}
                <g className="fill-gray-500 text-xs">
                    <text x="60" y="195" textAnchor="middle">J-30</text>      {/* 30 days ago */}
                    <text x="150" y="195" textAnchor="middle">J-15</text>     {/* 15 days ago */}
                    <text x="280" y="195" textAnchor="middle">J-7</text>      {/* 7 days ago */}
                    <text x="370" y="195" textAnchor="middle">Aujourd'hui</text> {/* Today (French) */}
                </g>

           
            </svg>
        </div>
    );
}