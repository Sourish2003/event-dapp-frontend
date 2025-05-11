# Event DApp Frontend

A React Native mobile application for event ticketing using blockchain technology.

## Overview

This application provides a user interface for an event ticketing system, with features including:

- View events by category
- Purchase tickets
- Transfer tickets
- Favorite events

## Mock Data Implementation

For rapid UI development and testing, this project uses mock data to simulate blockchain interactions. The mock data is stored in `src/services/mockData.js`.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/contexts` - React context providers
- `/src/navigation` - App navigation structure
- `/src/screens` - App screens organized by feature
- `/src/services` - Mock services and API integrations

## Setup and Running

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Use Expo Go app to scan the QR code or run on emulators.

## Recent Optimizations

1. Replaced blockchain calls with mock data services for UI development
2. Fixed navigation issues and loading screens
3. Consolidated duplicate code and removed unused files
4. Implemented profile registration with local storage

## Next Steps

- Implement real blockchain integration with proper error handling
- Add unit tests
- Improve UI/UX with animations and transitions

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
