// Initial array of quotes
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const newQuoteButton = document.getElementById('newQuote');

// Show a random quote
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
}

// Add a new quote from user input
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === '' || category === '') {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Clear inputs
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  // Display the newly added quote
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${newQuote.text}</p>
    <p><em>Category:</em> ${newQuote.category}</p>
  `;
}

// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Show a quote on page load
showRandomQuote();
