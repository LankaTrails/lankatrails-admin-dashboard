# Complaints Section Integration Guide

## Overview
This document describes the complete integration between the frontend admin dashboard and the backend API for the complaints management system.

## Backend Architecture

### Technology Stack
- **Framework**: Spring Boot (Java)
- **Database**: PostgreSQL with PostGIS
- **Port**: 8080
- **Base URL**: `http://localhost:8080/api`

### Database Models

#### Complaint Entity
Located at: `lankatrails-backend/src/main/java/com/lankatrails/lankatrails_backend/model/Complaint.java`

**Fields**:
- `complaintId` (Long) - Primary key
- `description` (String) - Complaint description
- `complaintStatus` (ComplaintStatus enum) - PENDING, IN_PROGRESS, or RESOLVED
- `complaintResult` (ComplaintResult enum) - REFUND_FROM_PROVIDER, REFUND_FROM_COMPANY, or REJECT
- `dateTime` (LocalDateTime) - When complaint was created
- `investigationStartedDate` (String) - When investigation started
- `booking` (Booking) - Related booking
- `service` (Service) - Service being complained about
- `tourist` (Tourist) - Tourist who made the complaint
- `complaintImages` (List<ComplaintImage>) - Evidence images
- `complaintResolve` (ComplaintResolve) - Resolution details if resolved with refund
- `complaintReject` (ComplaintReject) - Rejection details if rejected

#### Enums

**ComplaintStatus**:
- PENDING
- IN_PROGRESS
- RESOLVED

**ComplaintResult**:
- REFUND_FROM_PROVIDER
- REFUND_FROM_COMPANY
- REJECT

### API Endpoints

#### 1. Get All Complaints
```
GET /api/admin/complaints
```
**Description**: Retrieves all complaints with status PENDING or IN_PROGRESS

**Response Structure**:
```json
{
  "success": true,
  "message": "All Complaints",
  "data": {
    "content": [
      {
        "businessName": "Service Name",
        "businessType": "INDIVIDUAL",
        "touristEmail": "user@example.com",
        "userStatus": "ACTIVE",
        "complaintStatus": "PENDING",
        "complaintId": 1
      }
    ]
  }
}
```

#### 2. Get Complaint Details
```
GET /api/admin/complaints/{complaintId}
```
**Description**: Get detailed information about a specific complaint

**Response Structure**:
```json
{
  "success": true,
  "message": "View complaint Details",
  "data": {
    "touristEmail": "user@example.com",
    "description": "Detailed complaint description",
    "businessType": "COMPANY",
    "userStatus": "ACTIVE",
    "serviceName": "Service Name",
    "totalComplaints": 3,
    "category": {...},
    "complaintId": 1,
    "bookingId": 123,
    "complaintDateTime": "2024-01-15T10:30:00",
    "investigationStartedDate": "2024-01-16T09:00:00"
  }
}
```

#### 3. Update Complaint Status to IN_PROGRESS
```
PUT /api/admin/complaints/{complaintId}
```
**Request Body**:
```json
{
  "investigationStartedDate": "2024-01-16T09:00:00"
}
```
**Description**: Marks a complaint as IN_PROGRESS and sets the investigation start date

**Response**:
```json
{
  "success": true,
  "message": "Successfully Updated",
  "data": ""
}
```

#### 4. Update Complaint Result
```
PUT /api/admin/complaint-result/{complaintId}
```
**Request Body**:
```json
{
  "complaintResult": "REFUND_FROM_PROVIDER"
}
```
**Possible Values**: 
- "REFUND_FROM_PROVIDER"
- "REFUND_FROM_COMPANY"
- "REJECT"

**Description**: Sets the final result/classification of the complaint

**Response**:
```json
{
  "success": true,
  "message": "Successfully Updated the Complaint Result",
  "data": ""
}
```

## Frontend Architecture

### Technology Stack
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui
- **Styling**: TailwindCSS

### File Structure

