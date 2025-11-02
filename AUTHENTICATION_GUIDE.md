# Student Registration System - Authentication Guide

## Overview
The Student Registration System now includes a complete authentication system with login, account creation, and logout functionality, styled to match the main Kageyo TVET School website.

## Features Implemented

### 1. **Authentication System**
- **Login Page**: Users must login before accessing the registration system
- **Create Account**: New users can create accounts with different roles
- **Logout**: Secure logout functionality with confirmation
- **Session Persistence**: Login state is saved in browser localStorage

### 2. **User Roles**
Three user roles are available:
- **Administrator**: Full system access
- **Registrar**: Student registration and management
- **Teacher**: View and manage student information

### 3. **Design Updates**
- Matches the Kageyo TVET School index.html design
- Blue gradient theme (#1D4ED8 to #3B82F6)
- Roboto font family
- Professional authentication cards
- Responsive design

### 4. **Security Features**
- Password validation (minimum 6 characters)
- Password confirmation on account creation
- Username uniqueness check
- Secure logout with confirmation dialog

## How to Use

### First Time Setup
1. Open the `student-registration.html` file in a browser
2. Click "Create Account" on the login page
3. Fill in the required information:
   - Full Name
   - Username (must be unique)
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
   - Role (Administrator, Registrar, or Teacher)
4. Click "Create Account"
5. You'll be redirected to the login page

### Logging In
1. Enter your username and password
2. Click "Login"
3. You'll be taken to the Student Registration Dashboard

### Using the System
Once logged in, you can:
- Register new students
- Register returning students
- View all registered students (with filters)
- Export data to Excel:
  - Export all students
  - Export by class
  - Export by type (New/Returning)
- View statistics and analytics

### Logging Out
1. Click the "Logout" button at the bottom of the sidebar
2. Confirm the logout action
3. You'll be returned to the login page

## Technical Details

### Data Storage
All data is stored in browser localStorage:
- **kageyoUsers**: Array of user accounts
- **kageyoCurrentUser**: Currently logged-in user
- **registeredStudents**: Array of registered students

### Default Test Account
For testing, you can create an account with:
- Username: admin
- Password: admin123
- Role: Administrator

### Features from Previous Update
All previous features are retained:
- ✅ Automatic academic year calculation
- ✅ Separate forms for new and returning students
- ✅ Excel export functionality
- ✅ Filter and view all registered students
- ✅ Real-time statistics
- ✅ Dark mode support

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Notes
- Data is stored locally in the browser
- Clearing browser data will remove all accounts and registrations
- For production use, implement server-side authentication
- Consider adding password encryption for enhanced security

## Support
For issues or questions, contact the development team.
