import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { FeedbackStatusBadge, FeedbackCategoryBadge } from '../ui/Badge';
import { format } from 'date-fns';
import Button from '../ui/Button';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

function convertSecondsToDate(seconds) {
  if (!seconds && seconds !== 0) return new Date().toDateString();
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date.toDateString();
}


const RecentFeedbacks = ({ feedbacks = [] }) => {
  const navigate = useNavigate();
  const sortedFeedbacks = [...(feedbacks || [])]
    .sort((a, b) => {
      // Sort by status priority (new first) and then by creation date
      const statusPriority = { new: 4, reviewed: 3, responded: 2, archived: 1 };
      const statusDiff = (statusPriority[b?.status] || 0) - (statusPriority[a?.status] || 0);
      
      if (statusDiff !== 0) return statusDiff;
      
      return new Date(convertSecondsToDate(b?.createdAt?._seconds)).getTime() - new Date(convertSecondsToDate(a?.createdAt?._seconds)).getTime();
    })
    .slice(0, 5);

  const renderStars = (rating) => {
    if (!rating && rating !== 0) rating = 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < (rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };
  
  return (
    <Card 
      title="Recent Customer Feedbacks" 
      subtitle="Latest 5 customer reviews and ratings"
      footer={
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/feedback')}
          >
            View All Feedbacks
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
                Rating
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommend
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFeedbacks?.map((feedback) => (
              <tr key={feedback?.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{feedback?.customerName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{feedback?.email || 'N/A'}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {renderStars(feedback?.rating)}
                  </div>
                  <div className="text-xs text-gray-500">{(feedback?.rating || 0)}/5</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <FeedbackCategoryBadge category={feedback?.category} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {feedback?.wouldRecommend ? (
                      <ThumbsUp size={14} className="text-green-600" />
                    ) : (
                      <ThumbsDown size={14} className="text-red-600" />
                    )}
                    <span className={`ml-1 text-xs ${feedback?.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback?.wouldRecommend ? 'Yes' : 'No'}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <FeedbackStatusBadge status={feedback?.status} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date((feedback?.createdAt?._seconds || 0) * 1000), 'MMM d, h:mm a')}
                  </div>
                </td>
              </tr>
            ))}
            
            {(sortedFeedbacks?.length || 0) === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                  No recent feedbacks
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentFeedbacks;