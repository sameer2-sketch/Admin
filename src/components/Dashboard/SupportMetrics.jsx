import React from 'react';
import Card from '../ui/Card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Clock, Users, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const SupportMetrics = ({ tickets = [] }) => {
  // Calculate metrics
  const statusCounts = tickets?.reduce((acc, ticket) => {
    acc[ticket?.status] = (acc[ticket?.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const priorityCounts = tickets?.reduce((acc, ticket) => {
    acc[ticket?.priority] = (acc[ticket?.priority] || 0) + 1;
    return acc;
  }, {}) || {};

  const problemTypeCounts = tickets?.reduce((acc, ticket) => {
    acc[ticket?.problemType] = (acc[ticket?.problemType] || 0) + 1;
    return acc;
  }, {}) || {};

  // Calculate response metrics
  const openTickets = tickets?.filter(t => t?.status === 'open').length || 0;
  const resolvedTickets = tickets?.filter(t => t?.status === 'resolved').length || 0;
  const urgentTickets = tickets?.filter(t => t?.priority === 'urgent').length || 0;
  const pendingTickets = tickets?.filter(t => t?.priority === 'pending').length || 0;
  const resolutionRate = (tickets?.length || 0) > 0 ? (resolvedTickets / (tickets?.length || 1)) * 100 : 0;

  // Calculate customer satisfaction (mock data based on resolution rate)
  const customerSatisfaction = Math.min(95, Math.max(60, resolutionRate + 20));

  const statusData = {
    labels: Object.keys(statusCounts || {}).map(status => 
      status === 'in-progress' ? 'In Progress' : 
      status?.charAt(0)?.toUpperCase() + status?.slice(1)
    ),
    datasets: [
      {
        data: Object.values(statusCounts || {}),
        backgroundColor: [
          '#ef4444', // red for open
          '#f59e0b', // amber for in-progress
          '#10b981', // green for resolved
          '#6b7280', // gray for closed
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const priorityData = {
    labels: Object.keys(priorityCounts || {}).map(priority => 
      priority?.charAt(0)?.toUpperCase() + priority?.slice(1)
    ),
    datasets: [
      {
        data: Object.values(priorityCounts || {}),
        backgroundColor: [
          '#dc2626', // red for urgent
          '#ea580c', // orange for high
          '#3b82f6', // blue for medium
          '#6b7280', // gray for low
        ],
        borderWidth: 2,
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

  return (
    <Card 
      title="Support Analytics" 
      subtitle="Comprehensive support performance metrics"
      className="bg-gradient-to-br from-indigo-50 to-purple-50"
    >
      <div className="space-y-6">
        {/* Key Support Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <Users size={20} className="text-indigo-600" />
            </div>
            <p className="text-lg font-bold text-indigo-600">{tickets?.length || 0}</p>
            <p className="text-xs text-gray-600">Total Tickets</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <p className="text-lg font-bold text-red-600">{urgentTickets}</p>
            <p className="text-xs text-gray-600">Urgent Tickets</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown size={20} className="text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-600">{pendingTickets}</p>
            <p className="text-xs text-gray-600">Pending Tickets</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-600">{(resolutionRate || 0).toFixed(1)}%</p>
            <p className="text-xs text-gray-600">Resolution Rate</p>
          </div>
        </div>

        {/* Support Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock size={16} className="mr-2 text-indigo-600" />
              Response Metrics
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Open Tickets</span>
                <span className="text-sm font-medium text-red-600">{openTickets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved Today</span>
                <span className="text-sm font-medium text-green-600">{resolvedTickets}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-2 text-amber-600" />
              Priority Distribution
            </h4>
            <div className="space-y-2">
              {Object.entries(priorityCounts || {})
                .sort(([,a], [,b]) => (b || 0) - (a || 0))
                .map(([priority, count]) => {
                  const percentage = (tickets?.length || 0) > 0 ? ((count || 0) / (tickets?.length || 1)) * 100 : 0;
                  const colorClass = priority === 'urgent' ? 'bg-red-500' :
                                   priority === 'high' ? 'bg-orange-500' :
                                   priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500';
                  
                  return (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                        <span className="text-sm text-gray-600 capitalize">{priority || 'unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{count || 0}</span>
                        <span className="text-xs text-gray-500">({(percentage || 0).toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Charts */}
        {(tickets?.length || 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Status Distribution</h4>
              <div className="h-40">
                <Pie data={statusData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Priority Breakdown</h4>
              <div className="h-40">
                <Pie data={priorityData} options={chartOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No support tickets to analyze</p>
          </div>
        )}

        {/* Problem Types */}
        {Object.keys(problemTypeCounts || {}).length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Common Issues</h4>
            <div className="space-y-2">
              {Object.entries(problemTypeCounts || {})
                .sort(([,a], [,b]) => (b || 0) - (a || 0))
                .map(([type, count]) => {
                  const percentage = (tickets?.length || 0) > 0 ? ((count || 0) / (tickets?.length || 1)) * 100 : 0;
                  
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {type?.replace('-', ' ') || 'unknown'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{count || 0}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SupportMetrics;