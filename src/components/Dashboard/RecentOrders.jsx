import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { OrderStatusBadge } from '../ui/Badge';
import { format } from 'date-fns';
import Button from '../ui/Button';

const RecentOrders = ({ orders = [] }) => {

  function convertSecondsToDate(seconds) {
    if (!seconds && seconds !== 0) return 'N/A';
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }


  const navigate = useNavigate();
  const sortedOrders = [...(orders || [])]
    .sort((a, b) => new Date(convertSecondsToDate(b?.createdAt?._seconds)).getTime() - new Date(convertSecondsToDate(a?.createdAt?._seconds)).getTime())
    .slice(0, 5);
  
  return (
    <Card 
      title="Recent Orders" 
      subtitle="Latest 5 orders from customers"
      footer={
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders?.map((order) => (
              <tr key={order?.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order?.customerName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">Table {order?.tableNumber || 'N/A'}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {(order?.items?.length || 0)} {(order?.items?.length || 0) === 1 ? 'item' : 'items'}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${(order?.totalAmount || 0).toFixed(2)}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {convertSecondsToDate(order?.createdAt?._seconds)}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order?.status} />
                </td>
              </tr>
            ))}
            
            {(sortedOrders?.length || 0) === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                  No recent orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentOrders;