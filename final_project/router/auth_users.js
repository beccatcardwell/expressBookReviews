const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let matchingUsernames = users.filter(user => user.username === username)
  if (matchingUsernames.length > 0) return true
  return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user)=>(user.username === username && user.password === password))
  if(validUsers.length > 0) return true
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.status(404).json({message: 'Please enter both a username or password is missing from login'})

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send('User successfully logged in.')
  }
  return res.status(208).json({message: "Invalid login. Check your username and password."})

});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const review = req.body.review
  const book = books[isbn]

  if (book.reviews[username]) return res.send(`${username} already has a review for "${book.title}" by ${book.author}`)
  book.reviews[username] = review
  res.send(`User ${username} successfully added a review to book ${book.title} by ${book.author}`)
});

// Update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const review = req.body.review
  const book = books[isbn]
  
  if (!book.reviews[username]) return res.send(`${username} does not yet have a review for "${book.title}" by ${book.author}`)
  book.reviews[username] = review
  res.send(`User ${username} successfully updated their review for book ${book.title} by ${book.author}`)
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const book = books[isbn]
  
  if (!book.reviews[username]) return res.send(`${username} does not yet have a review for "${book.title}" by ${book.author}`)
  delete book.reviews[username]
  res.send(`User ${username} successfully deleted their review for book "${book.title}" by ${book.author}`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
