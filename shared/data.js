const COMP = [
  { key: 'quizzes', label: 'Quizzes', weight: 30 },
  { key: 'activities', label: 'Activities', weight: 20 },
  { key: 'exams', label: 'Exams', weight: 40 },
  { key: 'attendance', label: 'Attendance', weight: 10 }
];

const r = (q, a, e, att, abs, missing = []) => ({
  scores: { quizzes: q, activities: a, exams: e, attendance: att },
  absences: abs,
  missing: missing
});

const DATA = {
  students: [
    { id: '241-1055', name: 'Mike James Lalica', section: 'BSIT 3A' },
    { id: '241-1045', name: 'Alcris Joshua Pelmoka', section: 'BSIT 3A' },
    { id: '231-0371', name: 'Dixter Ballaso', section: 'BSIT 3A' }
  ],
  subjects: [
    { code: 'IT PEC 4', name: 'Systems Integration and Architecture', instructor: 'Tobias, Sherilyn P.', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'F 2-4 pm', room: 'ITE302' }, { time: 'M 1-2 pm', room: 'ITE102' }, { time: 'WF 1-2 pm', room: 'ITE302' }] },
    { code: 'ITT2_3', name: 'Network Design and Management', instructor: 'Patricio Jr., Fidel G.', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'Th 2-5 pm', room: 'ITE301' }, { time: 'TTh 1-2 pm', room: 'ITE301' }] },
    { code: 'ITT2_2', name: 'Networking Programming', instructor: 'TY-IS', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'T 3-6 pm', room: 'E-LAB' }, { time: 'Th 5-6 pm', room: 'E-LAB' }, { time: 'T 2-3 pm', room: 'E-LAB' }] },
    { code: 'IT PEC 3', name: 'Integrative Programming and Technologies 2', instructor: 'Cacal, Sharwin V.', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'W 7-10 am', room: 'E-LAB2' }, { time: 'WF 11 am-12 pm', room: 'GS203' }] },
    { code: 'ITT2_1', name: 'Ethical Hacking', instructor: 'Tobias, Sherilyn P.', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'WF 12-1 pm', room: 'CAS201' }, { time: 'Th 9 am-12 pm', room: 'GS201' }] },
    { code: 'IT PC 5', name: 'Quantitative Methods (Including Modeling & Simulation)', instructor: 'Bacani, Jaylord V.', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'T 7-10 am', room: 'ITE203' }, { time: 'W 2:30-4:30 pm', room: 'C305' }] },
    { code: 'IT PC 4', name: 'Software Engineering', instructor: 'Gabayan Jr., Von P.', maxAbsences: 6, components: COMP,
      schedule: [{ time: 'F 8-10 am', room: 'ITE202' }, { time: 'Th 8-9 am', room: 'CAS208' }] }
  ],
  records: {
    '241-1055': {
      'IT PEC 4': r(92, 88, 90, 100, 1),
      'ITT2_3': r(78, 70, 76, 85, 4, ['Lab Activity 3']),
      'ITT2_2': r(60, 65, 58, 70, 7, ['Case Study', 'Lab Activity 2']),
      'IT PEC 3': r(88, 90, 86, 95, 2),
      'ITT2_1': r(84, 80, 82, 90, 3),
      'IT PC 5': r(80, 78, 76, 90, 3),
      'IT PC 4': r(90, 92, 88, 100, 0)
    },
    '241-1045': {
      'IT PEC 4': r(88, 85, 84, 95, 2),
      'ITT2_3': r(90, 92, 88, 100, 0),
      'ITT2_2': r(82, 80, 79, 90, 3),
      'IT PEC 3': r(86, 84, 85, 92, 1),
      'ITT2_1': r(91, 89, 90, 95, 1),
      'IT PC 5': r(84, 82, 80, 90, 2),
      'IT PC 4': r(87, 85, 83, 95, 2)
    },
    '231-0371': {
      'IT PEC 4': r(70, 72, 68, 75, 5, ['Activity 5']),
      'ITT2_3': r(85, 80, 82, 90, 1),
      'ITT2_2': r(80, 78, 79, 85, 5),
      'IT PEC 3': r(76, 74, 78, 80, 4, ['Activity 3']),
      'ITT2_1': r(83, 81, 80, 90, 2),
      'IT PC 5': r(90, 88, 86, 95, 1),
      'IT PC 4': r(72, 70, 74, 80, 3)
    }
  }
};
