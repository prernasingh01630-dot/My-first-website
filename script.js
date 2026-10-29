/* ==========================================================================
   URBAN CART - JAVASCRIPT INTERACTIONS
   Simple, readable, beginner-friendly vanilla JavaScript.
   
   Contents:
   1. DOM Elements Selection
   2. Application State (Cart Array & Filters)
   3. Accessible Shopping Cart Drawer (Open, Close, Keyboard Events)
   4. Cart Management (Add, Update Quantity, Remove, Clear)
   5. Cost & Bill Calculation (Subtotal, Shipping, Grand Total)
   6. Product Search & Category Filtering
   7. Checkout Order Preview Modal
   8. Contact Form Confirmation
   9. Graceful Image Fallbacks
   ========================================================================== */

// Execute when HTML document is fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // --------------------------------------------------------------------------
    // 1. DOM ELEMENT REFERENCES
    // --------------------------------------------------------------------------

    // Search bar elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Category filter buttons and counter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resultsCountText = document.getElementById('results-count-text');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const resetSearchBtn = document.getElementById('reset-search-btn');

    // Product cards and empty message
    const productCards = document.querySelectorAll('.product-card');
    const noProductsMessage = document.getElementById('no-products-message');

    // Header Cart Button & Counter
    const cartBtn = document.getElementById('cart-btn');
    const cartCountElement = document.getElementById('cart-count');

    // Cart Drawer Elements
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');

    // Shipping benefit banner elements
    const shippingNoticeText = document.getElementById('shipping-notice-text');
    const shippingProgressBar = document.getElementById('shipping-progress-bar');

    // Bill Summary Elements
    const billSubtotal = document.getElementById('bill-subtotal');
    const billShipping = document.getElementById('bill-shipping');
    const billTotal = document.getElementById('bill-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Toast Notification
    const cartToast = document.getElementById('cart-toast');
    const cartToastMessage = document.getElementById('cart-toast-message');
    const cartToastAction = document.getElementById('cart-toast-action');
    let toastTimeout = null;

    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutModalClose = document.getElementById('checkout-modal-close');
    const modalBackBtn = document.getElementById('modal-back-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const checkoutItemsSummary = document.getElementById('checkout-items-summary');
    const modalSubtotal = document.getElementById('modal-subtotal');
    const modalShipping = document.getElementById('modal-shipping');
    const modalTotal = document.getElementById('modal-total');
    const orderSuccessMessage = document.getElementById('order-success-message');
    const orderIdDisplay = document.getElementById('order-id-display');

    // Footer Category Links
    const footerCatLinks = document.querySelectorAll('.footer-cat-link');

    // Contact Form
    const inquiryForm = document.getElementById('inquiry-form');
    const inquiryFeedback = document.getElementById('inquiry-feedback');

    // --------------------------------------------------------------------------
    // 2. APPLICATION STATE
    // --------------------------------------------------------------------------
    
    /*
     * Cart Array: Holds the list of added items.
     * Each item is an object:
     * {
     *   id: '1',
     *   name: 'Canvas Tote Bag',
     *   category: 'Accessories',
     *   price: 799,
     *   image: 'https://...',
     *   quantity: 1
     * }
     */
    let cart = [];
    let selectedCategory = 'all';
    const totalProducts = productCards.length;

    // Free delivery threshold in Indian rupees (₹)
    const FREE_SHIPPING_THRESHOLD = 999;
    const STANDARD_SHIPPING_FEE = 99;

    // --------------------------------------------------------------------------
    // 3. ACCESSIBLE CART DRAWER (OPEN & CLOSE)
    // --------------------------------------------------------------------------

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        cartDrawer.setAttribute('aria-hidden', 'false');
        cartBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('cart-open');
        cartCloseBtn.focus();
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        cartDrawer.setAttribute('aria-hidden', 'true');
        cartBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('cart-open');
    }

    // Header cart button click
    cartBtn.addEventListener('click', openCart);

    // Close button & overlay click
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }

    // Keyboard support: Close cart or modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (cartDrawer.classList.contains('active')) {
                closeCart();
            }
            if (checkoutModal.style.display === 'flex') {
                closeCheckoutModal();
            }
        }
    });

    // --------------------------------------------------------------------------
    // 4. NOTIFICATION TOAST
    // --------------------------------------------------------------------------

    function showToast(productName) {
        cartToastMessage.textContent = `Added "${productName}" to your cart.`;
        cartToast.classList.add('show');

        // Clear existing timer if triggered rapidly
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(function () {
            cartToast.classList.remove('show');
        }, 3500);
    }

    cartToastAction.addEventListener('click', function () {
        cartToast.classList.remove('show');
        openCart();
    });

    // --------------------------------------------------------------------------
    // 5. CART MANAGEMENT & BILL CALCULATION
    // --------------------------------------------------------------------------

    /*
     * renderCart()
     * Calculates total items, items subtotal, shipping charge, and final bill amount.
     * Renders item list and bill details in the drawer.
     */
    function renderCart() {
        // 1. Calculate totals
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(function (item) {
            totalItems += item.quantity;
            subtotal += (item.price * item.quantity);
        });

        // Calculate delivery charge: Free if subtotal >= 999 or cart is empty, else ₹99
        let shippingFee = 0;
        if (totalItems > 0) {
            shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
        }

        const grandTotal = subtotal + shippingFee;

        // 2. Update Header & Drawer Count Badges
        cartCountElement.textContent = totalItems;
        cartDrawerCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;

        // 3. Update Shipping Notice & Progress Bar
        if (totalItems === 0) {
            shippingNoticeText.textContent = `Free standard delivery on orders over ₹${FREE_SHIPPING_THRESHOLD}.`;
            shippingProgressBar.style.width = '0%';
        } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
            shippingNoticeText.textContent = `Free delivery unlocked for your order!`;
            shippingProgressBar.style.width = '100%';
        } else {
            const needed = FREE_SHIPPING_THRESHOLD - subtotal;
            const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
            shippingNoticeText.textContent = `Add ₹${needed.toLocaleString('en-IN')} more to get Free Delivery!`;
            shippingProgressBar.style.width = `${progressPercent}%`;
        }

        // 4. Update Bill Breakdown in Drawer
        billSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        billShipping.textContent = totalItems === 0 
            ? '₹0' 
            : (shippingFee === 0 ? 'Free (₹0)' : `₹${shippingFee}`);
        billTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

        // 5. Render Cart Items List
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            // Render friendly empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'cart-empty-state';
            emptyState.innerHTML = `
                <h3 class="cart-empty-title">Your cart is empty</h3>
                <p class="cart-empty-desc">You have not added any products yet. Browse through our essentials and add what you like.</p>
                <button type="button" id="empty-explore-btn" class="btn btn-secondary">Explore Products</button>
            `;
            cartItemsContainer.appendChild(emptyState);

            // Connect explore button inside empty state
            document.getElementById('empty-explore-btn').addEventListener('click', function () {
                closeCart();
                const productSec = document.getElementById('products-section');
                if (productSec) productSec.scrollIntoView({ behavior: 'smooth' });
            });

            // Disable checkout button when cart is empty
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.6';
            checkoutBtn.style.cursor = 'not-allowed';
            clearCartBtn.style.display = 'none';

        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
            clearCartBtn.style.display = 'inline-block';

            // Loop through each item in cart and create its card
            cart.forEach(function (item) {
                const itemTotal = item.price * item.quantity;

                const itemCard = document.createElement('div');
                itemCard.className = 'cart-item-card';
                itemCard.innerHTML = `
                    <img 
                        src="${item.image}" 
                        alt="${item.name}" 
                        class="cart-item-thumb"
                        onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2268%22%20height%3D%2268%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EItem%3C%2Ftext%3E%3C%2Fsvg%3E';"
                    >
                    <div class="cart-item-info">
                        <span class="cart-item-category">${item.category}</span>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')} each</span>
                        
                        <div class="cart-item-bottom-row">
                            <div class="qty-control-group" role="group" aria-label="Change item quantity">
                                <button type="button" class="qty-btn btn-decrease" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button type="button" class="qty-btn btn-increase" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">+</button>
                            </div>
                            <strong class="cart-item-total">₹${itemTotal.toLocaleString('en-IN')}</strong>
                        </div>

                        <button type="button" class="cart-item-remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                `;

                cartItemsContainer.appendChild(itemCard);
            });
        }
    }

    /*
     * addToCart(productId)
     * Finds product details from the HTML card data attributes,
     * updates the cart array, and refreshes the bill.
     */
    function addToCart(productId) {
        // Find matching product card element in DOM
        const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (!productCard) return;

        const name = productCard.getAttribute('data-name');
        const category = productCard.getAttribute('data-category');
        const price = parseInt(productCard.getAttribute('data-price'), 10);
        const image = productCard.getAttribute('data-image');

        // Check if item is already in cart
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: name,
                category: category,
                price: price,
                image: image,
                quantity: 1
            });
        }

        // Re-calculate and render cart
        renderCart();

        // Show brief toast notification
        showToast(name);
    }

    /*
     * Delegate quantity (+ / -) and remove button clicks inside cart drawer
     */
    cartItemsContainer.addEventListener('click', function (event) {
        const target = event.target;

        // Increase quantity
        if (target.classList.contains('btn-increase')) {
            const id = target.getAttribute('data-id');
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += 1;
                renderCart();
            }
        }

        // Decrease quantity
        if (target.classList.contains('btn-decrease')) {
            const id = target.getAttribute('data-id');
            const item = cart.find(i => i.id === id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // If quantity is 1 and decreased, remove item from cart
                    cart = cart.filter(i => i.id !== id);
                }
                renderCart();
            }
        }

        // Remove item
        if (target.classList.contains('cart-item-remove-btn')) {
            const id = target.getAttribute('data-id');
            cart = cart.filter(i => i.id !== id);
            renderCart();
        }
    });

    // Clear entire cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function () {
            if (cart.length > 0) {
                cart = [];
                renderCart();
            }
        });
    }

    /*
     * Attach "Add to Cart" click listener to each product card button
     */
    productCards.forEach(function (card) {
        const productId = card.getAttribute('data-id');
        const addBtn = card.querySelector('.add-to-cart-btn');

        if (addBtn) {
            addBtn.addEventListener('click', function () {
                addToCart(productId);

                // Temporary button feedback
                const originalText = 'Add to Cart';
                addBtn.textContent = 'Added';
                addBtn.classList.add('added');
                addBtn.disabled = true;

                setTimeout(function () {
                    addBtn.textContent = originalText;
                    addBtn.classList.remove('added');
                    addBtn.disabled = false;
                }, 1200);
            });
        }
    });

    // Initial render to set ₹0 and empty state
    renderCart();

    // --------------------------------------------------------------------------
    // 6. CHECKOUT BILL PREVIEW & CONFIRMATION MODAL
    // --------------------------------------------------------------------------

    function openCheckoutModal() {
        if (cart.length === 0) return;

        // Close drawer first
        closeCart();

        // Calculate bill breakdown
        let subtotal = 0;
        let totalQty = 0;
        checkoutItemsSummary.innerHTML = '';

        cart.forEach(function (item) {
            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;
            totalQty += item.quantity;

            const lineDiv = document.createElement('div');
            lineDiv.className = 'checkout-item-line';
            lineDiv.innerHTML = `
                <span class="checkout-item-name">${item.name} &times; ${item.quantity}</span>
                <span class="checkout-item-calc">₹${lineTotal.toLocaleString('en-IN')}</span>
            `;
            checkoutItemsSummary.appendChild(lineDiv);
        });

        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
        const total = subtotal + shipping;

        // Populate bill numbers in modal
        modalSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        modalShipping.textContent = shipping === 0 ? 'Free (₹0)' : `₹${shipping}`;
        modalTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

        // Reset order placed message state
        orderSuccessMessage.style.display = 'none';
        placeOrderBtn.style.display = 'inline-block';
        modalBackBtn.textContent = 'Back to Cart';

        // Display modal
        checkoutModal.style.display = 'flex';
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    checkoutBtn.addEventListener('click', openCheckoutModal);
    checkoutModalClose.addEventListener('click', closeCheckoutModal);

    modalBackBtn.addEventListener('click', function () {
        closeCheckoutModal();
        openCart();
    });

    // Simulated Order Placement
    placeOrderBtn.addEventListener('click', function () {
        const orderId = '#UC-' + Math.floor(10000 + Math.random() * 90000);
        orderIdDisplay.textContent = `Order Reference: ${orderId}`;
        orderSuccessMessage.style.display = 'block';

        // Clear cart after placing order
        cart = [];
        renderCart();

        // Change button states
        placeOrderBtn.style.display = 'none';
        modalBackBtn.textContent = 'Close & Continue';
    });

    // --------------------------------------------------------------------------
    // 7. PRODUCT FILTERING AND SEARCH
    // --------------------------------------------------------------------------

    /*
     * filterProducts()
     * Compares each product card against BOTH the active category
     * and the current search query text.
     */
    function filterProducts() {
        const searchQuery = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        productCards.forEach(function (card) {
            const productName = card.getAttribute('data-name').toLowerCase();
            const productCategory = card.getAttribute('data-category');

            const matchesCategory = (selectedCategory === 'all' || productCategory === selectedCategory);
            const matchesSearch = (searchQuery === '' || productName.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update results counter text
        if (selectedCategory === 'all' && searchQuery === '') {
            resultsCountText.textContent = `Showing all ${totalProducts} products`;
            clearFiltersBtn.style.display = 'none';
        } else {
            resultsCountText.textContent = `Showing ${visibleCount} of ${totalProducts} products`;
            clearFiltersBtn.style.display = 'inline-block';
        }

        // Show "No products found" message if none match
        if (visibleCount === 0) {
            noProductsMessage.style.display = 'block';
        } else {
            noProductsMessage.style.display = 'none';
        }
    }

    // Category button clicks
    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            selectedCategory = button.getAttribute('data-category');
            filterProducts();
        });
    });

    // Live search input
    searchInput.addEventListener('input', filterProducts);

    // Search button click
    searchBtn.addEventListener('click', function () {
        filterProducts();
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Reset filters
    function resetAllFilters() {
        searchInput.value = '';
        selectedCategory = 'all';

        filterButtons.forEach(function (button) {
            if (button.getAttribute('data-category') === 'all') {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        filterProducts();
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', resetAllFilters);
    }
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', resetAllFilters);
    }

    // Footer category shortcuts
    footerCatLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            const targetCategory = link.getAttribute('data-cat');
            selectedCategory = targetCategory;

            filterButtons.forEach(function (btn) {
                if (btn.getAttribute('data-category') === targetCategory) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            filterProducts();
        });
    });

    // --------------------------------------------------------------------------
    // 8. CONTACT FORM CONFIRMATION
    // --------------------------------------------------------------------------
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const nameInput = document.getElementById('inquiry-name');
            const enteredName = nameInput ? nameInput.value.trim() : 'Customer';

            inquiryFeedback.textContent = `Thank you, ${enteredName}! Your message has been received. Our support team will get back to you shortly.`;
            inquiryFeedback.className = 'form-feedback success';
            inquiryFeedback.style.display = 'block';

            inquiryForm.reset();

            setTimeout(function () {
                inquiryFeedback.style.display = 'none';
            }, 5000);
        });
    }

    // --------------------------------------------------------------------------
    // 9. OFFLINE / FALLBACK IMAGE HANDLER
    // --------------------------------------------------------------------------
    const images = document.querySelectorAll('.product-image, .hero-image');
    images.forEach(function (img) {
        img.addEventListener('error', function () {
            const label = encodeURIComponent(img.alt || 'Urban Cart Product');
            img.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%2364748b%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E${label}%3C%2Ftext%3E%3C%2Fsvg%3E`;
        });
    });

});
