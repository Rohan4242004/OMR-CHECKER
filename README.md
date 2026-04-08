OMR-CHECKER

OMR- CHECKER is a modern web application built with React + TypeScript, powered by Vite for fast development and Tailwind CSS for styling.
The project includes a clean UI built using shadcn-ui components.

Live Demo: https://omr-checker-lake.vercel.app/

🚀 Tech Stack

React (TypeScript)

Vite – lightning-fast dev environment

Tailwind CSS – utility-first styling

shadcn-ui – accessible, customizable UI components

Node / Bun for dependency management and builds

📦 Installation & Setup

Follow these steps to run the project locally:

1. Clone the repository
git clone <YOUR_GIT_URL>

2. Navigate into the project
cd grade-scan

3. Install dependencies

Using Bun:

bun install


or using npm:

npm install

4. Start the development server

Using Bun:

bun run dev


or npm:

npm run dev


Your app will now be available at:

http://localhost:5173/

🛠️ Environment Variables

Create a .env file in the project root:

VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here


(Include any additional env variables your project needs.)

📤 Deployment

This project is optimized for Render Static Site Hosting.

Render Deployment Settings

Build Command

bun install && bun run build


or

npm install && npm run build


Publish Directory

dist


Add your environment variables in Render → Environment.

Your production site is live here:
👉 https://omr-checker-lake.vercel.app/

📁 Project Structure
└── OMR-CHECKER/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── lib/
    │   └── App.tsx
    ├── supabase/
    ├── .env
    ├── index.html
    ├── package.json
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── vite.config.ts

🤝 Contributing

Pull requests and feature suggestions are welcome!
Feel free to open an issue if you encounter a bug.

📄 License

This project is open-source and available under the MIT License.
