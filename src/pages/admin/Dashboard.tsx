import React from 'react';
import { FaUsers, FaChartLine, FaStar } from 'react-icons/fa';

function Dashboard() {
  const stats = [
    {
      id: 1,
      title: 'Total Users',
      value: '1320',
      icon: FaUsers,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-[#006699]',
    },
    {
      id: 2,
      title: "Today's New Users",
      value: '8',
      icon: FaChartLine,
      bgColor: 'bg-green-50',
      iconBg: 'bg-[#006699]',
    },
    {
      id: 3,
      title: 'Total Positive Review',
      value: '1200',
      icon: FaStar,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-[#006699]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <div className="bg-white rounded-2xl px-8 py-6 shadow-sm">
        <p className="text-gray-600 text-sm font-medium">Hi, Good Morning</p>
        <h1 className="text-gray-900 text-2xl font-bold mt-1">Moni Roy</h1>
      </div>

      {/* User's Overview Section */}
      <div className="bg-white rounded-2xl px-8 py-8 shadow-sm">
        <h2 className="text-gray-900 text-xl font-bold mb-6">User's Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`${stat.bgColor} rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:scale-105`}
              >
                <div 
                  className={`${stat.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
