DATA.faculty = [
  { id: 'tobias', name: 'Tobias, Sherilyn P.' },
  { id: 'patricio', name: 'Patricio Jr., Fidel G.' },
  { id: 'tyis', name: 'TY-IS' },
  { id: 'cacal', name: 'Cacal, Sharwin V.' },
  { id: 'bacani', name: 'Bacani, Jaylord V.' },
  { id: 'gabayan', name: 'Gabayan Jr., Von P.' }
];
DATA.subjects.forEach(s => {
  const f = DATA.faculty.find(x => x.name === s.instructor);
  s.facultyId = f ? f.id : null;
});
