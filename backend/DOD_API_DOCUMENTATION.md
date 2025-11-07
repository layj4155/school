# DOD (Director of Discipline) API Documentation

## Base URL
`http://localhost:5002/api/dod`

---

## Fault Management

### 1. Create Fault
**POST** `/faults`

**Request Body:**
```json
{
  "name": "Late to class",
  "pointsToDeduct": 5,
  "description": "Student arrived late to class without valid reason"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Late to class",
    "pointsToDeduct": 5,
    "description": "Student arrived late to class without valid reason",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Faults
**GET** `/faults`

### 3. Get Single Fault
**GET** `/faults/:id`

### 4. Update Fault
**PUT** `/faults/:id`

**Request Body:**
```json
{
  "name": "Late to class",
  "pointsToDeduct": 3
}
```

### 5. Delete Fault
**DELETE** `/faults/:id`

---

## Reduce Conduct Marks

### 1. Deduct from Individual Students
**POST** `/deduct/students`

**Request Body:**
```json
{
  "studentIds": ["student_id_1", "student_id_2", "student_id_3"],
  "faultId": "fault_object_id",
  "comment": "Students were fighting during break time",
  "term": "Term 1",
  "academicYear": "2024-2025"
}
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "student": "...",
      "fault": "...",
      "pointsDeducted": 5,
      "comment": "Students were fighting during break time",
      "deductionType": "Individual",
      "term": "Term 1",
      "academicYear": "2024-2025"
    }
  ]
}
```

### 2. Deduct from Entire Class
**POST** `/deduct/class`

**Request Body:**
```json
{
  "classId": "class_object_id",
  "faultId": "fault_object_id",
  "comment": "Class was very noisy during assembly",
  "term": "Term 1",
  "academicYear": "2024-2025"
}
```

**Response:**
```json
{
  "success": true,
  "count": 35,
  "message": "Deducted 5 points from 35 students in class S3A",
  "data": [...]
}
```

---

## Conduct Management

### 1. Get All Conducts
**GET** `/conducts?term=Term 1&academicYear=2024-2025&status=Critical`

**Query Parameters:**
- `term`: Term 1, Term 2, or Term 3
- `academicYear`: e.g., 2024-2025
- `status`: Good, Warning, or Critical

**Response:**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "_id": "...",
      "student": {
        "firstName": "John",
        "lastName": "Doe",
        "studentID": "2025OLC001"
      },
      "term": "Term 1",
      "academicYear": "2024-2025",
      "totalPoints": 40,
      "remainingPoints": 32,
      "deductionsCount": 2,
      "status": "Good"
    }
  ]
}
```

### 2. Get Student Conduct
**GET** `/conducts/student/:studentId?term=Term 1&academicYear=2024-2025`

### 3. Get Class Conducts
**GET** `/conducts/class/:classId?term=Term 1&academicYear=2024-2025`

### 4. Get Low Conduct Alerts
**GET** `/conducts/alerts?term=Term 1&academicYear=2024-2025`

Returns all students with remaining points less than 20, including parent information.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "student": {
        "firstName": "Jane",
        "lastName": "Smith",
        "studentID": "2025OLC045",
        "parentName": "Mary Smith",
        "parentPhone": "0788123456",
        "parentEmail": "mary@example.com",
        "relationship": "Mother",
        "class": {
          "classID": "S2A",
          "name": "Senior 2 A"
        }
      },
      "term": "Term 1",
      "academicYear": "2024-2025",
      "totalPoints": 40,
      "remainingPoints": 15,
      "deductionsCount": 5,
      "status": "Critical"
    }
  ]
}
```

### 5. Get Conduct Statistics
**GET** `/conducts/statistics?term=Term 1&academicYear=2024-2025`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 450,
    "statusCounts": [
      { "_id": "Good", "count": 380 },
      { "_id": "Warning", "count": 50 },
      { "_id": "Critical", "count": 20 }
    ],
    "topFaults": [
      {
        "_id": {
          "name": "Late to class",
          "pointsToDeduct": 5
        },
        "count": 125,
        "totalPointsDeducted": 625
      }
    ],
    "average": {
      "avgRemainingPoints": 35.5,
      "avgDeductions": 1.2
    }
  }
}
```

---

## Publish Reports

### 1. Publish Discipline Report
**POST** `/publish`

**Request Body:**
```json
{
  "term": "Term 1",
  "academicYear": "2024-2025",
  "studentIds": ["student_id_1", "student_id_2"]
}
```

If `studentIds` is omitted, reports will be published for all students in the term.

**Response:**
```json
{
  "success": true,
  "message": "Published discipline reports for 2 students",
  "count": 2,
  "data": [
    {
      "student": {...},
      "summary": {
        "term": "Term 1",
        "totalReductions": 3,
        "conductScore": 32,
        "publishedTo": ["Student", "Parent", "DOS", "SM"]
      },
      "deductions": [...]
    }
  ]
}
```

### 2. Get Published Reports
**GET** `/published?term=Term 1&studentId=student_id`

### 3. Get Student Discipline Report
**GET** `/report/student/:studentId?term=Term 1&academicYear=2024-2025`

**Response:**
```json
{
  "success": true,
  "data": {
    "conduct": {
      "totalPoints": 40,
      "remainingPoints": 28,
      "deductionsCount": 3,
      "status": "Good"
    },
    "deductions": [
      {
        "fault": {
          "name": "Late to class",
          "pointsToDeduct": 5
        },
        "comment": "Arrived 15 minutes late",
        "createdAt": "2025-01-10T08:00:00.000Z"
      }
    ],
    "summary": {
      "totalPoints": 40,
      "remainingPoints": 28,
      "totalDeductions": 3,
      "pointsLost": 12,
      "status": "Good"
    }
  }
}
```

---

## View All Students

### Get All Students
**GET** `/students`

Returns all registered students for selection when deducting conduct marks.

---

## Conduct Point System

### Point Allocation
- Each student starts with **40 points** per term
- Points are deducted based on faults committed
- Points reset to 40 at the start of each new term

### Status Levels
- **Good**: 30-40 points remaining
- **Warning**: 20-29 points remaining
- **Critical**: Below 20 points (triggers Low Conduct Alert)

### Deduction Types
1. **Individual**: Deduct from selected students
2. **Class**: Deduct from all students in a class

---

## Notes

1. **Auto-Initialize**: Student conduct records are automatically created when first deduction is made
2. **Parent Alerts**: Students with less than 20 points appear in Low Conduct Alerts with full parent contact info
3. **Statistics**: Track most common faults and student behavior patterns
4. **Publishing**: Reports sent to Student, Parent, DOS, and SM accounts
