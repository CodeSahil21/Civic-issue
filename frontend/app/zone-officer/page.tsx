"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchZoneOfficerDetail, fetchZoneOfficerWards } from "@/redux";
import ZoneOverview from "@/components/zone/ZoneOverview";
import WardCards from "@/components/zone/WardCards";
import { ZoneOverviewSkeleton } from "@/components/ui/loading-skeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin } from "lucide-react";

export default function ZoneOfficerPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userState);
  const { zoneDetail, zoneWards, loading, error } = useAppSelector((state) => state.zone);

  useEffect(() => {
    if (user?.zoneId) {
      dispatch(fetchZoneOfficerDetail(user.zoneId));
      dispatch(fetchZoneOfficerWards(user.zoneId));
    }
  }, [dispatch, user?.zoneId]);

  if (!user?.zoneId) {
    return (
      <div className="p-4 sm:p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No zone assigned to this user. Please contact your administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading && !zoneDetail) {
    return (
      <div className="p-4 sm:p-6">
        <ZoneOverviewSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => {
            if (user?.zoneId) {
              dispatch(fetchZoneOfficerDetail(user.zoneId));
              dispatch(fetchZoneOfficerWards(user.zoneId));
            }
          }}
          variant="destructive"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Zone Overview */}
      <ZoneOverview zoneDetail={zoneDetail} />

      {/* Wards Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Wards in {zoneDetail?.zoneName || 'Zone'}
              </h2>
              <p className="text-sm text-gray-600">
                {zoneWards.length} ward{zoneWards.length !== 1 ? 's' : ''} under management
              </p>
            </div>
          </div>
          {zoneWards.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Issues</p>
              <p className="text-xl font-bold text-gray-900">
                {zoneWards.reduce((sum, ward) => sum + (ward.totalIssues || 0), 0)}
              </p>
            </div>
          )}
        </div>
        
        <WardCards wards={zoneWards} loading={loading} />
      </div>
    </div>
  );
}