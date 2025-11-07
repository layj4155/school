# Role-Based Admin Dashboard Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL or MySQL database
- Git (optional)

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kageyo_tvet
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.3 Initialize Database
```bash
# Run the database initialization script
node scripts/initDatabase.js

# Seed sample data (subjects, modules, classes, users)
node scripts/seedData.js
```

### 1.4 Start Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend API will be available at: `http://localhost:5002`

## Step 2: Frontend Setup

### 2.1 Update API Configuration
Open `js/api.js` and ensure the baseURL points to your backend:
```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:5002/api',
    timeout: 10000
};
```

### 2.2 Open the Dashboard
Open `admin-dashboard.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Then navigate to: `http://localhost:8000/admin-dashboard.html`

## Step 3: Login with Sample Accounts

### Admin Account
- **Username:** admin
- **Password:** admin123
- **Access:** Full system access

### Dean of Studies
- **Username:** dean_studies
- **Password:** dean123
- **Access:** View all marks, publish marks, view statistics

### Dean of Discipline
- **Username:** dean_discipline
- **Password:** dean123
- **Access:** Manage discipline records

### Teacher Accounts
- **Username:** teacher1 / teacher2
- **Password:** teacher123
- **Access:** Enter marks for assigned classes only

## Step 4: Configure Teacher Assignments

After logging in as Admin or Dean of Studies:

1. Go to **Classes** section
2. Select a class
3. Click **Assign Teacher**
4. Select teacher and subject
5. Save assignment

Now the teacher can:
- View their assigned classes in "My Classes"
- Enter marks for students in those classes

## Features Overview

### For Teachers:
1. **My Classes** - View all assigned classes
2. **Enter Marks** - Add marks for students
   - Select class, subject, module (optional)
   - Choose assessment type (midterm1, midterm2, exam)
   - Select term (term1, term2, term3)
   - Enter marks for all students
   - Save in bulk

### For Dean of Studies:
1. **Publish Marks** - Review and publish entered marks
   - Filter by class, subject, assessment, term
   - Select marks to publish
   - Publish individually or in bulk
   
2. **Statistics** - View comprehensive analytics
   - Average scores
   - Pass rates
   - Grade distribution
   - Performance trends
   - Export reports

### For Dean of Discipline:
1. **Discipline Management**
   - Add discipline records
   - Track incidents
   - Manage severity levels
   - Monitor student behavior

### For Admin:
- All of the above features
- User management
- Subject and module management
- Class management
- System configuration

## Database Schema

### Key Tables:
- **users** - All system users with roles
- **students** - Student information
- **subjects** - Course subjects
- **modules** - Subject modules
- **classes** - Class information
- **teacher_classes** - Teacher-class-subject assignments
- **marks** - Student marks with publishing status

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Marks Management
- `GET /api/marks` - Get marks (filtered)
- `POST /api/marks` - Create/update mark
- `POST /api/marks/bulk` - Bulk create/update
- `PUT /api/marks/:id/publish` - Publish mark
- `PUT /api/marks/publish-bulk` - Bulk publish
- `GET /api/marks/statistics` - Get statistics

### Subjects & Modules
- `GET /api/subjects` - Get subjects
- `POST /api/subjects` - Create subject
- `GET /api/modules` - Get modules
- `POST /api/modules` - Create module

### Classes
- `GET /api/classes` - Get classes
- `POST /api/classes` - Create class
- `POST /api/classes/:id/assign-teacher` - Assign teacher

## Subjects & Modules Seeded

### Software Development (Advanced)
1. **Backend Application Development**
   - REST API Design
   - Database Integration
   - Authentication & Authorization
   - Deployment & DevOps

2. **Window Server Administration**
   - Active Directory
   - Group Policy Management
   - Server Roles & Features
   - PowerShell Scripting

3. **PHP Programming**
   - PHP Fundamentals
   - Object-Oriented PHP
   - Laravel Framework
   - Database Connectivity

4. **Networking**
   - Network Fundamentals
   - TCP/IP Protocol Suite
   - Routing & Switching
   - Network Security

5. **Database Development**
   - SQL Fundamentals
   - Database Design & Normalization
   - Stored Procedures & Triggers
   - Performance Tuning

### Accounting (Advanced)
1. Financial Accounting
2. Cost Accounting
3. Taxation
4. Auditing
5. Management Accounting

### Ordinary Level
1. Mathematics
2. English
3. Computer Literacy
4. Business Studies
5. Entrepreneurship

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `.env`
- Ensure PostgreSQL/MySQL is running
- Check database exists

### Authentication Errors
- Clear browser localStorage
- Verify JWT_SECRET is set
- Check token expiration

### Marks Not Saving
- Verify teacher is assigned to class
- Check assessment type and term are selected
- Ensure marks are between 0-100

### Statistics Not Loading
- Ensure marks are published
- Check filters are correctly set
- Verify user has dean_studies role

## Next Steps

1. **Customize Subjects** - Add your own subjects and modules
2. **Add Students** - Import or manually add students
3. **Assign Teachers** - Link teachers to their classes
4. **Enter Marks** - Teachers start entering marks
5. **Publish Results** - Dean of Studies publishes marks
6. **View Analytics** - Monitor performance

## Support

For issues or questions:
- Check the `ROLE_BASED_DASHBOARD_GUIDE.md` for detailed information
- Review API documentation
- Check browser console for errors
- Verify backend logs

## Security Notes

⚠️ **Important for Production:**
- Change all default passwords
- Use strong JWT_SECRET
- Enable HTTPS
- Set appropriate CORS origins
- Implement rate limiting
- Regular database backups
- Keep dependencies updated

## License

This system is developed for Kageyo TVET School.
