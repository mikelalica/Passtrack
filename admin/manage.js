const user = Session.require('admin');
document.getElementById('logout').onclick = () => Session.logout();

const form = document.getElementById('form');
const formTitle = document.getElementById('formTitle');
const listTitle = document.getElementById('listTitle');
const list = document.getElementById('list');
const msg = document.getElementById('msg');

let tab = 'students';
let editing = null; // key of the item being edited, or null when adding

function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function say(text, isError) {
  msg.textContent = text;
  msg.className = 'msg' + (isError ? ' err' : '');
}
function persist() { Store.save(); }
const ID_OK = /^[a-z0-9._-]+$/;

/* ---------------- Students ---------------- */
function studentForm() {
  const s = editing ? DATA.students.find(x => x.id === editing) : { id: '', name: '', section: 'BSIT 3A' };
  formTitle.textContent = editing ? 'Edit student' : 'Add student';
  form.innerHTML =
    '<label>Student ID (also the username)<input id="f_id" value="' + esc(s.id) + '"' + (editing ? ' readonly' : '') + ' placeholder="e.g. 241-1234"></label>' +
    '<label>Full name<input id="f_name" value="' + esc(s.name) + '" placeholder="e.g. Juan Dela Cruz"></label>' +
    '<label>Section<input id="f_section" value="' + esc(s.section) + '"></label>' +
    btns();
}
function studentSave() {
  const id = val('f_id').toLowerCase(), name = val('f_name'), section = val('f_section');
  if (!id || !name || !section) return say('Please fill in the student ID, name, and section.', true);
  if (!ID_OK.test(id)) return say('The student ID may only contain letters, numbers, dot, dash, and underscore.', true);
  if (editing) {
    const s = DATA.students.find(x => x.id === editing);
    s.name = name; s.section = section;
    say('Student updated.');
  } else {
    if (DATA.students.some(x => x.id === id)) return say('That student ID already exists.', true);
    DATA.students.push({ id, name, section });
    Store.ensure();
    say('Student added. Username: ' + id + '. Scores start at 0 until the faculty enters them.');
  }
  persist(); finish();
}
function studentList() {
  listTitle.textContent = 'Students (' + DATA.students.length + ')';
  return DATA.students.map(s => item(s.id, s.name, s.id + ' | ' + s.section)).join('');
}
function studentDelete(id) {
  const s = DATA.students.find(x => x.id === id);
  if (!confirm('Delete ' + s.name + ' and all of their records?')) return;
  DATA.students = DATA.students.filter(x => x.id !== id);
  delete DATA.records[id];
  persist(); say('Student deleted.'); finish();
}

/* ---------------- Faculty ---------------- */
function facultyForm() {
  const f = editing ? DATA.faculty.find(x => x.id === editing) : { id: '', name: '' };
  formTitle.textContent = editing ? 'Edit faculty' : 'Add faculty';
  form.innerHTML =
    '<label>Username<input id="f_id" value="' + esc(f.id) + '"' + (editing ? ' readonly' : '') + ' placeholder="e.g. delacruz"></label>' +
    '<label>Full name<input id="f_name" value="' + esc(f.name) + '" placeholder="e.g. Dela Cruz, Juan A."></label>' +
    btns();
}
function facultySave() {
  const id = val('f_id').toLowerCase(), name = val('f_name');
  if (!id || !name) return say('Please fill in the username and full name.', true);
  if (!ID_OK.test(id)) return say('The username may only contain letters, numbers, dot, dash, and underscore.', true);
  if (DATA.faculty.some(x => x.name === name && x.id !== (editing || id))) return say('A faculty member with that name already exists.', true);
  if (editing) {
    const f = DATA.faculty.find(x => x.id === editing);
    DATA.subjects.forEach(s => { if (s.instructor === f.name) s.instructor = name; });
    f.name = name;
    Store.link();
    say('Faculty updated.');
  } else {
    if (DATA.faculty.some(x => x.id === id)) return say('That username already exists.', true);
    DATA.faculty.push({ id, name });
    say('Faculty added. Username: ' + id + '. Assign subjects in the Subjects tab.');
  }
  persist(); finish();
}
function facultyList() {
  listTitle.textContent = 'Faculty (' + DATA.faculty.length + ')';
  return DATA.faculty.map(f => {
    const subs = DATA.subjects.filter(s => s.facultyId === f.id).map(s => s.code);
    return item(f.id, f.name, f.id + ' | ' + (subs.length ? subs.join(', ') : 'No subjects assigned'));
  }).join('');
}
function facultyDelete(id) {
  const f = DATA.faculty.find(x => x.id === id);
  const mine = DATA.subjects.filter(s => s.facultyId === id);
  if (mine.length) return say('Cannot delete ' + f.name + ' while assigned to: ' + mine.map(s => s.code).join(', ') + '. Reassign those subjects first.', true);
  if (!confirm('Delete the faculty account of ' + f.name + '?')) return;
  DATA.faculty = DATA.faculty.filter(x => x.id !== id);
  persist(); say('Faculty deleted.'); finish();
}

