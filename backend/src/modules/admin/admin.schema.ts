import { z } from "zod";
import { UserRole, Department } from "@prisma/client";

export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().transform(val => val.toLowerCase()).optional(),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number").optional(),
  role: z.nativeEnum(UserRole).optional(),
  wardId: z.string().uuid().nullable().optional(),
  zoneId: z.string().uuid().nullable().optional(),
  department: z.nativeEnum(Department).nullable().optional()
}).refine((data) => {
  // Ward Engineer must have department
  if (data.role === 'WARD_ENGINEER' && data.department === null) {
    return false;
  }
  // Non-engineers cannot have department
  if (data.role && data.role !== 'WARD_ENGINEER' && data.department) {
    return false;
  }
  // Ward-level roles must have wardId
  if (data.role && ['WARD_ENGINEER', 'FIELD_WORKER'].includes(data.role) && !data.wardId) {
    return false;
  }
  // Zone officer must have zoneId
  if (data.role === 'ZONE_OFFICER' && !data.zoneId) {
    return false;
  }
  return true;
}, {
  message: "Invalid role-specific requirements"
});

export const reassignWorkSchema = z.object({
  toUserId: z.string().uuid("Invalid user ID format")
});

export const getUsersByFilterSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  wardId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  department: z.nativeEnum(Department).optional()
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type ReassignWorkData = z.infer<typeof reassignWorkSchema>;
export type GetUsersByFilterData = z.infer<typeof getUsersByFilterSchema>;