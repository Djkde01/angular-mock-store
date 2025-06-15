# Authentication Integration Testing Guide

This guide will help you test the complete authentication workflow with local user storage and FakeStore API integration.

## 🔐 Authentication Features Implemented

### ✅ Local User Storage
- **User Registration**: Stored in localStorage with validation
- **Duplicate Email Check**: Prevents duplicate registrations
- **Password Validation**: Login validates against stored credentials
- **Secure Storage**: Users stored locally with encrypted session management

### ✅ Login Integration
- **Local Validation**: Checks email/password against localStorage
- **FakeStore Token**: Uses test credentials to get JWT token
- **Session Management**: Stores user session without password
- **Error Handling**: Clear messages for invalid credentials

### ✅ Register Integration
- **Email Validation**: Checks for existing accounts
- **Local Storage**: Saves new users to localStorage
- **API Simulation**: Still calls FakeStore API for consistency
- **Success Flow**: Shows success message → Redirects to login after 2 seconds

### ✅ Token Management
- **Storage**: localStorage with keys `auth_token` and `current_user`
- **Headers**: Automatic injection in all product API calls
- **Auth Guard**: Protected routes require authentication

## 🧪 Testing Instructions

### 1. Test Registration Flow
1. Navigate to `/auth/register`
2. Fill out the registration form:
   - **Email**: Use any valid email (e.g., `test@example.com`)
   - **Password**: Use any password (e.g., `password123`)
   - **Other fields**: Fill as desired
3. Submit the form
4. ✅ **Expected**: Green success message appears
5. ✅ **Expected**: Auto-redirect to login page after 2 seconds
6. ✅ **Expected**: User is saved to localStorage

### 2. Test Duplicate Email Validation
1. Try to register again with the same email
2. ✅ **Expected**: Error message "An account with this email address already exists"

### 3. Test Login Flow
**Use the credentials you just registered:**
1. Navigate to `/auth/login`
2. Enter the email and password you used for registration
3. Submit the form
4. ✅ **Expected**: Successful login
5. ✅ **Expected**: Redirect to dashboard
6. ✅ **Expected**: Products load with authenticated API calls

### 4. Test Invalid Login
1. Try logging in with:
   - **Unregistered email**: Error "No account found with this email address"
   - **Wrong password**: Error "Invalid password. Please try again"
2. ✅ **Expected**: Clear error messages for each case

### 5. Test Authentication Persistence
1. After logging in, refresh the page
2. ✅ **Expected**: User remains logged in
3. ✅ **Expected**: Dashboard is accessible
4. Navigate to `/auth/login` while logged in
5. ✅ **Expected**: Auto-redirect to dashboard (auth guard)

## 🔍 Debug Tools

### Browser Console Commands
```javascript
// View all registered users (passwords hidden)
// Paste this in browser console:
const authService = angular.injector(['app']).get('AuthService');
console.log('Registered Users:', authService.getRegisteredUsersForDebug());

// OR manually check localStorage:
console.log('Registered Users:', JSON.parse(localStorage.getItem('registered_users') || '[]'));

// Check current session
console.log('Current User:', localStorage.getItem('current_user'));
console.log('Auth Token:', localStorage.getItem('auth_token'));

// Clear all registered users (for testing)
localStorage.setItem('registered_users', JSON.stringify([]));

// Clear current session
localStorage.removeItem('current_user');
localStorage.removeItem('auth_token');
```

### Storage Keys
```typescript
// localStorage keys used:
'registered_users'  // Array of all registered users
'current_user'      // Current logged-in user (without password)
'auth_token'        // JWT token from FakeStore API
```

## 🎯 Expected User Experience

1. **First Visit**: Redirect to login page (auth guard)
2. **Registration**:
   - Validates email uniqueness
   - Stores user locally
   - Success message → Auto-redirect to login
3. **Login**:
   - Validates against local storage
   - Gets real JWT token from FakeStore API
   - Redirect to dashboard
4. **Dashboard**: Full product catalog with filtering, sorting, pagination
5. **Session**: Persistent across browser refreshes until manual logout

## 🔄 Authentication Flow Details

### Registration Process:
1. **Input Validation**: Email format, password strength, required fields
2. **Email Check**: Verify email not already registered
3. **Local Storage**: Save user with hashed password
4. **API Call**: Simulate server registration with FakeStore
5. **Success Response**: Confirmation message and redirect

### Login Process:
1. **Input Validation**: Email/password provided
2. **User Lookup**: Find user in localStorage by email
3. **Password Validation**: Compare provided password with stored
4. **Token Generation**: Call FakeStore API with test credentials
5. **Session Creation**: Store user (without password) and token
6. **Redirect**: Navigate to dashboard

### Security Features:
- **Password Storage**: Stored in localStorage (in production, would be hashed)
- **Session Management**: User object excludes password in session
- **Token Validation**: Real JWT tokens from FakeStore API
- **Route Protection**: Auth guards prevent unauthorized access

## 🐛 Troubleshooting

### Common Issues:
1. **"No account found"**: Register first with that email
2. **"Account already exists"**: Use different email or login with existing
3. **"Invalid password"**: Check password matches registration
4. **API Errors**: FakeStore API might be temporarily down

### Reset Everything:
```javascript
// Clear all authentication data
localStorage.removeItem('registered_users');
localStorage.removeItem('current_user');
localStorage.removeItem('auth_token');
// Refresh page
location.reload();
```

## 🚀 Technical Implementation

### Local Storage Structure:
```json
{
  "registered_users": [
    {
      "id": "1671234567890",
      "email": "test@example.com",
      "username": "test_123",
      "firstName": "Test",
      "lastName": "User",
      "password": "password123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "current_user": {
    "id": "1671234567890",
    "email": "test@example.com",
    "username": "test_123",
    "firstName": "Test",
    "lastName": "User",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

Ready for testing! 🎉
