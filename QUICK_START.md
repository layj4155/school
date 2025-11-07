# 🚀 Quick Start Guide - Kageyo TVET School System

## Start the System in 3 Steps

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm run dev
```
✅ Server running at `http://localhost:5002`

### Step 2: Open Frontend
Open `app.html` in your browser

### Step 3: Register & Login
1. Go to Registration page
2. Select your role
3. Login and access your dashboard

---

## 🔑 Test Accounts

### Create These Test Users:

#### School Manager
- **Role:** SM
- **Email:** manager@kageyo.edu
- **Password:** manager123
- **Dashboard:** Full oversight with all department reports

#### Dean of Studies
- **Role:** DOS
- **Email:** dos@kageyo.edu
- **Password:** dos123
- **Dashboard:** Academic management, marks, classes

#### Dean of Discipline
- **Role:** DOD
- **Email:** dod@kageyo.edu
- **Password:** dod123
- **Dashboard:** Discipline, conduct (40 max)

#### IT Technician
- **Role:** IT
- **Email:** it@kageyo.edu
- **Password:** it123
- **Dashboard:** Full system access

#### Librarian
- **Role:** Librarian
- **Email:** librarian@kageyo.edu
- **Password:** lib123
- **Dashboard:** Books, borrowing, overdue (7 days)

#### Bursar
- **Role:** Bursar
- **Email:** bursar@kageyo.edu
- **Password:** bursar123
- **Dashboard:** Fees, payments, reports

#### Teacher
- **Role:** Teacher
- **Email:** teacher@kageyo.edu
- **Password:** teacher123
- **Dashboard:** Classes, marks entry

---

## 👥 Student/Parent Login

### For Students:
- No registration needed (admin creates accounts)
- **Login with:**
  - Student ID
  - Full Name
- **Access:** Own marks, conduct, claims

### For Parents:
- No registration needed
- **Login with:**
  - Student ID
  - Student Full Name
  - Student Class
  - Parent Name
- **Access:** Child's performance, discipline, fees

---

## 📊 What Each Role Can Do

### SM (School Manager)
✅ View all department reports  
✅ Register students  
✅ System oversight  

### DOS (Dean of Studies)
✅ Manage students & teachers  
✅ Create classes  
✅ Manage marks (add/edit/publish)  
✅ Performance analysis  
✅ Export reports to PDF  
✅ Sort by: >90%, 80%, 70%, 60%, 50%, <50%  

### DOD (Dean of Discipline)
✅ Create faults  
✅ Reduce conduct (40 max → can go down to 0)  
✅ Track low conduct (<20)  
✅ Publish reports to DOS & SM  

### Librarian
✅ Add books  
✅ Track borrowing  
✅ Monitor overdue (>7 days)  
✅ Most borrowed statistics  

### Bursar
✅ Record payments  
✅ Track paid/unpaid  
✅ Financial reports  
✅ Balance tracking  

---

## 🎯 Key Features

### ✅ Implemented:
- 11 user roles with specific permissions
- Unified login system
- Role-based dashboards
- Student/parent portals
- Backend API with all routes
- Frontend SPA (app.js)
- Responsive design
- Secure authentication

### 📦 Included:
- All database models
- All API routes
- All dashboard UIs
- Login/Registration flows
- Documentation

---

## 📱 Access URLs

### Public Pages
```
/#/                 - Home
/#/about            - About (with history)
/#/academics        - Programs & calendar
/#/trainers         - Staff directory
/#/news             - News & updates
/#/contact          - Contact info
```

### Authentication
```
/#/login            - Login page
/#/register         - Registration page
```

### Dashboards (Auto-routed by role)
```
/#/dashboard        - Role-based dashboard
/#/student-portal   - Student portal
/#/parent-portal    - Parent portal
```

---

## 🛠️ Technologies Used

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (password hashing)

### Frontend
- Vanilla JavaScript (SPA)
- Tailwind CSS
- Axios (API calls)
- Font Awesome icons

---

## 📝 Important Notes

1. **Conduct Marks:** Each student has 40 conduct marks. DOD can reduce based on faults.
2. **Book Borrowing:** Students have 7 days to return books before it's overdue.
3. **Student Login:** No password needed, just ID + Name for security.
4. **Parent Login:** 4-field verification (ID + Name + Class + Parent Name).
5. **Role Selection:** Choose correct role during registration.

---

## 🎓 System Flow

```
Registration → Select Role → Create Account
                    ↓
            Role-Based Dashboard
                    ↓
┌──────────────┬───────────────┬──────────────┬──────────────┐
│   SM         │   DOS         │   DOD        │   IT         │
│ (Oversight)  │ (Academic)    │ (Discipline) │ (System)     │
└──────────────┴───────────────┴──────────────┴──────────────┘
┌──────────────┬───────────────┬──────────────┬──────────────┐
│ Librarian    │   Bursar      │  Teacher     │ Student      │
│ (Library)    │ (Fees)        │ (Teaching)   │ (Portal)     │
└──────────────┴───────────────┴──────────────┴──────────────┘
```

---

## ✅ System Ready!

Your complete school management system is ready to use!

1. ✅ All 11 roles configured
2. ✅ Backend API ready
3. ✅ Frontend dashboards ready
4. ✅ Student/Parent portals ready
5. ✅ Documentation complete

**Next:** Start the backend and begin testing!

---

**Questions?** Check:
- `ROLES_GUIDE.md` - Detailed role permissions
- `BACKEND_SETUP_GUIDE.md` - API documentation
- `SYSTEM_COMPLETE.md` - Full system overview

**Kageyo TVET School Management System**  
*Work - Courage - Solidarity* 🎓
