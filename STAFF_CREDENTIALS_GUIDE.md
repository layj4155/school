# Staff Credentials & System Guide

## Overview
The Student Registration System now integrates with the school's staff database from `staff.html`. Only authorized staff members can create accounts and access the system.

## Authorized Staff Members

### Administration Team
1. **SCHOOL MANAGER**
   - Email: manager@kageyotvet.edu.rw
   - Position: School Manager
   - Role: Administrator
   - Suggested Username: school.manager

2. **SECRETARY**
   - Email: secretary@kageyotvet.edu.rw
   - Position: Secretary
   - Role: Registrar
   - Suggested Username: secretary

3. **LEOINE**
   - Email: bursar@kageyotvet.edu.rw
   - Position: Bursar
   - Role: Administrator
   - Suggested Username: leoine

4. **MFASHWANIMANA JMV**
   - Email: studies@kageyotvet.edu.rw
   - Position: Deputy School Manager in charge of Study
   - Role: Administrator
   - Suggested Username: mfashwanimana.jmv

### Discipline Team
5. **BIZIMANA PASCAL**
   - Email: discipline@kageyotvet.edu.rw
   - Position: Deputy School Manager in charge of Discipline
   - Role: Administrator
   - Suggested Username: bizimana.pascal

6. **BYIRINGIRO AIMABLE**
   - Email: patron@kageyotvet.edu.rw
   - Position: Patron
   - Role: Teacher
   - Suggested Username: byiringiro.aimable

7. **ISHIMWE MARIE CHERELE**
   - Email: matron@kageyotvet.edu.rw
   - Position: Matron
   - Role: Teacher
   - Suggested Username: ishimwe.marie.cherele

8. **PETRO SERGE**
   - Email: patron2@kageyotvet.edu.rw
   - Position: Patron
   - Role: Teacher
   - Suggested Username: petro.serge

### Supporting Staff
9. **MUTONI JEANETTE**
   - Email: library@kageyotvet.edu.rw
   - Position: Librarian
   - Role: Registrar
   - Suggested Username: mutoni.jeanette

10. **KARANGWA VAINQUEUR ALAIN**
    - Email: it@kageyotvet.edu.rw
    - Position: IT Technician
    - Role: Administrator
    - Suggested Username: karangwa.vainqueur.alain

## How to Create an Account

### Step 1: Access the System
1. Open `student-registration.html` in your browser
2. Click "Create Account" on the login page

### Step 2: Select Your Name
1. From the dropdown menu, select your name and position
2. Your details will be automatically filled:
   - Full Name
   - Email
   - Position
   - Role (auto-assigned based on position)
   - Suggested Username (you can modify this)

### Step 3: Set Your Credentials
1. **Username**: Modify the suggested username if desired (must be unique)
2. **Password**: Choose a strong password (minimum 6 characters)
3. **Confirm Password**: Re-enter your password

### Step 4: Create Account
1. Click "Create Account"
2. You'll be redirected to the login page
3. Login with your new credentials

## Role Permissions

### Administrator
- Full system access
- Register new and returning students
- View all registered students
- Export all reports
- Manage system settings

### Registrar
- Register new and returning students
- View all registered students
- Export student data and reports
- Limited administrative access

### Teacher
- View registered students
- Export class lists
- View student information
- Limited registration access

## Export Features

### 1. Export All Students (Excel)
- Downloads complete list of all registered students
- Includes all student details
- File format: `All_Registered_Students_YYYY-MM-DD.xlsx`

### 2. Export by Class (Excel)
- Prompts for class name (e.g., S1A, S2B)
- Exports only students in that class
- File format: `Students_[ClassName]_YYYY-MM-DD.xlsx`

### 3. Export by Type (Excel)
- Prompts for type (New or Returning)
- Exports only students of that type
- File format: `[Type]_Students_YYYY-MM-DD.xlsx`

### 4. Export Results Report (Excel) ⭐ NEW
Comprehensive report with 3 sheets:
- **Summary Sheet**: Overall statistics
  - Total registered students
  - New vs. Returning breakdown
  - Report generator name
  - Report date and time
  - Academic year
  
- **Class Distribution Sheet**: Per-class breakdown
  - Class name
  - Total students per class
  - New students per class
  - Returning students per class
  
- **All Students Sheet**: Complete student list
  - Student ID, Name, Class, Type
  - Gender, Date of Birth
  - Parent information
  - Registration date
  - Academic year

File format: `Registration_Results_Report_YYYY-MM-DD.xlsx`

## Security Features

### Account Creation
- ✅ Only authorized staff can create accounts
- ✅ Email validation (must match staff database)
- ✅ Username uniqueness check
- ✅ Password strength requirement (minimum 6 characters)
- ✅ Password confirmation
- ✅ One account per staff member

### Login Security
- ✅ Username and password authentication
- ✅ Session persistence
- ✅ Secure logout with confirmation

### Data Protection
- ✅ All data stored locally in browser
- ✅ User credentials encrypted in localStorage
- ✅ Role-based access control

## Quick Start Guide

### For First-Time Users
1. Open the system
2. Click "Create Account"
3. Select your name from the staff list
4. Set your username and password
5. Click "Create Account"
6. Login with your credentials

### For Existing Users
1. Open the system
2. Enter your username and password
3. Click "Login"
4. Start registering students

## Troubleshooting

### "Username already exists"
- Choose a different username
- Usernames must be unique across all staff

### "This staff member already has an account"
- You can only create one account per staff member
- If you forgot your password, contact the IT administrator

### "Please select a staff member"
- You must select your name from the dropdown
- Only authorized staff can create accounts

### Cannot see staff list
- Refresh the page
- Clear browser cache
- Contact IT support

## System Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- LocalStorage enabled
- Internet connection (for initial load)

## Data Management
- All data is stored in browser localStorage
- Clearing browser data will remove all accounts and registrations
- For production use, implement server-side database
- Regular backups recommended

## Support
For technical issues or questions:
- Contact: KARANGWA VAINQUEUR ALAIN (IT Technician)
- Email: it@kageyotvet.edu.rw

## Notes
- System automatically calculates academic year
- Statistics update in real-time
- Dark mode available
- Mobile responsive design
- All exports include timestamp

---

**KAGEYO TVET SCHOOL**  
*Work - Courage - Solidarity*
