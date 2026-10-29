# Urban Cart - Front-End Shopping Website

**Urban Cart** is a clean, modern, and professional front-end shopping website built with standard **HTML5**, **CSS3**, and beginner-friendly **vanilla JavaScript**.

---

## 1. Project Overview

- **Store Name:** Urban Cart
- **Tagline:** Everyday Essentials
- **Hero Statement:** Good Products for Everyday Living
- **Currency:** Indian Rupees (&#8377;)
- **Tech Stack:** HTML5, CSS3, Vanilla JavaScript (No frameworks, no external libraries, no backend)

---

## 2. File Structure

```text
ANTIGRAVITY IDE/
│
├── index.html       # Semantic HTML5 markup for all sections and accessible cart drawer
├── style.css        # Clean CSS styling (light theme, left-aligned, responsive)
├── script.js        # Beginner-friendly JavaScript (cart management, live billing, search & filter)
└── README.md        # Documentation and guide
```

---

## 3. Implemented Features

### 3.1 Accessible Cart Drawer & Live Billing
- **Open / Close Controls:**
  - Accessible Header Cart Button (`Cart: X items`) with keyboard support (`Escape` key, click overlay or Close button).
  - Floating Toast Notification after adding an item with a direct "View Cart" button.
- **Itemized Cart View:**
  - Displays product thumbnail, name, category, and unit price (&#8377;).
  - Quantity controls (`-` and `+`) to increase or decrease quantities on the fly.
  - Subtotal per item (`unit price × quantity`).
  - Single-click item removal (`Remove` button).
  - "Clear Cart" button to empty everything at once.
- **Dynamic Delivery Eligibility:**
  - Free delivery across India on orders over **&#8377;999**.
  - Live progress bar showing how much more to add to unlock free delivery.
- **Complete Bill Breakdown:**
  - **Items Subtotal** (&#8377;)
  - **Delivery Fee:** Free (&#8377;0) if subtotal &#8805; &#8377;999, else &#8377;99 standard fee.
  - **Total Bill Amount:** Accurately calculated grand total in &#8377;.
  - Tax note: "All prices are inclusive of standard GST and taxes."
- **Order Preview & Checkout Simulation:**
  - "Proceed to Checkout" opens an itemized order summary modal.
  - Clicking "Place Order" simulates a completed transaction with a generated order reference (e.g., `#UC-98421`).

### 3.2 Header & Navigation
- **Announcement Bar:** Free delivery across India on orders over &#8377;999 with 7-day hassle-free returns.
- **Brand Identity:** Bold left-aligned logo and tagline ("Urban Cart - Everyday Essentials").
- **Search Bar:** Real-time search field with dedicated "Search" button that scrolls smoothly to catalog.
- **Cart Button:** Header trigger with dynamic counter.
- **Main Navigation:** Links for *Home*, *Shop All*, *Categories*, *Why Choose Us*, and *Contact*.

### 3.3 Hero Section
- **Heading:** "Good Products for Everyday Living."
- **Description:** Left-aligned introduction to everyday essentials.
- **Button:** "Explore Products" button with smooth scroll.
- **Visual:** High-resolution lifestyle store image.
- **Strictly Left-Aligned:** Adheres to layout rules with zero center-aligned content.

### 3.4 Benefits Section (3 Items)
1. **Everyday Products:** Practical essentials designed for reliability and daily utility.
2. **Clear Pricing:** Honest prices in Indian rupees with no hidden fees or extra charges.
3. **Easy Shopping:** Smooth browsing, instant category filtering, and straightforward shopping.

### 3.5 Featured Products (8 Sample Items in &#8377;)
1. **Canvas Tote Bag** (Accessories) - &#8377;799
2. **Modern Desk Lamp** (Home) - &#8377;1,499
3. **Wireless Headphones** (Tech) - &#8377;2,999
4. **Ceramic Coffee Mug** (Home) - &#8377;449
5. **Everyday Backpack** (Accessories) - &#8377;1,899
6. **Bluetooth Speaker** (Tech) - &#8377;1,999
7. **Table Planter** (Home) - &#8377;649
8. **Classic Wrist Watch** (Accessories) - &#8377;2,499

### 3.6 Product Filtering & Live Search
- Category buttons: `All Products`, `Accessories`, `Home`, and `Tech`.
- Real-time search by product name.
- Combined filtering: category and search work simultaneously.
- Clean "No products found" message with "Show All Products" reset button.

---

## 4. How to Run and Test

1. Open File Explorer to `c:\Users\prern\OneDrive\Desktop\ANTIGRAVITY IDE`.
2. Double-click [`index.html`](file:///c:/Users/prern/OneDrive/Desktop/ANTIGRAVITY%20IDE/index.html) to open in any web browser.
3. Click **"Add to Cart"** on any product card:
   - Notice the button changes to "Added".
   - Notice the cart counter updates in the header.
   - A toast notification will appear with a "View Cart" button.
4. Click the **"Cart: X items"** button in the header (or the toast) to open the accessible Cart Drawer:
   - View added items, adjust quantities (`-` / `+`), and observe item line totals.
   - Observe the live delivery progress bar and delivery fee adjustment (Free if &#8805; &#8377;999).
   - Check the **Order Cost & Bill Summary** (Subtotal, Delivery Fee, Total Bill Amount).
   - Click **"Proceed to Checkout"** to view the itemized bill modal and confirm simulated order placement.
