const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Class = require('../models/Class');
const News = require('../models/News');

const calculateAverage = (marks) => {
    if (marks.length === 0) return 0;
    const sum = marks.reduce((acc, mark) => acc + mark.marks, 0);
    return sum / marks.length;
};

const categorizePerformance = (average, level, trade) => {
    if (level === 'A-Level' && (trade === 'SOD' || trade === 'ACC')) {
        if (average < 70) return 'Failed';
        if (average >= 70 && average < 80) return '70-79%';
        if (average >= 80 && average < 90) return '80-89%';
        if (average >= 90) return '90-100%';
    } else {
        if (average < 50) return 'Below 50%';
        if (average >= 50 && average < 60) return '50-59%';
        if (average >= 60 && average < 70) return '60-69%';
        if (average >= 70 && average < 80) return '70-79%';
        if (average >= 80 && average < 90) return '80-89%';
        if (average >= 90) return '90-100%';
    }
};

exports.getClassPerformance = async (req, res) => {
    try {
        const { classId } = req.params;
        const { term, academicYear, assessmentType } = req.query;

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        const query = {
            class: classId,
            published: true
        };
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;
        if (assessmentType) query.assessmentType = assessmentType;

        const marks = await Mark.find(query).populate('student', 'firstName lastName studentID');

        const studentPerformance = {};
        marks.forEach(mark => {
            const studentId = mark.student._id.toString();
            if (!studentPerformance[studentId]) {
                studentPerformance[studentId] = {
                    student: mark.student,
                    marks: []
                };
            }
            studentPerformance[studentId].marks.push(mark);
        });

        const performanceData = Object.values(studentPerformance).map(sp => {
            const average = calculateAverage(sp.marks);
            return {
                student: sp.student,
                average: Math.round(average * 100) / 100,
                category: categorizePerformance(average, classData.level, classData.trade),
                totalMarks: sp.marks.length
            };
        });

        performanceData.sort((a, b) => b.average - a.average);

        const bestPerformer = performanceData.length > 0 ? performanceData[0] : null;

        const categoryCounts = {
            'Below 50%': 0,
            '50-59%': 0,
            '60-69%': 0,
            '70-79%': 0,
            '80-89%': 0,
            '90-100%': 0,
            'Failed': 0
        };

        performanceData.forEach(pd => {
            if (categoryCounts.hasOwnProperty(pd.category)) {
                categoryCounts[pd.category]++;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                class: classData,
                bestPerformer,
                performanceData,
                categoryCounts,
                totalStudents: performanceData.length
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getSchoolPerformance = async (req, res) => {
    try {
        const { term, academicYear, assessmentType } = req.query;

        const query = { published: true };
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;
        if (assessmentType) query.assessmentType = assessmentType;

        const marks = await Mark.find(query)
            .populate('student', 'firstName lastName studentID')
            .populate('class', 'classID name level trade');

        const studentPerformance = {};
        marks.forEach(mark => {
            const studentId = mark.student._id.toString();
            if (!studentPerformance[studentId]) {
                studentPerformance[studentId] = {
                    student: mark.student,
                    class: mark.class,
                    marks: []
                };
            }
            studentPerformance[studentId].marks.push(mark);
        });

        const performanceData = Object.values(studentPerformance).map(sp => {
            const average = calculateAverage(sp.marks);
            return {
                student: sp.student,
                class: sp.class,
                average: Math.round(average * 100) / 100,
                category: categorizePerformance(average, sp.class.level, sp.class.trade),
                totalMarks: sp.marks.length
            };
        });

        performanceData.sort((a, b) => b.average - a.average);

        const categoryCounts = {
            'Below 50%': 0,
            '50-59%': 0,
            '60-69%': 0,
            '70-79%': 0,
            '80-89%': 0,
            '90-100%': 0,
            'Failed': 0
        };

        performanceData.forEach(pd => {
            if (categoryCounts.hasOwnProperty(pd.category)) {
                categoryCounts[pd.category]++;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                performanceData,
                categoryCounts,
                totalStudents: performanceData.length
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.publishBestPerformers = async (req, res) => {
    try {
        const { term, academicYear, assessmentType } = req.body;

        const query = {
            published: true,
            term,
            academicYear
        };
        if (assessmentType) query.assessmentType = assessmentType;

        const marks = await Mark.find(query)
            .populate('student', 'firstName lastName studentID')
            .populate('class', 'classID name');

        const studentPerformance = {};
        marks.forEach(mark => {
            const studentId = mark.student._id.toString();
            if (!studentPerformance[studentId]) {
                studentPerformance[studentId] = {
                    student: mark.student,
                    class: mark.class,
                    marks: []
                };
            }
            studentPerformance[studentId].marks.push(mark);
        });

        const bestPerformers = Object.values(studentPerformance)
            .map(sp => {
                const average = calculateAverage(sp.marks);
                return {
                    student: sp.student,
                    class: sp.class,
                    average: Math.round(average * 100) / 100
                };
            })
            .filter(p => p.average >= 84)
            .sort((a, b) => b.average - a.average);

        const newsTitle = `Best Performers - ${assessmentType || term} ${academicYear}`;
        const newsContent = bestPerformers.map((p, index) => 
            `${index + 1}. ${p.student.firstName} ${p.student.lastName} (${p.class.classID}) - ${p.average}%`
        ).join('\n');

        const news = await News.create({
            title: newsTitle,
            content: newsContent,
            type: 'Performance',
            published: true,
            publishedAt: new Date()
        });

        res.status(201).json({
            success: true,
            data: {
                news,
                bestPerformers
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
