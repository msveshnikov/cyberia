# User Model Documentation

## Overview

This file (`server/model/User.js`) defines the User model for the application using Mongoose, an
Object Data Modeling (ODM) library for MongoDB and Node.js. It's a crucial part of the server-side
implementation, handling user data structure and methods.

The User model includes various fields such as email, password, owned tiles, achievements, friends,
balance, and premium status. It also provides methods for password hashing, authentication, and
updating user data.

## Schema Definition

The `userSchema` defines the structure of a user document in the MongoDB database:

-   `email`: String (required, unique, trimmed, lowercase)
-   `password`: String (required, minimum length: 6)
-   `createdAt`: Date (default: current date)
-   `lastLogin`: Date
-   `isAdmin`: Boolean (default: false)
-   `ownedTiles`: Array of ObjectIds referencing 'Tile' documents
-   `achievements`: Array of Strings (enum: 'first_property', 'ten_properties',
    'customization_master')
-   `friends`: Array of ObjectIds referencing other 'User' documents
-   `balance`: Number (default: 0)
-   `premium`: Boolean (default: false)
-   `profilePicture`: String (default: '')

## Methods

### Pre-save Hook

```javascript
userSchema.pre('save', async function (next) {
    // ... (password hashing logic)
});
```

This method hashes the user's password before saving it to the database if the password field has
been modified.

### comparePassword

```javascript
userSchema.methods.comparePassword = async function (candidatePassword) {
    // ... (password comparison logic)
};
```

**Parameters:**

-   `candidatePassword`: String - The password to compare against the stored hash

**Returns:** Promise<boolean> - True if passwords match, false otherwise

### updateLastLogin

```javascript
userSchema.methods.updateLastLogin = function () {
    // ... (update last login time logic)
};
```

Updates the user's last login time to the current date and time.

### addOwnedTile

```javascript
userSchema.methods.addOwnedTile = function (tileId) {
    // ... (add tile to owned tiles logic)
};
```

**Parameters:**

-   `tileId`: ObjectId - The ID of the tile to add to the user's owned tiles

Adds a tile to the user's owned tiles if it's not already present.

### removeOwnedTile

```javascript
userSchema.methods.removeOwnedTile = function (tileId) {
    // ... (remove tile from owned tiles logic)
};
```

**Parameters:**

-   `tileId`: ObjectId - The ID of the tile to remove from the user's owned tiles

Removes a tile from the user's owned tiles.

### addAchievement

```javascript
userSchema.methods.addAchievement = function (achievement) {
    // ... (add achievement logic)
};
```

**Parameters:**

-   `achievement`: String - The achievement to add to the user's achievements

Adds an achievement to the user's achievements if it's not already present.

### addFriend

```javascript
userSchema.methods.addFriend = function (friendId) {
    // ... (add friend logic)
};
```

**Parameters:**

-   `friendId`: ObjectId - The ID of the friend to add to the user's friends list

Adds a friend to the user's friends list if not already present.

### removeFriend

```javascript
userSchema.methods.removeFriend = function (friendId) {
    // ... (remove friend logic)
};
```

**Parameters:**

-   `friendId`: ObjectId - The ID of the friend to remove from the user's friends list

Removes a friend from the user's friends list.

### updateBalance

```javascript
userSchema.methods.updateBalance = function (amount) {
    // ... (update balance logic)
};
```

**Parameters:**

-   `amount`: Number - The amount to add to (or subtract from) the user's balance

Updates the user's balance by the specified amount.

### setPremiumStatus

```javascript
userSchema.methods.setPremiumStatus = function (status) {
    // ... (set premium status logic)
};
```

**Parameters:**

-   `status`: Boolean - The premium status to set for the user

Sets the user's premium status.

### setProfilePicture

```javascript
userSchema.methods.setProfilePicture = function (pictureUrl) {
    // ... (set profile picture logic)
};
```

**Parameters:**

-   `pictureUrl`: String - The URL of the profile picture to set for the user

Sets the user's profile picture URL.

## Usage Example

```javascript
import User from './model/User.js';

// Create a new user
const newUser = new User({
    email: 'user@example.com',
    password: 'securepassword'
});

// Save the user to the database
await newUser.save();

// Authenticate user
const isMatch = await newUser.comparePassword('enteredpassword');

// Add a tile to user's owned tiles
await newUser.addOwnedTile(tileObjectId);

// Update user's balance
await newUser.updateBalance(100);
```

## Project Context

This User model is a core component of the server-side implementation. It interacts with the Tile
model (`server/model/Tile.js`) through the `ownedTiles` field. The model is likely used in various
server routes and controllers to handle user-related operations, authentication, and data
management.

The model supports features visible in the front-end components like `Profile.jsx` and potentially
in `PropertySelector.jsx` for managing owned tiles. It also aligns with the application's features
described in the documentation files within the `docs` folder.
