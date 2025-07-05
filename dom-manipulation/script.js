// ==== GLOBAL SETUP ====
const SERVER_API = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// ==== DOM ELEMENTS ====
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");

// ==== SAVE + DISPLAY ====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const stored = localStorage.getItem("selectedCategory");
  if (stored) categoryFilter.value = stored;
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found.</p>";
    return;
  }
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <p><em>(${quote.category})</em></p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ==== ADD QUOTE ====
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ==== IMPORT / EXPORT ====
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error();
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully.");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ==== SERVER SYNC ====
async function fetchServerQuotes() {
  try {
    const res = await fetch(SERVER_API);
    const data = await res.json();
    // Simulate quote structure
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchServerQuotes();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let newCount = 0;

  serverQuotes.forEach(serverQuote => {
    const exists = localQuotes.some(local => local.text === serverQuote.text);
    if (!exists) {
      localQuotes.push(serverQuote);
      newCount++;
    }
  });

  quotes = localQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
  showSyncNotification(`${newCount} quote(s) synced from server.`);
}

// ==== CONFLICT RESOLUTION UI (Optional future extension) ====
// You could compare timestamps and prompt the user here
// For now, we assume "server wins"

// ==== NOTIFICATION ====
function showSyncNotification(message) {
  if (!syncNotification) return;
  syncNotification.textContent = message;
  syncNotification.style.display = "block";
  setTimeout(() => (syncNotification.style.display = "none"), 5000);
}

// ==== INIT ====
window.onload = () => {
  populateCategories();
  filterQuotes();
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 30000); // Sync every 30s
};

// ==== EXPOSE TO HTML ====
window.addQuote = addQuote;
window.importFromJsonFile = importFromJsonFile;
window.exportToJsonFile = exportToJsonFile;
window.filterQuotes = filterQuotes;
window.syncQuotes = syncQuotes;
