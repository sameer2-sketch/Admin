import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import FeedbackForm from '../Feedback/FeedbackForm';
import Button from '../ui/Button';
import FeedbackDetails from '../Feedback/FeedbackDetails';
import FeedbackList from '../Feedback/FeedbackList';
import Loader from '../../CommonComponents/Loader/Loader';
import ErrorModal from '../ui/ErrorModal';
import SuccessModal from '../ui/SuccessModal';
import { v4 as uuidv4 } from 'uuid';

const Feedback = () => {
  
  let apiUrl = 'https://backend-i2v9.onrender.com/api/v1/feedback';
  
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddFeedbackLoading, setIsAddFeedbackLoading] = useState(false);
  const [customerFeedbacks, setCustomerFeedbacks] = useState([]);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  

  const getFeedbacks = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/getFeedbacks`);
      const data = await res.json();
      setCustomerFeedbacks(data?.feedbackList)
      } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFeedbacks();
  }, [])
  
  const handleAddNew = () => {
    setEditingFeedback(null);
    setShowForm(true);
  };
  
  const handleEdit = (feedback) => {
    setViewingFeedback(null);
    setEditingFeedback(feedback);
    setShowForm(true);
  };
  
  const handleView = (feedback) => {
    setViewingFeedback(feedback);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer feedback?')) {
      // deleteCustomerFeedback(id);
    }
  };

  const addCustomerFeedback = async(feedback) => {
    let payload = feedback;
    payload.id = uuidv4();
    setIsAddFeedbackLoading(true);
    try {
      const res = await fetch(`${apiUrl}/addFeedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Add Failed',
          message: 'Failed to add the feedback. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Feedback Added',
          message: `Feedback has been successfully added.`
        });
      }
      getFeedbacks();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Add Failed',
        message: 'Failed to add the feedback. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsAddFeedbackLoading(false)
    }
  }
  
  const handleSubmit = (feedback) => {
    if (editingFeedback) {
      // updateCustomerFeedback(editingFeedback.id, feedback);
    } else {
      addCustomerFeedback(feedback);
    }
    setShowForm(false);
    setEditingFeedback(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingFeedback(null);
  };
  
  const handleCloseDetails = () => {
    setViewingFeedback(null);
  };

  const handleStatusChange = (feedbackId, status) => {
    // updateFeedbackStatus(feedbackId, status);
    if (viewingFeedback && viewingFeedback.id === feedbackId) {
      setViewingFeedback({ ...viewingFeedback, status });
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
      {(isLoading || isAddFeedbackLoading) && <Loader showLoader={(isLoading || isAddFeedbackLoading)} />}
      {showForm ? (
        <FeedbackForm
          initialData={editingFeedback || undefined}
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
              <Plus size={18} className="mr-1" /> Add New Feedback
            </Button>
          </div>
          
          <FeedbackList
            feedbacks={customerFeedbacks}
            onViewDetails={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {viewingFeedback && (
        <FeedbackDetails
          feedback={viewingFeedback}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}
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

export default Feedback;