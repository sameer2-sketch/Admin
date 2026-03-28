import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useAppContext } from '../Context/AppContext';
import Loader from '../../CommonComponents/Loader/Loader';

const OrderForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [foodItemOptions, setFoodItemOptions] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foodItemError, setFoodItemsError] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setCustomerEmail(initialData.customerEmail);
      setCustomerPhoneNumber(initialData.customerPhoneNumber);
      setTableNumber(initialData.tableNumber);
      setStatus(initialData.status);
      setItems(initialData.items.map(item => ({
        foodId: item.foodId ? item.foodId : item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })));
    } else {
      setItems([{ foodId: '', name: '', quantity: 1, price: 0 }]);
    }
  }, [initialData]);
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const handleFoodData = data => {
    const availableFoodItems = data.filter(item => item.available);
    const foodItemOptions = [
      { value: '', label: 'Select an item...' },
      ...availableFoodItems.map(item => ({
        value: item.id,
        label: `${item.name} - ₹${item.price.toFixed(2)}`,
      })),
    ];
    setFoodItemOptions(foodItemOptions);
  }

  const getFoodItems = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/food/getFoodItems`);
      const data = await res.json();
      setFoodItems(data?.foodList);
      handleFoodData(data?.foodList);
      } catch (error) {
      setFoodItemsError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFoodItems();
  }, [])
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!customerPhoneNumber.trim()) {
      newErrors.customerPhoneNumber = 'Customer Phone Number is required';
    }
    
    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }

    if (!tableNumber.trim()) {
      newErrors.tableNumber = 'Table number is required';
    }
    
    if (items.length === 0 || items.every(item => !item.foodId)) {
      newErrors.items = 'At least one item is required';
    }
    
    items.forEach((item, index) => {
      if (item.foodId && item.quantity <= 0) {
        newErrors[`quantity_${index}`] = 'Quantity must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const validItems = items.filter(item => item.foodId);
    const totalAmount = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    onSubmit({
      customerName,
      customerEmail,
      customerPhoneNumber,
      tableNumber,
      status,
      items: validItems,
      totalAmount,
    });
  };

  const handleFoodItemChange = (index, foodId) => {
    const selectedFood = foodItems.find(item => item.id === foodId);
    const newItems = [...items];
    
    if (selectedFood) {
      newItems[index] = {
        foodId: selectedFood.id,
        name: selectedFood.name,
        quantity: newItems[index].quantity,
        price: selectedFood.price,
      };
    } else {
      newItems[index] = {
        foodId: '',
        name: '',
        quantity: 1,
        price: 0,
      };
    }
    
    setItems(newItems);
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, quantity);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { foodId: '', name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return (
    <>
    {(isLoading) && <Loader showLoader={(isLoading)} />}
    <Card title={initialData ? 'Edit Order' : 'Create New Order'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Customer Name"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            error={errors.customerName}
            fullWidth
          />
          
          <Input
            label="Table Number"
            id="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table number"
            error={errors.tableNumber}
            fullWidth
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Email Address"
          id="customerEmail"
          type="customerEmail"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Email address"
          error={errors.customerEmail}
          fullWidth
        />

        <Input
          label="Phone Number"
          id="customerPhoneNumber"
          type="customerPhoneNumber"
          value={customerPhoneNumber}
          onChange={(e) => setCustomerPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          error={errors.customerPhoneNumber}
          fullWidth
        />
        </div>
        
        <Select
          label="Order Status"
          id="status"
          value={status}
          onChange={(value) => setStatus(value)}
          options={statusOptions}
          className="mb-4 w-64"
          fullWidth
        />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Order Items
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
          
          {errors.items && (
            <p className="text-sm text-red-600 mb-2">{errors.items}</p>
          )}
          
          <div className="space-y-3">
            {items.map((item, index) => (
              !foodItemError?.length > 0 && <div key={index} className="flex items-end gap-2 p-3 border border-gray-200 rounded-md">
                <div className="flex-1">
                  <Select
                    label="Food Item"
                    options={foodItemOptions}
                    value={item.foodId}
                    onChange={(value) => handleFoodItemChange(index, value)}
                    fullWidth
                  />
                </div>
                
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, item.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-t border-b border-gray-300 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {errors[`quantity_${index}`] && (
                    <p className="text-xs text-red-600 mt-1">{errors[`quantity_${index}`]}</p>
                  )}
                </div>
                
                <div className="w-24 text-right">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtotal
                  </label>
                  <div className="text-lg font-semibold text-gray-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div> 
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-amber-700">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Card>
    </>
  );
};

export default OrderForm;