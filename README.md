(this is a fun a little project i did with the help of gemini!)

# Halal Restaurant Chatbot for Edmonton 🍽️

This is a responsive web-based chatbot application built with React that specializes in providing information about halal restaurants in Edmonton. Users can ask questions about various aspects of these restaurants, and the chatbot will provide concise, bullet-point answers, including details on cuisine, location, features, general pricing, and customer reviews.

## Features 😋

* **Intelligent Q&A:** Answers user queries specifically about halal restaurants in Edmonton.
* **Detailed Information:** Provides insights into a restaurant's cuisine, location, unique features, general pricing, and customer feedback.
* **Formatted Responses:** Presents information clearly and concisely using bullet points for easy readability.
* **Responsive Design:** Ensures a seamless user experience across various devices (mobile, tablet, desktop).
* **Loading Indicators:** Provides visual feedback while the chatbot processes requests.

## Technologies Used 🥘

* **React:** A JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development and responsive design.
* **Google Gemini API (gemini-2.0-flash):** Powers the conversational AI, enabling the chatbot to understand queries and generate relevant responses.

## How to Run Locally 🍸

1.  **Clone the Repository:**
     ```bash
    git clone [https://github.com/git-samia/halal-restaurants-edm.git](https://github.com/git-samia/halal-restaurants-edm.git)
    cd halal-restaurants-edm
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Tailwind CSS:**
    Ensure your `tailwind.config.js` is set up to scan your React components (e.g., `./src/**/*.{js,jsx,ts,tsx}`).
    Add Tailwind directives to your `src/index.css` (or `src/App.css`):
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import url('[https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap)');
    ```

4.  **Set up Google API Key:**
    * Obtain a **Gemini API key** from [Google AI Studio](https://ai.google.dev/gemini-api/docs/get-started/web) or Google Cloud Console.
    * In `src/App.js`, locate the `apiKey` variable and replace the empty string with your actual API key:
        ```javascript
        const apiKey = "YOUR_GEMINI_API_KEY_HERE";
        ```

5.  **Start the Development Server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The application will open in your default browser at `http://localhost:3000`.
