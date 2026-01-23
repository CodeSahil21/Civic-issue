"use client";

import { useEffect } from "react";
import { Activity } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchActivityLog } from "@/redux";
import ActivityLog from "@/components/shared/ActivityLog";

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { activityLog, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchActivityLog(50));
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
      </div>

      {/* Activity Log Component */}
      <ActivityLog 
        activities={activityLog}
        loading={loading}
        error={error}
        onRetry={() => dispatch(fetchActivityLog(50))}
        showFilters={true}
      />
    </div>
  );
}