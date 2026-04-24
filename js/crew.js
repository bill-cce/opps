// ─────────────────────────────────────────────
//  CREW
//  Stub — to be implemented
// ─────────────────────────────────────────────

// Crew mechanics will handle:
// - Inviting friends via RCS/SMS link
// - Tracking crew members (by phone number via Jest SDK)
// - Crew bonuses to attack/defense
// - Attribution tracking for Jest's 20% referral revenue share

const Crew = {
  getInviteLink() {
    // TODO: generate a trackable invite link via Jest SDK
    // that attributes any new user to this player
    return `https://jest.com/opps?ref=${G.phone || 'demo'}`;
  },

  getMembers() {
    // TODO: fetch crew members from Jest SDK
    return G.crew || [];
  },

  getBonus() {
    const members = this.getMembers().length;
    return {
      attack: members * 2,
      defense: members * 1
    };
  }
};
