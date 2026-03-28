import React from 'react';
import Card from '../ui/Card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Clock, CheckCircle, AlertCircle, XCircle, Package } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusDistribution = ({ orders = [] }) => {
  const statusCounts = orders?.reduce((acc, order) => {
    acc[order?.status] = (acc[order?.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const statusData = {
    labels: Object.keys(statusCounts || {}).map(status => 
      status?.charAt(0)?.toUpperCase() + status?.slice(1)
    ),
    datasets: [
      {
        data: Object.values(statusCounts || {}),
        backgroundColor: [
          '#f59e0b', // amber for pending
          '#3b82f6', // blue for preparing
          '#10b981', // green for ready
          '#22c55e', // green for delivered
          '#ef4444', // red for cancelled
        ],
        borderWidth: 3,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock size={20} className="text-gray-600" />;
    switch (status) {
      case 'pending': return <Clock size={20} className="text-amber-600" />;
      case 'preparing': return <Package size={20} className="text-blue-600" />;
      case 'ready': return <AlertCircle size={20} className="text-green-600" />;
      case 'delivered': return <CheckCircle size={20} className="text-green-700" />;
      case 'cancelled': return <XCircle size={20} className="text-red-600" />;
      default: return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-600';
    switch (status) {
      case 'pending': return 'text-amber-600';
      case 'preparing': return 'text-blue-600';
      case 'ready': return 'text-green-600';
      case 'delivered': return 'text-green-700';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card 
      title="Order Status Distribution" 
      subtitle="Current order status breakdown"
      className="bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(statusCounts || {}).map(([status, count]) => (
            <div key={status} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status}
                  </span>
                </div>
                <span className={`text-lg font-bold ${getStatusColor(status)}`}>
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        {orders?.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="h-64">
              <Pie data={statusData} options={chartOptions} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm text-center py-8">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No orders to display</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {((statusCounts?.delivered || 0) / Math.max(orders?.length || 0, 1) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">Completion Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {(statusCounts?.pending || 0) + (statusCounts?.preparing || 0)}
              </p>
              <p className="text-xs text-gray-600">Active Orders</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderStatusDistribution;