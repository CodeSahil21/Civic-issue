"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchIssueStats } from "@/redux/slices/issuesSlice";

interface IssueStatisticsProps {
  wardId?: string;
  zoneId?: string;
  assigneeId?: string;
  reporterId?: string;
  title?: string;
}

export default function IssueStatistics({ 
  wardId, 
  zoneId, 
  assigneeId,
  reporterId, 
  title = "Issue Statistics" 
}: IssueStatisticsProps) {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.issues);

  useEffect(() => {
    const params: any = {};
    if (wardId) params.wardId = wardId;
    if (zoneId) params.zoneId = zoneId;
    if (assigneeId) params.assigneeId = assigneeId;
    if (reporterId) params.reporterId = reporterId;
    
    dispatch(fetchIssueStats(params));
  }, [dispatch, wardId, zoneId, assigneeId, reporterId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'ASSIGNED': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'IN_PROGRESS': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'VERIFIED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No statistics available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Issues</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalIssues}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Open</p>
                  <p className="text-2xl font-bold text-red-900">{stats.issuesByStatus?.OPEN || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.issuesByStatus?.IN_PROGRESS || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.issuesByStatus?.RESOLVED || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.issuesByStatus && Object.entries(stats.issuesByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <span className="font-medium">{status.replace('_', ' ')}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.issuesByPriority && Object.entries(stats.issuesByPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority).replace('text-', 'bg-').replace('bg-', 'bg-').split(' ')[0].replace('text', 'bg')}`}></div>
                    <span className="font-medium">{priority}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}