'use client';

import React, { useState } from 'react';
import { 
  WidgetConfig, 
  WidgetType,
  ChartType
} from '@/lib/analytics/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  DonutChart, 
  AreaChart 
} from '@tremor/react';
import { 
  Download, 
  Maximize2, 
  Minimize2, 
  MoreHorizontal, 
  RefreshCw,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardWidgetProps {
  widget: WidgetConfig;
  isLoading?: boolean;
  onRefresh?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onMaximize?: () => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  isLoading = false,
  onRefresh,
  onEdit,
  onDelete,
  onExport,
  onMaximize
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);

  // Determine widget size classes
  const getSizeClasses = () => {
    switch (widget.size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'medium':
        return 'col-span-2 row-span-1';
      case 'large':
        return 'col-span-2 row-span-2';
      case 'full':
        return 'col-span-4 row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  // Handle widget expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onMaximize) {
      onMaximize();
    }
  };

  // Render chart based on type
  const renderChart = () => {
    if (!widget.chartConfig || isLoading) {
      return (
        <div className="flex items-centre justify-centre h-64">
          <Skeleton className="h-full w-full" />
        </div>
      );
    }

    const { type, datasets, options } = widget.chartConfig;
    
    // Transform data for Tremor charts
    const chartData = datasets[0]?.data.map(point => {
      const dataPoint: Record<string, string | number> = { category: point.label };
      
      datasets.forEach((dataset) => {
        const matchingPoint = dataset.data.find(p => p.label === point.label);
        if (matchingPoint) {
          dataPoint[dataset.label] = matchingPoint.value;
        }
      });
      
      return dataPoint;
    }) || [];
    
    // Get dataset names for index
    const datasetNames = datasets.map(dataset => dataset.label);
    
    // Get colors
    const colors = datasets.map(dataset => dataset.colour || dataset.borderColor || '#4361ee');

    switch (type) {
      case ChartType.BAR:
        return (
          <BarChart
            data={chartData}
            index="category"
            categories={datasetNames}
            colors={colors as any}
            valueFormatter={(value) => `${value}`}
            yAxisWidth={40}
            showLegend={true}
            showAnimation={true}
            className="h-64"
          />
        );
      case ChartType.LINE:
        return (
          <LineChart
            data={chartData}
            index="category"
            categories={datasetNames}
            colors={colors as any}
            valueFormatter={(value) => `${value}`}
            yAxisWidth={40}
            showLegend={true}
            showAnimation={true}
            className="h-64"
          />
        );
      case ChartType.PIE:
        return (
          <PieChart
            data={chartData.map(item => ({
              name: item.category,
              value: item[datasetNames[0]]
            }))}
            category="value"
            index="name"
            colors={colors as any}
            valueFormatter={(value) => `${value}`}
            className="h-64"
          />
        );
      case ChartType.DOUGHNUT:
        return (
          <DonutChart
            data={chartData.map(item => ({
              name: item.category,
              value: item[datasetNames[0]]
            }))}
            category="value"
            index="name"
            colors={colors as any}
            valueFormatter={(value) => `${value}`}
            className="h-64"
          />
        );
      case ChartType.AREA:
        return (
          <AreaChart
            data={chartData}
            index="category"
            categories={datasetNames}
            colors={colors as any}
            valueFormatter={(value) => `${value}`}
            yAxisWidth={40}
            showLegend={true}
            showAnimation={true}
            className="h-64"
          />
        );
      default:
        return (
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Chart type not supported</p>
          </div>
        );
    }
  };

  // Render metric
  const renderMetric = () => {
    if (!widget.metricConfig || isLoading) {
      return (
        <div className="flex flex-col items-centre justify-centre h-32">
          <Skeleton className="h-12 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      );
    }

    const { value, previousValue, unit, trend, trendPercentage, goal } = widget.metricConfig;
    
    return (
      <div className="flex flex-col items-centre justify-centre h-full py-6">
        <div className="text-4xl font-bold mb-2">
          {value}{unit ? ` ${unit}` : ''}
        </div>
        
        {previousValue && trend && (
          <div className={`flex items-centre text-sm ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {trend === 'stable' && '→ '}
            {trendPercentage ? `${trendPercentage}%` : ''} from previous period
          </div>
        )}
        
        {goal && (
          <div className="text-sm text-muted-foreground mt-2">
            Goal: {goal}{unit ? ` ${unit}` : ''}
          </div>
        )}
      </div>
    );
  };

  // Render widget content based on type
  const renderWidgetContent = () => {
    switch (widget.type) {
      case WidgetType.CHART:
        return renderChart();
      case WidgetType.METRIC:
        return renderMetric();
      case WidgetType.TABLE:
        // Table implementation would go here
        return (
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Table view</p>
          </div>
        );
      default:
        return (
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Widget type not supported</p>
          </div>
        );
    }
  };

  return (
    <Card className={`${getSizeClasses()} ${isExpanded ? 'fixed inset-4 z-50' : ''} overflow-hidden`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{widget.title}</CardTitle>
            {widget.description && (
              <CardDescription>{widget.description}</CardDescription>
            )}
          </div>
          <div className="flex items-centre space-x-1">
            {widget.chartConfig?.accessibility && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setShowAccessibilityInfo(true)}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Accessibility Information</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View accessibility information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onRefresh && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={onRefresh}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh data</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={toggleExpand}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isExpanded ? 'Minimize' : 'Maximize'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isExpanded ? 'Minimize' : 'Maximize'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Widget Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    Edit Widget
                  </DropdownMenuItem>
                )}
                {onExport && (
                  <DropdownMenuItem onClick={onExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-red-500 focus:text-red-500"
                  >
                    Delete Widget
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className="text-xs">
            {widget.dataCategory.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
      
      {/* Accessibility Information Dialog */}
      <Dialog open={showAccessibilityInfo} onOpenChange={setShowAccessibilityInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessibility Information</DialogTitle>
            <DialogDescription>
              Alternative formats and key findings for this chart.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p>{widget.chartConfig?.accessibility?.textDescription}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Key Findings</h3>
              <ul className="list-disc pl-5 space-y-1">
                {widget.chartConfig?.accessibility?.keyFindings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
            
            {widget.chartConfig?.accessibility?.alternativeFormats && (
              <div>
                <h3 className="font-medium mb-1">Alternative Formats</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Data Table (CSV)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Text Description
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DashboardWidget;
