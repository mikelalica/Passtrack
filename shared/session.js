const Session = {
  login(role, name) {
    sessionStorage.setItem('passtrack_user', JSON.stringify({ role, name }));
  },
  get() {
    const raw = sessionStorage.getItem('passtrack_user');
    return raw ? JSON.parse(raw) : null;
  },
  require(role) {
    const user = this.get();
    if (!user || user.role !== role) {
      window.location.href = '../login/index.html';
    }
    return user;
  },
  logout() {
    sessionStorage.removeItem('passtrack_user');
    window.location.href = '../login/index.html';
  }
};