```
src/
├── api/
│   └── axiosInstance.ts          # Axios config with JWT interceptors
├── services/
│   └── complaintSection.ts       # API service functions
├── types/
│   └── complaints.ts             # TypeScript type definitions
├── pages/
│   └── admin/
│       ├── Complaints.tsx        # Complaints list page
│       └── ComplaintDetail.tsx   # Single complaint detail page
└── store/
    └── authSlice.ts              # Auth state management
```

### API Configuration

**Base URL**: `http://localhost:8080/api`
**Authentication**: JWT Bearer token (automatically injected via interceptor)

The axios instance (`src/api/axiosInstance.ts`) automatically:
1. Checks JWT token expiry before each request
2. Refreshes token if needed
3. Adds `Authorization: Bearer <token>` header
4. Handles 401 errors by redirecting to login

### Service Layer

File: `src/services/complaintSection.ts`

#### Functions

```typescript
// Get all complaints (PENDING and IN_PROGRESS only)
export async function findAllComplaints(): Promise<Complaint[]>

// Get a specific complaint by ID
export async function findComplaintById(id: any): Promise<Complaint>

// Update complaint status to IN_PROGRESS
export async function updateComplaintStatus(
  id: string, 
  investigationStartedDate: string
): Promise<Complaint>

// Update complaint result (fault classification)
export async function updateComplaintResult(
  id: string, 
  complaintResult: string
): Promise<Complaint>
```

### Type Definitions

File: `src/types/complaints.ts`

```typescript
export interface Complaint {
  serviceName: string;
  businessType: BusinessType;
  touristEmail: string;
  userStatus: UserStatus;
  complaintStatus: ComplaintStatus;
  complaintResult: string;
  complaintId: string;
  complaintDateTime: string;
  description: string;
  bookingId: string;
  investigationStartedDate: string;
  faultType: String;
}

export type ComplaintStatus = 'RESOLVED' | 'PENDING' | 'IN_PROGRESS';
export type BusinessType = 'INDIVIDUAL' | 'COMPANY' | 'ORGANIZATION';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'DISABLED';
export type FaultType = 'APP_FAULT' | 'PROVIDER_FAULT' | 'REJECT';
```

## Integration Changes Made

### 1. Fixed API Call Signatures

**Before**:
```typescript
updateComplaintStatus(id, { resolutionStatus: { investigationStartedDate: ... } })
updateComplaintResult(id, { complaintResult: "..." })
```

**After** (Matching backend expectations):
```typescript
updateComplaintStatus(id, investigationStartedDate)
updateComplaintResult(id, complaintResult)
```

### 2. Updated ComplaintDetail.tsx Handlers

#### handleSaveResolution
- Now sends `investigationStartedDate` as ISO string directly
- Updates local complaint state after successful API call
- Properly handles success/error states

#### handleSaveFaultClassification
- Maps fault type ("APP", "PROVIDER", "REJECT") to complaint result enum
- Calls `updateComplaintResult` with correct enum value
- Updates local state after successful API call

### 3. Workflow

1. **View Complaints List** (`/admin/complaints`)
   - Loads all PENDING and IN_PROGRESS complaints
   - Displays in searchable/filterable table
   - Click "Eye" icon to view details

2. **View Complaint Details** (`/admin/complaints/{id}`)
   - If `investigationStartedDate == "null"`:
     - Shows "Mark as In Progress" checkbox
     - Admin can add notes
     - Clicking "Save Resolution Status" calls `PUT /admin/complaints/{id}`
   
3. **After Marking In Progress**
   - Full complaint details become visible
   - Shows description, images, booking info
   - Admin can classify fault type

4. **Fault Classification**
   - Admin selects: Provider Fault, App Fault, or Reject
   - Clicking "Save Fault Classification" calls `PUT /admin/complaint-result/{id}`
   - Backend maps: APP → REFUND_FROM_COMPANY, PROVIDER → REFUND_FROM_PROVIDER, REJECT → REJECT

