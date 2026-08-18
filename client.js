const axios = require("axios");

const API__AUTH_URL = "http://localhost:5000/customer/auth/review";
const API_BOOKS_URL = "http://localhost:5000";

// 1. READ - Get all books
async function getAllBooks() {
  try {
    const response = await axios.get(API_BOOKS_URL);

    console.log("All books:");
    console.log(response.data);
  } catch (error) {
    console.error("Error getting books:", error.message);
  }
}

// 2. READ - Get a book by ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`${API_BOOKS_URL}/isbn/${isbn}`);

    console.log(`Book ${isbn}:`);
    console.log(response.data);
  } catch (error) {
    console.error("Error getting book:", error.message);
  }
}

// 3. READ - Get books by author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `${API_BOOKS_URL}/author/${encodeURIComponent(author)}`,
    );

    console.log(`Books by ${author}:`);
    console.log(response.data);
  } catch (error) {
    console.error("Error getting books by author:", error.message);
  }
}

// 4. READ - Get books by title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `${API_BOOKS_URL}/title/${encodeURIComponent(title)}`,
    );

    console.log(`Books with title ${title}:`);
    console.log(response.data);
  } catch (error) {
    console.error("Error getting books by title:", error.message);
  }
}

// create review(protected)
async function createBookReview(isbn) {
  try {
    const review = {
      review: "This is an excellent book!",
    };

    const response = await axios.put(`${API__AUTH_URL}/${isbn}`, review);

    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

// delete review(protected)
async function deleteReview(id) {
  try {
    const response = await axios.delete(`${API__AUTH_URL}/${id}`);

    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

// Run the requests
async function main() {
  await getAllBooks();

  await getBookByISBN(1);

  await getBooksByAuthor("Chinua Achebe");

  await getBooksByTitle("Things Fall Apart");
  await createBookReview(1);
  await deleteReview(123);
}

main();
