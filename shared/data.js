const DATA = {
  students: [
    { id: '2023-0001', name: 'Juan Dela Cruz', section: 'BSIT 3-A' },
    { id: '2023-0002', name: 'Maria Santos', section: 'BSIT 3-A' },
    { id: '2023-0003', name: 'Pedro Reyes', section: 'BSIT 3-A' }
  ],
  subjects: [
    { code: 'IT 301', name: 'Systems Administration', instructor: 'Prof. Garcia', maxAbsences: 6,
      components: [
        { key: 'quizzes', label: 'Quizzes', weight: 30 },
        { key: 'activities', label: 'Activities', weight: 20 },
        { key: 'exams', label: 'Exams', weight: 40 },
        { key: 'attendance', label: 'Attendance', weight: 10 }
      ] },
    { code: 'IT 302', name: 'Network Security', instructor: 'Prof. Ramos', maxAbsences: 6,
      components: [
        { key: 'quizzes', label: 'Quizzes', weight: 30 },
        { key: 'activities', label: 'Activities', weight: 20 },
        { key: 'exams', label: 'Exams', weight: 40 },
        { key: 'attendance', label: 'Attendance', weight: 10 }
      ] },
    { code: 'IT 303', name: 'Advanced Networking', instructor: 'Prof. Mendoza', maxAbsences: 6,
      components: [
        { key: 'quizzes', label: 'Quizzes', weight: 30 },
        { key: 'activities', label: 'Activities', weight: 20 },
        { key: 'exams', label: 'Exams', weight: 40 },
        { key: 'attendance', label: 'Attendance', weight: 10 }
      ] }
  ],
  records: {
    '2023-0001': {
      'IT 301': { scores: { quizzes: 92, activities: 88, exams: 90, attendance: 100 }, absences: 1, missing: [] },
      'IT 302': { scores: { quizzes: 78, activities: 70, exams: 76, attendance: 85 }, absences: 4, missing: ['Lab Activity 3'] },
      'IT 303': { scores: { quizzes: 60, activities: 65, exams: 58, attendance: 70 }, absences: 7, missing: ['Case Study', 'Lab Activity 2'] }
    },
    '2023-0002': {
      'IT 301': { scores: { quizzes: 88, activities: 85, exams: 84, attendance: 95 }, absences: 2, missing: [] },
      'IT 302': { scores: { quizzes: 90, activities: 92, exams: 88, attendance: 100 }, absences: 0, missing: [] },
      'IT 303': { scores: { quizzes: 82, activities: 80, exams: 79, attendance: 90 }, absences: 3, missing: [] }
    },
    '2023-0003': {
      'IT 301': { scores: { quizzes: 70, activities: 72, exams: 68, attendance: 75 }, absences: 5, missing: ['Activity 5'] },
      'IT 302': { scores: { quizzes: 85, activities: 80, exams: 82, attendance: 90 }, absences: 1, missing: [] },
      'IT 303': { scores: { quizzes: 74, activities: 76, exams: 70, attendance: 80 }, absences: 6, missing: ['Lab Activity 4'] }
    }
  }
};
