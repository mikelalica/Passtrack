const user = Session.require('faculty');
const fac = DATA.faculty.find(f => f.id === user.name);
if (!fac) Session.logout();

const mySubjects = DATA.subjects.filter(s => s.facultyId === fac.id);

document.getElementById('name').textContent = 'Welcome, ' + fac.name;
document.getElementById('logout').onclick = () => Session.logout();

const select = document.getElementById('subject');
const meta = document.getElementById('meta');
const box = document.getElementById('students');
const msg = document.getElementById('msg');
const fileInput = document.getElementById('file');

const FIELDS = [
  ['quizzes', 'Quizzes'], ['activities', 'Activities'],
  ['exams', 'Exams'], ['attendance', 'Attendance']
];
const COLS = ['Student ID', 'Quizzes', 'Activities', 'Exams', 'Attendance', 'Absences', 'Missing Requirements'];

function esc(t) { return String(t).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

mySubjects.forEach(s => {
  const o = document.createElement('option');
  o.value = s.code;
  o.textContent = s.code + ' - ' + s.name;
  select.appendChild(o);
});

function current() { return mySubjects.find(s => s.code === select.value); }

function refresh(id) {
  const sub = current();
  const rec = DATA.records[id][sub.code];
  const st = Compute.status(sub, rec);
  const p = Compute.standing(sub, rec);
  const badge = document.getElementById('b-' + id);
  badge.className = 'badge ' + st.key;
  badge.textContent = st.icon + ' ' + st.label;
  const defs = Compute.deficiencies(sub, rec);
  document.getElementById('s-' + id).textContent =
    'Standing: ' + p + '% | Est. grade: ' + Compute.grade(p) +
    (defs.length ? ' | ' + defs.join('; ') : ' | No deficiencies');
}

function render() {
  const sub = current();
  meta.textContent = sub.instructor + ' | ' +
    sub.schedule.map(x => x.time + ' (' + x.room + ')').join(' | ');
  box.innerHTML = '';
  DATA.students.forEach(stu => {
    const rec = DATA.records[stu.id][sub.code];
    let html = '<div class="row"><strong>' + stu.name + '</strong><span class="badge" id="b-' + stu.id + '"></span></div>' +
      '<small>' + stu.id + '</small><div class="grid">';
    FIELDS.forEach(([k, label]) => {
      html += '<label>' + label + ' (%)<input type="number" min="0" max="100" data-id="' + stu.id +
        '" data-k="' + k + '" value="' + rec.scores[k] + '"></label>';
    });
    html += '<label>Absences<input type="number" min="0" data-id="' + stu.id +
      '" data-k="absences" value="' + rec.absences + '"></label></div>' +
      '<label>Missing requirements (comma-separated)<input type="text" data-id="' + stu.id +
      '" data-k="missing" value="' + esc(rec.missing.join(', ')) + '"></label>' +
      '<p class="muted" id="s-' + stu.id + '"></p>';
    const card = document.createElement('div');
    card.className = 'stu';
    card.innerHTML = html;
    box.appendChild(card);
    refresh(stu.id);
  });
}

box.addEventListener('input', (e) => {
  const id = e.target.dataset.id, k = e.target.dataset.k;
  if (!id) return;
  const rec = DATA.records[id][current().code];
  const v = e.target.value;
  if (k === 'missing') {
    rec.missing = v.split(',').map(x => x.trim()).filter(Boolean);
  } else if (k === 'absences') {
    rec.absences = Math.max(0, Number(v) || 0);
  } else {
    rec.scores[k] = Math.min(100, Math.max(0, Number(v) || 0));
  }
  msg.textContent = 'Unsaved changes.';
  refresh(id);
});

select.addEventListener('change', () => { msg.textContent = ''; render(); });

/* ---------- Excel template (only the selected subject of this faculty) ---------- */
document.getElementById('template').onclick = () => {
  if (typeof XLSX === 'undefined') {
    alert('The Excel library did not load. Please check your internet connection.');
    return;
  }
  const sub = current();
  const data = DATA.students.map(stu => {
    const rec = DATA.records[stu.id][sub.code];
    return {
      'Student ID': stu.id,
      'Quizzes': rec.scores.quizzes,
      'Activities': rec.scores.activities,
      'Exams': rec.scores.exams,
      'Attendance': rec.scores.attendance,
      'Absences': rec.absences,
      'Missing Requirements': rec.missing.join(', ')
    };
  });
  const ws = XLSX.utils.json_to_sheet(data, { header: COLS });
  ws['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 11 }, { wch: 8 }, { wch: 11 }, { wch: 10 }, { wch: 36 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Class Record');
  XLSX.writeFile(wb, 'PassTrack_' + sub.code.replace(/\s+/g, '_') + '_Template.xlsx');
};

/* ---------- Excel upload (only for the selected subject of this faculty) ---------- */
document.getElementById('upload').onclick = () => {
  if (typeof XLSX === 'undefined') {
    alert('The Excel library did not load. Please check your internet connection.');
    return;
  }
  fileInput.click();
};

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      importRows(rows);
    } catch (err) {
      msg.textContent = 'Could not read the file. Please use the downloaded template.';
    }
    fileInput.value = '';
  };
  reader.readAsArrayBuffer(file);
});

function importRows(rows) {
  const sub = current();
  let updated = 0, skipped = 0, invalid = 0;
  rows.forEach(raw => {
    const r = {};
    Object.keys(raw).forEach(k => { r[k.trim().toLowerCase()] = raw[k]; });
    const id = String(r['student id'] || '').trim();
    if (!DATA.records[id]) { skipped++; return; }
    const rec = DATA.records[id][sub.code];
    FIELDS.forEach(([k, label]) => {
      const key = label.toLowerCase();
      if (r[key] === undefined || r[key] === '') return;
      const v = Number(r[key]);
      if (isFinite(v) && v >= 0 && v <= 100) rec.scores[k] = v; else invalid++;
    });
    if (r['absences'] !== undefined && r['absences'] !== '') {
      const a = Number(r['absences']);
      if (isFinite(a) && a >= 0) rec.absences = a; else invalid++;
    }
    if (r['missing requirements'] !== undefined) {
      rec.missing = String(r['missing requirements']).split(',').map(x => x.trim()).filter(Boolean);
    }
    updated++;
  });
  render();
  msg.textContent = 'Imported ' + updated + ' student(s) for ' + sub.code +
    (skipped ? ', skipped ' + skipped + ' unknown ID(s)' : '') +
    (invalid ? ', ignored ' + invalid + ' invalid value(s)' : '') +
    '. Press "Save changes" to keep them.';
}

document.getElementById('save').onclick = () => {
  Store.save();
  msg.textContent = 'Saved. The students will see the updated status.';
};
document.getElementById('reset').onclick = () => {
  if (confirm('Reset all scores to the original demo data?')) Store.reset();
};

render();
