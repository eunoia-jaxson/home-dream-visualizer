import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { scenarios } from '@/mocks/assetData';
import type { SimulationData } from '@/types/asset';

interface AssetScenarioChartProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  getScenarioData: (scenario: string) => SimulationData[];
  formatCurrency: (value: string) => string;
}

const AssetScenarioChart = ({
  selectedScenario,
  onScenarioChange,
  getScenarioData,
  formatCurrency,
}: AssetScenarioChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <span>시나리오별 자산 성장 비교</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedScenario} onValueChange={onScenarioChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="worst" className="text-red-600">
              최악 시나리오
            </TabsTrigger>
            <TabsTrigger value="average" className="text-blue-600">
              평균 시나리오
            </TabsTrigger>
            <TabsTrigger value="best" className="text-green-600">
              최선 시나리오
            </TabsTrigger>
          </TabsList>

          {Object.keys(scenarios).map((scenario) => (
            <TabsContent key={scenario} value={scenario}>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getScenarioData(scenario)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) => {
                        if (value >= 100000000) {
                          return `${(value / 100000000).toFixed(1)}조`;
                        } else if (value >= 10000) {
                          return `${(value / 10000).toFixed(1)}억`;
                        } else if (value >= 1000) {
                          return `${(value / 1000).toFixed(1)}천만`;
                        } else {
                          return `${value}만`;
                        }
                      }}
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'assets') {
                          const formattedValue =
                            formatCurrency(String(value)) ||
                            `${value.toLocaleString()}만원`;
                          return [formattedValue, '총 자산'];
                        }
                        if (name === 'savings') {
                          const formattedValue =
                            formatCurrency(String(value)) ||
                            `${value.toLocaleString()}만원`;
                          return [formattedValue, '월 저축'];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label) => `시점: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="assets"
                      stroke={scenarios[scenario].color}
                      strokeWidth={3}
                      dot={{
                        fill: scenarios[scenario].color,
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssetScenarioChart;
