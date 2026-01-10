import { Router } from "express";
import { AdminController } from "./admin.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

router.use(verifyJWT);

// User Management Routes (Super Admin only)
router.post("/register", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.registerUser
);

router.get("/users", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.getAllUsers
);

router.get("/departments", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.getDepartments
);

// Dashboard Routes (Super Admin only)
router.get("/dashboard", requireRole(["SUPER_ADMIN"]), AdminController.getDashboard);
router.get("/zones", requireRole(["SUPER_ADMIN"]), AdminController.getZonesOverview);
router.get("/zones/:zoneId", requireRole(["SUPER_ADMIN"]), AdminController.getZoneDetail);
router.get("/zones/:zoneId/wards", requireRole(["SUPER_ADMIN"]), AdminController.getZoneWards);
router.get("/wards/:wardId", requireRole(["SUPER_ADMIN"]), AdminController.getWardDetail);
router.get("/wards/:wardId/issues", requireRole(["SUPER_ADMIN"]), AdminController.getWardIssues);

export default router;