"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Eye, MoreVertical, Mail, Phone, BarChart3 } from "lucide-react";

interface Engineer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  department: string;
}

interface AllEngineersDialogProps {
  engineers: Engineer[];
  onViewProfile: (userId: string) => void;
  onViewStats: (userId: string, userName: string) => void;
}

export default function AllEngineersDialog({ engineers, onViewProfile, onViewStats }: AllEngineersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Show All ({engineers.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>All Ward Engineers ({engineers.length})</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engineers.map((engineer) => (
              <div key={engineer.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{engineer.fullName}</h3>
                      <Badge variant={engineer.isActive ? "default" : "secondary"} className="text-xs">
                        {engineer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{engineer.department}</p>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{engineer.email}</span>
                      </div>
                      {engineer.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{engineer.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        onViewProfile(engineer.id);
                        setIsOpen(false);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        onViewStats(engineer.id, engineer.fullName);
                        setIsOpen(false);
                      }}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Stats
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          
          {engineers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No engineers assigned</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}