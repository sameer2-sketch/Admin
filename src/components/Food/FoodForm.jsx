import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';


const FoodForm = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Beverages');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [moods, setMoods] = useState([]);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
      setCategory(initialData.category);
      setImage(initialData.image);
      setAvailable(initialData.available);
      setIsVegetarian(initialData.isVegetarian);
      setIsFeatured(initialData.isFeatured);
      setMoods(initialData.moods || []);
    }
  }, [initialData]);
  
  const categoryOptions = [
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Main', label: 'Main' },
    { value: 'Sides', label: 'Sides' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Desserts', label: 'Desserts' },
  ];

  const moodOptions = [
    "Foucsed",
    'Relaxing',
    'Healthy',
    'Happy',
    'Sad',
    'Excited',
    'Stressed',
    "Romantic",
    "salad",
    "soup"
  ];
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      name,
      description,
      price: parseFloat(price),
      category,
      image: image || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
      available,
      isVegetarian,
      isFeatured,
      moods,
    });
  };

  const handleMoodChange = (mood) => {
    setMoods(prevMoods => 
      prevMoods.includes(mood)
        ? prevMoods.filter(m => m !== mood)
        : [...prevMoods, mood]
    );
  };
  
  return (
    <Card title={initialData ? 'Edit Menu Item' : 'Add New Menu Item'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            error={errors.name}
            fullWidth
          />
          
          <Input
            label="Price (₹)"
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            error={errors.price}
            fullWidth
          />
        </div>
        
        <TextArea
          label="Description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item description"
          rows={3}
          error={errors.description}
          fullWidth
          className="mb-4 w-full"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Category"
            id="category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            error={errors.category}
            fullWidth
            className="w-full"
          />
          
          <Input
            label="Image URL"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            error={errors.image}
            fullWidth
          />
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="vegetarian"
                checked={isVegetarian}
                onChange={() => setIsVegetarian(true)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="vegetarian" className="text-sm text-gray-700">Vegetarian</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="non-vegetarian"
                checked={!isVegetarian}
                onChange={() => setIsVegetarian(false)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="non-vegetarian" className="text-sm text-gray-700">Non-Vegetarian</label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">Featured Item</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Available for order</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood Tags
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {moodOptions.map((mood) => (
              <div key={mood} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`mood-${mood}`}
                  checked={moods.includes(mood)}
                  onChange={() => handleMoodChange(mood)}
                  className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor={`mood-${mood}`} className="text-sm text-gray-700">
                  {mood}
                </label>
              </div>
            ))}
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
            {initialData ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FoodForm;
