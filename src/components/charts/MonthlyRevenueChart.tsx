import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyRevenueChartProps {
  data: { name: string; revenue: number }[];
}

const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ data }) => {
  const options = {
    chart: {
      id: 'monthly-revenue-chart',
      type: 'line' as 'line', // Explicitly cast to the correct type
      toolbar: {
        autoSelected: 'zoom' as 'zoom',
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
          customIcons: []
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp: any) {
              return new Date(timestamp).toDateString()
            }
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          }
        },
      },
    },
    xaxis: {
      categories: data.map(item => {
        const [year, month] = item.name.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
      }),
      title: {
        text: 'Tháng'
      }
    },
    yaxis: {
      title: {
        text: 'Doanh Thu (VND)'
      },
      labels: {
        formatter: function (value: number) {
          return new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value) + ' VND';
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as 'smooth'
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
      }
    }
  };

  const series = [{
    name: 'Doanh Thu',
    data: data.map(item => item.revenue)
  }];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Doanh Thu Theo Tháng</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ReactApexChart options={options} series={series} type="line" height={300} />
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenueChart;