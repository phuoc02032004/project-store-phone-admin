import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductsSoldChartProps {
  data: { name: string; quantity: number }[];
}

const ProductsSoldChart: React.FC<ProductsSoldChartProps> = ({ data }) => {
  const options = {
    chart: {
      id: 'products-sold-chart',
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
        text: 'Sản Phẩm'
      }
    },
    yaxis: {
      title: {
        text: 'Số Lượng Đã Bán'
      },
      labels: {
        formatter: function (value: number) {
          return value.toFixed(0);
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return value.toFixed(0);
        }
      }
    }
  };

  const series = [{
    name: 'Số Lượng',
    data: data.map(item => item.quantity)
  }];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Số Lượng Sản Phẩm Đã Bán</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      </CardContent>
    </Card>
  );
};

export default ProductsSoldChart;