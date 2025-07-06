const SERVER_API = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem("selectedCategory");
  if (lastSelected) categoryFilter.value = lastSelected;
}

// Display a filtered/random quote
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <p><em>(${quote.category})</em></p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote + POST to server
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote); // ✅ POST to server

  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ✅ Required: POST a quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) throw new Error("Failed to post quote");
    const result = await response.json();
    console.log("Posted to server:", result);
    showSyncNotification("Quote successfully sent to server.");
  } catch (error) {
    console.error("POST error:", error);
    showSyncNotification("Failed to post quote to server.");
  }
}

// ✅ Required: fetch quotes from server
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

// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let added = 0;

  serverQuotes.forEach(serverQuote => {
    const exists = localQuotes.some(local => local.text === serverQuote.text);
    if (!exists) {
      localQuotes.push(serverQuote);
      added++;
    }
  });

  quotes = localQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
  showSyncNotification(`${added} new quote(s) synced from server.`);
}

// Display sync message
function showSyncNotification(message) {
  if (!syncNotification) return;
  syncNotification.textContent = message;
  syncNotification.style.display = "block";
  setTimeout(() => (syncNotification.style.display = "none"), 4000);
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error();
      quotes.push(...imported);
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

// Initialize
window.onload = () => {
  populateCategories();
  filterQuotes();
  syncQuotes();
  setInterval(syncQuotes, 30000);
};

// Expose for HTML
window.addQuote = addQuote;
window.filterQuotes = filterQuotes;
window.syncQuotes = syncQuotes;
window.fetchQuotesFromServer = fetchQuotesFromServer;
window.postQuoteToServer = postQuoteToServer;
window.exportToJsonFile = exportToJsonFile;
window.importFromJsonFile = importFromJsonFile;
