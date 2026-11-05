(function () {
  const KEY = 'passtrack_records';
  const ROSTER = 'passtrack_roster';

  const blank = () => ({
    scores: { quizzes: 0, activities: 0, exams: 0, attendance: 0 },
    absences: 0,
    missing: []
  });

  // Link each subject to its instructor's username
  function link() {
    DATA.subjects.forEach(s => {
      const f = DATA.faculty.find(x => x.name === s.instructor);
      s.facultyId = f ? f.id : null;
    });
  }

  // Make sure every student has a record for every subject
  function ensure() {
    DATA.students.forEach(st => {
      if (!DATA.records[st.id]) DATA.records[st.id] = {};
      DATA.subjects.forEach(sub => {
        if (!DATA.records[st.id][sub.code]) DATA.records[st.id][sub.code] = blank();
      });
    });
  }

  try {
    const roster = localStorage.getItem(ROSTER);
    if (roster) {
      const o = JSON.parse(roster);
      if (Array.isArray(o.students) && Array.isArray(o.faculty) && Array.isArray(o.subjects)) {
        DATA.students = o.students;
        DATA.faculty = o.faculty;
        DATA.subjects = o.subjects;
      }
    }
  } catch (e) {}

  try {
    const saved = localStorage.getItem(KEY);
    if (saved) DATA.records = JSON.parse(saved);
  } catch (e) {}

  link();
  ensure();

  window.Store = {
    blank, link, ensure,
    save() {
      localStorage.setItem(KEY, JSON.stringify(DATA.records));
      localStorage.setItem(ROSTER, JSON.stringify({
        students: DATA.students, faculty: DATA.faculty, subjects: DATA.subjects
      }));
    },
    reset() {
      localStorage.removeItem(KEY);
      localStorage.removeItem(ROSTER);
      location.reload();
    }
  };
})();
