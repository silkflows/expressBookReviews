const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  // extract user req body
  const username = req.body?.username;
  const password = req.body?.password;
  // validate
  if (!username || !password) {
    return res.status(400).send({ error: "username or password missing" });
  }
  // check if user aready exist
  const userExist = users.find(
    (user) => user.username === username && user.password === password,
  );
  if (!userExist) {
    return res.status(401).send({ error: "invalid username or password " });
  }

  // create session for user and store id as identifier

  const id = userExist.id;
  req.session.userId = id;

  res.send({ message: "user logged in successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params?.isbn;
  //   validate
  if (!isbn) {
    return res.status(400).send({ error: "isbn required" });
  }

  //   check book existance

  const book = books[isbn];
  if (!book) {
    return res.status(404).send({ error: "book not found" });
  }

  //   get user review from body
  const review = req.body?.review;
  if (!review) {
    return res.status(400).send({ error: "review content messing" });
  }

  // create review

  const reviewData = {
    id: Math.floor(Math.random() * 3002432),
    content: review,
  };
  book.reviews[reviewData.id] = reviewData;

  return res.status(200).json({message:"review created successfully"});
});

// delete review
regd_users.delete("/auth/review/:id", (req, res) => {
  const reviewId = req.params?.id;

  if (!reviewId) {
    return res.status(400).send({
      error: "review id is required",
    });
  }

  // Find the book containing this review
  const book = Object.values(books).find((book) => book.reviews?.[reviewId]);

  if (!book) {
    return res.status(404).send({
      error: "review not found",
    });
  }

  // Delete the review
  delete book.reviews[reviewId];

  return res.status(200).send({
    message: "review deleted successfully",
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
