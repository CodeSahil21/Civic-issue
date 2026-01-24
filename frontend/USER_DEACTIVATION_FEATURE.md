# User Deactivation with Issue Reassignment

## Overview
Implemented comprehensive user deactivation functionality with automatic issue reassignment based on user roles and organizational structure.

## Backend Changes

### Admin Service (`admin.service.ts`)
- **Updated `deactivateUser` method**: Now accepts optional `reassignToUserId` parameter
- **Enhanced issue status handling**: Includes `OPEN`, `ASSIGNED`, `IN_PROGRESS`, and `RESOLVED` statuses
- **Automatic reassignment**: Reassigns all active issues to target user before deactivation
- **Audit logging**: Comprehensive logging of reassignment and deactivation actions

### Admin Controller (`admin.controller.ts`)
- **Updated `deactivateUser` endpoint**: Now accepts `reassignToUserId` in request body
- **Maintains backward compatibility**: Works with or without reassignment parameter

## Frontend Changes

### Redux Slice (`adminSlice.ts`)
- **New thunk**: `deactivateUserWithReassignment` for handling reassignment during deactivation
- **Enhanced error handling**: Proper error propagation for reassignment failures
- **State management**: Updates user list after successful deactivation

### DeactivateUserDialog Component
- **Role-based filtering logic**:
  - **Ward Engineers**: Shows only other ward engineers from the same ward
  - **Field Workers**: Shows all field workers (no ward/zone restriction)
  - **Zone Officers**: Shows all zone officers (no zone restriction)

- **Enhanced user selection**:
  - Displays user details including ward/zone information
  - Shows appropriate messages when no users are available
  - Excludes the user being deactivated from the list

- **Streamlined workflow**:
  - Single-step process: reassignment and deactivation in one action
  - Improved button states and loading indicators
  - Better error handling and user feedback

## Role-Based Reassignment Logic

### Ward Engineers
- **Filter**: Same ward only (`wardId` match)
- **Message**: "No other ward engineers found in [Ward Name]. Please add an engineer to this ward first."
- **Rationale**: Ward-specific expertise and local knowledge required

### Field Workers
- **Filter**: All field workers (no geographic restriction)
- **Message**: "No other field workers found in the system."
- **Rationale**: Field workers can work across different areas

### Zone Officers
- **Filter**: All zone officers (no zone restriction)
- **Message**: "No other zone officers found in the system."
- **Rationale**: Zone officers can manage multiple zones if needed

## Issue Status Handling
The system now handles reassignment for issues in the following statuses:
- `OPEN`: Newly reported issues
- `ASSIGNED`: Issues assigned to the user
- `IN_PROGRESS`: Issues currently being worked on
- `RESOLVED`: Issues resolved but not yet verified

## User Experience Improvements

### Visual Enhancements
- **Detailed user information**: Shows role, ward, and zone in dropdown
- **Context-aware messages**: Role-specific guidance when no users available
- **Single-action workflow**: Combined reassign and deactivate operation
- **Progress indicators**: Clear loading states and success/error messages

### Error Handling
- **Validation**: Ensures target user is active and valid
- **Rollback capability**: Maintains data integrity if operations fail
- **User feedback**: Clear error messages for different failure scenarios

## API Integration
- **Endpoint**: `PATCH /admin/users/:userId/deactivate`
- **Request body**: `{ reassignToUserId?: string }`
- **Response**: Updated user object with `isActive: false`
- **Error codes**: Appropriate HTTP status codes for different failure scenarios

## Testing Recommendations

### Backend Testing
1. Test deactivation without active issues
2. Test deactivation with reassignment
3. Test invalid reassignment target
4. Test role-based filtering in `getUsersByFilter`

### Frontend Testing
1. Test role-based user filtering
2. Test empty user list scenarios
3. Test successful reassignment workflow
4. Test error handling and user feedback

## Security Considerations
- **Authorization**: Only SUPER_ADMIN can deactivate users
- **Validation**: Ensures reassignment target is valid and active
- **Audit trail**: Complete logging of all reassignment and deactivation actions
- **Data integrity**: Maintains referential integrity during reassignment

## Future Enhancements
- **Bulk operations**: Support for deactivating multiple users
- **Notification system**: Email notifications for reassigned users
- **Approval workflow**: Multi-step approval for critical user deactivations
- **Rollback capability**: Ability to undo deactivation and reassignment