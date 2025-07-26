# AI-Powered Resume Analyzer

A sophisticated resume analysis tool that provides AI-powered feedback on resumes. Built with Angular for the frontend and Node.js/Express for the backend.

## Features

- Upload and analyze resumes in multiple formats (PDF, DOC, DOCX)
- AI-powered feedback and suggestions
- Responsive design with modern UI/UX
- Drag and drop file upload
- Real-time validation and error handling

## Tech Stack

- **Frontend**: Angular 20, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **AI**: OpenAI GPT-3.5/4
- **Document Processing**: pdf-parse, mammoth, textract

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- MongoDB
- OpenAI API Key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/AI-Powered-Resume-Analyzer.git
   cd AI-Powered-Resume-Analyzer
   \`\`\`

2. Install backend dependencies:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. Install frontend dependencies:
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. Set up environment variables:
   - Create a \[.env\](cci:7://file:///d:/My-Learnings/AI-Powered-Resume-Analyzer/backend/.env:0:0-0:0) file in the \`backend\` directory
   - Add your OpenAI API key:
     \`\`\`
     OPENAI_API_KEY=your_openai_api_key
     MONGODB_URI=mongodb://localhost:27017/resume-analyzer
     \`\`\`

### Running the Application

1. Start the backend:
   \`\`\`bash
   cd backend
   npm start
   \`\`\`

2. In a new terminal, start the frontend:
   \`\`\`bash
   cd frontend
   ng serve
   \`\`\`

3. Open your browser and navigate to \`http://localhost:4200\`

## Project Structure

\`\`\`
AI-Powered-Resume-Analyzer/
├── backend/             # Backend Node.js/Express application
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── server.js       # Express server
│
├── frontend/           # Frontend Angular application
│   ├── src/            # Source files
│   │   ├── app/        # Angular components, services, etc.
│   │   └── assets/     # Static assets
│   └── angular.json    # Angular configuration
│
├── .gitignore          # Git ignore file
└── README.md           # This file
\`\`\`

## Contributing

1. Fork the repository
2. Create a new branch: \`git checkout -b feature/your-feature\`
3. Commit your changes: \`git commit -m 'Add some feature'\`
4. Push to the branch: \`git push origin feature/your-feature\`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for their powerful language models
- The Angular and Node.js communities
- All contributors and open-source libraries used in this project" > README.md