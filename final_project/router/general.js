const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username 
  const password = req.body.password
  if (username && password) {
    if (isValid(username)) {
      return res.status(404).json({message: 'User already exists!'})
    } else {
      users.push({'username': username, 'password': password})
      return res.status(200).json({message: 'User successfully registered. You can now login.'})
    }
   
  } else {
    res.status(404).send('Please enter both a username and a password')
  }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4 ))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const filteredBooks = {}

  for (const [key, value] of Object.entries(books)) {
    if (value.author === author) filteredBooks[key] = value
  }

  if (Object.keys(filteredBooks).length > 0) res.send(filteredBooks)
  else res.send(`Book with author name ${author} not found.`)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const filteredBooks = {}

  for (const [key, value] of Object.entries(books)) {
    if (value.title === title) filteredBooks[key] = value
  }

  if (Object.keys(filteredBooks).length > 0) res.send(filteredBooks)
  else res.send(`Book with title "${title}" not found.`)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (book) res.send(book.reviews)
  else res.send(`Could not find book with isbn ${isbn}`)
});

////
//// Promises/Asycn Await Tasks 10-13 
////

//Get all books
const getAllBooks = async () => {
  axios.get('http://localhost:5000')
  .then(response => console.log(response.data))
  .catch(err => console.error(err))
}

const getBookByIsbn = async (isbn) => {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(response => console.log(response.data))
  .catch(err => console.error(err))
}

const getBooksByAuthor = async (author) => {
  axios.get(`http://localhost:5000/author/${author}`)
  .then(response => console.log(response.data))
  .catch(err => console.error(err))
}

const getBooksByTitle = async (title) => {
  axios.get(`http://localhost:5000/title/${title}`)
  .then(response => console.log(response.data))
  .catch(err => console.error(err))
}

getAllBooks()
getBookByIsbn(4)
getBooksByAuthor('Jane Austen')
getBooksByTitle("Njál's Saga")

module.exports.general = public_users;
