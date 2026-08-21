# Keystone — Password Generator

A password generator web app that lets users create secure, customizable passwords through a simple, pastel-themed interface.

## Live Demo

- **Live URL:** [add your GitHub Pages / Netlify link here]


## Project Description

Keystone generates random passwords based on user-defined criteria. Users can adjust the password length using a slider and choose which character types to include — uppercase letters, lowercase letters, digits, and symbols — using checkboxes. The app validates input (e.g. requiring at least one character type to be selected, and length long enough to fit each chosen type) and displays a live strength meter for the generated password based on estimated entropy. Generated passwords can be copied to the clipboard with a single click.


## Technologies Used

- **HTML5** — page structure and semantics
- **CSS3** — custom properties (CSS variables), flexbox, grid, transitions
- **JavaScript (ES6+)** — DOM manipulation, event handling, Web Crypto API
- **Google Fonts** — Nunito (display font), Space Mono (password readout)

No frameworks or build tools are used — the project runs entirely with static HTML, CSS, and JS.

## Steps to Run the Project
: Run with a local server 
1. Clone the repository:
   bash
   git clone https://github.com/yourusername/keystone.git
   cd keystone
2. Open the folder in VS Code (or Google Antigravity).
3. Install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.
5. The app will open at `http://127.0.0.1:5500` (or similar).

## How It Works

1. Select which character types to include using the checkboxes.
2. Adjust the length slider to the desired password length.
3. Click **"Generate password"**.
4. The app validates your selections, then builds the password by randomly picking a category and a character for each position, verifying afterward that every selected category appears at least once.
5. The strength meter updates based on the password's estimated entropy.
6. Click **"Copy"** to copy the password to your clipboard.
