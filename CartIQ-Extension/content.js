// content.js
const getCartItems = () => {
    // Assuming your website has a way to access the cart items, like a global state or a specific DOM structure
    const cartItems = []; // Replace this with the actual logic to retrieve cart items

    // Example: Assuming cart items are stored in a global variable
    if (window.cartItems) {
        cartItems.push(...window.cartItems); // Adjust according to your cart structure
    }

    return cartItems;
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCartItems') {
        const items = getCartItems();
        sendResponse({ cartItems: items });
    }
});