# 🎓 Kageyo TVET School Management System

> A comprehensive school management system with role-based access control for administrators, teachers, students, and parents.

**Status:** ✅ **COMPLETE & READY TO USE**

---

## 🌟 Features

### ✅ 11 User Roles with Specific Permissions
- **SM** (School Manager) - Full oversight
- **DOS** (Dean of Studies) - Academic management
- **DOD** (Dean of Discipline) - Conduct management (40 marks max)
- **IT Technician** - Full system access
- **Librarian** - Library management (7-day borrowing limit)
- **Bursar** - Fee management
- **Patron** - Male student welfare
- **Matron** - Female student welfare
- **Teacher** - Teaching & marks
- **Student** - Personal portal
- **Parent** - Child's information

### ✅ Dual Login System
1. **Staff/Teacher Login:** Email + Password
2. **Student Login:** StudentID + Full Name
3. **Parent Login:** StudentID + Name + Class + Parent Name

### ✅ Role-Based Dashboards
Each role gets a customized dashboard with only their relevant features and permissions.

### ✅ Complete Backend API
12 route endpoints with full CRUD operations and role-based authorization.

### ✅ Responsive Frontend
Modern single-page application with Tailwind CSS.

---

## 📁 Project Structure

```
D:/school/
├── backend/
│   ├── models/
│   │   ├── User.js           ✅ All 11 roles
│   │   ├── Student.js        ✅ With parent info
│   │   ├── Teacher.js        ✅ NEW
│   │   ├── Program.js        ✅ NEW
│   │   ├── News.js           ✅ NEW
│   │   ├── Fee.js            ✅ NEW
│   │   ├── Class.js          ✅
│   │   ├── Mark.js           ✅
│   │   ├── Discipline.js     ✅
│   │   └── Book.js           ✅
│   ├── routes/
│   │   ├── auth.js           ✅
│   │   ├── students.js       ✅ With login endpoints
│   │   ├── trainers.js       ✅ NEW
│   │   ├── programs.js       ✅ NEW
│   │   ├── news.js           ✅ NEW
│   │   ├── fees.js           ✅ NEW
│   │   └── ... (8 more)      ✅
│   └── server.js             ✅ Updated
├── app.html                  ✅
├── app.js                    ✅ Complete SPA
├── BACKEND_SETUP_GUIDE.md    ✅
├── ROLES_GUIDE.md            ✅
├── QUICK_START.md            ✅
├── SYSTEM_COMPLETE.md        ✅
├── IMPLEMENTATION_SUMMARY.md ✅
└── README.md                 ✅ This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `backend/.env`:
```env
NODE_ENV=development
PORT=5002
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Open Frontend
Open `app.html` in your browser or use:
```bash
# If you have live-server
npx live-server
```

### 5. Register & Login
1. Navigate to `#/register`
2. Choose your role
3. Create account
4. Login and explore!

---

## 👤 User Roles Explained

### Administrative Roles (8)

#### **SM - School Manager**
- View all department reports
- Register students
- Full system access
- Decision-making authority

#### **DOS - Dean of Studies**
- Manage students & teachers
- Create and manage classes
- Add/edit/publish marks
- Performance analysis with sorting
- Generate final reports & export to PDF

#### **DOD - Dean of Discipline**
- Create discipline faults
- Manage conduct marks (40 max per student)
- Track students with low conduct (<20)
- Publish reports to DOS and SM

#### **IT - IT Technician**
- Full system administration
- Manage all users
- Website management
- Database operations

#### **Librarian**
- Add and manage books
- Track borrowing/returns
- Monitor overdue (7-day limit)
- Generate library reports

#### **Bursar**
- Record fee payments
- Track paid/unpaid status
- Generate financial reports
- Balance calculations

#### **Patron & Matron**
- Student welfare
- Same permissions as DOD
- Gender-specific responsibilities

### Teaching Role (1)

#### **Teacher**
- View assigned classes
- Record marks for students
- View performance data

### User Roles (2)

#### **Student**
- Login: StudentID + Name
- View own marks & conduct
- File claims/disputes

#### **Parent**
- Login: StudentID + Student Name + Class + Parent Name
- View child's performance
- View discipline & fees

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | Get started in 3 steps |
| [ROLES_GUIDE.md](ROLES_GUIDE.md) | Detailed role permissions |
| [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) | Complete API documentation |
| [SYSTEM_COMPLETE.md](SYSTEM_COMPLETE.md) | Full system overview |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What was built |

---

## 🔐 Security

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based authorization
- ✅ Student verification (ID + Name)
- ✅ Parent verification (4-field check)
- ✅ Input validation
- ✅ Error handling

---

## 🎨 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Auth:** JWT + bcrypt
- **Middleware:** Custom authorization

### Frontend
- **Architecture:** Single Page Application (SPA)
- **JavaScript:** Vanilla ES6+
- **CSS:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** Font Awesome

---

## 📊 System Capabilities

### For School Management:
✅ Complete student lifecycle management  
✅ Academic performance tracking (3 terms)  
✅ Discipline management (40 conduct marks)  
✅ Library management (7-day borrowing)  
✅ Financial management  
✅ Performance analytics & sorting  
✅ Report generation & PDF export  

### For Students:
✅ Secure portal access  
✅ View marks after publication  
✅ View conduct scores  
✅ File claims for disputes  

### For Parents:
✅ Verified access to child's data  
✅ Academic performance visibility  
✅ Discipline status  
✅ Fee payment tracking  

---

## 🎯 Key Features by Department

### Dean of Studies (DOS)
- Student management
- Class creation & assignment
- Marks: Add → Edit → Refill → Publish
- Performance sorting (>90%, 80%, 70%, 60%, 50%, <50%)
- Final reports combining academics + discipline
- PDF export functionality

### Dean of Discipline (DOD)
- Fault management
- Conduct reduction (starting from 40)
- Low conduct alerts (<20 marks)
- Reports to DOS & SM

### Librarian
- Book cataloging
- Borrowing system
- 7-day return policy
- Overdue tracking
- Most borrowed statistics

### Bursar
- Fee recording
- Payment tracking
- Paid/unpaid status
- Balance calculations
- Financial reports

---

## 📞 Contact & Support

**School Information:**
- **Name:** Kageyo TVET School
- **Location:** Gicumbi District, Kaniga Sector, Northern Province
- **Phone:** +250 738266603
- **Email:** kageyotvet@gmail.com
- **Motto:** Work - Courage - Solidarity

---

## 📝 License

© 2025 Kageyo TVET School. All rights reserved.

---

## 🎉 System Status: COMPLETE

All features implemented and ready for production use!

**Version:** 1.0.0  
**Last Updated:** November 6, 2025  
**Status:** ✅ Production Ready

---

**Built with ❤️ for Kageyo TVET School**
