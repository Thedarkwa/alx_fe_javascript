const SERVER_API = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");

// Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category filter
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

// Show a random quote
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <p><em>(${quote.category})</em></p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote
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

// Import from JSON
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

// Export to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Fetch quotes from server (Required Function)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_API);
    const data = await res.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}

// Sync local data with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
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
  showSyncNotification(`${newCount} new quote(s) synced from server.`);
}

// Notification display
function showSyncNotification(message) {
  if (!syncNotification) return;
  syncNotification.textContent = message;
  syncNotification.style.display = "block";
  setTimeout(() => (syncNotification.style.display = "none"), 5000);
}

// Optional: Manual Conflict Resolver Placeholder
function resolveConflictsManually() {
  // Future feature: Let user choose between server/local version
  alert("Manual conflict resolution not yet implemented.");
}

// Initialize on page load
window.onload = () => {
  populateCategories();
  filterQuotes();
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 30000); // Sync every 30 seconds
};

// Expose functions for HTML access
window.addQuote = addQuote;
window.filterQuotes = filterQuotes;
window.importFromJsonFile = importFromJsonFile;
window.exportToJsonFile = exportToJsonFile;
window.syncQuotes = syncQuotes;
window.fetchQuotesFromServer = fetchQuotesFromServer;
