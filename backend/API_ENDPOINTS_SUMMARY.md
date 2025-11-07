# Complete API Endpoints Summary

## Base URL
`http://localhost:5002`

---

## 🎓 DOS (Director of Studies) - `/api/dos`

### Class Management
- `POST /api/dos/classes` - Create class
- `GET /api/dos/classes` - Get all classes
- `GET /api/dos/classes/:id` - Get single class
- `PUT /api/dos/classes/:id` - Update class
- `DELETE /api/dos/classes/:id` - Delete class
- `PUT /api/dos/classes/:id/assign-teacher` - Assign class teacher
- `PUT /api/dos/classes/:id/assign-student` - Assign student to class

### Student Management
- `POST /api/dos/students` - Register student (auto-generates StudentID)
- `GET /api/dos/students` - Get all students
- `GET /api/dos/students/:id` - Get single student
- `PUT /api/dos/students/:id` - Update student
- `DELETE /api/dos/students/:id` - Delete student
- `GET /api/dos/students/class/:classId` - Get students by class

### Marks Management
- `POST /api/dos/marks` - Add marks for students
- `PUT /api/dos/marks/:id` - Update mark
- `DELETE /api/dos/marks/:id` - Delete mark
- `POST /api/dos/marks/publish` - Publish marks (make visible to students/parents)
- `GET /api/dos/marks/class/:classId` - Get marks by class
- `GET /api/dos/marks/student/:studentId` - Get student marks

### Performance Analysis
- `GET /api/dos/performance/class/:classId` - Get class performance analysis
- `GET /api/dos/performance/school` - Get school-wide performance
- `POST /api/dos/performance/publish-best` - Publish best performers to news (84%+)

---

## 👮 DOD (Director of Discipline) - `/api/dod`

### Fault Management
- `POST /api/dod/faults` - Create fault
- `GET /api/dod/faults` - Get all faults
- `GET /api/dod/faults/:id` - Get single fault
- `PUT /api/dod/faults/:id` - Update fault
- `DELETE /api/dod/faults/:id` - Delete fault

### Deduct Conduct Marks
- `POST /api/dod/deduct/students` - Deduct from individual students
- `POST /api/dod/deduct/class` - Deduct from entire class

### Conduct Management
- `GET /api/dod/conducts` - Get all conduct records
- `GET /api/dod/conducts/student/:studentId` - Get student conduct
- `GET /api/dod/conducts/class/:classId` - Get class conducts
- `GET /api/dod/conducts/alerts` - Get low conduct alerts (<20 points)
- `GET /api/dod/conducts/statistics` - Get conduct statistics

### Publish Reports
- `POST /api/dod/publish` - Publish discipline reports
- `GET /api/dod/published` - Get published reports
- `GET /api/dod/report/student/:studentId` - Get student discipline report

### Utilities
- `GET /api/dod/students` - Get all students for selection

---

## 🌍 Location Utility - `/api/locations`

- `GET /api/locations/provinces` - Get all provinces
- `GET /api/locations/districts/:province` - Get districts by province
- `GET /api/locations/all` - Get all location data

---

## 📝 Example Workflows

### DOS: Register Student & Add Marks
1. Create a class: `POST /api/dos/classes`
2. Register student: `POST /api/dos/students` (auto-generates ID like 2025OLC001)
3. Add marks: `POST /api/dos/marks`
4. Publish marks: `POST /api/dos/marks/publish`
5. View performance: `GET /api/dos/performance/class/:classId`

### DOD: Manage Discipline
1. Create fault: `POST /api/dod/faults` (e.g., "Late to class", 5 points)
2. Deduct from students: `POST /api/dod/deduct/students`
3. Check alerts: `GET /api/dod/conducts/alerts` (students with <20 points)
4. Publish report: `POST /api/dod/publish`

---

## 🔑 Key Features

### DOS Features
- ✅ Auto-generated Student IDs (2025OLC001, 2025SOD001, etc.)
- ✅ Rwanda location data integration
- ✅ Multiple assessment types
- ✅ Performance categories (50-59%, 60-69%, etc.)
- ✅ Auto-publish best performers to news (84%+)
- ✅ SOD/ACC students: <70% = Failed

### DOD Features
- ✅ 40 points per student per term
- ✅ Auto-status: Good (30-40), Warning (20-29), Critical (<20)
- ✅ Individual or class-wide deductions
- ✅ Parent contact info in alerts
- ✅ Fault statistics & behavior patterns
- ✅ Publish to Student, Parent, DOS, SM

---

## 🚀 Testing the APIs

You can test these endpoints using:
- **Postman** or **Insomnia** (REST clients)
- **Thunder Client** (VS Code extension)
- **cURL** commands

Example cURL:
```bash
# Create a class
curl -X POST http://localhost:5002/api/dos/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Senior 1 A","level":"O-Level","trade":"None","grade":"S1","section":"A"}'

# Get all faults
curl http://localhost:5002/api/dod/faults
```

---

## 📚 Full Documentation
- [DOS API Documentation](./DOS_API_DOCUMENTATION.md)
- [DOD API Documentation](./DOD_API_DOCUMENTATION.md)
