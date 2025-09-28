'use client';
import React from 'react';
import { FaTshirt, FaFemale, FaMale, FaShoppingBag } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-6">
        Welcome to <span className="text-pink-500">Fashion</span> &{' '}
        <span className="text-blue-500">Lifestyle</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 text-center mb-12 max-w-2xl">
        Discover the latest trends, shop timeless styles, and elevate your wardrobe with us.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
          <FaMale className="text-5xl mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Men</h3>
          <p className="text-gray-600 mb-4">Smart styles for every occasion.</p>  
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
          <FaFemale className="text-5xl mx-auto text-pink-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Women</h3>
          <p className="text-gray-600 mb-4">Chic fashion for modern lifestyles.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
          <FaShoppingBag className="text-5xl mx-auto text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Accessories</h3>
          <p className="text-gray-600 mb-4">Complete your look with the perfect touch.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
          <FaTshirt className="text-5xl mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Trending</h3>
          <p className="text-gray-600 mb-4">Stay ahead with the latest trends.</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
