import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ChevronDown } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserSelectorProps {
  selectedUserId?: number;
  onUserChange: (userId: number | undefined) => void;
}

export default function UserSelector({
  selectedUserId,
  onUserChange,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for now - replace with actual API call
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {selectedUser ? selectedUser.name : "All Users"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            <button
              onClick={() => {
                onUserChange(undefined);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                !selectedUserId
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Users
            </button>
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading users...
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onUserChange(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    selectedUserId === user.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
