# Marks Publishing System - How It Works

## Overview
The Kageyo TVET School has two connected systems:
1. **Admin Dashboard** (`admin-dashboard.html`) - For administrators to enter and publish marks
2. **Student Data Portal** (`student-data.html`) - For students and parents to view published marks

## How the Connection Works

### Publishing Marks (Admin Dashboard)

When an administrator publishes marks in the Admin Dashboard:

1. **Save Marks Button** - Saves marks to `localStorage` with key `kageyoMarks`
2. **Publish Results Button** - Publishes marks by:
   - Saving to `publishedMarks` (for midterm marks)
   - Saving to `publishedExamData` (for exam marks)
   - Setting `marksPublished` flag to `'true'`
   - Adding a timestamp to `publishTimestamp`

### Viewing Marks (Student Data Portal)

When students/parents log in to the Student Data Portal:

1. **Auto-Load on Login** - The `loadPublishedData()` function runs and:
   - Checks for `publishedData` in localStorage
   - Checks for `publishedMarks` from admin dashboard
   - Checks for `publishedExamData` from admin dashboard
   - Merges all data into the student portal format

2. **Real-Time Updates** - The portal listens for storage changes:
   - When admin publishes new marks, the portal automatically detects it
   - Shows a notification "New results have been published!"
   - Refreshes the current view to show updated marks

## localStorage Keys Used

| Key | Purpose | Set By | Read By |
|-----|---------|--------|---------|
| `kageyoMarks` | Draft marks storage | Admin Dashboard | Admin Dashboard |
| `kageyoExamData` | Draft exam marks | Admin Dashboard | Admin Dashboard |
| `publishedMarks` | Published midterm marks | Admin Dashboard | Student Portal |
| `publishedExamData` | Published exam marks | Admin Dashboard | Student Portal |
| `marksPublished` | Publish status flag | Admin Dashboard | Student Portal |
| `publishTimestamp` | When marks were published | Admin Dashboard | Both |
| `publishedData` | Student portal format | Student Portal | Student Portal |

## User Roles

### Admin
- **Username:** admin
- **Password:** kageyo2025
- Can enter marks, publish results, manage all student data

### Students
- Login with their name and class
- Can only view their own published marks
- See marks immediately after admin publishes

### Parents
- Login with student name, class, and parent name
- Can only view their child's published marks
- Automatically see published data only

## Step-by-Step Usage

### For Administrators:

1. Open `admin-dashboard.html`
2. Navigate to "Marks Management" tab
3. Select a class and midterm
4. Enter marks for students
5. Click "Save Marks" to save (auto-publishes to student portal)
6. Click "Publish Results" button to officially publish all marks
7. Students can now see the marks in their portal

### For Students:

1. Open `student-data.html`
2. Click "Student Login" tab
3. Enter your name and select your class
4. Click "Login"
5. View your marks in different sections:
   - My Marks (overview)
   - Midterm Marks (detailed midterm results)
   - Discipline Records
   - Academic Results (full year summary)

### For Parents:

1. Open `student-data.html`
2. Click "Parent Login" tab
3. Enter student name, class, and your name
4. Click "Login"
5. View your child's published marks and discipline records

## Features

### Real-Time Synchronization
- Changes in admin dashboard automatically reflect in student portal
- No page refresh needed - uses browser storage events
- Toast notifications inform users of new published data

### Data Security
- Students can only see their own data
- Parents can only see their child's data
- Admin has full access to all data
- Published vs Draft data separation

### Offline Capability
- All data stored in browser localStorage
- Works without internet connection
- Data persists across browser sessions

## Technical Details

### Data Format

**Admin Dashboard Format:**
```javascript
{
  "S1A": {
    "midterm1": {
      "Student Name": 85,
      "Another Student": 92
    },
    "midterm2": { ... },
    "term1": { ... }
  }
}
```

**Student Portal Format:**
```javascript
{
  "termMarks": {
    "S1A": {
      "midterm1": { "Student Name": 85 },
      "term1": { "Student Name": 88 }
    }
  },
  "disciplineData": { ... }
}
```

### Event Listeners

The student portal listens for these storage events:
- `publishedMarks` - Midterm marks published
- `publishedExamData` - Exam marks published
- `marksPublished` - Overall publish status change

## Troubleshooting

### Marks not showing in student portal?
1. Check if admin clicked "Publish Results"
2. Verify `marksPublished` is set to `'true'` in localStorage
3. Try logging out and logging back in
4. Check browser console for errors

### Real-time updates not working?
1. Make sure both pages are open in the same browser
2. Storage events only work across different tabs/windows
3. Try refreshing the student portal page

### Data not persisting?
1. Check if browser allows localStorage
2. Verify browser is not in private/incognito mode
3. Check if localStorage is full (rare)

## Future Enhancements

- Backend API integration for true server-side storage
- Email notifications when marks are published
- SMS notifications for parents
- PDF report generation
- Grade analytics and charts
- Attendance tracking integration

---

**Last Updated:** October 29, 2025
**Version:** 1.0
**Maintained by:** Kageyo TVET School IT Department
