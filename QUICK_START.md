# 🚀 Quick Start Guide - Role-Based Admin Dashboard

## ⚡ 5-Minute Setup

### 1. Backend Setup (2 minutes)
```bash
cd backend
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_NAME=kageyo_tvet
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres
JWT_SECRET=change_this_secret_key
PORT=5000
```

Initialize and seed:
```bash
node scripts/initDatabase.js
node scripts/seedData.js
npm start
```

### 2. Frontend Setup (1 minute)
```bash
# In project root
npx http-server -p 8000
```

Open: `http://localhost:8000/admin-dashboard.html`

### 3. Login (1 minute)
**Admin:** admin / admin123

## 🎯 Quick Tasks

### Task 1: Assign Teacher to Class (Admin)
1. Login as admin
2. Go to "Classes"
3. Select "Advanced Software Development Year 1"
4. Click "Assign Teacher"
5. Select teacher1 and "Backend Application Development"
6. Save

### Task 2: Enter Marks (Teacher)
1. Logout and login as teacher1 / teacher123
2. Go to "Enter Marks"
3. Select class: "Advanced Software Development Year 1"
4. Select subject: "Backend Application Development"
5. Select module: "REST API Design" (optional)
6. Select assessment: "Midterm 1"
7. Select term: "Term 1"
8. Click "Load Students"
9. Enter marks for students
10. Click "Save All Marks"

### Task 3: Publish Marks (Dean of Studies)
1. Logout and login as dean_studies / dean123
2. Go to "Publish Marks"
3. Filter by class and subject
4. Click "Load Unpublished Marks"
5. Select marks to publish
6. Click "Publish Selected"

### Task 4: View Statistics (Dean of Studies)
1. While logged in as dean_studies
2. Go to "Statistics"
3. Select class and subject
4. Click "Load Statistics"
5. View charts and analytics

## 📊 Sample Accounts

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | admin | admin123 | Everything |
| Dean of Studies | dean_studies | dean123 | Publish & Stats |
| Dean of Discipline | dean_discipline | dean123 | Discipline |
| Teacher | teacher1 | teacher123 | Assigned Classes |
| Teacher | teacher2 | teacher123 | Assigned Classes |

## 🎓 Pre-loaded Data

### Subjects (Software Development):
- Backend Application Development (4 modules)
- Window Server Administration (4 modules)
- PHP Programming (4 modules)
- Networking (4 modules)
- Database Development (4 modules)

### Classes:
- Advanced Software Development Year 1 & 2
- Advanced Accounting Year 1 & 2
- Ordinary Level Year 1 & 2

## 🔑 Key API Endpoints

```
POST   /api/auth/login              - Login
GET    /api/marks                   - Get marks
POST   /api/marks                   - Create mark
POST   /api/marks/bulk              - Bulk create
PUT    /api/marks/publish-bulk      - Publish marks
GET    /api/marks/statistics        - Get stats
GET    /api/subjects                - Get subjects
GET    /api/modules                 - Get modules
GET    /api/classes                 - Get classes
POST   /api/classes/:id/assign-teacher - Assign teacher
```

## ✅ Verification Steps

1. ✅ Backend running on port 5000
2. ✅ Can login as admin
3. ✅ Can see dashboard
4. ✅ Can assign teacher to class
5. ✅ Teacher can see assigned class
6. ✅ Teacher can enter marks
7. ✅ Dean can publish marks
8. ✅ Statistics calculate correctly

## 🐛 Troubleshooting

**Can't connect to database?**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Login not working?**
- Clear browser localStorage
- Check backend is running
- Verify credentials

**Marks not saving?**
- Ensure teacher is assigned to class
- Check all required fields are filled
- Verify marks are 0-100

**Statistics showing 0?**
- Ensure marks are published
- Check filters are set correctly
- Verify data exists for selection

## 📚 Full Documentation

- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `ROLE_BASED_DASHBOARD_GUIDE.md` - Feature documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical details

## 🎉 You're Ready!

The system is now configured with:
- ✅ 3 roles (Admin, Dean of Studies, Teachers)
- ✅ 15 subjects across 3 programs
- ✅ 20 modules for Software Development
- ✅ 6 classes ready for students
- ✅ Complete marks management system
- ✅ Publishing workflow
- ✅ Statistics and analytics

**Start by assigning teachers to classes, then let them enter marks!**
