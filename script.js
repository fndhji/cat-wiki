const entries = [
  {
    id: "2l", category: "username", avatar: "2L", title: "2L", example: "@ab",
    tags: ["2 letters", "very rare"],
    short: "Exactly two letters.",
    description: "A 2L is a username made of exactly two letters. It is one of the shortest and rarest basic username formats.",
    extraTitle: "Important",
    extra: "A pure 2L contains letters only. A username such as a1 is a 2C, not a 2L.",
    impact: "Very high", detection: "Supported"
  },
  {
    id: "2c", category: "username", avatar: "2C", title: "2C", example: "@a1",
    tags: ["2 characters", "rare"],
    short: "Two characters with at least one non-letter.",
    description: "A 2C contains exactly two characters and is not a pure 2L. It may mix letters and numbers.",
    extraTitle: "Example",
    extra: "a1, 7x and 4q are 2C usernames. ab is a 2L.",
    impact: "High", detection: "Supported"
  },
  {
    id: "3l", category: "username", avatar: "3L", title: "3L", example: "@qic",
    tags: ["3 letters", "rare"],
    short: "Exactly three letters.",
    description: "A 3L contains exactly three letters and nothing else. Cat treats 3L and 3C as exclusive categories.",
    extraTitle: "Classification",
    extra: "qic is 3L only. It should not also receive the 3C classification.",
    impact: "High", detection: "Supported"
  },
  {
    id: "3c", category: "username", avatar: "3C", title: "3C", example: "@j4x",
    tags: ["3 characters", "collectible"],
    short: "Three characters, not all letters.",
    description: "A 3C is exactly three characters long with at least one non-letter character.",
    extraTitle: "Example",
    extra: "j4x and 7a2 are 3C. abc is 3L instead.",
    impact: "Medium to high", detection: "Supported"
  },
  {
    id: "3n", category: "username", avatar: "3N", title: "3N", example: "@483",
    tags: ["3 numbers", "rare"],
    short: "Exactly three numerical digits.",
    description: "A 3N is a three-digit username. Clean, memorable or patterned numbers can be substantially more desirable.",
    extraTitle: "Pricing",
    extra: "Not every 3N has the same value. Repeating digits, culturally recognizable numbers and clean patterns can change demand.",
    impact: "High", detection: "Supported"
  },
  {
    id: "4l", category: "username", avatar: "4L", title: "4L", example: "@miam",
    tags: ["4 letters", "variable"],
    short: "Exactly four letters.",
    description: "A 4L contains exactly four letters. Its desirability depends strongly on readability, pronunciation and whether it is also a Meaning.",
    extraTitle: "Meaning overlap",
    extra: "A username can be both a 4L and a Meaning if it is a real word.",
    impact: "Variable", detection: "Supported"
  },
  {
    id: "4c", category: "username", avatar: "4C", title: "4C", example: "@a7x2",
    tags: ["4 characters", "commoner"],
    short: "Four characters, not all letters.",
    description: "A 4C has exactly four characters and contains at least one non-letter. It is more common than 3C or 3L.",
    extraTitle: "Value",
    extra: "Visual cleanliness matters. A readable 4C usually attracts more interest than a random combination.",
    impact: "Low to medium", detection: "Supported"
  },
  {
    id: "semi3c", category: "username", avatar: "S3C", title: "Semi 3C", example: "@j4_",
    tags: ["3C base", "separator"],
    short: "A 3C-style base plus one separator.",
    description: "A Semi 3C contains a three-character base with one extra separator, commonly a dot or underscore.",
    extraTitle: "Examples",
    extra: "j4_, a1b. and 12x_ are Semi 3C-style usernames. They are not pure 3C because the separator adds a fourth character.",
    impact: "Medium", detection: "Supported"
  },
  {
    id: "semi3l", category: "username", avatar: "S3L", title: "Semi 3L", example: "@qic.",
    tags: ["3 letters", "separator"],
    short: "Three letters plus one separator.",
    description: "A Semi 3L is formed from a clean three-letter base plus a separator such as a dot or underscore.",
    extraTitle: "Examples",
    extra: "qic. and ils_ are Semi 3L. They are close to 3L visually, but are not pure 3L usernames.",
    impact: "Medium to high", detection: "Supported"
  },
  {
    id: "meaning", category: "username", avatar: "M", title: "Meaning", example: "@ghost",
    tags: ["real word", "FR / EN"],
    short: "A username that is a real word with an actual meaning.",
    description: "Meaning is the collector term used here for usernames that are real French or English words.",
    extraTitle: "Quality matters",
    extra: "Being a dictionary word does not automatically make a username valuable. Short, common, memorable and internationally understood Meanings generally attract more demand than long or obscure words.",
    impact: "Highly variable", detection: "FR / EN dictionaries"
  },
  {
    id: "repeater", category: "username", avatar: "REP", title: "Repeater", example: "@ababab",
    tags: ["pattern", "repeated"],
    short: "A username made from a repeated pattern.",
    description: "A Repeater repeats the same unit across the full username, such as 111111, ababab or abcabcabc.",
    extraTitle: "Not a repeater",
    extra: "A random-looking number such as 2990312903012 is not a Repeater because it has no consistent repeating unit.",
    impact: "Variable", detection: "Supported"
  },

  {
    id: "early", category: "badge", avatar: "ES", title: "Early Supporter", example: "Legacy badge",
    tags: ["legacy", "detectable"],
    short: "Early Nitro supporter badge.",
    description: "Early Supporter was awarded to users who supported Discord through Nitro during its early subscription period.",
    extraTitle: "Collector interest",
    extra: "It is one of the most recognizable legacy profile badges and often adds noticeable account demand.",
    impact: "High", detection: "Public API"
  },
  {
    id: "bug1", category: "badge", avatar: "BH1", title: "Bug Hunter Level 1", example: "Legacy badge",
    tags: ["bug hunter", "detectable"],
    short: "Historical Discord bug hunter badge.",
    description: "Bug Hunter Level 1 was awarded through Discord's historical bug hunter program.",
    extraTitle: "Rarity",
    extra: "It is significantly less common than ordinary profile badges and is treated as a collector badge.",
    impact: "High", detection: "Public API"
  },
  {
    id: "bug2", category: "badge", avatar: "BH2", title: "Bug Hunter Level 2", example: "Legacy badge",
    tags: ["very rare", "detectable"],
    short: "Higher historical Bug Hunter tier.",
    description: "Bug Hunter Level 2 is the higher public Bug Hunter tier and is substantially scarcer than Level 1.",
    extraTitle: "Rarity",
    extra: "Its limited supply can make it one of the stronger legacy account features.",
    impact: "Very high", detection: "Public API"
  },
  {
    id: "hse", category: "badge", avatar: "HSE", title: "HypeSquad Events", example: "Legacy badge",
    tags: ["very rare", "legacy"],
    short: "Discontinued HypeSquad Events badge.",
    description: "HypeSquad Events is a discontinued badge historically tied to Discord event participation.",
    extraTitle: "Market",
    extra: "Its limited supply and recognizable design make it much more significant than the standard HypeSquad house flags.",
    impact: "Very high", detection: "Public API"
  },
  {
    id: "dev", category: "badge", avatar: "DEV", title: "Early Verified Bot Developer", example: "Legacy badge",
    tags: ["developer", "legacy"],
    short: "Discontinued verified bot developer badge.",
    description: "This badge was historically awarded to developers of verified Discord bots and is no longer obtainable.",
    extraTitle: "Supply",
    extra: "Because the badge is discontinued, the set of accounts carrying it is limited.",
    impact: "High", detection: "Public API"
  },
  {
    id: "partner", category: "badge", avatar: "P", title: "Partnered Server Owner", example: "Legacy badge",
    tags: ["partner", "legacy"],
    short: "Legacy partner-related account badge.",
    description: "The Partnered Server Owner badge is associated with historical Discord Partner server ownership.",
    extraTitle: "Demand",
    extra: "Demand can vary more than for some other legacy badges, but it remains a scarce public flag.",
    impact: "Medium to high", detection: "Public API"
  },
  {
    id: "alumni", category: "badge", avatar: "MOD", title: "Moderator Programs Alumni", example: "Legacy badge",
    tags: ["moderation", "legacy"],
    short: "Badge tied to Discord moderator programs.",
    description: "Moderator Programs Alumni is a legacy moderation-related badge exposed through Discord public flags.",
    extraTitle: "Demand",
    extra: "It is uncommon, although collector demand can be more niche than Early Supporter or HypeSquad Events.",
    impact: "Medium to high", detection: "Public API"
  },
  {
    id: "staff", category: "badge", avatar: "★", title: "Discord Staff", example: "Public flag",
    tags: ["extremely rare", "staff"],
    short: "Exceptionally uncommon staff-related public flag.",
    description: "Discord Staff is not a normal collectible badge and is exceptionally uncommon among ordinary accounts.",
    extraTitle: "Important",
    extra: "It should not be compared with standard legacy badges when discussing rarity.",
    impact: "Exceptional", detection: "When publicly exposed"
  },
  {
    id: "houses", category: "badge", avatar: "HS", title: "HypeSquad Houses", example: "Bravery · Brilliance · Balance",
    tags: ["public flags", "lower impact"],
    short: "The three standard HypeSquad house badges.",
    description: "Bravery, Brilliance and Balance are HypeSquad house flags that can be exposed publicly.",
    extraTitle: "Pricing",
    extra: "They usually have much less market impact than HypeSquad Events and the scarcer legacy badges.",
    impact: "Low", detection: "Public API"
  },
  {
    id: "modern-badges", category: "badge", avatar: "API", title: "Modern badge limitations", example: "Nitro · Quest · Orbs · Gifting",
    tags: ["API limitation", "important"],
    short: "Not every visible Discord badge is available to apps.",
    description: "Some newer badges and profile cosmetics can appear in the Discord client without being exposed to normal third-party apps.",
    extraTitle: "Cat Self behavior",
    extra: "Cat Self does not invent missing badge data. Automated estimates only use badges that the app can actually verify.",
    impact: "Depends on badge", detection: "Often unavailable"
  },

  {
    id: "price-rarity", category: "pricing", avatar: "$", title: "Username rarity", example: "2L · 3L · 3N · Meaning",
    tags: ["pricing factor"],
    short: "Different username formats have different supply.",
    description: "Username rarity is one component of an estimate. Short formats usually have lower supply, but rarity alone does not guarantee demand.",
    extraTitle: "Remember",
    extra: "A clean 4L Meaning can be more desirable than an ugly random short username.",
    impact: "Major factor", detection: "Cat Self analysis"
  },
  {
    id: "price-age", category: "pricing", avatar: "AGE", title: "Account age", example: "2015 · 2016 · 2017",
    tags: ["pricing factor", "aged"],
    short: "Older Discord accounts can carry a premium.",
    description: "Creation year can materially affect collector interest. Very early Discord accounts, especially 2015 and 2016, may carry a strong age premium.",
    extraTitle: "Not everything",
    extra: "Age is additive context. An old account with no desirable username or badges is not automatically worth an extreme amount.",
    impact: "High for early years", detection: "Calculated from user ID"
  },
  {
    id: "price-badges", category: "pricing", avatar: "BAD", title: "Badge premiums", example: "Early · HSE · Bug Hunter",
    tags: ["pricing factor", "legacy"],
    short: "Rare verified badges can affect estimates.",
    description: "Legacy badges can increase perceived account rarity, but each badge has a different supply and level of market demand.",
    extraTitle: "Verification",
    extra: "Cat Self only applies automated badge premiums to badges that Discord exposes to the app.",
    impact: "Badge-dependent", detection: "Public API"
  },
  {
    id: "price-warning", category: "pricing", avatar: "!", title: "Prices can vary", example: "Estimate ≠ guaranteed sale",
    tags: ["important", "disclaimer"],
    short: "Market listings are not fixed prices.",
    description: "An asking price only tells you what a seller requested. It does not prove that the account or username sold for that amount.",
    extraTitle: "Why estimates move",
    extra: "Demand, seller urgency, market conditions, word quality, account history and badge visibility can all change the real-world price.",
    impact: "Always relevant", detection: "Market data"
  },

  {
    id: "cat", category: "bot", avatar: "CAT", title: "Cat", example: "Server bot",
    tags: ["moderation", "roles", "logs"],
    short: "The server-side Cat bot.",
    description: "Cat is the Discord server bot focused on moderation, username roles, joins, logs, boosts, safety and server protection.",
    extraTitle: "Username roles",
    extra: "Cat can automatically classify usernames and assign configured roles such as 3L, 3C, Meaning, Repeater and badge roles.",
    impact: "Server utility", detection: "Discord bot"
  },
  {
    id: "catself", category: "bot", avatar: "SELF", title: "Cat Self", example: "User-installed app",
    tags: ["analysis", "pricing", "user app"],
    short: "The user-installed Cat analysis app.",
    description: "Cat Self analyzes a Discord user through /user and displays username classification, account age, available public badges and an unofficial estimate.",
    extraTitle: "Limitations",
    extra: "Cat Self only uses information that Discord makes available to the app. Some modern profile badges cannot be verified automatically.",
    impact: "Analysis utility", detection: "User-installed app"
  }
];

