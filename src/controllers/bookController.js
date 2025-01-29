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
   * Provide req.doc to the route if :subject is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} subject - The value of the subject to load.
   * @param {string} page - The value of the page to load.
   */
  async loadSubject (req, res, next, subject, page) {
    try {
      let query = ''

      const firstPage = 1
      if (parseInt(page) === firstPage) {
        query = `SELECT * FROM books WHERE subject = '${subject}' LIMIT 2`
      } else {
        query = `SELECT * FROM books WHERE subject = '${subject}' LIMIT 2 OFFSET ${parseInt(page) * 2 - 2}`
      }

      const response = await db.query(query)

      const result = response[0]

      const maxPage = await db.query(`SELECT COUNT(*) FROM books WHERE subject = '${subject}'`)
      const maxPageValue = maxPage[0]

      const pageObj = {
        current: parseInt(page),
        max: maxPageValue[0]['COUNT(*)']
      }

      req.doc = result
      req.page = pageObj
      // req.page.max =

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
   * @param {string} id - The value of the id for the subject to load.
   */
  async loadSearch (req, res, next, id) {
    try {
      console.log('IN LOADSEARCH METHOD')
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
      console.log('IN SEARCHBOOKS METHOD')
      res.redirect('./')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Renders the checkout page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  checkout (req, res, next) {
    res.render('books/checkout')
  }
}
