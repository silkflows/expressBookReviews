const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ error: "username or password missing" });
  }

  // check if username already exist
  const isExist = isValid(username);
  if (isExist) {
    return res.status(409).send({ error: "username is alreay exist" });
  }

  // create user/register
  const user = { id: Math.floor(Math.random() * 3994499), username, password };

  users.push(user);

  return res.status(201).json({
    message: "registarion successfully done!",
  });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {

  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Could not load books");
    }
  });

  try {
    const data = await getBooks;

    return res.json(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {

  const getBook = new Promise((resolve, reject) => {

    const bookId = req.params?.isbn;

    if (!bookId) {
      reject({
        status: 400,
        error: "book id or reference required"
      });
      return;
    }

    const book = books[bookId];

    if (!book) {
      reject({
        status: 404,
        error: "book not found"
      });
      return;
    }

    resolve(book);
  });

  try {
    const data = await getBook;

    return res.json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.error || "failed to retrieve book"
    });
  }
});


// Get book details based on author
public_users.get("/author/:author", async function (req, res) {

  const getBooksByAuthor = new Promise((resolve, reject) => {

    const author = req.params.author;
    const result = {};

    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        result[key] = books[key];
      }
    });

    if (Object.keys(result).length === 0) {
      reject({
        status: 404,
        error: "author not found"
      });
      return;
    }

    resolve(result);
  });

  try {
    const data = await getBooksByAuthor;

    return res.json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.error || "failed to retrieve books"
    });
  }
});


// Get all books based on title
public_users.get("/title/:title", async function (req, res) {

  const getBooksByTitle = new Promise((resolve, reject) => {

    const title = req.params.title;
    const result = {};

    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        result[key] = books[key];
      }
    });

    if (Object.keys(result).length === 0) {
      reject({
        status: 404,
        error: "book title not found"
      });
      return;
    }

    resolve(result);
  });

  try {
    const data = await getBooksByTitle;

    return res.json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.error || "failed to retrieve books"
    });
  }
});


// Get book review
public_users.get("/review/:isbn", async function (req, res) {

  const getReview = new Promise((resolve, reject) => {

    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      reject({
        status: 404,
        error: "book not found"
      });
      return;
    }

    resolve(book.reviews);
  });

  try {
    const data = await getReview;

    return res.json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.error || "failed to retrieve review"
    });
  }
});

module.exports.general = public_users;


































