// src/data/media.ts
var AD_PRICES = {
  "ad-core-n": 900,
  "ad-core-w": 650,
  "ad-market-n": 800,
  "ad-market-s": 760,
  "ad-club": 450,
  "ad-pool": 360,
  "ad-gardens": 380,
  "ad-marina": 500,
  "ad-avenue-w": 580,
  "ad-avenue-e": 420,
  "ad-skyport": 340,
  "ad-homes": 280
};
var AD_DAYS = [1, 7, 14, 30];
var adCost = (spot, days) => Math.round((AD_PRICES[spot] || 0) * days * (days >= 30 ? 0.75 : days >= 14 ? 0.85 : days >= 7 ? 0.9 : 1));
var AD_IMAGE_MAX = 6e4;
var HALLS = [
  { id: "grand", name: "Grand Conference Hall", kind: "conference", site: "halls", cap: 200, hourly: 600, color: "#4da3ff", desc: "Main stage, giant screen and 200 seats. Product launches, summits, graduations." },
  { id: "summit", name: "Summit Room", kind: "conference", site: "halls", cap: 60, hourly: 250, color: "#ffc27a", desc: "Boardroom-style room for meetups, panels and investor pitches." },
  { id: "studio", name: "Workshop Studio", kind: "conference", site: "halls", cap: 30, hourly: 120, color: "#45e0ae", desc: "Small room with a whiteboard wall for classes and hands-on workshops." },
  { id: "skyline", name: "Skyline Lounge", kind: "lounge", site: "lounge", cap: 80, hourly: 300, color: "#c792ea", desc: "Sofas, a mocktail bar and city views. Networking nights and listening parties." },
  { id: "rooftop", name: "Rooftop Chill Lounge", kind: "lounge", site: "lounge", cap: 40, hourly: 150, color: "#ff9a3c", desc: "Open-air rooftop with fire tables for small, relaxed hangouts." },
  { id: "arena", name: "Gaming Arena", kind: "gaming", site: "lounge", cap: 120, hourly: 400, color: "#e5484d", desc: "Gaming rigs, an arena screen and stands. Watch parties and skill tournaments." }
];
var hallById = (id) => HALLS.find((h) => h.id === id);
var HALL_MAX_HOURS = 6;
var TICKET_MAX = 5e3;
var HOST_SHARE = 0.9;
var NEWS_CATS = {
  nation: { label: "Nation", color: "#ffc27a" },
  economy: { label: "Economy", color: "#45e0ae" },
  property: { label: "Property", color: "#4da3ff" },
  market: { label: "Market", color: "#ff9a3c" },
  education: { label: "Education", color: "#7fd1ff" },
  events: { label: "Events", color: "#c792ea" },
  court: { label: "Court", color: "#e5484d" },
  politics: { label: "Politics", color: "#b06ad9" },
  ads: { label: "Billboards", color: "#f1c40f" },
  citizen: { label: "Citizen report", color: "#a8d8ff" }
};
var WORLD_FEEDS = [
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { name: "NPR World", url: "https://feeds.npr.org/1004/rss.xml" }
];

