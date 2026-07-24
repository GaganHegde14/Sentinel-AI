import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to BotShield
        </h1>
        {user ? (
          <p className="text-gray-600">
            You are logged in as {user.name} ({user.role}). Events and Booking features will be added here in the next phase!
          </p>
        ) : (
          <p className="text-gray-600">
            Please log in or register to access the smart ticket booking platform.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
