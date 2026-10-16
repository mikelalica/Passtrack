const user = Session.require('faculty');
document.getElementById('name').textContent = 'Welcome, ' + user.name;
document.getElementById('logout').onclick = () => Session.logout();

const select = document.getElementById('subject');
const meta = document.getElementById('meta');
const box = document.getElementById('students');
const msg = document.getElementById('msg');

const FIELDS = [
  ['quizzes', 'Quizzes'], ['activities', 'Activities'],
  ['exams', 'Exams'], ['attendance', 'Attendance']
];

function esc(t) { return String(t).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

DATA.subjects.forEach(s => {
  const o = document.createElement('option');
  o.value = s.code;
  o.textContent = s.code + ' - ' + s.name;
  select.appendChild(o);
});

function current() { return DATA.subjects.find(s => s.code === select.value); }

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

select.addEventListener('change', render);

document.getElementById('save').onclick = () => {
  Store.save();
  msg.textContent = 'Saved. The students will see the updated status.';
};
document.getElementById('reset').onclick = () => {
  if (confirm('Reset all scores to the original demo data?')) Store.reset();
};

render();
