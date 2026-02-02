import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugPhotoUrl = () => {
  const { user } = useAuth();
  
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${backendUrl}${photoUrl}`;
  };
  
  const dbPhotoUrl = user?.profile?.photoUrl;
  const fullPhotoUrl = getPhotoUrl(dbPhotoUrl);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-2xl max-w-md z-50 border-2 border-purple-500">
      <h3 className="font-bold text-lg mb-2">🐛 Photo URL Debug</h3>
      <div className="space-y-2 text-xs">
        <div>
          <strong>DB Path:</strong>
          <code className="block bg-gray-100 p-1 rounded mt-1 break-all">
            {dbPhotoUrl || 'null'}
          </code>
        </div>
        <div>
          <strong>Full URL:</strong>
          <code className="block bg-gray-100 p-1 rounded mt-1 break-all">
            {fullPhotoUrl || 'null'}
          </code>
        </div>
        <div>
          <strong>Backend URL:</strong>
          <code className="block bg-gray-100 p-1 rounded mt-1 break-all">
            {import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}
          </code>
        </div>
        {fullPhotoUrl && (
          <div>
            <strong>Test Image:</strong>
            <img 
              src={fullPhotoUrl} 
              alt="Test" 
              className="w-20 h-20 rounded-full mt-2 border-2 border-green-500"
              onError={(e) => {
                e.target.style.border = '2px solid red';
                e.target.alt = '❌ Failed to load';
              }}
              onLoad={(e) => {
                e.target.style.border = '2px solid green';
              }}
            />
            <a 
              href={fullPhotoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2 text-blue-500 underline"
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPhotoUrl;
