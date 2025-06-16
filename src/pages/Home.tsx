import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/api/order";
import type { Order } from "@/types/Order";
import WeeklyRevenueChart from "@/components/charts/WeeklyRevenueChart";
import MonthlyRevenueChart from "@/components/charts/MonthlyRevenueChart";
import SalesChart from "@/components/charts/SalesChart";
import ProductsSoldChart from "@/components/charts/ProductsSoldChart";

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const { totalRevenue,  } = useMemo(() => {
    let revenue = 0;
    let salesCount = 0;

    orders.forEach(order => {
      if (order.finalAmount !== undefined) {
        revenue += order.finalAmount;
      } else {
        revenue += order.totalAmount;
      }
      salesCount += 1;
    });
    return { totalRevenue: revenue, totalSales: salesCount };
  }, [orders]);

  const weeklyRevenueData = useMemo(() => {
    const dailyData: Record<string, number> = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

      const revenue = order.finalAmount !== undefined ? order.finalAmount : order.totalAmount;

      if (!dailyData[startOfDay]) {
        dailyData[startOfDay] = 0;
      }
      dailyData[startOfDay] += revenue;
    });

    return Object.entries(dailyData)
      .map(([timestamp, revenue]) => ({ x: parseInt(timestamp), y: revenue }))
      .sort((a, b) => a.x - b.x);
  }, [orders]);

  const monthlyRevenueData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      const revenue = order.finalAmount !== undefined ? order.finalAmount : order.totalAmount;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += revenue;
    });

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ name: month, revenue }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [orders]);

  const { totalMonthlyRevenue, totalDailyRevenue, totalMonthlyOrders, totalDailyOrders } = useMemo(() => {
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const currentDayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    let monthlyRevenue = 0;
    let dailyRevenue = 0;
    let monthlyOrders = 0;
    let dailyOrders = 0;

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const orderMonthKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
      const orderDayTimestamp = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime();

      const revenue = order.finalAmount !== undefined ? order.finalAmount : order.totalAmount;

      if (orderMonthKey === currentMonthKey) {
        monthlyRevenue += revenue;
        monthlyOrders += 1;
      }

      if (orderDayTimestamp === currentDayTimestamp) {
        dailyRevenue += revenue;
        dailyOrders += 1;
      }
    });

    return { totalMonthlyRevenue: monthlyRevenue, totalDailyRevenue: dailyRevenue, totalMonthlyOrders: monthlyOrders, totalDailyOrders: dailyOrders };
  }, [orders]);


  const salesChartData = useMemo(() => {
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

    return Object.values(salesDataForChart).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [orders]);

  const productsSoldChartData = useMemo(() => {
    const productsSoldDataForChart = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const productName = item.product;

        if (!acc[productName]) {
          acc[productName] = { name: productName, quantity: 0 };
        }
        acc[productName].quantity += item.quantity;
      });
      return acc;
    }, {} as Record<string, { name: string; quantity: number }>);

    return Object.values(productsSoldDataForChart);
  }, [orders]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 lg:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
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
            <CardTitle className="text-sm font-medium">Doanh Thu Tháng Này</CardTitle>
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
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalMonthlyRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh Thu Hôm Nay</CardTitle>
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
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDailyRevenue)}
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
            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng Tháng Này</CardTitle>
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
            <div className="text-2xl font-bold">{totalMonthlyOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng Hôm Nay</CardTitle>
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
            <div className="text-2xl font-bold">{totalDailyOrders}</div>
          </CardContent>
        </Card>
      </div>

      <WeeklyRevenueChart data={weeklyRevenueData} />

      <MonthlyRevenueChart data={monthlyRevenueData} />

      <SalesChart data={salesChartData} />

      <ProductsSoldChart data={productsSoldChartData} />
    </div>
  );
};

export default Home;