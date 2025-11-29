import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';

const Summary = () => {
  const { user } = useAuth();

  return (
    <div className="rounded flex bg-white shadow p-4">
      <div className="text-3xl flex justify-center items-center bg-teal-600 text-white px-4 py-4">
        <FaUser />
      </div>

      <div className="pl-4 py-2">
        <p className="text-lg font-semibold">Welcome Back</p>
        <p className="text-xl font-bold">{user?.name}</p>
      </div>
    </div>
  );
};

export default Summary;
