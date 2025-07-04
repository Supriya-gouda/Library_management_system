import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDebug = () => {
  const { user, token, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Admin Debug Information</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Authentication Status</h3>
              <p>Is Authenticated: {isAuthenticated() ? '✅ Yes' : '❌ No'}</p>
              <p>Is Admin: {isAdmin() ? '✅ Yes' : '❌ No'}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">User Information</h3>
              <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Token Information</h3>
              <p className="text-sm break-all">
                {token ? `Token exists: ${token.substring(0, 50)}...` : 'No token found'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Local Storage</h3>
              <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                {JSON.stringify({
                  token: localStorage.getItem('token'),
                  user: localStorage.getItem('user')
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug;
