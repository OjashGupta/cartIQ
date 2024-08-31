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
//                     console.log('Scraped Cart Items:', cartItems);  // Log the scraped cart items
//                     displayCartItems(cartItems);
//                 }
//             }
//         );
//     });
// });

// function scrapeCartItems() {
//     const cartItems = [];
//     const cartItemNodes = document.evaluate("//div[contains(@class, 'bg-white-200')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

//     for (let i = 0; i < cartItemNodes.snapshotLength; i++) {
//         const itemNode = cartItemNodes.snapshotItem(i);
        
//         const name = document.evaluate(".//h3", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;
//         const category = document.evaluate(".//p[contains(@class, 'text-left')]", itemNode, null, XPathResult.STRING_TYPE, null).stringValue;
        
//         cartItems.push({ name, category });
//     }

//     console.log('Scraped Items inside the function:', cartItems);  // Log items inside the scraping function
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
//                 <div class="details" style="display: none;">
//                 <div class="details-content"></div>
//                 </div>
//             `;
//             itemElement.addEventListener('click', () => toggleDetails(itemElement, item.name));
//             cartItemsContainer.appendChild(itemElement);
//         });
//     }
// }

// async function fetchProductDetails(productName) {
//     try {
//         const response = await fetch('http://localhost:8080/getInsights', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ productName: productName })
//         });
//         console.log(response.body);
//         const result = await response.json();
//         return result.data;
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         return null;
//     }
// }

// function toggleDetails(itemElement, productName) {
//     const detailsDiv = itemElement.querySelector('.details');
//     const detailsContentDiv = itemElement.querySelector('.details-content');

//     if (detailsDiv.style.display === 'none') {
//         detailsDiv.style.display = 'block';

