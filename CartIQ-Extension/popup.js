// document.addEventListener('DOMContentLoaded', function() {
//     // Set up button click listeners
//     const buttons = document.querySelectorAll('#buttons button');
//     const sections = document.querySelectorAll('.section');

//     buttons.forEach(button => {
//         button.addEventListener('click', function() {
//             const targetId = this.id.replace('-btn', '');
//             sections.forEach(section => {
//                 if (section.id === targetId) {
//                     section.classList.add('active');
//                 } else {
//                     section.classList.remove('active');
//                 }
//             });
//         });
//     });

//     // Scrape cart items when the popup is opened
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         chrome.scripting.executeScript(
//             {
//                 target: { tabId: tabs[0].id },
//                 function: scrapeCartItems
//             },
//             (results) => {
//                 if (results && results[0] && results[0].result) {
//                     const cartItems = results[0].result;
//                     displayCartItems(cartItems);
//                     // You can add calls to other functions here, like fetchSimilarItems(cartItems)
//                 }
//             }
//         );
//     });
// });

// function scrapeCartItems() {
//     const cartItems = [];
//     // XPath to select all the cart product containers
//     const cartItemNodes = document.evaluate("//div[contains(@class, 'bg-white-200')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

//     for (let i = 0; i < cartItemNodes.snapshotLength; i++) {
//         const itemNode = cartItemNodes.snapshotItem(i);
        
//         // XPath to extract the name inside h3 element
//         const name = document.evaluate(".//h3", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;

//         // XPath to extract the category inside the p element with specific class
//         const category = document.evaluate(".//p[contains(@class, 'text-left')]", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;
        
//         cartItems.push({ name, category });
//     }

//     return cartItems;
// }

// function displayCartItems(cartItems) {
//     const cartItemsContainer = document.getElementById('cart-items');
//     cartItemsContainer.innerHTML = ''; // Clear previous items
//     if (cartItems.length === 0) {
//         cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
//     } else {
//         cartItems.forEach(item => {
//             const itemElement = document.createElement('div');
//             itemElement.className = 'item';
//             itemElement.innerHTML = `
//                 <h3>${item.name}</h3>
//                 <p>${item.category}</p>
//             `;
//             cartItemsContainer.appendChild(itemElement);
//         });
//     }
// }

// // Placeholder functions for other sections
// function displaySimilarItems() {
//     const similarItemsContainer = document.getElementById('similar-items');
//     similarItemsContainer.innerHTML = '<p>Similar items will be displayed here.</p>';
// }

// function displayInsights() {
//     const insightsContainer = document.getElementById('insights');
//     insightsContainer.innerHTML = '<p>Shopping insights will be displayed here.</p>';
// }

// function displayPastTrends() {
//     const pastTrendsContainer = document.getElementById('past-trends');
//     pastTrendsContainer.innerHTML = '<p>Past shopping trends will be displayed here.</p>';
// }



document.addEventListener('DOMContentLoaded', function() {
    // Set up button click listeners
    const buttons = document.querySelectorAll('#buttons button');
    const sections = document.querySelectorAll('.section');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('-btn', '');
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // Scrape cart items when the popup is opened
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: scrapeCartItems
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    const cartItems = results[0].result;
                    console.log('Scraped Cart Items:', cartItems);  // Log the scraped cart items
                    displayCartItems(cartItems);
                }
            }
        );
    });
});

function scrapeCartItems() {
    const cartItems = [];
    const cartItemNodes = document.evaluate("//div[contains(@class, 'bg-white-200')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < cartItemNodes.snapshotLength; i++) {
        const itemNode = cartItemNodes.snapshotItem(i);
        
        const name = document.evaluate(".//h3", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;
        const category = document.evaluate(".//p[contains(@class, 'text-left')]", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;
        
        cartItems.push({ name, category });
    }

    console.log('Scraped Items inside the function:', cartItems);  // Log items inside the scraping function
    return cartItems;
}

function displayCartItems(cartItems) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
    } else {
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.category}</p>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
}
