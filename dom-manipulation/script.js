// ====== SETUP ======
const SERVER_API = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// ====== DOM REFERENCES ======
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");

// ====== CORE FUNCTIONS ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category if available
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) categoryFilter.value = savedCategory;
}

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
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (!text || !category) {
    alert("Please enter both a quote and category.");
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ====== IMPORT / EXPORT ======
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else throw new Error();
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

// ====== SERVER SYNC ======
async function fetchServerQuotes() {
  const res = await fetch(SERVER_API);
  const data = await res.json();
  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchServerQuotes();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let newCount = 0;
    const merged = [...localQuotes];

    serverQuotes.forEach(serverQuote => {
      const exists = localQuotes.some(local => local.text === serverQuote.text);
      if (!exists) {
        merged.push(serverQuote);
        newCount++;
      }
    });

    quotes = merged;
    saveQuotes();
    populateCategories();
    filterQuotes();

    showNotification(newCount > 0
      ? `${newCount} new quote(s) synced from server.`
      : "No new quotes from server.");
  } catch (err) {
    showNotification("Sync failed. Please check your connection.");
  }
}

function showNotification(msg) {
  if (!syncNotification) return;
  syncNotification.textContent = msg;
  syncNotification.style.display = "block";
  setTimeout(() => syncNotification.style.display = "none", 5000);
}

// ====== INIT ON LOAD ======
window.onload = () => {
  populateCategories();
  filterQuotes();
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 30000); // Auto sync every 30s
};

// ====== EVENT LISTENERS ======
if (newQuoteButton) newQuoteButton.addEventListener("click", filterQuotes);
