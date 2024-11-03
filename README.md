# ChatStream

A React-based chat application with integrated video calling and video streaming features, powered by Firebase for user authentication and data storage.

## Project Description

**ChatStream** is a comprehensive communication platform that allows users to chat, make video calls, and stream videos—all in one app. Powered by Firebase, ChatStream provides secure user authentication, real-time media sharing, and seamless data storage. Built with React, ChatStream is designed to offer an intuitive, responsive experience for connecting through various media formats.

### Technology Choices

- **React**: Provides a component-based, responsive UI structure for an engaging user experience.
- **Firebase**: Ensures secure, real-time updates for authentication and data storage, perfect for applications requiring low-latency communication.

### Future Plans

- Expand video streaming to support multi-user streaming rooms.
- Enhance user experience with customizable chat themes.
- Introduce additional media options, including file sharing and screen sharing.


## How to Install and Run the Project

To set up and run this project locally, follow these steps:

### Prerequisites

- **Node.js** and **npm** installed.
- Firebase project setup with Firestore, Authentication, and Storage enabled.

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sandeep07y/react-chat-app.git
   cd react-chat-app


2. **Install dependencies**:

   ```bash

   npm install

   ```



3. **Set up Firebase**:

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).

   - Enable **Authentication**, **Firestore**, and **Storage** in your Firebase project.

   - Copy your Firebase configuration settings and create a `.env` file in the root of the project with the following content:



     ```plaintext

     REACT_APP_FIREBASE_API_KEY=your-api-key

     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain

     REACT_APP_FIREBASE_PROJECT_ID=your-project-id

     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket

     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id

     REACT_APP_FIREBASE_APP_ID=your-app-id

     ```



4. **Start the development server**:

   ```bash

   npm start

   ```

   The application will be accessible at `http://localhost:3000`.

