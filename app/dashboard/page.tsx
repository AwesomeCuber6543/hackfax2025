'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import EmergencyDetailModal from '../components/EmergencyDetailModal';

// Define types for our emergency data
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Emergency = [number, Priority, string, string, string];

interface EmergencyResponse {
  emergencies: Emergency[];
}

export default function EmergencyDashboard() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Priority | 'ALL'>('ALL');
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        setLoading(true);
        // const response = await axios.get<EmergencyResponse>('https://7461-76-78-140-25.ngrok-free.app/get_emergencies');
        const response = await axios.get<EmergencyResponse>('http://localhost:5002/get_emergencies');
        
        console.log(response.data);
        setEmergencies(response.data.emergencies || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch emergency data. Please try again later.');
        console.error('Error fetching emergencies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();
    
    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchEmergencies, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const filteredEmergencies = filter === 'ALL' 
    ? emergencies 
    : emergencies.filter(emergency => emergency[1] === filter);

  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Emergency Services Dashboard
          </h1>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and manage emergency calls during natural disasters
        </p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'ALL' 
                ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('HIGH')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'HIGH' 
                ? 'bg-red-600 text-white' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            High Priority
          </button>
          <button 
            onClick={() => setFilter('MEDIUM')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'MEDIUM' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            Medium Priority
          </button>
          <button 
            onClick={() => setFilter('LOW')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'LOW' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            Low Priority
          </button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {loading ? 'Refreshing data...' : `Last updated: ${new Date().toLocaleTimeString()}`}
        </div>
      </div>

      {loading && emergencies.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-200 dark:border-red-800" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : filteredEmergencies.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'ALL' 
              ? 'No emergency calls have been recorded yet.' 
              : `No ${filter.toLowerCase()} priority emergencies found.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Caller
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredEmergencies.map((emergency) => (
                <tr 
                  key={emergency[0]} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedEmergency(emergency)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{emergency[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(emergency[1])}`}>
                      {emergency[1]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    <div className="line-clamp-2">{emergency[2]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {emergency[3]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {emergency[4]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Emergency Detail Modal */}
      {selectedEmergency && (
        <EmergencyDetailModal 
          emergency={selectedEmergency} 
          onClose={() => setSelectedEmergency(null)} 
        />
      )}
    </div>
  );
}
