# NovaCart — E-Commerce Storefront Capstone

NovaCart is a responsive e-commerce storefront built with vanilla HTML, CSS, and JavaScript. It demonstrates front-end application structure, dynamic product rendering, CRUD operations, cart state, browser persistence, search, filtering, sorting, and a simulated checkout flow.

> **Demo / portfolio project:** Authentication and checkout are simulated in the browser. No real account, payment, shipping label, or server-side order is created. Do not enter sensitive personal or payment information.

## Features

- Responsive storefront layout for desktop, tablet, and mobile
- Product catalog with search, category filters, and sorting
- Product cards with ratings, badges, and favourites
- Shopping cart with quantity controls, item removal, subtotal, and free-shipping progress
- Product management: add, edit, delete, and restore starter catalog
- Browser persistence using `localStorage` for products, cart, favourites, and demo profile
- Simulated sign-in, newsletter signup, and checkout confirmation
- Accessible labels, dialog forms, empty states, and status messages
- No build step or package installation required

## Tech stack

- HTML5
- CSS3 (responsive layout and custom styling)
- Vanilla JavaScript (DOM events and state management)
- `localStorage` for persistence

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local development server, if Python is installed, run this from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to Vercel

1. Create a GitHub repository named `novacart-ecommerce-capstone`.
2. Upload the project files (`index.html`, `styles.css`, `app.js`, and `README.md`) to the repository root.
3. Sign in to Vercel and choose **Add New → Project**.
4. Import the GitHub repository.
5. For this static site, leave the framework preset as **Other** (or no framework), set the root directory to `./`, and leave build/output commands empty unless the dashboard requires a static output directory.
6. Deploy. Open the generated URL and test search, cart, product management, and mobile layout.

Alternative static hosting: Netlify or Cloudflare Pages can deploy the same files with no build command.

## Project structure

```text
novacart-ecommerce-capstone/
├── index.html    # Page structure and dialogs
├── styles.css    # Theme, layout, responsive styling
├── app.js        # Catalog, CRUD, cart, persistence, and demo flows
└── README.md     # Setup and deployment documentation
```

## Architecture overview

```text
User interaction
      |
      v
HTML interface (index.html)
      |
      v
DOM event handlers + application state (app.js)
      |
      +------> Product catalog / cart / favourites / demo profile
      |
      v
localStorage (browser persistence)
      |
      v
Render updated UI (product cards, cart, admin list)
```

## Data and security notes

- All state is stored in the visitor's browser. Clearing browser storage resets the saved demo data.
- This project does not include a backend API, database, production authentication, inventory service, or payment provider.
- Never use the simulated sign-in or checkout as real authentication or payment processing.
- If extending this into a production store, add a backend, secure authentication, server-side validation, database persistence, inventory handling, and a PCI-compliant payment provider.

## Suggested evaluation checklist

- [ ] Search by product name and description
- [ ] Filter by category and sort by price/rating
- [ ] Add multiple products to the cart, change quantities, and remove items
- [ ] Refresh the page and verify saved cart/catalog state
- [ ] Add, edit, and delete a product in Manage products
- [ ] Verify favourites persist after refresh
- [ ] Complete the simulated checkout and verify the cart clears
- [ ] Test the page at mobile and desktop widths
- [ ] Confirm the GitHub repository and public deployment URL are accessible

## Capstone proof

- GitHub repository: _Add your repository URL here_
- Live deployment: _Add your deployed URL here_
