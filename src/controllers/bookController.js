/**
 * @file Defines the BookController class.
 * @module BookController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import { db } from '../config/dbsettings.js'

/**
 * Encapsulates the book controller.
 */
export class BookController {
  /**
   * Provide req.doc and req.page to the route if :subject and :page is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} subject - The value of the subject to load.
   * @param {string} page - The page to load.
   */
  async loadSubject (req, res, next, subject, page) {
    try {
      let query = ''

      const firstPage = 1

      // Decide the queries based on if it is the first page or a subsequent page.
      if (parseInt(page) === firstPage) {
        query = `SELECT * FROM books WHERE subject = '${subject}' LIMIT 2`
      } else {
        query = `SELECT * FROM books WHERE subject = '${subject}' LIMIT 2 OFFSET ${parseInt(page) * 2 - 2}`
      }

      const response = await db.query(query)

      const result = response[0]

      // Get the max amount of pages aswell for the specific subject.
      const maxPage = await db.query(`SELECT COUNT(*) FROM books WHERE subject = '${subject}'`)
      const maxPageValue = maxPage[0]

      const pageObj = {
        current: parseInt(page),
        max: maxPageValue[0]['COUNT(*)']
      }

      // Set the book and page data to the req object.
      req.doc = result
      req.page = pageObj

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Provide req.doc to the route if :search is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} searchString - The value of the searchString for the subject to load.
   * @param {string} page - The page to load.
   */
  async loadSearch (req, res, next, searchString, page) {
    try {
      // Check if the search is by title or author.
      const { title } = req.body

      let authorOrTitle = ''

      if (title) {
        authorOrTitle = 'title'
      } else {
        authorOrTitle = 'author'
      }

      const search = decodeURIComponent(searchString)

      let query = ''
      const firstPage = 1

      // Decide the queries based on if it is the first page or a subsequent page.
      if (parseInt(page) === firstPage) {
        query = `SELECT * FROM books WHERE ${authorOrTitle} LIKE '%${search}%' LIMIT 3`
      } else {
        query = `SELECT * FROM books WHERE ${authorOrTitle} LIKE '%${search}%' LIMIT 3 OFFSET ${parseInt(page) * 2 - 2}`
      }

      const response = await db.query(query)

      const result = response[0]

      // Get the max amount of pages aswell for the specific subject.
      const maxPage = await db.query(`SELECT COUNT(*) FROM books WHERE ${authorOrTitle} LIKE '%${search}%'`)
      const maxPageValue = maxPage[0]

      const pageObj = {
        current: parseInt(page),
        max: maxPageValue[0]['COUNT(*)']
      }

      // Set the book and page data to the req object.
      req.doc = result
      req.page = pageObj
      req.search = {}
      req.search.type = authorOrTitle
      req.search.searchstring = search

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the browsing page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async browse (req, res, next) {
    try {
      // Fetch all the subjects in the db.
      const query = 'SELECT DISTINCT subject FROM books'
      const response = await db.query(query)

      const subjects = []

      for (const sub of response[0]) {
        subjects.push(sub.subject)
      }

      // Give the subjects to the view sorted alphabetically.
      res.locals.subjects = subjects.sort()
      res.render('books/browse')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('../')
    }
  }

  /**
   * Handles the browsing page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  browseSubject (req, res, next) {
    try {
      res.render('books/subject', { books: req.doc, page: req.page })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Renders the search page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  search (req, res, next) {
    res.render('books/search')
  }

  /**
   * Handles the search page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  searchBooks (req, res, next) {
    try {
      res.render('books/searchResults', { books: req.doc, page: req.page, search: req.search })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Handles adding a book to the cart.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addToCart (req, res, next) {
    try {
      const isbn = req.body.isbn
      const quantity = req.body.quantity

      // Create a query that inserts a new tuple into the cart, if it already exists just update the existing one with a new quantity.
      const query = 'INSERT INTO cart (userid, isbn, qty) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)'

      // Insert it into the db with the correct values.
      await db.execute(query, [parseInt(req.session.user.userid), isbn, quantity])

      res.status(200).json({ message: 'Book added to cart successfully.' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to add book to cart.' })
    }
  }

  /**
   * Renders the checkout page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async checkout (req, res, next) {
    try {
      const books = await this.#getCart(req)
      res.render('books/checkout', { books })
    } catch (error) {
      res.render('books/checkout')
    }
  }

  /**
   * Handles the checkout confirmation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async confirmCheckout (req, res, next) {
    try {
      const books = await this.#getCart(req)
      const user = req.session.user
      const userid = parseInt(user.userid)
      const createdAt = new Date().toISOString().split('T')[0]

      // Create an order row.
      const orderQuery = 'INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip) VALUES (?, ?, ?, ?, ?)'

      const [orderResult] = await db.execute(orderQuery, [userid, createdAt, user.address, user.city, parseInt(user.zip)])

      const ordernr = orderResult.insertId

      // Create order details for each isbn (in odetails).
      const odetailsQuery = 'INSERT INTO odetails (ono, isbn, qty, amount) VALUES (?, ?, ?, ?)'

      books.forEach(async (book) => {
        const amount = (book.price * book.qty).toFixed(2)

        await db.execute(odetailsQuery, [ordernr, book.isbn, book.qty, amount])
      })

      // Remove the cart from the db.
      const removeCartQuery = 'DELETE FROM cart WHERE userid = ?'

      await db.execute(removeCartQuery, [userid])

      // Create a shipping date 7 days from today.
      const shipDate = new Date()
      shipDate.setDate(shipDate.getDate() + 7)

      const shippingDate = shipDate.toISOString().split('T')[0]

      res.render('books/confirmation', { books, ordernr, shippingDate, currentDate: createdAt })
    } catch (error) {
      res.redirect('../')
    }
  }

  /**
   * Get the cart books from the db.
   *
   * @param {object} req - Express request object.
   * @returns {object} - Returns an object containing all books in the users cart.
   */
  async #getCart (req) {
    const userid = req.session.user.userid

    const query = `SELECT cart.isbn, cart.qty, books.title, books.price FROM cart JOIN books ON cart.isbn = books.isbn WHERE cart.userid = ${userid}`

    const response = await db.query(query)

    return response[0]
  }
}
