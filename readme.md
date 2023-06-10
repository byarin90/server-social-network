# Social Network Web Application

## Models:

- User
- Post
- Comment
- Message
- Friendship

### User Model

Stores user information. Includes fields such as username, email, password (hashed and salted), profile picture, bio, etc.

### Post Model

Stores posts made by users. Includes fields like user (creator of the post), text (content of the post), image (image in the post, if any), likes (array of users who liked the post), comments (array of comment IDs), timestamps (created at and updated at).

### Comment Model

Stores comments made on posts. Includes fields like user (creator of the comment), post (post on which the comment was made), text (content of the comment), likes (array of users who liked the comment), timestamps.

### Message Model

Required for real-time chat feature. Includes fields like sender (user who sent the message), receiver (user who received the message), text (content of the message), timestamps.

### Friendship Model

Used for managing friendships between users. Includes fields like user1 and user2 (users who are friends), status (pending, accepted, declined), timestamps.

MongoDB's features like references or embedded subdocuments can be used depending on the use case. The design of models heavily depends on the specific use case and may need to be adjusted as more features are added to the application.

## Routes:

### User Routes

- Register: POST /users/register
- Login: POST /users/login
- Logout: POST /users/logout
- Get Profile: GET /users/:userId
- Update Profile: PUT /users/:userId
- Delete User: DELETE /users/:userId

### Post Routes

- Create Post: POST /posts
- Get a Post: GET /posts/:postId
- Get all Posts: GET /posts
- Update a Post: PUT /posts/:postId
- Delete a Post: DELETE /posts/:postId
- Like a Post: PUT /posts/:postId/like
- Unlike a Post: PUT /posts/:postId/unlike

### Comment Routes

- Create Comment: POST /comments
- Get a Comment: GET /comments/:commentId
- Get all Comments for a Post: GET /posts/:postId/comments
- Update a Comment: PUT /comments/:commentId
- Delete a Comment: DELETE /comments/:commentId
- Like a Comment: PUT /comments/:commentId/like
- Unlike a Comment: PUT /comments/:commentId/unlike

### Message Routes

- Send Message: POST /messages
- Get a Message: GET /messages/:messageId
- Get all Messages between users: GET /messages/:user1Id/:user2Id
- Delete a Message: DELETE /messages/:messageId

### Friendship Routes

- Send Friend Request: POST /friendships
- Get Friendship status: GET /friendships/:friendshipId
- Get all Friends for a User: GET /users/:userId/friends
- Accept Friend Request: PUT /friendships/:friendshipId/accept
- Reject Friend Request: PUT /friendships/:friendshipId/reject
- Delete a Friend: DELETE /friendships/:friendshipId

## Technologies Used:

### Back-End Development

- Node.js
- Express.js
- MongoDB
- Mongoose
- jsonwebtoken (JWT)
- bcrypt.js / argon2
- dotenv
- Socket.IO

### Front-End Development

- React.js
- Redux or Context API
- Axios
- Material-UI / Ant Design / Bootstrap
- Formik / React Hook Form

### Deployment and Version Control

- Git
- GitHub
- Heroku / AWS / Google Cloud / Netlify
- Docker (Optional)

### Testing and Linting Tools

- Jest
- React Testing Library
- ESLint
- Prettier

### Other Tools

- Postman / Insomnia
- NPM / Yarn
- Visual Studio Code
- Babel

The list of technologies might change depending on specific needs. Assessment of needs should be carefully done before beginning the project.
