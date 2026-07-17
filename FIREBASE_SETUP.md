# Firebase CMS Setup

## 1. Create a Firebase project
- Open Firebase Console and create a new project.
- Enable Authentication with the Email/Password sign-in provider.
- Enable Firestore Database.
- Enable Cloud Storage.

## 2. Add environment variables
Create a `.env` file in the project root with:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_ADMIN_EMAIL=admin@adiitech.com
```

## 3. Firestore rules
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Storage rules
```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Run locally
```bash
npm run dev
```
