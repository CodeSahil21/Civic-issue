"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, AlertTriangle, Clock, TrendingUp, Building, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWardDetail, getWardIssues, clearAdminError } from "@/redux";
import { ErrorState, EmptyState } from "@/components/admin/ErrorBoundary";
import IssueDetailModal from "@/components/admin/IssueDetailModal";

export default function WardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentWardDetail, wardIssues, loading, loadingIssues, error } = useAppSelector(state => state.admin);
  
  const wardId = params.wardId as string;
  const zoneId = params.zoneId as string;
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  useEffect(() => {
    if (wardId) {
      dispatch(clearAdminError());
      dispatch(fetchWardDetail(wardId));
      dispatch(getWardIssues({ wardId, filters: {} }));
    }
  }, [dispatch, wardId]);

  const handleRetry = () => {
    dispatch(clearAdminError());
    dispatch(fetchWardDetail(wardId));
    dispatch(getWardIssues({ wardId, filters: {} }));
  };

  const handleIssueClick = (issueId: string) => {
    setSelectedIssueId(issueId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10" />
          <div className="space-y-2">
            <Skeleton className="w-64 h-8" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/zones/${zoneId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Zone
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Ward Details</h1>
        </div>
        <ErrorState 
          title="Failed to load ward details"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!currentWardDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/zones/${zoneId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Zone
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Ward Details</h1>
        </div>
        <EmptyState 
          title="Ward not found"
          message="The requested ward could not be found. It may have been removed or you may not have permission to view it."
          icon={<Building className="w-8 h-8 text-gray-400" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(`/admin/zones/${zoneId}`)}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Zone
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Ward {currentWardDetail.wardNumber} - {currentWardDetail.wardName}
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {currentWardDetail.zoneName}
            </p>
          </div>
        </div>
      </div>

      {/* Ward Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-blue-600">{currentWardDetail.totalIssues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-orange-600">{currentWardDetail.open}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className={`text-2xl font-bold ${
                  currentWardDetail.slaCompliance >= 90 ? 'text-green-600' :
                  currentWardDetail.slaCompliance >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {currentWardDetail.slaCompliance}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engineers</p>
                <p className="text-2xl font-bold text-purple-600">{currentWardDetail.totalEngineers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Average Open Days</p>
              <p className="text-3xl font-bold text-blue-600">{currentWardDetail.avgOpenDays}</p>
              <p className="text-xs text-gray-500 mt-1">days on average</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Oldest Open Issue</p>
              <p className="text-3xl font-bold text-orange-600">{currentWardDetail.oldestOpenDays}</p>
              <p className="text-xs text-gray-500 mt-1">days old</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">SLA Breached</p>
              <p className="text-3xl font-bold text-red-600">{currentWardDetail.slaBreached}</p>
              <p className="text-xs text-gray-500 mt-1">issues overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Open</span>
                <Badge className="bg-red-100 text-red-800">{currentWardDetail.open}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Assigned</span>
                <Badge className="bg-blue-100 text-blue-800">{currentWardDetail.assigned}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <Badge className="bg-yellow-100 text-yellow-800">{currentWardDetail.inProgress}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved</span>
                <Badge className="bg-green-100 text-green-800">{currentWardDetail.resolved}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Verified</span>
                <Badge className="bg-green-100 text-green-800">{currentWardDetail.verified}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical</span>
                <Badge className="bg-red-100 text-red-800">{currentWardDetail.priorities.critical}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High</span>
                <Badge className="bg-orange-100 text-orange-800">{currentWardDetail.priorities.high}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium</span>
                <Badge className="bg-yellow-100 text-yellow-800">{currentWardDetail.priorities.medium}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low</span>
                <Badge className="bg-green-100 text-green-800">{currentWardDetail.priorities.low}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Ward Engineers ({currentWardDetail.totalEngineers})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentWardDetail.engineers.length === 0 ? (
            <EmptyState 
              title="No engineers assigned"
              message="This ward currently has no engineers assigned to it."
              icon={<Users className="w-8 h-8 text-gray-400" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWardDetail.engineers.map((engineer) => (
                <Card key={engineer.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{engineer.fullName}</h4>
                      <Badge variant={engineer.isActive ? 'default' : 'secondary'}>
                        {engineer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="truncate">{engineer.email}</p>
                      <p>{engineer.phoneNumber}</p>
                      <p className="font-medium text-blue-600">{engineer.department?.replace('_', ' ')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            All Issues ({wardIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingIssues ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : wardIssues.length === 0 ? (
            <EmptyState 
              title="No issues found"
              message="This ward currently has no reported issues."
              icon={<AlertTriangle className="w-8 h-8 text-gray-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>SLA Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wardIssues.map((issue) => (
                    <TableRow key={issue.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {issue.ticketNumber || 'N/A'}
                      </TableCell>
                      <TableCell>{issue.category || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{issue.department?.replace('_', ' ') || 'N/A'}</TableCell>
                      <TableCell>{issue.assignee || 'Unassigned'}</TableCell>
                      <TableCell>
                        {issue.slaBreached ? (
                          <Badge variant="destructive">Breached</Badge>
                        ) : (
                          <Badge variant="default">On Time</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(issue.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleIssueClick(issue.id)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issue Detail Modal */}
      {selectedIssueId && (
        <IssueDetailModal 
          isOpen={!!selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          issueId={selectedIssueId}
        />
      )}
    </div>
  );
}