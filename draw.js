function rand(n) {
  const limit = Math.floor(2 ** 32 / n) * n;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return value[0] % n;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickTeam(pairing) {
  return { a: pairing.remA[rand(pairing.remA.length)], b: pairing.remB[rand(pairing.remB.length)] };
}

function splitIntoGroups(teamIds, groupCount) {
  const groups = Array.from({ length: groupCount }, () => []);
  shuffle(teamIds).forEach((id, i) => groups[i % groupCount].push(id));
  return groups;
}

function scheduleMatches(ids, format) {
  const newMatch = (p1, p2) => ({ p1, p2, winner: null });
  if (format === 'one') {
    const order = shuffle(ids);
    const matches = [];
    for (let i = 0; i + 1 < order.length; i += 2) matches.push(newMatch(order[i], order[i + 1]));
    if (order.length % 2) matches.push(newMatch(order[order.length - 1], order[rand(order.length - 1)]));
    return matches;
  }
  const firstLeg = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) firstLeg.push(newMatch(ids[i], ids[j]));
  }
  const shuffled = shuffle(firstLeg);
  if (format === 'twice') return [...shuffled, ...shuffle(firstLeg.map(m => newMatch(m.p2, m.p1)))];
  return shuffled;
}
