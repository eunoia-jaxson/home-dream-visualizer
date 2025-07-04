import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';
import type { SimulationData } from '@/types/asset';

interface AssetAnalysisChartsProps {
  selectedScenario: string;
  getScenarioData: (scenario: string) => SimulationData[];
  getAssetBreakdown: () => Array<{ name: string; value: number; fill: string }>;
  formatCurrency: (value: string) => string;
}

const AssetAnalysisCharts = ({
  selectedScenario,
  getScenarioData,
  getAssetBreakdown,
  formatCurrency,
}: AssetAnalysisChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-orange-600" />
            <span>15년 후 자산 구성</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip
                  formatter={(value, name) => {
                    const formattedValue =
                      formatCurrency(String(value)) ||
                      `${value.toLocaleString()}만원`;
                    return [formattedValue, name];
                  }}
                />
                <RechartsPieChart
                  dataKey="value"
                  data={getAssetBreakdown()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {getAssetBreakdown().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {getAssetBreakdown().map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(String(item.value)) ||
                    `${item.value.toLocaleString()}만원`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>연도별 수입/지출 변화</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getScenarioData(selectedScenario)}
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
                    const formattedValue =
                      formatCurrency(String(value)) ||
                      `${value.toLocaleString()}만원`;
                    return [
                      formattedValue,
                      name === 'income' ? '월 수입' : '월 지출',
                    ];
                  }}
                />
                <Bar dataKey="income" fill="#10b981" name="income" />
                <Bar dataKey="expense" fill="#ef4444" name="expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetAnalysisCharts;
