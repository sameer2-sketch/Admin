import React from 'react';
import { SupportStatusBadge, SupportPriorityBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { X, User, Mail, Hash, AlertTriangle, Clock, MessageSquare } from 'lucide-react';

const SupportTicketDetails = ({
  ticket,
  onClose,
  onEdit,
  onStatusChange,
}) => {
  const handleStatusChange = (e) => {
    onStatusChange(ticket.id, e.target.value);
  };

  const getProblemTypeLabel = (type) => {
    const labels = {
      'food-quality': 'Food Quality',
      'service': 'Service',
      'billing': 'Billing',
      'cleanliness': 'Cleanliness',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Support Ticket Details
                  </h3>
                  <div className="flex space-x-2">
                    <SupportPriorityBadge priority={ticket.priority} />
                    <SupportStatusBadge status={ticket.status} />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="text-sm text-gray-900">{ticket.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Hash size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Table Number</p>
                        <p className="text-sm text-gray-900">{ticket.tableNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{ticket.customerEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <AlertTriangle size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Problem Type</p>
                        <p className="text-sm text-gray-900">{getProblemTypeLabel(ticket.problemType)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Created</p>
                        <p className="text-sm text-gray-900">
                          { ticket.createdAt._seconds ? convertSecondsToDate(ticket.createdAt._seconds) : ''}
                        </p>
                      </div>
                    </div>
                    
                    { ticket?.updatedAt && <div className="flex items-center">
                      <Clock size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-sm text-gray-900">
                          {ticket?.updatedAt?._seconds ? convertSecondsToDate(ticket?.updatedAt?._seconds) : ''}
                        </p>
                      </div>
                    </div> }
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                  <select
                    value={ticket.status}
                    onChange={handleStatusChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-start">
                    <MessageSquare size={18} className="text-amber-600 mr-2 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-2">Problem Description</p>
                      <div className="bg-white border border-gray-200 rounded-md p-3">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{ticket.problemDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              variant="primary"
              onClick={() => onEdit(ticket)}
              className="w-full sm:w-auto sm:ml-3"
            >
              Edit Ticket
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full mt-3 sm:mt-0 sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetails;