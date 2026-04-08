import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';

import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Users,
  Coffee,
  Star,
  Calendar,
  Target,
  ThumbsUp
} from 'lucide-react';
import StatsCard from '../Dashboard/StatsCard';
import OrderStatusDistribution from '../Dashboard/OrderStatusDistribution';
import RevenueBreakdown from '../Dashboard/RevenueBreakdown';
import SupportMetrics from '../Dashboard/SupportMetrics';
import PopularItems from '../Dashboard/PopularItems';
import RecentOrders from '../Dashboard/RecentOrders';
import RecentSupportTickets from '../Dashboard/RecentSupportTickets';
import OrdersChart from '../Dashboard/OrdersChart';
import Loader from '../../CommonComponents/Loader/Loader';
import FeedbackMetrics from '../Dashboard/FeedbackMetrics';
import RecentFeedbacks from '../Dashboard/RecentFeedbacks';
import logo from '../../assets/logo2.png'

const Dashboard = () => {

  const { dashboardStats } = useAppContext();

  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableItems, setAvailableItems] = useState(0);
  const [featuredItems, setFeaturedItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [urgentTickets, setUrgentTickets] = useState(0);
  const [totalSupportTickets, setTotalSupportTickets] = useState(0);
  const [pendingSupportTickets, setPendingSupportTickets] = useState(0);
  const [customerFeedbacks, setCustomerFeedbacks] = useState([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const getFoodItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/food/getFoodItems`);
      const data = await res.json();
      setFoodItems(data?.foodList);
      const availableItems = data?.foodList?.filter(item => item.available)?.length;
      const featuredItems = data?.foodList?.filter(item => item.isFeatured)?.length;
      setAvailableItems(availableItems)
      setFeaturedItems(featuredItems)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const getOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/orders/getOrders`);
      const data = await res.json();
      setOrders(data?.orderList);
      const totalOrders = data?.orderList?.length;
      setTotalOrders(totalOrders)
      const totalRevenue = data?.orderList?.reduce((sum, order) => sum + order.totalAmount, 0);
      setTotalRevenue(totalRevenue);
      const pendingOrders = data?.orderList?.filter(order =>
        ['pending', 'preparing'].includes(order.status)).length;
      setPendingOrders(pendingOrders);
      const completedOrders = data?.orderList?.filter(order =>
        order.status === 'delivered').length;

      const todayOrders = data?.orderList.filter(order =>
        new Date(convertSecondsToDate(order.createdAt?._seconds)) >= todayStart
      );

      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      setTodayRevenue(todayRevenue);
      const avgOrderValue = data?.orderList.length > 0
        ? totalRevenue / totalOrders
        : 0;
      setAvgOrderValue(avgOrderValue);
      const completionRate = totalOrders > 0
        ? (completedOrders / totalOrders) * 100
        : 0
      setCompletionRate(completionRate);
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const getSupports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/support/getSupport`);
      const data = await res.json();
      setSupportTickets(data?.supportList);
      const urgentTickets = data?.supportList.filter(ticket =>
        ticket.priority === 'urgent' && ['open', 'in-progress'].includes(ticket.status)
      ).length;
      setUrgentTickets(urgentTickets);
      const totalSupportTickets = data?.supportList.length;
      setTotalSupportTickets(totalSupportTickets);
      const pendingSupportTickets = data?.supportList.filter(ticket =>
        ['open', 'in-progress'].includes(ticket.status)).length;
      setPendingSupportTickets(pendingSupportTickets);
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const getFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/feedback/getFeedbacks`);
      const data = await res.json();
      setCustomerFeedbacks(data?.feedbackList);
      const totalFeedbacks = data?.feedbackList.length;
      setTotalFeedbacks(totalFeedbacks);
      const averageRating = totalFeedbacks > 0
        ? data?.feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks
        : 0;
        setAverageRating(averageRating);
      const recommendationRate = totalFeedbacks > 0
        ? (data?.feedbackList.filter(feedback => feedback.wouldRecommend).length / totalFeedbacks) * 100
        : 0;
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFoodItems();
    getOrders();
    getSupports();
    getFeedbacks();
  }, [])


  return (
    <div className="space-y-8">
      {(isLoading) && <Loader showLoader={(isLoading)} />}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to MoodNest Admin Dashboard</h1>
            <p className="text-amber-100">
              Here's what's happening at your café today
            </p>
          </div>
          <div className="hidden md:block">
            <img src={logo} style={{ height: 100, width: 100 }}/>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={totalRevenue && `₹${totalRevenue?.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingBag size={24} />}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
        />
        <StatsCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toFixed(2)}`}
          icon={<TrendingUp size={24} />}
          className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
        />
        <StatsCard
          title="Avg Order Value"
          value={`₹${avgOrderValue.toFixed(2)}`}
          icon={<Target size={24} />}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock size={24} />}
          className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate.toFixed(1)}%`}
          icon={<CheckCircle size={24} />}
          className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200"
        />
        <StatsCard
          title="Available Items"
          value={availableItems}
          icon={<Coffee size={24} />}
          className="bg-gradient-to-br from-brown-50 to-amber-50 border-amber-200"
        />
        <StatsCard
          title="Featured Items"
          value={featuredItems}
          icon={<Star size={24} />}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
        />
      </div>

      {/* Support Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Support Tickets"
          value={totalSupportTickets}
          icon={<MessageSquare size={24} />}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200"
        />
        <StatsCard
          title="Pending Support"
          value={pendingSupportTickets}
          icon={<AlertTriangle size={24} />}
          className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
        />
        <StatsCard
          title="Urgent Tickets"
          value={urgentTickets}
          icon={<AlertTriangle size={24} />}
          className="bg-gradient-to-br from-red-100 to-red-50 border-red-300"
        />
        <StatsCard
          title="Customer Feedbacks"
          value={totalFeedbacks}
          icon={<Star size={24} />}
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
        />
        <StatsCard
          title="Avg Rating"
          value={`${averageRating.toFixed(1)}/5`}
          icon={<ThumbsUp size={24} />}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart orders={orders} />
        <OrderStatusDistribution orders={orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBreakdown orders={orders} />
        <SupportMetrics tickets={supportTickets} />
      </div>

      {/* Popular Items */}
      <PopularItems orders={orders} foodItems={foodItems} />
      <FeedbackMetrics feedbacks={customerFeedbacks} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <RecentSupportTickets tickets={supportTickets} />
        <RecentFeedbacks feedbacks={customerFeedbacks} />
      </div>
    </div>
  );
};

export default Dashboard;