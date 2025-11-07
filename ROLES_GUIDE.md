# Kageyo TVET School - Roles & Permissions Guide

## Available Roles for Registration

When registering on the platform, users can select from the following roles:

### 📋 Administrative Staff

#### 1. **SM (School Manager)**
- **Full Name:** School Manager
- **Permissions:**
  - View overall reports from all departments
  - Register new students
  - Access all system data
  - View department-wise reports (DOS, DOD, Librarian, Bursar)
  - Highest level of oversight

#### 2. **DOS (Dean of Studies)**
- **Full Name:** Dean of Studies
- **Permissions:**
  - Dashboard for all students and teachers
  - Register new students
  - Student management
  - Classes management (create, add students, generate lists)
  - Marks management (add, edit, refill, publish)
  - View discipline reports from DOD
  - Generate final reports (academic + behavior)
  - Export results to PDF
  - Performance analysis (by class and whole school)
  - Sort students by performance levels (>90%, 80%, 70%, 60%, 50%, <50%)
  - View overall results for every class

#### 3. **DOD (Dean of Discipline)**
- **Full Name:** Dean of Discipline
- **Permissions:**
  - Access dashboard for all students
  - Discipline management
  - Create faults and assign reduction values
  - Reduce student conduct marks (max 40 per student)
  - Track students with low conduct (<20)
  - Generate and publish discipline reports to DOS and SM

#### 4. **IT (IT Technician)**
- **Full Name:** IT Technician
- **Permissions:**
  - View dashboards for students, staff, and teachers
  - Register students
  - Manage staff, teachers, and students
  - Full website management (frontend & backend)
  - System configuration
  - Database management

#### 5. **Bursar**
- **Full Name:** Bursar
- **Permissions:**
  - View all students and their classes
  - Record school fees paid by students
  - Track payment status (paid/unpaid)
  - Calculate payment differences
  - Generate financial reports

#### 6. **Librarian**
- **Full Name:** Librarian
- **Permissions:**
  - Access all students per class
  - Add new books
  - Manage borrowing and returns
  - Track overdue books (7-day borrowing limit)
  - View most borrowed books
  - Generate library reports
  - Track which students have which books

#### 7. **Patron**
- **Full Name:** Patron (Male Student Welfare)
- **Permissions:**
  - Same as DOD
  - Focus on male student welfare
  - Discipline management
  - Conduct marks reduction

#### 8. **Matron**
- **Full Name:** Matron (Female Student Welfare)
- **Permissions:**
  - Same as DOD
  - Focus on female student welfare
  - Discipline management
  - Conduct marks reduction

### 👨‍🏫 Teaching Staff

#### 9. **Teacher**
- **Full Name:** Teacher
- **Permissions:**
  - View assigned classes
  - Record marks for students
  - View student performance
  - Submit marks to DOS
  - Access teaching resources

### 🎓 Students & Parents

#### 10. **Student**
- **Full Name:** Student
- **Login Requirements:**
  - Student ID
  - Full Name
- **Permissions:**
  - View own academic marks (after DOS publishes)
  - View own discipline/conduct records
  - View behavior reduction details
  - Claim/dispute marks or conduct records
  - Access personal dashboard

#### 11. **Parent**
- **Full Name:** Parent
- **Login Requirements:**
  - Student ID
  - Student Name
  - Student Class
  - Parent Name (must match database)
- **Permissions:**
  - View child's academic performance
  - View child's discipline records
  - View payment status from Bursar
  - View child's complete school information

## Registration Process

1. Go to the registration page
2. Fill in:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - **Select Role** from the dropdown menu
3. Click "Create Account"
4. After successful registration, you'll be redirected to your role-based dashboard

## Dashboard Access

Each role has a customized dashboard showing only relevant information:

- **SM Dashboard:** Overall school reports
- **DOS Dashboard:** Academic management
- **DOD Dashboard:** Discipline management
- **IT Dashboard:** System management
- **Bursar Dashboard:** Financial management
- **Librarian Dashboard:** Library management
- **Patron/Matron Dashboard:** Student welfare
- **Teacher Dashboard:** Teaching & marks
- **Student Dashboard:** Personal academic info
- **Parent Dashboard:** Child's information

## Security Features

- Password must be at least 6 characters
- Email must be unique
- Role-based access control
- JWT authentication
- Secure password hashing (bcrypt)

## Need Help?

If you're unsure which role to select:
- **Staff members:** Contact your School Manager
- **Teachers:** Select "Teacher"
- **Students:** Select "Student"
- **Parents:** Select "Parent"
- **IT Issues:** Contact IT Technician

## Important Notes

- Each role has specific permissions
- You cannot access features outside your role
- Students and parents have separate login requirements
- All administrative staff can be contacted through the school office

---

**Kageyo TVET School Management System**  
*Work - Courage - Solidarity*
