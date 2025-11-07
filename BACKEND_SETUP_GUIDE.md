# Kageyo TVET School - Backend Setup Guide

## Overview
This is the complete backend API for the Kageyo TVET School Management System with role-based access control.

## Roles & Permissions

### Administrative Roles
1. **SM** (School Manager) - Highest level oversight
2. **DOS** (Dean of Studies) - Academic management
3. **DOD** (Dean of Discipline) - Discipline management
4. **IT** - Full system access
5. **Librarian** - Library management
6. **Bursar** - Financial management
7. **Patron** - Student welfare (male)
8. **Matron** - Student welfare (female)
9. **Teacher** - Teaching and marks
10. **Student** - Own records access
11. **Parent** - Child's records access

## API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
```

### Student Routes (`/api/students`)
```
GET    /api/students          - Get all students
GET    /api/students/:id      - Get single student
POST   /api/students          - Create student (SM, DOS, IT)
PUT    /api/students/:id      - Update student (SM, DOS, IT)
DELETE /api/students/:id      - Delete student (SM, IT)
```

### Teacher/Trainer Routes (`/api/trainers`)
```
GET    /api/trainers          - Get all trainers (Public)
GET    /api/trainers/:id      - Get single trainer (Public)
POST   /api/trainers          - Create trainer (IT, SM, DOS)
PUT    /api/trainers/:id      - Update trainer (IT, SM, DOS)
DELETE /api/trainers/:id      - Deactivate trainer (IT, SM)
```

### Program Routes (`/api/programs`)
```
GET    /api/programs          - Get all programs (Public)
GET    /api/programs/:id      - Get single program (Public)
POST   /api/programs          - Create program (IT, SM, DOS)
PUT    /api/programs/:id      - Update program (IT, SM, DOS)
DELETE /api/programs/:id      - Deactivate program (IT, SM)
```

### News Routes (`/api/news`)
```
GET    /api/news              - Get all news (Public)
GET    /api/news/:id          - Get single news (Public)
POST   /api/news              - Create news (All staff)
PUT    /api/news/:id          - Update news (All staff)
DELETE /api/news/:id          - Delete news (IT, SM)
```

### Class Routes (`/api/classes`)
```
GET    /api/classes           - Get all classes
GET    /api/classes/:id       - Get single class
POST   /api/classes           - Create class (DOS, IT)
PUT    /api/classes/:id       - Update class (DOS, IT)
DELETE /api/classes/:id       - Delete class (DOS, IT)
POST   /api/classes/:id/students  - Add students to class
```

### Marks Routes (`/api/marks`)
```
GET    /api/marks             - Get all marks
GET    /api/marks/student/:id - Get student marks
POST   /api/marks             - Create marks (Teacher, DOS)
PUT    /api/marks/:id         - Update marks (Teacher, DOS)
DELETE /api/marks/:id         - Delete marks (DOS, IT)
POST   /api/marks/publish     - Publish marks (DOS)
```

### Discipline Routes (`/api/discipline`)
```
GET    /api/discipline        - Get all discipline records
GET    /api/discipline/student/:id - Get student discipline
POST   /api/discipline        - Create discipline record (DOD, Patron, Matron)
PUT    /api/discipline/:id    - Update record (DOD, Patron, Matron)
GET    /api/discipline/reports - Get discipline reports (DOD, SM, DOS)
```

### Library/Books Routes (`/api/books`)
```
GET    /api/books             - Get all books
GET    /api/books/:id         - Get single book
POST   /api/books             - Create book (Librarian, IT)
PUT    /api/books/:id         - Update book (Librarian, IT)
DELETE /api/books/:id         - Delete book (Librarian, IT)
POST   /api/books/:id/borrow  - Borrow book (Librarian)
POST   /api/books/:id/return  - Return book (Librarian)
GET    /api/books/overdue     - Get overdue books
GET    /api/books/reports     - Get library reports
```

### Fees Routes (`/api/fees`)
```
GET    /api/fees              - Get all fees (Bursar, SM, IT)
GET    /api/fees/student/:studentId - Get student fees
POST   /api/fees              - Create fee record (Bursar, SM, IT)
POST   /api/fees/:id/payment  - Record payment (Bursar, SM, IT)
GET    /api/fees/reports/summary - Get fees summary (Bursar, SM)
```

### Performance Routes (`/api/performance`)
```
GET    /api/performance       - Get performance data
GET    /api/performance/class/:id - Get class performance
GET    /api/performance/analysis  - Get performance analysis
```

### Reports Routes (`/api/reports`)
```
GET    /api/reports/academic  - Get academic reports (DOS, SM)
GET    /api/reports/discipline - Get discipline reports (DOD, SM)
GET    /api/reports/financial - Get financial reports (Bursar, SM)
GET    /api/reports/overall   - Get overall school reports (SM)
```

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  role: Enum [Student, Parent, Teacher, SM, DOS, DOD, IT, Librarian, Bursar, Patron, Matron],
  password: String (hashed),
  createdAt: Date
}
```

