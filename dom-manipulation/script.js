// --- Load quotes from local storage or initialize ---
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const newQuoteButton = document.getElementById('newQuote');

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Show a random quote ---
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>
  `;

  // Save the last shown quote in session storage
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// --- Add a new quote ---
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes(); // ✅ Save to local storage

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${newQuote.text}</p>
    <p><em>Category:</em> ${newQuote.category}</p>
  `;

  newQuoteText.value = '';
  newQuoteCategory.value = '';
}

// --- Export quotes to JSON file ---
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

// --- Import quotes from JSON file ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      alert("Failed to import quotes. Please upload a valid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Restore last quote on load (optional) ---
window.onload = () => {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><em>Category:</em> ${quote.category}</p>
    `;
  } else {
    showRandomQuote();
  }
};

// --- Event listener for Show New Quote button ---
newQuoteButton.addEventListener('click', showRandomQuote);
