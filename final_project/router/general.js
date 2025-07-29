const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", async function (_, res) {
  try {
    const response = await axios.get("https://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  // const isbn = req.params.isbn;
  // console.log(books[isbn]);
  // if (!books[isbn]) {
  //   return res.status(404).json({ message: "Book not found" });
  // }
  // return res.status(200).json(books[isbn]);
  //do the same as / above but with axios and try catch callback
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`https://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  // const author = req.params.author;
  // const booksArray = [];
  // for (const book in books) {
  //   console.log(books[book]["author"]);
  //   if (books[book]["author"].toLowerCase() === author.toLowerCase()) {
  //     booksArray.push(books[book]);
  //   }
  // }
  // if (booksArray.length === 0) {
  //   return res.status(404).json({ message: "No books found by this author" });
  // }
  // return res.status(200).json(booksArray);
  const author = req.params.author;
  const booksArray = [];
  try {
    const response = await axios.get(`https://localhost:5000/author/${author}`);
    for (const book of response.data) {
      if (book.author.toLowerCase() === author.toLowerCase()) {
        booksArray.push(book);
      }
    }
    if (booksArray.length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }
    return res.status(200).json(booksArray);
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  // const title = req.params.title;
  // const booksArray = [];
  // for (const book in books) {
  //   console.log(books[book]["title"]);
  //   if (books[book]["title"].toLowerCase() === title.toLowerCase()) {
  //     booksArray.push(books[book]);
  //   }
  // }
  // if (booksArray.length === 0) {
  //   return res.status(404).json({ message: "No books found by this title" });
  // }
  // return res.status(200).json(booksArray);
  const title = req.params.title;
  const booksArray = [];
  try {
    const response = await axios.get(`https://localhost:5000/title/${title}`);
    for (const book of response.data) {
      if (book.title.toLowerCase() === title.toLowerCase()) {
        booksArray.push(book);
      }
    }
    if (booksArray.length === 0) {
      return res.status(404).json({ message: "No books found by this title" });
    }
    return res.status(200).json(booksArray);
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (Object.keys(books[isbn]["reviews"]).length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
  return res.status(300).json(books[isbn]["reviews"]);
});

module.exports.general = public_users;
