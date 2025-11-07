# DOS (Director of Studies) API Documentation

## Base URL
`http://localhost:5002/api/dos`

---

## Class Management

### 1. Create Class
**POST** `/classes`

**Request Body:**
```json
{
  "name": "Senior 1 A",
  "level": "O-Level",
  "trade": "None",
  "grade": "S1",
  "section": "A"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "classID": "S1A",
    "name": "Senior 1 A",
    "level": "O-Level",
    "trade": "None",
    "grade": "S1",
    "section": "A"
  }
}
```

### 2. Get All Classes
**GET** `/classes`

### 3. Get Single Class
**GET** `/classes/:id`

### 4. Update Class
**PUT** `/classes/:id`

### 5. Delete Class
**DELETE** `/classes/:id`

### 6. Assign Class Teacher
**PUT** `/classes/:id/assign-teacher`

**Request Body:**
```json
{
  "teacherId": "teacher_object_id"
}
```

### 7. Assign Student to Class
**PUT** `/classes/:id/assign-student`

**Request Body:**
```json
{
  "studentId": "student_object_id"
}
```

---

## Student Management

### 1. Register Student
**POST** `/students`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "2008-05-15",
  "classId": "class_object_id",
  "parentName": "Jane Doe",
  "parentPhone": "0788123456",
  "relationship": "Mother",
  "parentEmail": "jane@example.com",
  "address": {
    "province": "Kigali City",
    "district": "Gasabo",
    "sector": "Remera",
    "cell": "Rukiri I",
    "village": "Agatare"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "studentID": "2025OLC001",
    "firstName": "John",
    "lastName": "Doe",
    "age": 17,
    ...
  }
}
```

### 2. Get All Students
**GET** `/students`

### 3. Get Single Student
**GET** `/students/:id`

### 4. Update Student
**PUT** `/students/:id`

### 5. Delete Student
**DELETE** `/students/:id`

### 6. Get Students by Class
**GET** `/students/class/:classId`

---

## Marks Management

### 1. Add Marks
**POST** `/marks`

**Request Body:**
```json
{
  "classId": "class_object_id",
  "assessmentType": "Midterm Exam",
  "term": "Term 1",
  "academicYear": "2024-2025",
  "marks": [
    {
      "studentId": "student_object_id",
      "subject": "Mathematics",
      "score": 85
    },
    {
      "studentId": "student_object_id_2",
      "subject": "Mathematics",
      "score": 78
    }
  ]
}
```

**Assessment Types:**
- Midterm Exam
- Formative Assessment
- End of Unity
- Summative Exam
- Integrated Assessment
- Final Exam

### 2. Update Mark
**PUT** `/marks/:id`

### 3. Delete Mark
**DELETE** `/marks/:id`

### 4. Publish Marks
**POST** `/marks/publish`

**Request Body:**
```json
{
  "classId": "class_object_id",
  "assessmentType": "Midterm Exam",
  "term": "Term 1",
  "academicYear": "2024-2025"
}
```

### 5. Get Marks by Class
**GET** `/marks/class/:classId?assessmentType=Midterm Exam&term=Term 1&academicYear=2024-2025`

### 6. Get Student Marks
**GET** `/marks/student/:studentId?term=Term 1&academicYear=2024-2025&published=true`

---

## Performance Analysis

### 1. Get Class Performance
**GET** `/performance/class/:classId?term=Term 1&academicYear=2024-2025&assessmentType=Midterm Exam`

**Response:**
```json
{
  "success": true,
  "data": {
    "class": {...},
    "bestPerformer": {
      "student": {...},
      "average": 92.5,
      "category": "90-100%"
    },
    "performanceData": [...],
    "categoryCounts": {
      "Below 50%": 2,
      "50-59%": 5,
      "60-69%": 8,
      "70-79%": 10,
      "80-89%": 7,
      "90-100%": 3
    },
    "totalStudents": 35
  }
}
```

### 2. Get School Performance
**GET** `/performance/school?term=Term 1&academicYear=2024-2025&assessmentType=Midterm Exam`

### 3. Publish Best Performers to News
**POST** `/performance/publish-best`

**Request Body:**
```json
{
  "term": "Term 1",
  "academicYear": "2024-2025",
  "assessmentType": "Midterm Exam"
}
```

This will create a news article featuring all students who scored 84% or above.

---

## Location Utility

### 1. Get All Provinces
**GET** `/api/locations/provinces`

### 2. Get Districts by Province
**GET** `/api/locations/districts/Kigali City`

### 3. Get All Locations
**GET** `/api/locations/all`

---

## Notes

1. **Student ID Generation:**
   - O-Level: `{year}OLC{number}` (e.g., 2025OLC001)
   - A-Level SOD: `{year}SOD{number}` (e.g., 2025SOD001)
   - A-Level ACC: `{year}ACC{number}` (e.g., 2025ACC001)

2. **Performance Categories:**
   - For SOD/ACC students: Below 70% = Failed
   - For O-Level: Below 50% = Below 50%
   - Best performers (84%+) are published to news

3. **Class ID Format:**
   - O-Level: `S1A`, `S2B`, `S3A`
   - A-Level: `L3 SOD A`, `S5 ACC B`, etc.
