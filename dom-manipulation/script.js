// Load from localStorage or use default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

// Save quotes and filter to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

function getSelectedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// Populate dropdown from unique categories
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  
  // Clear old options except "All"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore previously selected category
  const savedCategory = getSelectedCategory();
  categoryFilter.value = savedCategory;
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveSelectedCategory(selectedCategory);

  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>
  `;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Add a new quote and update UI
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories(); // Update dropdown if category is new
  filterQuotes();       // Refresh filtered view

  newQuoteText.value = '';
  newQuoteCategory.value = '';
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
        filterQuotes();
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      alert("Failed to import quotes. Please upload a valid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Load page state
window.onload = () => {
  populateCategories();
  filterQuotes(); // Show quote based on last filter
};
