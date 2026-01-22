"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Users, AlertTriangle, TrendingUp, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchZoneDetail, fetchWardsForZone, clearAdminError } from "@/redux";
import { ErrorState, EmptyState } from "@/components/admin/ErrorBoundary";

export default function ZoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentZoneDetail, wardsByZone, loading, loadingWards, error } = useAppSelector(state => state.admin);
  
  const zoneId = params.zoneId as string;
  const wards = wardsByZone[zoneId] || [];

  useEffect(() => {
    if (zoneId) {
      dispatch(clearAdminError());
      dispatch(fetchZoneDetail(zoneId));
      dispatch(fetchWardsForZone(zoneId));
    }
  }, [dispatch, zoneId]);

  const handleWardClick = (wardId: string) => {
    router.push(`/admin/zones/${zoneId}/wards/${wardId}`);
  };

  const handleRetry = () => {
    dispatch(clearAdminError());
    dispatch(fetchZoneDetail(zoneId));
    dispatch(fetchWardsForZone(zoneId));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Zone Details</h1>
        </div>
        <ErrorState 
          title="Failed to load zone details"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!currentZoneDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Zone Details</h1>
        </div>
        <EmptyState 
          title="Zone not found"
          message="The requested zone could not be found. It may have been removed or you may not have permission to view it."
          icon={<Building className="w-8 h-8 text-gray-400" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentZoneDetail.zoneName}</h1>
          <p className="text-gray-600">Zone Officer: {currentZoneDetail.zoneOfficer || 'Not assigned'}</p>
        </div>
      </div>

      {/* Zone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wards</p>
                <p className="text-2xl font-bold text-blue-600">{currentZoneDetail.totalWards}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-orange-600">{currentZoneDetail.totalIssues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className={`text-2xl font-bold ${
                  currentZoneDetail.slaCompliance >= 90 ? 'text-green-600' :
                  currentZoneDetail.slaCompliance >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {currentZoneDetail.slaCompliance}%
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
                <p className="text-sm font-medium text-gray-600">Zone Officer</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentZoneDetail.zoneOfficer || 'Not assigned'}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wards List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Wards in {currentZoneDetail.zoneName}
            {loadingWards && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingWards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : wards.length === 0 ? (
            <EmptyState 
              title="No wards found"
              message="This zone currently has no wards assigned to it."
              icon={<MapPin className="w-8 h-8 text-gray-400" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wards.map((ward) => (
                <Card 
                  key={ward.wardId} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => handleWardClick(ward.wardId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Ward {ward.wardNumber} - {ward.name}
                      </h3>
                      {ward.slaBreached > 0 && (
                        <Badge variant="destructive">SLA Breach</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Issues:</span>
                        <span className="font-medium">{ward.totalIssues}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Open:</span>
                        <span className="font-medium text-orange-600">{ward.open}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">In Progress:</span>
                        <span className="font-medium text-blue-600">{ward.inProgress}</span>
                      </div>
                      {ward.slaBreached > 0 && (
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">SLA Breached:</span>
                          <span className="font-medium text-red-600">{ward.slaBreached}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}