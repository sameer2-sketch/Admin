import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FoodItemCard from '../Food/FoodItemCard';
import FoodForm from '../Food/FoodForm';
import { Plus, Filter } from 'lucide-react';
import Select from '../ui/Select';
import Loader from '../../CommonComponents/Loader/Loader';
import { v4 as uuidv4 } from 'uuid';
import ConfirmationModal from '../ui/ConfirmationModal';
import ErrorModal from '../ui/ErrorModal';
import SuccessModal from '../ui/SuccessModal';

const Food = () => {
  let apiUrl = 'https://backend-i2v9.onrender.com/api/v1/food';
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState();
  const [categoryOptions, setCategoryOptions] = useState();
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [foodItems, setFoodItems] = useState(false);
  const [foodItemsError, setFoodItemsError] = useState('');
  const [isAddFoodLoading, setIsAddFoodLoading] = useState(false);
  const [isUpdateFoodLoading, setIsUpdateFoodLoading] = useState(false);
  const [isDeleteFoodLoading, setIsDeleteFoodLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  const availabilityOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'available', label: 'Available Only' },
    { value: 'unavailable', label: 'Unavailable Only' },
  ];

  const getFoodItems = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/getFoodItems`);
      const data = await res.json();
      setFoodItems(data?.foodList)
      handleFoodData(data?.foodList);
      } catch (error) {
      setFoodItemsError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  const handleFoodData = data => {
    const categories = data && ['all', ...new Set(data?.map(item => item.category))];
    const categoryOptions = data && categories?.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'All Categories' : cat,
    }));
    setCategoryOptions(categoryOptions)
    handleFilters(data)
  }

  useEffect(() => {
    foodItems && handleFilters(foodItems)
  }, [categoryFilter, foodItems, handleFilters])
  
  useEffect(() => {
    foodItems && handleFilters(foodItems)
  }, [availabilityFilter, foodItems, handleFilters])

  const handleFilters = (data) => {
    const filteredItems = data?.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      
      if (availabilityFilter === 'available' && !item.available) {
        return false;
      }
      
      if (availabilityFilter === 'unavailable' && item.available) {
        return false;
      }
      
      return true;
    });
    setFilteredItems(filteredItems)
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getFoodItems();
  }, [])
  
  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };
  
  const handleEdit = (id) => {
    const item = foodItems?.find(item => item.id === id);
    if (item) {
      setEditingItem(item);
      setShowForm(true);
    }
  };
  
  const handleDelete = (id) => {
    const item = foodItems.find(item => item.id === id);
    if (item) {
      setDeleteModal({ isOpen: true, item });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.item) {
      deleteFoodItem(deleteModal.item.id);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const addFoodItem = async(foodItem) => {
    let payload = foodItem;
    payload.id = uuidv4();
    setIsAddFoodLoading(true);
    try {
      const res = await fetch(`${apiUrl}/addFood`, {
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
          message: 'Failed to add the menu item. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Item Added',
          message: `"${foodItem.name}" has been successfully added to the menu.`
        });
      }
      getFoodItems();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Add Failed',
        message: 'Failed to add the menu item. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsAddFoodLoading(false)
    }
  }

  const updateFoodItem = async(id, foodItem) => {
    let payload = foodItem;
    payload.id = id;
    setIsUpdateFoodLoading(true);
    try {
      const res = await fetch(`${apiUrl}/updateFood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Update Failed',
          message: 'Failed to update the menu item. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Item Updated',
          message: `"${foodItem.name}" has been successfully updated.`
        });
      }
      getFoodItems();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update the menu item. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsUpdateFoodLoading(false)
    }
  }

  const deleteFoodItem = async(id) => {
    let payload = { id };
    setIsDeleteFoodLoading(true);
    try {
      const res = await fetch(`${apiUrl}/deleteFood`, {
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
          message: 'Failed to delete the menu item. Please try again.',
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Item Deleted',
          message: `"${deleteModal.item.name}" has been successfully removed from the menu.`
        });
      }
      getFoodItems();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Delete Failed',
        message: 'Failed to delete the menu item. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsDeleteFoodLoading(false)
    }
  }

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
  };

  const handleCategoryFilter = (e, data = foodItems, type = 'categoryFilter') => {
    type === 'categoryFilter' ? setCategoryFilter(e) : setAvailabilityFilter(e);
    handleFilters(data ? data : foodItems)
  }
  
  const handleSubmit = (foodItem) => {
    if (editingItem) {
      updateFoodItem(editingItem.id, foodItem);
    } else {
      addFoodItem(foodItem);
    }
    setShowForm(false);
    setEditingItem(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };
  
  return (
    <div className="space-y-6">
      {(isLoading || isAddFoodLoading || isUpdateFoodLoading || isDeleteFoodLoading) && <Loader showLoader={(isLoading || isAddFoodLoading || isUpdateFoodLoading || isDeleteFoodLoading)} />}
      {showForm ? (
        <FoodForm
          initialData={editingItem || undefined}
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
              <Plus size={18} className="mr-1" /> Add New Item
            </Button>
          </div>
          
          <Card>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {categoryOptions && <Select
                  options={categoryOptions && categoryOptions}
                  value={categoryFilter}
                  onChange={(e) => handleCategoryFilter(e, foodItems, 'categoryFilter')}
                  className="w-full sm:w-40"
                />}
                {availabilityOptions && <Select
                  options={availabilityOptions && availabilityOptions}
                  value={availabilityFilter}
                  onChange={(e) => handleCategoryFilter(e, foodItems, 'availabilityFilter')}
                  className="w-full sm:w-40"
                />}
              </div>
            </div>
            
            {(filteredItems?.length === 0) || (foodItemsError?.length > 0) ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{foodItemsError?.length > 0 ? foodItemsError :'No menu items found'}</p>
                {!(foodItemsError?.length > 0) && <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddNew}
                  className="mt-4"
                >
                  Add Your First Item
                </Button>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems && filteredItems.map(item => (
                  <FoodItemCard
                    key={item.id}
                    foodItem={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </Card>
        </>
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message={
          deleteModal.item 
            ? `Are you sure you want to delete "${deleteModal.item.name}"? This action cannot be undone and will remove the item from your menu permanently.`
            : ''
        }
        confirmText="Delete Item"
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

export default Food;