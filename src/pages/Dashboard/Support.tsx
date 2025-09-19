import ShineButton from '../../components/ShineButton';
import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-lg max-w-6xl mx-auto mb-7 mt-2">
      {/* Avatar & Text Section */}
      <div className="flex items-center gap-4">
        {/* Avatars */}
        <div className="flex -space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="Support 1"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          <img
            src="https://via.placeholder.com/40"
            alt="Support 2"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          <img
            src="https://via.placeholder.com/40"
            alt="Support 3"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
        </div>

        {/* Text Info */}
        <div>
          <h3 className="text-base font-semibold text-black">
            Need help choosing the right products?
          </h3>
          <p className="text-sm text-gray-600">
            Talk to Tradelle’s experts for reviews, targeting, scaling, and sales advice.
          </p>
        </div>
      </div>

      {/* Chat Button */}
     <ShineButton onClick={() => alert("Chat started!")}>
  Chat Now
</ShineButton>

    </div>
  );
};

export default Support;
