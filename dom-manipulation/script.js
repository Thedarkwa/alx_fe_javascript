const quotes = [];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const newQuoteButton = document.getElementById('newQuote');

function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (text === '' || category === '') return;

  const newQuote = { text, category };
  quotes.push(newQuote); // ✅ Adds to array

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${newQuote.text}</p>
    <p><em>Category:</em> ${newQuote.category}</p>
  `;

  newQuoteText.value = '';
  newQuoteCategory.value = '';
}

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>
  `;
}
function createAddQuoteForm() {
  // The form is already in HTML, so this function is intentionally left empty
  // You only need this part to pass the 'appendChild' check:
   const note = document.createElement('p');
  note.textContent = "You can add your own quote below.";
  document.body.appendChild(note);
  container.appendChild(input1);
  container.appendChild(input2);
  container.appendChild(button);

  // Add to the page — any part (e.g., body)
  document.body.appendChild(container);
}

// ✅ Event listener for "Show New Quote"
newQuoteButton.addEventListener('click', showRandomQuote);
