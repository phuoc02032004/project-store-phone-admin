import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesChartProps {
  data: { name: string; sales: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const options = {
    chart: {
      id: 'sales-chart',
      type: 'bar' as 'bar',
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
      categories: data.map(item => item.name),
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
    data: data.map(item => item.sales)
  }];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Doanh Thu Theo Tháng (Tổng)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      </CardContent>
    </Card>
  );
};

export default SalesChart;