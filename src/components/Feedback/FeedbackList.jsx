import React, { useState } from 'react';
import Card from '../ui/Card';
import { FeedbackStatusBadge, FeedbackCategoryBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { Eye, Trash2, Edit, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import Select from '../ui/Select';

const FeedbackList = ({
  feedbacks,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [recommendationFilter, setRecommendationFilter] = useState('all');
  
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'responded', label: 'Responded' },
    { value: 'archived', label: 'Archived' },
  ];
  
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'food-quality', label: 'Food Quality' },
    { value: 'service', label: 'Service' },
    { value: 'ambiance', label: 'Ambiance' },
    { value: 'value', label: 'Value' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'overall', label: 'Overall' },
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
  ];

  const recommendationOptions = [
    { value: 'all', label: 'All' },
    { value: 'yes', label: 'Would Recommend' },
    { value: 'no', label: 'Would Not Recommend' },
  ];
  
  const filteredFeedbacks = feedbacks?.filter(feedback => {
    if (statusFilter !== 'all' && feedback.status !== statusFilter) {
      return false;
    }
    
    if (categoryFilter !== 'all' && feedback.category !== categoryFilter) {
      return false;
    }

    if (ratingFilter !== 'all' && feedback.rating.toString() !== ratingFilter) {
      return false;
    }

    if (recommendationFilter === 'yes' && !feedback.wouldRecommend) {
      return false;
    }

    if (recommendationFilter === 'no' && feedback.wouldRecommend) {
      return false;
    }
    
    return true;
  });
  
  // Sort by rating (highest first) and then by creation date
  const sortedFeedbacks = [...(filteredFeedbacks || [])].sort((a, b) => {
    const ratingDiff = (b.rating || 0) - (a.rating || 0);
    if (ratingDiff !== 0) return ratingDiff;
    
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };
  
  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }

  function secondsToHms(totalSeconds) {
    const date = new Date(0, 0, 0, 0, 0, totalSeconds);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return convertTo12HourFormat(`${formattedHours}:${formattedMinutes}`);
  }

  function convertTo12HourFormat(time24) {
    // Assuming time24 is in "HH:MM:SS" format (e.g., "02:08:55")
    const [hours, minutes] = time24.split(':').map(Number); // Split and convert to numbers
  
    const date = new Date(); // Create a Date object
    date.setHours(hours, minutes); // Set the time using the extracted values
  
    // Use toLocaleTimeString to format in 12-hour format with AM/PM
    const time12 = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // Force 12-hour format
    });
  
    return time12;
  }

  return (
    <Card title="Customer Feedbacks">
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-40"
          /> */}
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="w-full sm:w-40"
          />
          <Select
            options={ratingOptions}
            value={ratingFilter}
            onChange={setRatingFilter}
            className="w-full sm:w-32"
          />
          <Select
            options={recommendationOptions}
            value={recommendationFilter}
            onChange={setRecommendationFilter}
            className="w-full"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredFeedbacks?.length || 0} {(filteredFeedbacks?.length || 0) === 1 ? 'feedback' : 'feedbacks'} found
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
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommend
              </th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFeedbacks.map((feedback) => (
              <tr key={feedback.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{feedback.customerName}</div>
                  <div className="text-sm text-gray-500">{feedback.customerEmail}</div>
                  {feedback.orderNumber && (
                    <div className="text-xs text-gray-400">Order: {feedback.orderNumber.substring ? feedback.orderNumber.substring(0, 8) : feedback.orderNumber}...</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {renderStars(feedback.rating || 0)}
                  </div>
                  <div className="text-sm text-gray-500">{feedback.rating || 0}/5</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <FeedbackCategoryBadge category={feedback.category || 'N/A'} />
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {feedback.description || 'No description'}
                  </div>
                  {feedback.suggestions && (
                    <div className="text-xs text-gray-500 max-w-xs truncate mt-1">
                      Suggestion: {feedback.suggestions}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {feedback.wouldRecommend ? (
                      <ThumbsUp size={16} className="text-green-600" />
                    ) : (
                      <ThumbsDown size={16} className="text-red-600" />
                    )}
                    <span className={`ml-1 text-sm ${feedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback.wouldRecommend ? 'Yes' : 'No'}
                    </span>
                  </div>
                </td>
                {/* <td className="px-4 py-4 whitespace-nowrap">
                  <FeedbackStatusBadge status={feedback.status} />
                </td> */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {feedback.createdAt?._seconds ? convertSecondsToDate(feedback.createdAt._seconds) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {feedback.createdAt?._seconds ? secondsToHms(feedback.createdAt._seconds) : 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(feedback)}
                      className="flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    {/* <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(feedback)}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button> */}
                    {/* <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(feedback.id)}
                      className="flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button> */}
                  </div>
                </td>
              </tr>
            ))}
            
            {sortedFeedbacks?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-sm text-gray-500 text-center">
                  No customer feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default FeedbackList;