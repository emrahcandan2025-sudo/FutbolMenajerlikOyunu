// CNDN Football Manager — yardımcı kariyer sistemleri.
// Bu modül, ana arayüzden ayrı tutulmuş ve sonraki entegrasyonlar için hazırlanmıştır.

export function createRoundRobinFixtures(clubNames) {
  if (!Array.isArray(clubNames) || clubNames.length < 2) return [];
  const teams = [...clubNames];
  if (teams.length % 2) teams.push(null);
  const n = teams.length;
  const rounds = [];
  let rotating = [...teams];
  for (let r = 0; r < n - 1; r++) {
    const games = [];
    for (let i = 0; i < n / 2; i++) {
      const home = rotating[i];
      const away = rotating[n - 1 - i];
      if (home && away) games.push({ round: r + 1, home, away, played: false, homeGoals: null, awayGoals: null });
    }
    rounds.push(games);
    rotating = [rotating[0], rotating[n - 1], ...rotating.slice(1, n - 1)];
  }
  const returnLeg = rounds.map((games, i) => games.map(g => ({ ...g, round: i + rounds.length + 1, home: g.away, away: g.home })));
  return [...rounds, ...returnLeg].flat();
}

export function makeContractOffer(player, offer = {}) {
  const wage = Math.max(0, Number(offer.wage) || 0);
  const years = Math.max(1, Math.min(5, Math.round(Number(offer.years) || 1)));
  const bonus = Math.max(0, Number(offer.signingBonus) || 0);
  const ambition = Number(offer.ambition) || 50;
  const clubReputation = Number(offer.clubReputation) || 50;
  const expectedWage = Number(player.wage) || 0;
  const wageScore = expectedWage > 0 ? Math.min(100, wage / expectedWage * 70) : 50;
  const fitScore = Math.max(0, Math.min(100, wageScore * 0.7 + ambition * 0.15 + clubReputation * 0.15));
  const accepted = fitScore >= 62;
  return {
    accepted,
    playerId: player.id,
    wage,
    years,
    signingBonus: bonus,
    score: Math.round(fitScore),
    message: accepted ? `${player.name} sözleşme teklifini kabul etti.` : `${player.name} daha iyi ücret veya daha iddialı bir proje istiyor.`,
  };
}

export function applyContract(state, playerId, offer) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return { ...state, lastMessage: 'Oyuncu bulunamadı.' };
  if (offer.signingBonus > state.budget) return { ...state, lastMessage: 'İmza parası için bütçe yetersiz.' };
  if (offer.wage > state.wageBudget) return { ...state, lastMessage: 'Bu maaş, kalan maaş bütçesini aşıyor.' };
  const result = makeContractOffer(player, offer);
  if (!result.accepted) return { ...state, lastMessage: result.message };
  return {
    ...state,
    budget: state.budget - result.signingBonus,
    wageBudget: state.wageBudget - result.wage,
    players: state.players.map(p => p.id === playerId ? { ...p, wage: result.wage, contract: result.years } : p),
    lastMessage: result.message,
    news: [result.message, ...(state.news || [])].slice(0, 20),
  };
}

export function scoutPlayer(player, scoutLevel = 50) {
  const uncertainty = Math.max(1, Math.round((100 - scoutLevel) / 8));
  const jitter = () => Math.round((Math.random() * 2 - 1) * uncertainty);
  return {
    ...player,
    scoutedRating: Math.max(1, Math.min(99, player.rating + jitter())),
    scoutedPotential: Math.max(1, Math.min(99, player.potential + jitter())),
    scoutConfidence: Math.max(10, Math.min(99, scoutLevel)),
  };
}

export function applyWeeklyRecovery(state) {
  return {
    ...state,
    players: state.players.map(p => ({
      ...p,
      condition: Math.min(100, (Number(p.condition) || 70) + 12),
      morale: Math.max(0, Math.min(100, (Number(p.morale) || 60) + (state.morale >= 65 ? 1 : -1))),
      contract: Math.max(0, Number(p.contract) || 0),
    })),
    finance: {
      ...(state.finance || {}),
      expenses: (state.finance?.expenses || 0) + state.players.reduce((sum, p) => sum + (Number(p.wage) || 0), 0),
    },
  };
}

export function calculateBoardConfidence(state) {
  const position = Number(state.position) || 10;
  const target = Number(state.targetPosition) || 10;
  const performance = Math.max(0, Math.min(100, 75 + (target - position) * 5));
  const morale = Number(state.morale) || 50;
  return Math.round(Math.max(0, Math.min(100, performance * 0.65 + morale * 0.35)));
}
