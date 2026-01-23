"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchIssues } from "@/redux/slices/issuesSlice";

interface ActivityLogProps {
  userId?: string;
  wardId?: string;
  zoneId?: string;
  limit?: number;
  title?: string;
}

export default function ActivityLog({ 
  userId, 
  wardId, 
  zoneId, 
  limit = 10, 
  title = "Recent Activity" 
}: ActivityLogProps) {
  const dispatch = useAppDispatch();
  const { issues, loading } = useAppSelector((state) => state.issues);

  useEffect(() => {
    const params: any = {
      page: 1,
      pageSize: limit,
      ...(userId && { reporterId: userId }),
      ...(wardId && { wardId }),
      ...(zoneId && { zoneId }),
    };
    
    dispatch(fetchIssues(params));
  }, [dispatch, userId, wardId, zoneId, limit]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, limit).map((issue) => (
              <div key={issue.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">#{issue.ticketNumber}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {issue.category?.name || 'N/A'}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {issue.reporter?.fullName || 'Unknown'}
                      </span>
                      <span>{formatDate(issue.updatedAt)}</span>
                    </div>
                  </div>
                  {issue.priority === 'CRITICAL' && (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}