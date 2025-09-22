// src/components/admin/UserTable.tsx
import React from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface UserTableProps {
  users: User[];
  onDelete: (userId: string) => void;
  onPromote: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onPromote }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase text-sm">
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Email</th>
            <th className="p-4 font-semibold">ID</th>
            <th className="p-4 font-semibold">Role</th>
            <th className="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user._id}
              className={`border-b last:border-none transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="p-4 text-gray-900 font-medium">{user.name}</td>
              <td className="p-4 text-gray-600">{user.email}</td>
              <td className="p-4 text-gray-500 text-sm">{user._id}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isAdmin
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "User"}
                </span>
              </td>
              <td className="p-4 flex justify-center gap-2">
                <button
                  onClick={() => onDelete(user._id)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition"
                >
                  Delete
                </button>
                {!user.isAdmin && (
                  <button
                    onClick={() => onPromote(user._id)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
                  >
                    Promote
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
