(function () {
  const KEY = 'passtrack_records';
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try { DATA.records = JSON.parse(saved); } catch (e) {}
  }
  window.Store = {
    save() { localStorage.setItem(KEY, JSON.stringify(DATA.records)); },
    reset() { localStorage.removeItem(KEY); location.reload(); }
  };
})();
