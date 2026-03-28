import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import { Plus } from 'lucide-react';
import SupportTicketForm from '../Support/SupportTicketForm';
import SupportTicketList from '../Support/SupportTicketList';
import SupportTicketDetails from '../Support/SupportTicketDetails';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../../CommonComponents/Loader/Loader';
import ErrorModal from '../ui/ErrorModal';
import SuccessModal from '../ui/SuccessModal';
import ConfirmationModal from '../ui/ConfirmationModal';

const Support = () => {
  const { 
    updateSupportTicketStatus 
  } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addSupportLoading, setIsAddSupportLoading] = useState(false);
  const [updateSupportLoading, setIsUpdateSupportLoading] = useState(false);
  const [deleteSupportLoading, setIsDeleteSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  
  let apiUrl = 'https://backend-i2v9.onrender.com/api/v1/support';
  
  const handleAddNew = () => {
    setEditingTicket(null);
    setShowForm(true);
  };
  
  const handleEdit = (ticket) => {
    setViewingTicket(null);
    setEditingTicket(ticket);
    setShowForm(true);
  };
  
  const handleView = (ticket) => {
    setViewingTicket(ticket);
  };
  
  const handleDelete = (id) => {
    const item = supportTickets.find(item => item.id === id);
    if (item) {
      setDeleteModal({ isOpen: true, item });
    }
  };

  const deleteSupport = async(id) => {
    let payload = { id };
    setIsDeleteSupportLoading(true);
    try {
      const res = await fetch(`${apiUrl}/deleteSupport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Delete Failed',
          message: 'Failed to delete the support. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Support Deleted',
          message: `Support has been successfully removed.`
        });
      }
      getSupports();
    } catch (error) {
      
    } finally {
      setIsDeleteSupportLoading(false)
    }
  }

  const confirmDelete = () => {
    if (deleteModal.item) {
      deleteSupport(deleteModal.item.id);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const getSupports = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/getSupport`);
      const data = await res.json();
      setSupportTickets(data?.supportList)
      } catch (error) {
      setSupportError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getSupports();
  }, [])
  
  const getEstimatedResolution = (priority) => {
    switch (priority) {
      case 'high': return 'Within 5-10 minutes';
      case 'medium': return 'Within 15-30 minutes';
      case 'low': return 'Within 30-60 minutes';
      default: return 'Within 30 minutes';
    }
  };

  const addSupportTicket = async (ticket) => {
    let payload = ticket;
    payload.id = uuidv4();
    payload.estimatedResolution = getEstimatedResolution(ticket.priority)
    setIsAddSupportLoading(true);
    try {
      const res = await fetch(`${apiUrl}/addSupport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      getSupports();
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Add Failed',
          message: 'Failed to add support. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Support Added',
          message: `Support has been successfully added.`
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Add Failed',
        message: 'Failed to add support. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsAddSupportLoading(false)
    }
  };

  const updateSupportTicket = async (id , ticket) => {
    let payload = ticket;
    payload.id = id;
    setIsUpdateSupportLoading(true);
    try {
      const res = await fetch(`${apiUrl}/updateSupport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      getSupports();
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Update Failed',
          message: 'Failed to update the support. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Support Updated',
          message: `Support has been successfully updated.`
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update the support. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsUpdateSupportLoading(false)
    }
  }
  
  const handleSubmit = (ticket) => {
    if (editingTicket) {
      updateSupportTicket(editingTicket.id, ticket);
    } else {
      addSupportTicket(ticket);
    }
    setShowForm(false);
    setEditingTicket(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingTicket(null);
  };
  
  const handleCloseDetails = () => {
    setViewingTicket(null);
  };

  const handleStatusChange = (ticketId, status) => {
    updateSupportTicketStatus(ticketId, status);
    if (viewingTicket && viewingTicket.id === ticketId) {
      setViewingTicket({ ...viewingTicket, status });
    }
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
  };
  
  return (
    <div className="space-y-6">
      {(addSupportLoading || isLoading || updateSupportLoading || deleteSupportLoading) && <Loader showLoader={(addSupportLoading || isLoading || updateSupportLoading || deleteSupportLoading)} />}
      {showForm ? (
        <SupportTicketForm
          initialData={editingTicket || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" /> Create New Ticket
            </Button>
          </div>
          
          { supportTickets?.length > 0 && <SupportTicketList
            tickets={supportTickets}
            onViewDetails={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            supportError={supportError}
          /> }
        </>
      )}
      
      {viewingTicket && (
        <SupportTicketDetails
          ticket={viewingTicket}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Support"
        message={
          deleteModal.item 
            ? `Are you sure you want to delete this support? This action cannot be undone and will remove the support permanently.`
            : ''
        }
        confirmText="Delete Support"
        cancelText="Cancel"
        type="danger"
      />
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
};

export default Support;