//         fetchProductDetails(productName).then(data => {
//             console.log(productName);
//             console.log(data);
//             if (data) {
//                 detailsContentDiv.innerHTML = `
//                     <h4>Product Details</h4>
//                     <p><strong>Serving Size:</strong> ${data.serving_size}</p>
//                     <p><strong>Calories:</strong> ${data.calories}</p>
//                     <p><strong>Protein:</strong> ${data.protein}</p>
//                     <p><strong>Fat:</strong> ${data.fat}</p>
//                     <p><strong>Carbohydrate:</strong> ${data.carbohydrate}</p>
//                     <p><strong>Sugars:</strong> ${data.sugars}</p>
//                     <p><strong>Fiber:</strong> ${data.fiber}</p>
//                 `;
//             } else {
//                 detailsContentDiv.innerHTML = '<p>Details not available.</p>';
//             }
//         });
//     } else {
//         detailsDiv.style.display = 'none';
//     }
// }
document.addEventListener('DOMContentLoaded', function() {
    // Set up button click listeners
    const buttons = document.querySelectorAll('#buttons button');
    const sections = document.querySelectorAll('.section');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('-btn', '');
            sections.forEach(section => {
                section.classList.toggle('active', section.id === targetId);
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
                    console.log('Scraped Cart Items:', cartItems); // Log the scraped cart items
                    displayCartItems(cartItems);
                    showInsights(cartItems);
                    fetchSimilarItems(cartItems);
                    pastTrends()
                } else {
                    console.error('No cart items found or an error occurred.');
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

    console.log('Scraped Items inside the function:', cartItems); // Log items inside the scraping function
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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

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

async function showInsights(cartItems) {
    productNames = []
    for(let i=0; i < cartItems.length;i++){
        productNames.push(cartItems[i]["name"])
    }
    const response = await fetch('http://localhost:8080/getAllInsights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listOfProducts: productNames })
    });
    const result = await response.json();
    console.log(result.data);
    const data = result.data;

    const sum = calculateSums(data)
    console.log(sum);

    const labels = Object.keys(sum).slice(1);
    const values = Object.values(sum).slice(1);
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    const total_calories = sum.calories;
    const target_div = document.getElementById('calories');
    const newElement = document.createElement('p');
    newElement.textContent = "The total calories of your cart: " + total_calories + ".";
    target_div.appendChild(newElement);

    const maxValue = Math.max(...values);
    const barWidth = 40;
    const gap = 30;

    labels.forEach((label, index) => {
        const barHeight = (values[index] / maxValue) * 200;
        const x = index * (barWidth + gap);
        const y = canvas.height - barHeight - 30;
    
        // Add shadow to the bars
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
    
        // Draw the bars with a gradient
        const gradient = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight);
        gradient.addColorStop(0, 'rgba(0, 150, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 80, 255, 0.7)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
    
        // Reset shadow for text
        ctx.shadowColor = 'transparent';
    
        // Draw the label
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barWidth / 2, canvas.height - 10);
    
        // Draw the value above the bar
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(values[index], x + barWidth / 2, y - 10);
    });
    

    return ;
}

function calculateSums(data) {
    const totals = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrate: 0,
        sugars: 0,
        fiber: 0,
    };

    data.forEach(item => {
        totals.calories += item.calories || 0;
        totals.protein += parseFloat(item.protein) || 0;
        totals.fat += parseFloat(item.fat) || 0;
        totals.carbohydrate += parseFloat(item.carbohydrate) || 0;
        totals.sugars += parseFloat(item.sugars) || 0;
        totals.fiber += parseFloat(item.fiber) || 0;
    });

    // Round the totals to 2 decimal places
    totals.calories = parseFloat(totals.calories.toFixed(2));
    totals.protein = parseFloat(totals.protein.toFixed(2));
    totals.fat = parseFloat(totals.fat.toFixed(2));
    totals.carbohydrate = parseFloat(totals.carbohydrate.toFixed(2));
    totals.sugars = parseFloat(totals.sugars.toFixed(2));
    totals.fiber = parseFloat(totals.fiber.toFixed(2));

    return totals;
}

async function fetchSimilarItems(cartItems) {
    cartCategories = []
    for(let i=0; i < cartItems.length;i++){
        cartCategories.push(cartItems[i]["category"])
    }
    const response = await fetch('http://localhost:8080/similarItems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listOfCategories: cartCategories })
    });
    const result = await response.json();
    console.log(result.data);
    const data = result.data;

    const filteredItems = data.filter(dataItem => !cartItems.some(cartItem => cartItem.name === dataItem.name))
    const cartItemsContainer = document.getElementById('similar-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (filteredItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
    } else {
        filteredItems .forEach(item => {
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

function pastTrends() {
    const canvas = document.getElementById('pastTrend');
    const ctx = canvas.getContext('2d');

// Data
    const data = {
        labels: [1, 2, 3, 4, 5],
        datasets: [
            {
                label: 'Protein Purchases (g)',
                data: [41, 45, 50, 43, 51],
                borderColor: 'blue',
                backgroundColor: 'blue',
            },
            {
                label: 'Fat Purchases (g)',
                data: [23, 18, 30, 35, 29],
                borderColor: 'orange',
                backgroundColor: 'orange',
            },
            {
                label: 'Sugar Purchases (g)',
                data: [18, 19, 20, 21, 22],
                borderColor: 'green',
                backgroundColor: 'green',
            },
            {
                label: 'Fiber Purchases (g)',
                data: [10, 12, 13, 11, 12],
                borderColor: 'purple',
                backgroundColor: 'purple',
            },
            {
                label: 'Carbohydrate Purchases (g)',
                data: [50, 65, 60, 70, 48],
                borderColor: 'red',
                backgroundColor: 'red',
            }
        ]
    };

// Utility functions
    function drawLine(ctx, startX, startY, endX, endY, color) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    function drawPoint(ctx, x, y, color) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    // Drawing graph
    function drawGraph(ctx, data) {
        const padding = 35;
        const chartHeight = canvas.height - padding * 3;
        const chartWidth = canvas.width - padding * 3;
        const xInterval = chartWidth / (data.labels.length - 2);
        const maxYValue = 70;
        const unitRatio = chartHeight / maxYValue;

        // Draw Y axis labels
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        for (let i = 0; i <= 7; i++) {
            const y = padding + chartHeight - (i * chartHeight / 7);
            ctx.fillText(i * 10, padding - 30, y + 3);
            drawLine(ctx, padding - 10, y, padding + chartWidth, y, '#ddd');
        }

        // Draw X axis labels
        data.labels.forEach((label, index) => {
            const x = padding + index * xInterval;
            ctx.fillText(label, x - 4, canvas.height - padding + 5);
        });

        // Draw lines and points
        data.datasets.forEach(dataset => {
            ctx.strokeStyle = dataset.borderColor;
            ctx.fillStyle = dataset.backgroundColor;

            dataset.data.forEach((value, index) => {
                const x = padding + index * xInterval;
                const y = padding + chartHeight - (value * unitRatio);
                if (index > 0) {
                    const prevX = padding + (index - 1) * xInterval;
                    const prevY = padding + chartHeight - (dataset.data[index - 1] * unitRatio);
                    drawLine(ctx, prevX, prevY, x, y, dataset.borderColor);
                }
                drawPoint(ctx, x, y, dataset.backgroundColor);
            });
        });

        // Chart title
        ctx.font = "14px Arial";
        ctx.fillText("Recent Purchases of Nutrients (in gm)", padding, padding - 10);
    }

    drawGraph(ctx, data);
    }