5. **Refund Process** (if not rejected)
   - Refund section appears after fault classification
   - Admin can enter amount and reason
   - (Currently front-end only - backend integration pending)

## Running the Application

### Backend

1. **Prerequisites**:
   - Java 17+
   - PostgreSQL with PostGIS
   - Redis
   - RabbitMQ
   - MongoDB

2. **Environment Variables** (create `.env` file):
```env
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_FROM=noreply@lankatrails.com
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
MONGODB_URI=mongodb://localhost:27017/lankatrails
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

3. **Start Backend**:
```bash
cd lankatrails-backend
./mvnw spring-boot:run
```
Backend will run on `http://localhost:8080`

### Frontend

1. **Install Dependencies**:
```bash
npm install
```

2. **Start Development Server**:
```bash
npm run dev
```
Frontend will run on `http://localhost:5173` (or next available port)

3. **Login**:
   - Navigate to `/login`
   - Use admin credentials
   - JWT token will be stored and auto-refreshed

4. **Access Complaints**:
   - Navigate to `/admin/complaints`
   - View list of pending/in-progress complaints
   - Click on any complaint to view details

## Testing the Integration

### Test Workflow

1. **Ensure Backend is Running**:
   - Check `http://localhost:8080/actuator/health`
   - Should return `{"status":"UP"}`

2. **Login to Admin Dashboard**:
   - Go to `http://localhost:5173/login`
   - Login with admin credentials
   - JWT should be set automatically

3. **View Complaints List**:
   - Navigate to `/admin/complaints`
   - Should see list of PENDING/IN_PROGRESS complaints
   - Check browser console for API responses

4. **View Single Complaint**:
   - Click eye icon on any complaint
   - Should load complaint details
   - Check if `investigationStartedDate` is "null" or has a value

5. **Mark as In Progress**:
   - Check "Mark as In Progress"
   - Add notes (optional)
   - Click "Save Resolution Status"
   - Verify success toast appears
   - Verify complaint details section becomes visible

6. **Classify Fault**:
   - Select fault type from dropdown
   - Click "Save Fault Classification"
   - Verify success toast
   - Verify saved classification badge appears

7. **Check Network Tab**:
   - Verify PUT requests are sent with correct payloads
   - Verify 200 responses from backend
   - Check response data structure

## Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution**: 
- Check if JWT token is valid
- Try logging out and logging in again
- Verify backend JWT secret matches

### Issue: CORS Error
**Solution**:
- Verify backend `application.properties` has correct CORS origins
- Add frontend origin to `app.cors.allowed-origins`

### Issue: Complaint Details Not Loading
**Solution**:
- Check if `complaintId` is correct
- Verify backend has complaint with that ID
- Check browser console for errors

### Issue: Investigation Date is "null" (string)
**Solution**:
- Backend returns string "null" for null values
- Frontend checks with `== "null"` (loose equality)
- This is handled in current implementation

## Future Enhancements

1. **Refund Processing**: Connect refund section to payment gateway API
2. **Real-time Updates**: Use WebSocket for live complaint updates
3. **Image Upload**: Add complaint image viewing from backend
4. **Notifications**: Email/SMS notifications to tourists
5. **Analytics**: Complaint statistics and trends
6. **Provider Warnings**: Integrate with provider warning system
7. **Chat/Messaging**: Real-time chat with tourists

## API Response Examples

### Successful Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Error message",
  "details": "Detailed error information",
  "userMessage": "User-friendly error message"
}
```

## Notes

- All timestamps are in ISO 8601 format
- Backend uses `LocalDateTime` which is timezone-naive
- Frontend should handle timezone conversions if needed
- Complaint status transitions: PENDING → IN_PROGRESS → RESOLVED
- Once a complaint is RESOLVED, it won't appear in the admin list
- JWT tokens expire after 1 hour (configurable in backend)
- Refresh tokens are HTTP-only cookies

## Contact & Support

For issues or questions:
1. Check backend logs: `lankatrails-backend/logs/`
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all required services (DB, Redis, RabbitMQ) are running
