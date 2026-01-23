"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserStatistics, clearCurrentDetails } from "@/redux";
import { User, BarChart3, Clock, CheckCircle, TrendingUp } from "lucide-react";

interface UserStatsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}

export default function UserStatsDialog({ open, onClose, userId, userName }: UserStatsDialogProps) {
  const dispatch = useAppDispatch();
  const { userStatistics, loading } = useAppSelector(state => state.admin);

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchUserStatistics(userId));
    }
  }, [dispatch, open, userId]);

  const handleClose = () => {
    onClose();
  };

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Engineer Statistics - {userName || "Loading..."}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-32" />
          </div>
        ) : userStatistics ? (
          <div className="space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Engineer Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{userStatistics.user.fullName}</p>
                    <p className="text-sm text-gray-600">{userStatistics.user.role.replace('_', ' ')}</p>
                  </div>
                  <Badge variant={userStatistics.user.isActive ? "default" : "secondary"}>
                    {userStatistics.user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Assigned</p>
                      <p className="text-2xl font-bold">{userStatistics.statistics.totalAssigned}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Issues</p>
                      <p className="text-2xl font-bold">{userStatistics.statistics.activeIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold">{userStatistics.statistics.resolvedIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      userStatistics.statistics.resolutionRate >= 80 ? 'bg-green-100' :
                      userStatistics.statistics.resolutionRate >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${
                        userStatistics.statistics.resolutionRate >= 80 ? 'text-green-600' :
                        userStatistics.statistics.resolutionRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Resolution Rate</p>
                      <p className={`text-2xl font-bold ${
                        userStatistics.statistics.resolutionRate >= 80 ? 'text-green-600' :
                        userStatistics.statistics.resolutionRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {userStatistics.statistics.resolutionRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Resolution Time</span>
                    <span className="font-medium">
                      {userStatistics.statistics.avgResolutionDays > 0 
                        ? `${userStatistics.statistics.avgResolutionDays} days`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <Badge variant={
                      userStatistics.statistics.resolutionRate >= 80 ? "default" :
                      userStatistics.statistics.resolutionRate >= 60 ? "secondary" : "destructive"
                    }>
                      {userStatistics.statistics.resolutionRate >= 80 ? "Excellent" :
                       userStatistics.statistics.resolutionRate >= 60 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No statistics available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}