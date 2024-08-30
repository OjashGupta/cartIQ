// // document.addEventListener('DOMContentLoaded', function () {
// //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //       chrome.scripting.executeScript(
// //         {
// //           target: { tabId: tabs[0].id },
// //           function: scrapeCartItems
// //         },
// //         (results) => {
// //           if (results && results[0] && results[0].result) {
// //             const cartItems = results[0].result;
// //             displayCartItems(cartItems);
// //             fetchSimilarItems(cartItems);
// //           }
// //         }
// //       );
// //     });
// //   });
  
// //   function scrapeCartItems() {
// //     // Ensure that the cart items are fully loaded
// //     const cartItems = [];
    
// //     // More robust selector for cart items
// //     document.querySelectorAll('w-full max-w-3xl').forEach(item => {
// //       const name = item.querySelector('.font-semibold text-green-900 text-left capitalize text-lg md:text-xl')?.innerText;
// //       const category = item.querySelector('.text-left text-slate-500 font-medium text-medium ')?.innerText; // Optional: handle quantity
// //       const price = item.querySelector('.font-bold text-base text-green-700')?.innerText; // Optional: handle price
// //       cartItems.push({ name, category, price });
// //     });
// //     // Return the cart items
// //     // console.log("pookie");
// //     // console.log(cartItems);
// //     return cartItems;
// //   }

// //   function displayCartItems(cartItems) {
// //     const cartItemsContainer = document.getElementById('cart-items');
// //     cartItemsContainer.innerHTML = ''; // Clear previous items
// //     cartItems.forEach(item => {
// //       const itemElement = document.createElement('div');
// //       itemElement.className = 'item';
// //       itemElement.innerHTML = `<h2>${item.name}</h2><p>Quantity: ${item.quantity}</p><p>Price: ${item.price}</p>`;
// //       cartItemsContainer.appendChild(itemElement);
// //     });
// //   }
  
// //   function fetchSimilarItems(cartItems) {
// //     fetch('http://localhost:8080/product')
// //       .then(response => response.json())
// //       .then(data => {
// //         fetch(chrome.runtime.getURL('nutrition.json'))
// //           .then(response => response.json())
// //           .then(nutritionData => {
// //             const similarItems = findSimilarItems(cartItems, data, nutritionData);
// //             displaySimilarItems(similarItems);
// //           });
// //       });
// //   }
  
// //   function findSimilarItems(cartItems, allItems, nutritionData) {
// //     const similarItems = [];
// //     cartItems.forEach(cartItem => {
// //       const item = allItems.find(i => i.name === cartItem.name);
// //       if (item) {
// //         const category = item.category;
// //         const similar = allItems.filter(i => i.category === category || isNutritionallySimilar(i, item, nutritionData));
// //         similarItems.push(...similar.slice(0, 5));
// //       }
// //     });
// //     return similarItems;
// //   }
  
// //   function isNutritionallySimilar(item1, item2, nutritionData) {
// //     const nutrition1 = nutritionData.find(n => n.name === item1.name);
// //     const nutrition2 = nutritionData.find(n => n.name === item2.name);
// //     if (!nutrition1 || !nutrition2) return false;
  
// //     // Implement your similarity logic here
// //     return true;
// //   }
  
// //   function displaySimilarItems(similarItems) {
// //     const similarItemsContainer = document.getElementById('similar-items');
// //     similarItemsContainer.innerHTML = ''; // Clear previous items
// //     similarItems.forEach(item => {
// //       const itemElement = document.createElement('div');
// //       itemElement.className = 'item';
// //       itemElement.innerHTML = `<h2>${item.name}</h2><p>${item.description}</p>`;
// //       similarItemsContainer.appendChild(itemElement);
// //     });
// //   }
  
// // // import React, { useEffect, useState } from 'react';
// // // import ReactDOM from 'react-dom';
// // // import './popup.css'; // Assuming you have some styles for the popup

// // // const Popup = () => {
// // //     const [cartItems, setCartItems] = useState([]);
// // //     const [totalPrice, setTotalPrice] = useState(0);

// // //     useEffect(() => {
// // //         // Fetch cart items from the content script using message passing
// // //         chrome.runtime.sendMessage({ action: 'getCartItems' }, (response) => {
// // //             if (response && response.cartItems) {
// // //                 setCartItems(response.cartItems);
// // //                 const total = response.cartItems.reduce((acc, item) => acc + item.total, 0);
// // //                 setTotalPrice(total);
// // //             }
// // //         });
// // //     }, []);

// // //     return (
// // //         <div className="popup-container">
// // //             <h2 className="popup-title">Your Cart Items</h2>
// // //             {cartItems.length === 0 ? (
// // //                 <p className="empty-cart">Your cart is empty!</p>
// // //             ) : (
// // //                 <div>
// // //                     <div className="cart-items">
// // //                         {cartItems.map((item) => (
// // //                             <div key={item.id} className="cart-item">
// // //                                 <img src={item.image} alt={item.name} className="cart-item-image" />
// // //                                 <div className="cart-item-details">
// // //                                     <h3 className="cart-item-name">{item.name}</h3>
// // //                                     <p className="cart-item-category">{item.category}</p>
// // //                                     <p className="cart-item-price">
// // //                                         <span className="currency">₹</span>{item.price}
// // //                                     </p>
// // //                                     <p className="cart-item-qty">Quantity: {item.qty}</p>
// // //                                     <p className="cart-item-total">Total: ₹{item.total}</p>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                     <div className="cart-summary">
// // //                         <h3>Total Price: ₹{totalPrice}</h3>
// // //                     </div>
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // // Render the Popup component
// // // ReactDOM.render(<Popup />, document.getElementById('root'));

// document.addEventListener('DOMContentLoaded', function() {
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
//                 }
//             }
//         );
//     });
// });

// function scrapeCartItems() {
//     const cartItems = [];
//     // XPath to select all the cart product containers
//     const cartItemNodes = document.evaluate("//div[contains(@class, 'bg-green-200')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

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
//     cartItems.forEach(item => {
//         const itemElement = document.createElement('div');
//         itemElement.className = 'item';
//         itemElement.innerHTML = `<h2>${item.name}</h2><p>${item.category}</p>`;
//         cartItemsContainer.appendChild(itemElement);
//     });
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
                    displayCartItems(cartItems);
                    // You can add calls to other functions here, like fetchSimilarItems(cartItems)
                }
            }
        );
    });
});

function scrapeCartItems() {
    const cartItems = [];
    // XPath to select all the cart product containers
    const cartItemNodes = document.evaluate("//div[contains(@class, 'bg-white-200')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < cartItemNodes.snapshotLength; i++) {
        const itemNode = cartItemNodes.snapshotItem(i);
        
        // XPath to extract the name inside h3 element
        const name = document.evaluate(".//h3", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;

        // XPath to extract the category inside the p element with specific class
        const category = document.evaluate(".//p[contains(@class, 'text-left')]", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;
        
        cartItems.push({ name, category });
    }

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

// Placeholder functions for other sections
function displaySimilarItems() {
    const similarItemsContainer = document.getElementById('similar-items');
    similarItemsContainer.innerHTML = '<p>Similar items will be displayed here.</p>';
}

function displayInsights() {
    const insightsContainer = document.getElementById('insights');
    insightsContainer.innerHTML = '<p>Shopping insights will be displayed here.</p>';
}

function displayPastTrends() {
    const pastTrendsContainer = document.getElementById('past-trends');
    pastTrendsContainer.innerHTML = '<p>Past shopping trends will be displayed here.</p>';
}

// You can call these functions when the respective buttons are clicked
// For now, they're just placeholders
