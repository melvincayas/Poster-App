# Poster

This is a project of a social media website where users can create, like, and bookmark posts similar to [Instagram](https://www.instagram.com/) and [Twitter](https:/www.twitter.com/). Feel free to check it out [here](https://my-poster-app.herokuapp.com/).

## Built With

- [Bootstrap](https://getbootstrap.com/)
- [Embedded JavaScript](https://ejs.co/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

## Features

- Follow/Unfollow users
- Liking posts
- Bookmarking posts
- Commenting on posts
- Replying to comments
- Notifications for follows and likes
- Search for specific users or posts

## Installation

Feel free to play around with the code.

1. Clone this repo

```
git clone https://github.com/melvincayas/poster.git
```

2. Install NPM packages

```
npm install
```

3. Include the following in your `.env` file:

```
SECRET=RANDOM_PASSWORD_FOR_SESSION_CONFIG
DB_URL=LINK_TO_YOUR_MONGO_DB
```

If you need to randomly generate a password, you can do so [here](https://passwordsgenerator.net/).

## Contributing

I'm always open to improving my code and the best way to do that is by having others critique it. If you see any bugs or opportunities to refactor, please let me know. It would be **highly appreciated**!

1. Fork this repo

2. Create your branch for improvement

```
git checkout -b your-improvement
```

3. Commit your changes

```
git commit -m "Refactored the code"
```

4. Push to your branch

```
git push origin your-improvement
```

5. Open a Pull Request

## Future of Poster

I got what I wanted out of this project once I finished the user notifications for follows and likes. My goal was to see what I could accomplish after finishing a [full-stack web developer course](https://www.udemy.com/course/the-web-developer-bootcamp/) on Udemy. After that, I began to learn [React](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)!

If I continue this project in the future, I would:

- Recreate the user-interface with React
- Implement infinite scrolling for all posts on the home page
  - It became difficult to reuse components, especially posts without tools like React
- Add color indicators in the navbar to show which page is displayed

## Acknowledgements

- [Unsplash](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

## Contact

Melvin Cayas  
[cayasmj@gmail.com](mailto:cayasmj@gmail.com?subject=[GitHub])  
[melvincayas.com](https://melvincayas.com/)

Project Link  
[Live Version](https://my-poster-app.herokuapp.com/)  
[GitHub](https://github.com/melvincayas/poster)