### Student Model
```javascript
{
  name: String,
  studentId: String (unique),
  class: String,
  parentName: String,
  parentPhone: String,
  userAccount: ObjectId (ref: User),
  parentUserAccount: ObjectId (ref: User),
  createdAt: Date
}
```

### Teacher Model
```javascript
{
  name: String,
  teacherId: String (unique),
  email: String,
  phone: String,
  subject: String,
  specialties: String,
  department: Enum,
  photo: String,
  userAccount: ObjectId (ref: User),
  assignedClasses: [ObjectId],
  isActive: Boolean,
  createdAt: Date
}
```

### Fee Model
```javascript
{
  student: ObjectId (ref: Student),
  studentId: String,
  studentName: String,
  class: String,
  totalFees: Number,
  amountPaid: Number,
  balance: Number,
  payments: [{
    amount: Number,
    date: Date,
    method: Enum,
    receiptNumber: String,
    recordedBy: ObjectId
  }],
  academicYear: String,
  term: Enum,
  status: Enum [Paid, Partially Paid, Unpaid, Overdue],
  createdAt: Date
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file:
```env
NODE_ENV=development
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

### 3. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

### 4. Test API
```bash
# Check if server is running
curl http://localhost:5002

# Should return: "KTSS API is running..."
```

## Role-Based Dashboard Access

### School Manager (SM)
- Overall reports from all departments
- Can register students
- View all system data
- Department-wise reports

### Dean of Studies (DOS)
- Student & teacher management
- Marks management (add, edit, publish)
- Classes management
- Performance analysis
- Final reports generation
- Export to PDF

### Dean of Discipline (DOD/Patron/Matron)
- Discipline management
- Conduct marks (40 total per student)
- Low conduct tracking (<20)
- Discipline reports to DOS and SM

### IT Technician
- Full system access
- User management
- Website management
- System configuration

### Librarian
- Book management
- Borrowing/return tracking
- Overdue monitoring (7 days limit)
- Library reports
- Most borrowed books

### Bursar
- Fee management
- Payment recording
- Fee reports
- Paid/unpaid tracking

### Teacher
- View assigned classes
- Record marks
- View student performance

### Student
- Login with StudentID + Full Name
- View own marks
- View own discipline record
- Claim disputes

### Parent
- Login with StudentID + Student Name + Class + Parent Name
- View child's academic performance
- View child's discipline
- View payment status

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt encryption
3. **Role-Based Access Control** - Middleware authorization
4. **Input Validation** - Mongoose validators
5. **Error Handling** - Centralized error middleware

## Next Steps

1. Start the backend server
2. Test API endpoints with Postman
3. Connect frontend app.js to backend
4. Create role-based dashboard components
5. Implement specific features for each role

## Support

For issues or questions, contact the development team.
