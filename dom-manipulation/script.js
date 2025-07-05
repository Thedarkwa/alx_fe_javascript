function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  // Create input for quote text
  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  // Create input for quote category
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  // Create add quote button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  // Append elements to the container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Add form to the body
  document.body.appendChild(formContainer);
}
