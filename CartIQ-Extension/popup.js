document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: scrapeCartItems
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const cartItems = results[0].result;
            displayCartItems(cartItems);
            fetchSimilarItems(cartItems);
          }
        }
      );
    });
  });
  
  function scrapeCartItems() {
    // This function will be executed in the context of the webpage
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
      const name = item.querySelector('.item-name').innerText;
      cartItems.push(name);
    });
    return cartItems;
  }
  
  function displayCartItems(cartItems) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'item';
      itemElement.innerHTML = `<h2>${item}</h2>`;
      cartItemsContainer.appendChild(itemElement);
    });
  }
  
  function fetchSimilarItems(cartItems) {
    fetch('http://localhost:8080/product')
      .then(response => response.json())
      .then(data => {
        fetch(chrome.runtime.getURL('nutrition.json'))
          .then(response => response.json())
          .then(nutritionData => {
            const similarItems = findSimilarItems(cartItems, data, nutritionData);
            displaySimilarItems(similarItems);
          });
      });
  }
  
  function findSimilarItems(cartItems, allItems, nutritionData) {
    const similarItems = [];
    cartItems.forEach(cartItem => {
      const item = allItems.find(i => i.name === cartItem);
      if (item) {
        const category = item.category;
        const similar = allItems.filter(i => i.category === category || isNutritionallySimilar(i, item, nutritionData));
        similarItems.push(...similar.slice(0, 5));
      }
    });
    return similarItems;
  }
  
  function isNutritionallySimilar(item1, item2, nutritionData) {
    const nutrition1 = nutritionData.find(n => n.name === item1.name);
    const nutrition2 = nutritionData.find(n => n.name === item2.name);
    if (!nutrition1 || !nutrition2) return false;
  
    // Implement your similarity logic here
    return true;
  }
  
  function displaySimilarItems(similarItems) {
    const similarItemsContainer = document.getElementById('similar-items');
    similarItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'item';
      itemElement.innerHTML = `<h2>${item.name}</h2><p>${item.description}</p>`;
      similarItemsContainer.appendChild(itemElement);
    });
  }