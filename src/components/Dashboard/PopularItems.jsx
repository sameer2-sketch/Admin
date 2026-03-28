import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, Star, Coffee } from 'lucide-react';

const PopularItems = ({ orders = [], foodItems = [] }) => {
  // Calculate item popularity based on order frequency
  const itemStats = orders?.reduce((acc, order) => {
    order?.items?.forEach(item => {
      if (!acc[item?.foodId]) {
        acc[item?.foodId] = {
          id: item?.foodId,
          name: item?.name || 'Unknown Item',
          totalOrdered: 0,
          totalRevenue: 0,
          orderCount: 0
        };
      }
      acc[item?.foodId].totalOrdered += item?.quantity || 0;
      acc[item?.foodId].totalRevenue += (item?.price || 0) * (item?.quantity || 0);
      acc[item?.foodId].orderCount += 1;
    });
    return acc;
  }, {}) || {};

  const popularItems = Object.values(itemStats)
    .sort((a, b) => (b?.totalOrdered || 0) - (a?.totalOrdered || 0))
    .slice(0, 5);

  const topRevenueItems = Object.values(itemStats)
    .sort((a, b) => (b?.totalRevenue || 0) - (a?.totalRevenue || 0))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Most Popular Items */}
      <Card 
        title="Most Popular Items" 
        subtitle="Based on quantity ordered"
        className="bg-gradient-to-br from-amber-50 to-orange-50"
      >
        <div className="space-y-4">
          {(popularItems?.length || 0) > 0 ? (
            popularItems?.map((item, index) => {
              const foodItem = foodItems?.find(f => f?.id === item?.id);
              return (
                <div key={item?.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      {foodItem?.image ? (
                        <img 
                          src={foodItem?.image} 
                          alt={item?.name || 'Item'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <Coffee size={16} className="text-amber-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{item?.orderCount || 0} orders</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-700">{item?.totalOrdered || 0}</p>
                    <p className="text-xs text-gray-500">sold</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Coffee size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No orders yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Top Revenue Items */}
      <Card 
        title="Top Revenue Generators" 
        subtitle="Items bringing in the most revenue"
        className="bg-gradient-to-br from-green-50 to-emerald-50"
      >
        <div className="space-y-4">
          {(topRevenueItems?.length || 0) > 0 ? (
            topRevenueItems?.map((item, index) => {
              const foodItem = foodItems?.find(f => f?.id === item?.id);
              return (
                <div key={item?.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className={index === 0 ? 'text-yellow-500' : 'text-gray-400'} />
                      {foodItem?.image ? (
                        <img 
                          src={foodItem?.image} 
                          alt={item?.name || 'Item'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Coffee size={16} className="text-green-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{item?.totalOrdered || 0} units sold</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">₹{(item?.totalRevenue || 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No revenue data yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PopularItems;