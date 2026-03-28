import React, { useState } from 'react';
import Card from '../ui/Card';
import { SupportStatusBadge, SupportPriorityBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { Eye, Trash2, Edit } from 'lucide-react';
import Select from '../ui/Select';

const SupportTicketList = ({
  tickets,
  onViewDetails,
  onEdit,
  onDelete,
  supportError
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [problemTypeFilter, setProblemTypeFilter] = useState('all');
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];
  
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const problemTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'food-quality', label: 'Food Quality' },
    { value: 'service', label: 'Service' },
    { value: 'billing', label: 'Billing' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'other', label: 'Other' },
  ];

  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }
  
  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) {
      return false;
    }
    
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) {
      return false;
    }

    if (problemTypeFilter !== 'all' && ticket.problemType !== problemTypeFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort by priority (urgent first) and then by creation date
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  return (
    <Card title="Support Tickets">
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-40"
          />
          <Select
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
            className="w-full sm:w-40"
          />
          <Select
            options={problemTypeOptions}
            value={problemTypeFilter}
            onChange={setProblemTypeFilter}
            className="w-full sm:w-40"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'} found
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{ticket.customerName}</div>
                  <div className="text-sm text-gray-500">Table {ticket.tableNumber}</div>
                  <div className="text-sm text-gray-500">{ticket.email}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 capitalize">
                    {ticket.problemType.replace('-', ' ')}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {ticket.description}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <SupportPriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <SupportStatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                  {ticket?.createdAt?._seconds ? convertSecondsToDate(ticket?.createdAt?._seconds) : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {ticket?.createdAt?._seconds ? convertSecondsToDate(ticket?.createdAt?._seconds) : ''}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(ticket)}
                      className="flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    {(ticket.status !== 'resolved' && ticket.status !== 'closed') && <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(ticket)}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(ticket.id)}
                      className="flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {((supportError?.length > 0) || (sortedTickets?.length === 0)) && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-sm text-gray-500 text-center">
                  {supportError?.length > 0 ? supportError :'No support tickets found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SupportTicketList;