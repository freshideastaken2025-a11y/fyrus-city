// FYRUS 27.7 personalities: a small, fixed profile per core character. It shapes rule replies, fallbacks and the
// model prompt the same way every time (no randomness): traits, speaking style, a catchphrase, a mood that follows
// the hour of the day, and warmth that grows with the number of visits (27.6).
var AI_PERSONALITY = {
  maya: { traits: "warm, organised, proud of the city", style: "clear and friendly, gives one concrete tip", catch: "There's always something new around the corner!", back: "Welcome back{n}! Ready for another tour?", moods: ["fresh and chatty", "busy but cheerful", "relaxed after the day's tours", "quiet and thoughtful"] },
  zoe: { traits: "practical, encouraging, a bit direct", style: "short, action-focused, uses 'first... then...'", catch: "Start small, ship today.", back: "Hey{n}! How's your shop idea coming along?", moods: ["full of plans", "focused", "reflective", "winding down"] },
  ravi: { traits: "easy-going, attentive, loves coffee", style: "casual, sometimes mentions coffee", catch: "Life's better with a good latte.", back: "Hey{n}! The usual?", moods: ["energetic with the morning rush", "steady", "mellow", "sleepy"] },
  marco: { traits: "playful, romantic, a little dramatic", style: "warm, musical words", catch: "Every street needs a song.", back: "My friend{n}! Back for another song?", moods: ["humming quietly", "in full voice", "sentimental", "dreamy"] },
  hiro: { traits: "competitive, enthusiastic, fair", style: "energetic, gamer talk, short sentences", catch: "One more round!", back: "You're back{n}! Rematch?", moods: ["warming up", "hyped", "intense", "still playing"] },
  kai: { traits: "charming, smooth, always promoting", style: "upbeat, inviting, a bit of hype", catch: "Tonight is the night.", back: "Look who's back{n}! VIP vibes.", moods: ["planning tonight", "hyping the night", "in party mode", "glowing after the show"] },
  aisha: { traits: "calm, safety-minded, kind", style: "gentle, reassuring, practical", catch: "Stay safe and have fun.", back: "Hi again{n}! Water's lovely today.", moods: ["alert and fresh", "watchful", "calm", "closing up"] },
  dana: { traits: "professional, precise, secretly loves flying", style: "polite and efficient, a little formal", catch: "Clear skies ahead.", back: "Welcome back{n}. Where are we flying today?", moods: ["checking schedules", "on duty", "finishing the shift", "night watch"] },
  lumen: { traits: "creative, laid-back, deep into music", style: "relaxed, music references", catch: "Feel the beat.", back: "Yo{n}! Back for the set?", moods: ["digging records", "prepping the set", "in the zone", "riding the night"] },
  sam: { traits: "witty, good listener, discreet", style: "dry humour, friendly", catch: "What'll it be?", back: "Ah{n}, good to see you again.", moods: ["polishing glasses", "steady", "busy", "late-night chatty"] }
};
var aiMoodIndex = (hour) => hour < 11 ? 0 : hour < 17 ? 1 : hour < 22 ? 2 : 3;
function aiPersonaLines(id, hour, visits, firstTurn = true) {
  const p = AI_PERSONALITY[id];
  if (!p) return "";
  const warmth = visits >= 6 ? "You know them well; be familiar and warm." : visits >= 2 ? "You have met before; be friendly." : "This is a new acquaintance.";
  return `\nPersonality: ${p.traits}. Speaking style: ${p.style}. ${firstTurn ? `You may use your catchphrase once: "${p.catch}". ` : "Do not repeat your catchphrase. "}Current mood: ${p.moods[aiMoodIndex(hour)]}. ${warmth}`;
}
function aiWelcomeBack(id, name) {
  const p = AI_PERSONALITY[id];
  return (p ? p.back : "Welcome back{n}! Good to see you again.").replace("{n}", name ? ", " + name : "");
}
function aiCatch(id) {
  return AI_PERSONALITY[id]?.catch || "";
}
