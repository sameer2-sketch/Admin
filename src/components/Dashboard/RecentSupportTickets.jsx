import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { SupportStatusBadge, SupportPriorityBadge } from '../ui/Badge';
import { format } from 'date-fns';
import Button from '../ui/Button';

function convertSecondsToDate(seconds) {
  if (!seconds && seconds !== 0) return 'N/A';
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date.toDateString();
}

const RecentSupportTickets= ({ tickets = [] }) => {
  const navigate = useNavigate();
  const sortedTickets = [...(tickets || [])]
    .sort((a, b) => {
      // Sort by priority first (urgent > high > medium > low)
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b?.priority] || 0) - (priorityOrder[a?.priority] || 0);
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by creation date (newest first)
      return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
    })
    .slice(0, 5);
  
  return (
    <Card 
      title="Recent Support Tickets" 
      subtitle="Latest 5 support requests from customers"
      footer={
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/support')}
          >
            View All Tickets
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
                Problem
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created 
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTickets?.map((ticket) => (
              <tr key={ticket?.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{ticket?.customerName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">Table {ticket?.tableNumber || 'N/A'}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="text-sm text-gray-900 capitalize">
                    {ticket?.problemType?.replace('-', ' ') || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {ticket?.description || 'No description'}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <SupportPriorityBadge priority={ticket?.priority} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <SupportStatusBadge status={ticket?.status} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {convertSecondsToDate(ticket?.createdAt?._seconds)}
                  </div>
                </td>
              </tr>
            ))}
            
            {(sortedTickets?.length || 0) === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                  No recent support tickets
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentSupportTickets;