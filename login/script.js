const pages = {
  student: '../student/index.html',
  faculty: '../faculty/index.html',
  admin: '../admin/index.html'
};

const DEMO_PASSWORD = '12345';

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('msg');

  if (typeof DATA === 'undefined') {
    msg.textContent = 'Data file failed to load. Check shared/data.js.';
    return;
  }

  const role = document.getElementById('role').value;
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    msg.textContent = 'Please enter your username and password.';
    return;
  }

  let valid = false;
  if (role === 'student') valid = DATA.students.some(s => s.id === username);
  if (role === 'faculty') valid = DATA.faculty.some(f => f.id === username);
  if (role === 'admin') valid = username === 'admin';

  if (!valid || password !== DEMO_PASSWORD) {
    msg.textContent = 'Incorrect username or password.';
    return;
  }

  Session.login(role, username);
  window.location.href = pages[role];
});
