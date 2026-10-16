const user = Session.require('admin');
document.getElementById('name').textContent = 'Welcome, ' + user.name;
document.getElementById('logout').onclick = () => Session.logout();

function build() {
  const rows = [];
  DATA.students.forEach(stu => {
    DATA.subjects.forEach(sub => {
      const rec = DATA.records[stu.id][sub.code];
      rows.push({
        stu, sub, rec,
        p: Compute.standing(sub, rec),
        st: Compute.status(sub, rec),
        defs: Compute.deficiencies(sub, rec)
      });
    });
  });
  return rows;
}

const rows = build();
const count = k => rows.filter(r => r.st.key === k).length;

document.getElementById('summary').innerHTML =
  '<div class="box"><strong>' + DATA.students.length + '</strong><span>Students</span></div>' +
  '<div class="box"><strong>' + DATA.subjects.length + '</strong><span>Subjects</span></div>' +
  '<div class="box"><strong>' + count('green') + '</strong><span>✔ On Track</span></div>' +
  '<div class="box"><strong>' + count('amber') + '</strong><span>! At Risk</span></div>' +
  '<div class="box"><strong>' + count('red') + '</strong><span>✖ Critical</span></div>';

let t = '<tr><th>Subject</th><th>Instructor</th><th>✔</th><th>!</th><th>✖</th></tr>';
DATA.subjects.forEach(sub => {
  const mine = rows.filter(r => r.sub.code === sub.code);
  const c = k => mine.filter(r => r.st.key === k).length;
  t += '<tr><td>' + sub.code + '<br><small>' + sub.name + '</small></td><td>' + sub.instructor +
       '</td><td>' + c('green') + '</td><td>' + c('amber') + '</td><td>' + c('red') + '</td></tr>';
});
document.getElementById('subjects').innerHTML = t;

const order = { red: 0, amber: 1 };
const need = rows.filter(r => r.st.key !== 'green').sort((a, b) => order[a.st.key] - order[b.st.key]);
document.getElementById('attention').innerHTML = need.length
  ? need.map(r =>
      '<div class="item"><div class="row"><strong>' + r.stu.name + '</strong>' +
      '<span class="badge ' + r.st.key + '">' + r.st.icon + ' ' + r.st.label + '</span></div>' +
      '<small>' + r.sub.code + ' - ' + r.sub.name + ' | ' + r.p + '%</small>' +
      '<small>' + (r.defs.length ? r.defs.join('; ') : 'No deficiencies') + '</small></div>'
    ).join('')
  : '<p>No students need attention.</p>';

document.getElementById('export').onclick = () => {
  if (typeof XLSX === 'undefined') {
    alert('The Excel library did not load. Please check your internet connection.');
    return;
  }
  const data = rows.map(r => ({
    'Student ID': r.stu.id,
    'Name': r.stu.name,
    'Subject Code': r.sub.code,
    'Subject': r.sub.name,
    'Instructor': r.sub.instructor,
    'Standing (%)': r.p,
    'Est. Grade': Compute.grade(r.p),
    'Status': r.st.label,
    'Absences': r.rec.absences,
    'Deficiencies': r.defs.join('; ')
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 12 }, { wch: 24 }, { wch: 12 }, { wch: 40 }, { wch: 22 },
    { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 50 }
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PassTrack Report');
  XLSX.writeFile(wb, 'PassTrack_Report.xlsx');
};