const cards = document.getElementById("cards");
const searchInput = document.getElementById("searchInput");
const filters = [...document.querySelectorAll(".filter")];
const emptyState = document.getElementById("emptyState");
const visibleCount = document.getElementById("visibleCount");

const overlay = document.getElementById("overlay");
const modalClose = document.getElementById("modalClose");
const modalAvatar = document.getElementById("modalAvatar");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalExample = document.getElementById("modalExample");
const modalTags = document.getElementById("modalTags");
const modalDescription = document.getElementById("modalDescription");
const modalExtraTitle = document.getElementById("modalExtraTitle");
const modalExtra = document.getElementById("modalExtra");
const modalImpact = document.getElementById("modalImpact");
const modalDetection = document.getElementById("modalDetection");

let activeFilter = "all";

function categoryLabel(category) {
  return ({
    username: "USERNAME TYPE",
    badge: "DISCORD BADGE",
    pricing: "PRICING",
    bot: "CAT ECOSYSTEM"
  })[category] || category.toUpperCase();
}

function cardHTML(item) {
  return `
    <article class="wiki-card" tabindex="0" data-id="${item.id}">
      <div class="card-avatar">${item.avatar}</div>
      <div class="card-body">
        <div class="card-title-line">
          <span class="card-title">${item.title}</span>
          <span class="card-type">${categoryLabel(item.category)}</span>
        </div>
        <div class="card-example">${item.example}</div>
        <p class="card-description">${item.short}</p>
        <div class="card-tags">
          ${item.tags.slice(0, 3).map(tag => `<span class="mini-tag">${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = entries.filter(item => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const haystack = [
      item.title, item.example, item.short, item.description, item.extra,
      ...item.tags
    ].join(" ").toLowerCase();
    return matchesFilter && (!q || haystack.includes(q));
  });

  cards.innerHTML = filtered.map(cardHTML).join("");
  visibleCount.textContent = filtered.length;
  emptyState.hidden = filtered.length !== 0;

  document.querySelectorAll(".wiki-card").forEach(card => {
    const open = () => showEntry(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

function showEntry(id) {
  const item = entries.find(x => x.id === id);
  if (!item) return;

  modalAvatar.textContent = item.avatar;
  modalCategory.textContent = categoryLabel(item.category);
  modalTitle.textContent = item.title;
  modalExample.textContent = item.example;
  modalDescription.textContent = item.description;
  modalExtraTitle.textContent = item.extraTitle || "Notes";
  modalExtra.textContent = item.extra || "";
  modalImpact.textContent = item.impact;
  modalDetection.textContent = item.detection;
  modalTags.innerHTML = item.tags.map(tag => `<span class="mini-tag">${tag}</span>`).join("");

  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = "";
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(b => b.classList.toggle("active", b === button));
    render();
  });
});

searchInput.addEventListener("input", render);

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", e => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});

document.querySelector("[data-filter-jump='username']").addEventListener("click", () => {
  const btn = filters.find(b => b.dataset.filter === "username");
  btn.click();
  document.querySelector(".widget").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("copyLinkBtn").addEventListener("click", async e => {
  const button = e.currentTarget;
  try {
    await navigator.clipboard.writeText(location.href);
    const old = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => button.textContent = old, 1200);
  } catch {
    button.textContent = "Copy unavailable";
    setTimeout(() => button.textContent = "Copy link", 1200);
  }
});

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("cat-wiki-theme");
root.dataset.theme = savedTheme === "blue" ? "blue" : "dark";

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "blue" ? "dark" : "blue";
  root.dataset.theme = next;
  localStorage.setItem("cat-wiki-theme", next);
});

const categoryCounts = entries.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

document.getElementById("entryCountTop").textContent = entries.length;
document.getElementById("entryCountTitle").textContent = `(${entries.length})`;
document.getElementById("countAll").textContent = entries.length;
document.getElementById("countUsername").textContent = categoryCounts.username || 0;
document.getElementById("countBadge").textContent = categoryCounts.badge || 0;
document.getElementById("countPricing").textContent = categoryCounts.pricing || 0;
document.getElementById("countBot").textContent = categoryCounts.bot || 0;

render();
