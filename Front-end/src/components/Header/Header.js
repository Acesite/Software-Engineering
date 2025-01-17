import React from 'react';

function Header() {
  return (
    <div className="flex">
      {/* Sidebar (You can add a sidebar component here if you have one) */}
    
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between h-16 w-full px-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/shslogo.jpg" // Replace with the correct path to your logo
              alt="Logo"
              className="h-10 w-10 mr-3" // Adjust the size as needed
            />
            <h1 className="text-black text-xl font-bold">Admin Dashboard</h1>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <p className="text-black">Welcome, Admin</p>
            <img
              src="/lcc.jpg" // Replace with your user profile image
              alt="User avatar"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
