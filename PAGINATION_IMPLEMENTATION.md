# User Management Pagination Implementation

## Backend Changes

### 1. Admin Service (`admin.service.ts`)
- Updated `getAllUsers()` method to accept `page` and `limit` parameters
- Added pagination logic with `skip` and `take` for database queries
- Returns both users array and pagination metadata
- Default: 18 users per page (as requested)

### 2. Admin Controller (`admin.controller.ts`)
- Updated `getAllUsers` controller to parse query parameters
- Extracts `page` and `limit` from request query
- Passes parameters to service method

### 3. Types (`admin.types.ts`)
- Added `PaginatedUsersResponse` interface
- Includes pagination metadata: currentPage, totalPages, totalUsers, hasNextPage, hasPreviousPage, limit

### 4. Validation (`admin.schema.ts`)
- Added `getAllUsersSchema` for query parameter validation
- Validates page > 0 and limit between 1-100
- Transforms string parameters to integers

### 5. Routes (`admin.routes.ts`)
- Added validation middleware to `/admin/users` endpoint
- Validates pagination query parameters

## Frontend Changes

### 1. Redux Slice (`adminSlice.ts`)
- Updated `AdminState` interface to include `usersPagination`
- Modified `fetchAllUsers` thunk to accept pagination parameters
- Updated reducer to handle pagination data from API response

### 2. User Management Page (`page.tsx`)
- Added `currentPage` state management
- Updated `useEffect` to fetch users with pagination parameters
- Added pagination controls with Previous/Next buttons
- Added page number buttons (shows up to 5 pages)
- Added user count display in header
- Handles loading states for pagination

## API Endpoint

```
GET /admin/users?page=1&limit=18
```

### Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 18, max: 100)

### Response Format:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 87,
      "hasNextPage": true,
      "hasPreviousPage": false,
      "limit": 18
    }
  }
}
```

## Features Implemented

1. **Server-side Pagination**: Efficient database queries with LIMIT/OFFSET
2. **Validation**: Query parameter validation with Zod schemas
3. **Frontend Pagination Controls**: Previous/Next buttons and page numbers
4. **User Count Display**: Shows total users and current range
5. **Loading States**: Proper loading indicators during page changes
6. **Responsive Design**: Pagination works on mobile and desktop

## Usage

The user management page now loads 18 users per page by default. Users can navigate between pages using the pagination controls at the bottom of the page. The system maintains the current page state and refreshes data when users are added or updated.