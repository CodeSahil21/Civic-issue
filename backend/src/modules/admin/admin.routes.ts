import { Router } from "express";
import { AdminController } from "./admin.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { updateUserSchema, reassignWorkSchema } from "./admin.schema";
import { Request, Response, NextFunction } from "express";

const router = Router();

// Validation middleware helper
const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues || [{ message: error.message }]
      });
    }
  };
};

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

router.get("/users/:userId", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.getUserById
);

router.put("/users/:userId", 
  requireRole(["SUPER_ADMIN"]),
  validateBody(updateUserSchema),
  AdminController.updateUser
);

router.post("/users/:userId/reassign", 
  requireRole(["SUPER_ADMIN"]),
  validateBody(reassignWorkSchema),
  AdminController.reassignUserWork
);

router.patch("/users/:userId/deactivate", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.deactivateUser
);

router.patch("/users/:userId/reactivate", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.reactivateUser
);

router.get("/users/:userId/statistics", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.getUserStatistics
);

router.get("/users/filter/search", 
  requireRole(["SUPER_ADMIN"]), 
  AdminController.getUsersByFilter
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