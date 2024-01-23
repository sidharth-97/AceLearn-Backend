# AceLearn(A Private Tutor Platform) Backend

This is the backend repository for the AceLearn, an online education platform that connects students with tutors. This repository houses the server, database, and API that power the platform.

## Getting Started

These instructions will help you set up and run the backend of the Private Tutor Platform on your local machine for development and testing.

### Prerequisites

- Node.js and npm installed.
- MongoDB installed and running.
- Environment variables set up for your configuration (e.g., database connection, authentication secrets).

### Installation

1. Clone the repository:

git clone https://github.com/sidharth-97/AceLearn-Backend.git

2. Navigate to the project directory

3. Install dependencies:

npm install

4. Set up environment variables:

Create a '.env' file in the root of your project and configure the necessary environment variables, such as database connection details, authentication secrets, and other relevant settings.

MONGO_URI,JWT_KEY,NODE_ENV,MAILPASS,CLIENT_SECRET,CLIENT_ID,CLOUDINARY_NAME,CLOUDINARY_KEY,CLOUDINARY_SECRET,STRIPE_SECRET_KEY,STRIPE_PUBLIC_KEY,WEBSITE

5. Start the server:
npm start
