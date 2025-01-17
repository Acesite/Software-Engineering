import React from 'react';
import { CiClock2 } from "react-icons/ci";
import { GoHourglass } from "react-icons/go";
import { CgGoogleTasks } from "react-icons/cg";
import { CiCircleCheck } from "react-icons/ci";

const cardIcons = {
  'Total Tasks': <CgGoogleTasks className="text-blue-500 text-3xl" />,
  'Pending Tasks': <GoHourglass className="text-blue-500 text-3xl" />,
  'Completed Tasks': <CiCircleCheck className="text-blue-500 text-3xl" />,
  'Total Logged Hours': <CiClock2 className="text-blue-500 text-3xl" />
};

const Card = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out h-48">
      <div className="flex items-center mb-4">
        {/* Icon on the left */}
        <div className="mr-4">
          {cardIcons[title]}
        </div>

        {/* Card title on the right */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Card;
