const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username,password}= req.body
    if(!username || !password){
        return res.status(400).send({error:"username or password missing"})
    }

    // check if username already exist
    const isExist = isValid(username)
    if(isExist){
        return res.status(409).send({error:"username is alreay exist"})
    }

    // create user/register
    const user ={id:Math.floor(Math.random()*3994499),username,password}


    users.push(user)

    return res.status(201).json({
        message: "registarion successfully done!"
    });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(books)
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const bookId = req.params?.isbn

    if(!bookId){
        return res.status(400).send({
            error:"book id or reference required"
        })
    }

    const book = books[bookId]

    if(!book){
        return res.status(404).send({
            error:"book not found"
        })
    }

    return res.send(book)
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author

    const result = {}

    Object.keys(books).forEach(key => {
        if(books[key].author === author){
            result[key] = books[key]
        }
    })

    if(Object.keys(result).length === 0){
        return res.status(404).send({
            error:"author not found"
        })
    }

    return res.json(result)
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title

    const result = {}

    Object.keys(books).forEach(key => {
        if(books[key].title === title){
            result[key] = books[key]
        }
    })

    if(Object.keys(result).length === 0){
        return res.status(404).send({
            error:"book title not found"
        })
    }

    return res.json(result)
});


// Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn

    const book = books[isbn]

    if(!book){
        return res.status(404).send({
            error:"book not found"
        })
    }

    return res.json(book.reviews)
});


module.exports.general = public_users;