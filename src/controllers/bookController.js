/**
 * @file Defines the BookController class.
 * @module BookController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

/**
 * Encapsulates the book controller.
 */
export class BookController {
  /**
   * Renders the browse page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  browse (req, res, next) {
    res.render('books/browse')
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
