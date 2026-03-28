import React from 'react';
import Card from '../ui/Card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Star, ThumbsUp, MessageSquare, TrendingUp, Users, Award } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const FeedbackMetrics = ({ feedbacks = [] }) => {
  // Calculate metrics
  const totalFeedbacks = feedbacks?.length || 0;
  const averageRating = totalFeedbacks > 0 
    ? (feedbacks?.reduce((sum, feedback) => sum + (feedback?.rating || 0), 0) || 0) / totalFeedbacks 
    : 0;
  
  const recommendationRate = totalFeedbacks > 0 
    ? ((feedbacks?.filter(feedback => feedback?.wouldRecommend).length || 0) / totalFeedbacks) * 100 
    : 0;

  const newFeedbacks = feedbacks?.filter(feedback => feedback?.status === 'new').length || 0;
  const respondedFeedbacks = feedbacks?.filter(feedback => feedback?.status === 'responded').length || 0;
  const responseRate = totalFeedbacks > 0 ? (respondedFeedbacks / totalFeedbacks) * 100 : 0;

  // Rating distribution
  const ratingCounts = feedbacks?.reduce((acc, feedback) => {
    acc[feedback?.rating] = (acc[feedback?.rating] || 0) + 1;
    return acc;
  }, {}) || {};

  // Category distribution
  const categoryCounts = feedbacks?.reduce((acc, feedback) => {
    acc[feedback?.category] = (acc[feedback?.category] || 0) + 1;
    return acc;
  }, {}) || {};

  // Status distribution
  const statusCounts = feedbacks?.reduce((acc, feedback) => {
    acc[feedback?.status] = (acc[feedback?.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const ratingData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        data: [
          ratingCounts[5] || 0,
          ratingCounts[4] || 0,
          ratingCounts[3] || 0,
          ratingCounts[2] || 0,
          ratingCounts[1] || 0,
        ],
        backgroundColor: [
          '#10b981', // green for 5 stars
          '#3b82f6', // blue for 4 stars
          '#f59e0b', // amber for 3 stars
          '#f97316', // orange for 2 stars
          '#ef4444', // red for 1 star
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryCounts || {}).map(category => 
      category === 'food-quality' ? 'Food Quality' :
      category?.charAt(0)?.toUpperCase() + category?.slice(1)
    ),
    datasets: [
      {
        data: Object.values(categoryCounts || {}),
        backgroundColor: [
          '#3b82f6', // blue
          '#10b981', // green
          '#f59e0b', // amber
          '#8b5cf6', // purple
          '#ef4444', // red
          '#06b6d4', // cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const renderStars = (rating) => {
    if (!rating && rating !== 0) rating = 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <Card 
      title="Customer Feedback Analytics" 
      subtitle="Comprehensive feedback insights and customer satisfaction metrics"
      className="bg-gradient-to-br from-purple-50 to-pink-50"
    >
      <div className="space-y-6">
        {/* Key Feedback Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare size={20} className="text-purple-600" />
            </div>
            <p className="text-lg font-bold text-purple-600">{totalFeedbacks || 0}</p>
            <p className="text-xs text-gray-600">Total Feedbacks</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <Star size={20} className="text-yellow-600" />
            </div>
            <p className="text-lg font-bold text-yellow-600">{(averageRating || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-600">Avg Rating</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <ThumbsUp size={20} className="text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-600">{(recommendationRate || 0).toFixed(1)}%</p>
            <p className="text-xs text-gray-600">Recommend Rate</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-600">{(responseRate || 0).toFixed(1)}%</p>
            <p className="text-xs text-gray-600">Response Rate</p>
          </div>
        </div>

        {/* Feedback Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Award size={16} className="mr-2 text-purple-600" />
              Customer Satisfaction
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center space-x-1">
                  {renderStars(averageRating || 0)}
                  <span className="text-sm font-medium text-gray-900 ml-1">{(averageRating || 0).toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">5-Star Reviews</span>
                <span className="text-sm font-medium text-green-600">{ratingCounts?.[5] || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recommendation Rate</span>
                <span className="text-sm font-medium text-green-600">{(recommendationRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Users size={16} className="mr-2 text-blue-600" />
              Response Management
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Feedbacks</span>
                <span className="text-sm font-medium text-orange-600">{newFeedbacks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Responded</span>
                <span className="text-sm font-medium text-green-600">{respondedFeedbacks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="text-sm font-medium text-blue-600">{(responseRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {(totalFeedbacks || 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Rating Distribution</h4>
              <div className="h-40">
                <Pie data={ratingData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Feedback Categories</h4>
              <div className="h-40">
                <Pie data={categoryData} options={chartOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No customer feedbacks to analyze</p>
          </div>
        )}

        {/* Rating Breakdown */}
        {(totalFeedbacks || 0) > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Breakdown</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts?.[rating] || 0;
                const percentage = (totalFeedbacks || 0) > 0 ? ((count || 0) / (totalFeedbacks || 1)) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-12">{rating} Star</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: rating || 0 }, (_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-1 mx-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackMetrics;