import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/api/order";
import type { Order } from "@/types/Order";
// Import shadcn chart components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// Import recharts components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  // Add state for weekly and monthly revenue data
  const [weeklyRevenueData, setWeeklyRevenueData] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  // Add state for other metrics if needed

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
        calculateMetrics(data);
        calculateWeeklyRevenue(data);
        calculateMonthlyRevenue(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const calculateMetrics = (orders: Order[]) => {
    let revenue = 0;
    let salesCount = 0;

    orders.forEach(order => {
      // Assuming 'finalAmount' is the total amount after discount/shipping
      // If not, you might need to calculate based on items and other fields
      if (order.finalAmount !== undefined) {
        revenue += order.finalAmount;
      } else {
        // Fallback if finalAmount is not available
        revenue += order.totalAmount;
      }
      salesCount += 1; // Each order is one sale
    });

    setTotalRevenue(revenue);
    setTotalSales(salesCount);
    // Calculate and set other metrics here
  };

  // Add functions to calculate weekly and monthly revenue
  const calculateWeeklyRevenue = (orders: Order[]) => {
    const weeklyData: Record<string, number> = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      // Get the start of the week (e.g., Monday)
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Adjust for Sunday as last day
      startOfWeek.setHours(0, 0, 0, 0);

      const weekKey = startOfWeek.toISOString().split('T')[0]; // Use start date as key

      const revenue = order.finalAmount !== undefined ? order.finalAmount : order.totalAmount;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0;
      }
      weeklyData[weekKey] += revenue;
    });

    // Convert to array and sort by date
    const sortedWeeklyData = Object.entries(weeklyData)
      .map(([date, revenue]) => ({ name: date, revenue }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    setWeeklyRevenueData(sortedWeeklyData);
  };

  const calculateMonthlyRevenue = (orders: Order[]) => {
    const monthlyData: Record<string, number> = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM format

      const revenue = order.finalAmount !== undefined ? order.finalAmount : order.totalAmount;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += revenue;
    });

    // Convert to array and sort by date
    const sortedMonthlyData = Object.entries(monthlyData)
      .map(([month, revenue]) => ({ name: month, revenue }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    setMonthlyRevenueData(sortedMonthlyData);
  };

  // Prepare data for charts (example: sales over time)
  const salesDataForChart = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!acc[key]) {
      acc[key] = { name: key, sales: 0 };
    }
     if (order.finalAmount !== undefined) {
        acc[key].sales += order.finalAmount;
      } else {
        acc[key].sales += order.totalAmount;
      }

    return acc;
  }, {} as Record<string, { name: string; sales: number }>);

  const salesChartData = Object.values(salesDataForChart).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());


  // Prepare data for products sold chart (example: quantity sold per product)
  const productsSoldDataForChart = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      // Assuming item.product is the product name or ID you want to group by
      // You might need to fetch product details to get names if item.product is an ID
      const productName = item.product; // Replace with actual product name if available

      if (!acc[productName]) {
        acc[productName] = { name: productName, quantity: 0 };
      }
      acc[productName].quantity += item.quantity;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number }>);

  const productsSoldChartData = Object.values(productsSoldDataForChart);


  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Doanh Thu
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect width="8" height="2" x="8" y="2" rx="1"></rect>
              <path d="M12 17v-6"></path>
              <path d="M15 14h-6"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh Thu</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue Chart */}
      <div className="grid gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh Thu Theo Tuần</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }} className="min-h-[300px] w-full">
              <LineChart
                data={weeklyRevenueData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 60,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)} VND`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="revenue"
                  type="monotone"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-revenue)",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "var(--color-revenue)",
                    stroke: "white",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="grid gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh Thu Theo Tháng</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }} className="min-h-[300px] w-full">
              <LineChart
                data={monthlyRevenueData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 60,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)} VND`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="revenue"
                  type="monotone"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-revenue)",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "var(--color-revenue)",
                    stroke: "white",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;