const Compute = {
  standing(subject, rec) {
    let total = 0, weight = 0;
    subject.components.forEach(c => {
      const v = rec.scores[c.key];
      if (typeof v === 'number') { total += v * c.weight; weight += c.weight; }
    });
    return weight ? Math.round((total / weight) * 100) / 100 : null;
  },

  // Palitan ang mga numero ayon sa opisyal na grading system ng NVSU
  grade(p) {
    const table = [[99,'1.00'],[96,'1.25'],[93,'1.50'],[90,'1.75'],
                   [87,'2.00'],[85,'2.25'],[82,'2.50'],[78,'2.75'],[75,'3.00']];
    for (const [min, g] of table) if (p >= min) return g;
    return '5.00';
  },

  status(subject, rec) {
    const p = this.standing(subject, rec);
    const abs = rec.absences || 0;
    const max = subject.maxAbsences;
    if (p === null || p < 75 || abs > max) return { key: 'red', label: 'Critical', icon: '✖' };
    if (p < 80 || (rec.missing || []).length > 0 || abs >= max - 1) return { key: 'amber', label: 'At Risk', icon: '!' };
    return { key: 'green', label: 'On Track', icon: '✔' };
  },

  deficiencies(subject, rec) {
    const list = [];
    (rec.missing || []).forEach(m => list.push('Missing requirement: ' + m));
    subject.components.forEach(c => {
      const v = rec.scores[c.key];
      if (typeof v === 'number' && v < 75) list.push('Low score in ' + c.label + ' (' + v + '%)');
    });
    const abs = rec.absences || 0, max = subject.maxAbsences;
    if (abs > max) list.push('Absences beyond the allowed limit (' + abs + ' of ' + max + ')');
    else if (abs >= max - 1) list.push('Absences near the allowed limit (' + abs + ' of ' + max + ')');
    return list;
  }
};
