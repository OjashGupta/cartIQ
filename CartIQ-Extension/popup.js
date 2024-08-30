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
                <div class="details" style="display: none;">
                <div class="details-content"></div>
                </div>
            `;
            itemElement.addEventListener('click', () => toggleDetails(itemElement, item.name));
            cartItemsContainer.appendChild(itemElement);
        });
    }
}

async function fetchProductDetails(productName) {
    try {
        const response = await fetch('http://localhost:8080/getInsights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productName: productName })
        });
        console.log(response.body);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

function toggleDetails(itemElement, productName) {
    const detailsDiv = itemElement.querySelector('.details');
    const detailsContentDiv = itemElement.querySelector('.details-content');

    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';

        fetchProductDetails(productName).then(data => {
            console.log(productName);
            console.log(data);
            if (data) {
                detailsContentDiv.innerHTML = `
                    <h4>Product Details</h4>
                    <p><strong>Serving Size:</strong> ${data.serving_size}</p>
                    <p><strong>Calories:</strong> ${data.calories}</p>
                    <p><strong>Protein:</strong> ${data.protein}</p>
                    <p><strong>Fat:</strong> ${data.fat}</p>
                    <p><strong>Carbohydrate:</strong> ${data.carbohydrate}</p>
                    <p><strong>Sugars:</strong> ${data.sugars}</p>
                    <p><strong>Fiber:</strong> ${data.fiber}</p>
                `;
            } else {
                detailsContentDiv.innerHTML = '<p>Details not available.</p>';
            }
        });
    } else {
        detailsDiv.style.display = 'none';
    }
}
