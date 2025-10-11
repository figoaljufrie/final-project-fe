"use client";

import { motion } from "framer-motion";
import { BellIcon } from "@heroicons/react/24/outline";

interface TenantApprovalHeaderProps {
  pendingCount: number;
}

export default function TenantApprovalHeader({
  pendingCount,
}: TenantApprovalHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tenant Approval System
          </h1>
          <p className="text-gray-600">
            Manage and approve booking requests from users
          </p>
        </div>

        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3"
          >
            <BellIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">
                {pendingCount} booking{pendingCount > 1 ? "s" : ""} pending
                approval
              </p>
              <p className="text-yellow-700 text-sm">
                Please review and take action
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
