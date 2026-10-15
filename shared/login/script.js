const pages = {
  student: '../student/index.html',
  faculty: '../faculty/index.html',
  admin: '../admin/index.html'
};

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const role = document.getElementById('role').value;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  if (!username || !password) {
    msg.textContent = 'Please enter your username and password.';
    return;
  }
  Session.login(role, username);
  window.location.href = pages[role];
});
