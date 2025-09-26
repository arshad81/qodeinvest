// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const tabs = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/portfolio" },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden flex items-center p-4 bg-gray-100">
        <p onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          Dummy
        </p>
        <h1 className="ml-4 font-bold text-lg">My App</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 bg-white shadow-md z-50 transform transition-transform duration-300
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:fixed md:flex md:flex-col md:w-64`}
      >
        <div className="flex flex-col mt-10 md:mt-4">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`px-4 py-3 hover:bg-gray-100 transition-colors ${
                location.pathname === tab.path ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => setIsOpen(false)} // close sidebar on mobile click
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
