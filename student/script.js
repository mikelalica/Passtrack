const user = Session.require('student');
const student = DATA.students.find(s => s.id === user.name) || DATA.students[0];

document.getElementById('name').textContent = student.name;
document.getElementById('info').textContent = student.id + ' | ' + student.section;
document.getElementById('logout').onclick = () => Session.logout();

const list = document.getElementById('list');
const detail = document.getElementById('detail');

function schedText(sub) {
  return sub.schedule.map(s => s.time + ' (' + s.room + ')').join(' | ');
}

function renderList() {
  detail.hidden = true;
  list.hidden = false;
  list.innerHTML = '';
  DATA.subjects.forEach(sub => {
    const rec = DATA.records[student.id][sub.code];
    const st = Compute.status(sub, rec);
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.innerHTML =
      '<div class="row"><strong>' + sub.code + ' - ' + sub.name + '</strong>' +
      '<span class="badge ' + st.key + '">' + st.icon + ' ' + st.label + '</span></div>' +
      '<small>' + sub.instructor + '</small><br>' +
      '<small>' + schedText(sub) + '</small>';
    btn.onclick = () => renderDetail(sub, rec);
    list.appendChild(btn);
  });
}

function renderDetail(sub, rec) {
  const st = Compute.status(sub, rec);
  const defs = Compute.deficiencies(sub, rec);
  const rows = sub.components.map(c =>
    '<tr><td>' + c.label + '</td><td>' + c.weight + '%</td><td>' + rec.scores[c.key] + '%</td></tr>'
  ).join('');
  list.hidden = true;
  detail.hidden = false;
  detail.innerHTML =
    '<button class="back" id="back">Back</button>' +
    '<h3>' + sub.code + ' - ' + sub.name + '</h3>' +
    '<p class="muted">' + sub.instructor + '<br>' + schedText(sub) + '</p>' +
    '<p><span class="badge ' + st.key + '">' + st.icon + ' ' + st.label + '</span><br>' +
    '<small>This status is an estimate for monitoring only, not the official grade.</small></p>' +
    '<table><tr><th>Component</th><th>Weight</th><th>Score</th></tr>' + rows + '</table>' +
    '<h4>Deficiencies</h4>' +
    (defs.length ? '<ul>' + defs.map(d => '<li>' + d + '</li>').join('') + '</ul>' : '<p>No deficiencies.</p>');
  document.getElementById('back').onclick = renderList;
}

renderList();
