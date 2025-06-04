import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyRevenueChartProps {
  data: { x: number; y: number }[];
}

const WeeklyRevenueChart: React.FC<WeeklyRevenueChartProps> = ({ data }) => {
  const options = {
    chart: {
      id: 'weekly-revenue-chart',
      toolbar: {
        autoSelected: 'zoom' as 'zoom', // Explicitly cast to the correct type
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
      type: 'datetime' as 'datetime',
      labels: {
        formatter: function(value: string, timestamp?: number) {
          return timestamp ? new Date(timestamp).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }) : '';
        }
      },
      title: {
        text: 'Ngày'
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
      x: {
        format: 'dd/MM/yy'
      },
      y: {
        formatter: function (value: number) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
      }
    }
  };

  const series = [{
    name: 'Doanh Thu',
    data: data
  }];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Doanh Thu Theo Tuần</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ReactApexChart options={options} series={series} type="line" height={300} />
      </CardContent>
    </Card>
  );
};

export default WeeklyRevenueChart;