/* ---------------- Subjects (and instructor assignment) ---------------- */
function subjectForm() {
  const s = editing ? DATA.subjects.find(x => x.code === editing)
    : { code: '', name: '', instructor: '', maxAbsences: 6, schedule: [] };
  formTitle.textContent = editing ? 'Edit subject' : 'Add subject';
  const opts = '<option value="">Select instructor</option>' + DATA.faculty.map(f =>
    '<option value="' + esc(f.id) + '"' + (f.id === s.facultyId ? ' selected' : '') + '>' + esc(f.name) + '</option>').join('');
  form.innerHTML =
    '<label>Subject code<input id="f_code" value="' + esc(s.code) + '"' + (editing ? ' readonly' : '') + ' placeholder="e.g. IT PEC 5"></label>' +
    '<label>Subject name<input id="f_name" value="' + esc(s.name) + '"></label>' +
    '<label>Instructor<select id="f_inst">' + opts + '</select></label>' +
    '<label>Allowed absences<input id="f_abs" type="number" min="1" value="' + esc(s.maxAbsences) + '"></label>' +
    '<label>Schedule<textarea id="f_sched" placeholder="F 2-4 pm | ITE302">' +
      esc(s.schedule.map(x => x.time + ' | ' + x.room).join('\n')) +
    '</textarea><span class="hint">One per line, as: time | room</span></label>' +
    btns();
}
function subjectSave() {
  const code = val('f_code'), name = val('f_name'), fid = val('f_inst');
  const max = Number(val('f_abs'));
  if (!code || !name) return say('Please fill in the subject code and name.', true);
  if (!fid) return say('Please select an instructor.', true);
  if (!(max >= 1)) return say('Allowed absences must be at least 1.', true);
  const fac = DATA.faculty.find(x => x.id === fid);
  const schedule = document.getElementById('f_sched').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const parts = l.split('|').map(x => x.trim());
    return { time: parts[0], room: parts[1] || 'TBA' };
  });
  if (editing) {
    const s = DATA.subjects.find(x => x.code === editing);
    s.name = name; s.instructor = fac.name; s.maxAbsences = max; s.schedule = schedule;
    Store.link();
    say('Subject updated (instructor: ' + fac.name + ').');
  } else {
    if (DATA.subjects.some(x => x.code.toLowerCase() === code.toLowerCase())) return say('That subject code already exists.', true);
    DATA.subjects.push({
      code, name, instructor: fac.name, maxAbsences: max,
      components: COMP.map(c => ({ key: c.key, label: c.label, weight: c.weight })),
      schedule
    });
    Store.link(); Store.ensure();
    say('Subject added (instructor: ' + fac.name + '). All students now have a record for it.');
  }
  persist(); finish();
}
function subjectList() {
  listTitle.textContent = 'Subjects (' + DATA.subjects.length + ')';
  return DATA.subjects.map(s => item(s.code, s.code + ' - ' + s.name,
    s.instructor + ' | ' + s.schedule.map(x => x.time + ' (' + x.room + ')').join(' | '))).join('');
}
function subjectDelete(code) {
  const s = DATA.subjects.find(x => x.code === code);
  if (!confirm('Delete ' + s.code + ' and all student records for it?')) return;
  DATA.subjects = DATA.subjects.filter(x => x.code !== code);
  Object.keys(DATA.records).forEach(id => { delete DATA.records[id][code]; });
  persist(); say('Subject deleted.'); finish();
}

/* ---------------- shared helpers ---------------- */
function val(id) { return document.getElementById(id).value.trim(); }
function btns() {
  return '<div class="btns"><button type="submit" class="primary">' + (editing ? 'Save changes' : 'Add') + '</button>' +
    (editing ? '<button type="button" class="secondary" id="cancel">Cancel</button>' : '') + '</div>';
}
function item(key, title, sub) {
  return '<div class="item"><div class="row"><div><strong>' + esc(title) + '</strong><small>' + esc(sub) + '</small></div>' +
    '<div class="acts"><button data-act="edit" data-key="' + esc(key) + '">Edit</button>' +
    '<button class="del" data-act="del" data-key="' + esc(key) + '">Delete</button></div></div></div>';
}

const T = {
  students: { form: studentForm, save: studentSave, list: studentList, del: studentDelete },
  faculty:  { form: facultyForm, save: facultySave, list: facultyList, del: facultyDelete },
  subjects: { form: subjectForm, save: subjectSave, list: subjectList, del: subjectDelete }
};

function render() {
  document.querySelectorAll('.tab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
    b.setAttribute('aria-selected', b.dataset.tab === tab);
  });
  T[tab].form();
  list.innerHTML = T[tab].list() || '<p>Nothing here yet.</p>';
  const c = document.getElementById('cancel');
  if (c) c.onclick = () => { editing = null; say(''); render(); };
}
function finish() { editing = null; render(); }

form.addEventListener('submit', e => { e.preventDefault(); T[tab].save(); });
list.addEventListener('click', e => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  if (b.dataset.act === 'edit') { editing = b.dataset.key; say(''); render(); window.scrollTo(0, 0); }
  else T[tab].del(b.dataset.key);
});
document.querySelectorAll('.tab').forEach(b => b.onclick = () => { tab = b.dataset.tab; editing = null; say(''); render(); });

render();
