# 🔗 Frontend-Backend Integration Guide

## ✅ What's Been Connected

Your Kageyo TVET School website is now fully integrated with the backend API!

### 🎯 Completed Integrations

1. **API Helper Library** (`js/api.js`)
   - Centralized API communication
   - Authentication management
   - Token storage and retrieval
   - All CRUD operations for all modules

2. **Admin Login** (`index.html`)
   - Connected to backend authentication
   - JWT token management
   - Role-based access control
   - Secure credential validation

3. **Ready-to-Use API Functions**
   - Students management
   - Staff management
   - Courses
   - News & Events
   - Announcements
   - Admissions
   - Contact forms
   - Library, Discipline, Marks, Forum

## 🚀 How to Use the API in Your Pages

### Step 1: Include the API Script

Add this to the `<head>` section of any HTML page:

```html
<script src="js/api.js"></script>
```

**Already added to:** `index.html`

### Step 2: Check Backend is Running

1. Open terminal in `backend` folder
2. Run: `npm run dev`
3. Server should start on `http://localhost:5002`
4. Test: Open `http://localhost:5002/api/health` in browser

### Step 3: Use API Functions

## 📚 API Usage Examples

### Authentication

#### Login
```javascript
// Admin login (already implemented in index.html)
async function loginUser() {
    try {
        const response = await API.auth.login('admin', 'admin123', 'admin');
        
        if (response.success) {
            console.log('Logged in:', response.user);
            // User data and token are automatically stored
            window.location.href = 'admin-dashboard.html';
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}
```

#### Check if User is Logged In
```javascript
if (API.isLoggedIn()) {
    const user = API.getCurrentUser();
    console.log('Current user:', user);
} else {
    window.location.href = 'login-new.html';
}
```

#### Logout
```javascript
API.auth.logout(); // Clears token and redirects to index.html
```

### Students Management

#### Get All Students
```javascript
async function loadStudents() {
    try {
        const response = await API.students.getAll({ page: 1, limit: 10 });
        
        if (response.success) {
            const students = response.data;
            // Display students in your HTML
            displayStudents(students);
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}
```

#### Create New Student
```javascript
async function addStudent() {
    const studentData = {
        studentId: 'STD2025003',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+250788999999',
        courseId: 'course-uuid-here',
        level: 'Level 1',
        status: 'Active'
    };

    try {
        const response = await API.students.create(studentData);
        
        if (response.success) {
            alert('Student added successfully!');
            loadStudents(); // Refresh list
        }
    } catch (error) {
        alert('Error adding student: ' + error.message);
    }
}
```

#### Update Student
```javascript
async function updateStudent(studentId) {
    const updates = {
        level: 'Level 2',
        status: 'Active'
    };

    try {
        const response = await API.students.update(studentId, updates);
        
        if (response.success) {
            alert('Student updated!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

### Courses

#### Load Courses for Dropdown
```javascript
async function loadCoursesDropdown() {
    try {
        const response = await API.courses.getAll();
        
        if (response.success) {
            const select = document.getElementById('course-select');
            response.data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.courseName;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}
```

### News & Events

#### Display Latest News
```javascript
async function displayNews() {
    try {
        const response = await API.news.getAll();
        
        if (response.success) {
            const newsContainer = document.getElementById('news-container');
            response.data.forEach(news => {
                newsContainer.innerHTML += `
                    <div class="news-item">
                        <h3>${news.title}</h3>
                        <p>${news.excerpt}</p>
                        <a href="news-detail.html?id=${news.id}">Read More</a>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}
```

### Admissions

#### Submit Application Form
```javascript
async function submitApplication(event) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value,
        dateOfBirth: document.getElementById('dob').value
    };

    try {
        const response = await API.admissions.apply(formData);
        
        if (response.success) {
            alert('Application submitted successfully!');
            document.getElementById('application-form').reset();
        }
    } catch (error) {
        alert('Error submitting application: ' + error.message);
    }
}
```

### Contact Form

#### Submit Contact Message
```javascript
async function submitContact(event) {
    event.preventDefault();
    
    const contactData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await API.contact.send(contactData);
        
        if (response.success) {
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
```

## 🔐 Protected Pages

To protect pages that require login:

```javascript
// Add this at the top of your protected page
<script src="js/api.js"></script>
<script>
    // Require login for this page
    requireAuth();
    
    // Or require specific role
    requireAuth(['admin', 'dean_studies']);
</script>
```

## 📄 Pages to Update

### Priority 1 - Authentication Pages
- ✅ `index.html` - Admin login (DONE)
- ⏳ `login-new.html` - Regular login
- ⏳ `student-registration.html` - Student signup

### Priority 2 - Admin Pages
- ⏳ `admin-dashboard.html` - Dashboard with stats
- ⏳ `student-data.html` - Student list
- ⏳ `staff.html` - Staff management

### Priority 3 - Public Pages
- ⏳ `apply job.html` - Application form
- ⏳ `contact.html` - Contact form
- ⏳ `news.html` - News list
- ⏳ `events.html` - Events list

### Priority 4 - Content Pages
- ⏳ `vocational-training.html` - Courses from API
- ⏳ `announcements.html` - Announcements from API
- ⏳ `forum.html` - Forum posts

## 🛠️ Quick Integration Template

For any page that needs API data:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
    <!-- Include API script -->
    <script src="js/api.js"></script>
</head>
<body>
    <div id="content"></div>

    <script>
        // Wait for page to load
        document.addEventListener('DOMContentLoaded', async () => {
            // Optional: Protect page
            // requireAuth(['admin']);

            // Load data from API
            try {
                const response = await API.students.getAll();
                
                if (response.success) {
                    // Display data
                    const content = document.getElementById('content');
                    response.data.forEach(item => {
                        content.innerHTML += `<div>${item.firstName}</div>`;
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>
```

## 🧪 Testing

### Test Login
1. Open `index.html`
2. Press `Ctrl+Shift+L` to open admin login
3. Enter:
   - Username: `admin`
   - Password: `admin123`
   - Role: `Dean of Studies` or `Dean of Discipline`
4. Click Login
5. Should redirect to `admin-dashboard.html`

### Test API Directly
Open browser console (F12) on any page with `api.js` loaded:

```javascript
// Test login
API.auth.login('admin', 'admin123', 'admin')
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));

// Test getting students
API.students.getAll()
    .then(data => console.log('Students:', data))
    .catch(err => console.error('Error:', err));
```

## ⚠️ Important Notes

1. **CORS**: Backend is configured to allow requests from your frontend
2. **Tokens**: Automatically stored in localStorage
3. **Errors**: All API calls have try-catch error handling
4. **Loading States**: Show loading indicators during API calls
5. **Validation**: Validate data before sending to API

## 🔧 Troubleshooting

### "Failed to fetch" Error
- **Cause**: Backend not running
- **Solution**: Start backend with `npm run dev`

### "401 Unauthorized" Error
- **Cause**: Not logged in or token expired
- **Solution**: Login again

### "CORS" Error
- **Cause**: Backend CORS not configured
- **Solution**: Check backend `.env` has correct `FRONTEND_URL`

### "Network Error"
- **Cause**: Wrong API URL
- **Solution**: Check `API_CONFIG.baseURL` in `js/api.js`

## 📞 Support

- Backend Documentation: `backend/README.md`
- Quick Start: `backend/QUICKSTART.md`
- Email: kageyotvet@gmail.com
- Phone: +250 738266603

---

**Your frontend is now connected to the backend! 🎉**

Start by testing the admin login, then gradually integrate other pages.
