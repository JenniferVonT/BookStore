/**
 * @file Defines the HomeController class.
 * @module HomeController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import { db } from '../config/dbsettings.js'

/**
 * Encapsulates the home controller.
 */
export class UserController {
  /**
   * Provide req.user to the route if :user is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} username - The username for the account to load.
   */
  async loadUser (req, res, next, username) {
    try {
      // Get the user.

      // If the account is not found, throw an error.
      /* if (!user) {
        const error = new Error('The account you requested does not exist.')
        error.status = 404
        throw error
      }

      // Provide the account to req.
      req.user = user

      // Next middleware.
      next()
      */
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  login (req, res, next) {
    res.render('user/login')
  }

  /**
   * Renders the user creation page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  create (req, res, next) {
    res.render('user/create')
  }

  /**
   * Handles the user creation post event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createUser (req, res, next) {
    try {
      const {
        fname, lname, address,
        city, zip, phone, email,
        password, passwordCheck
      } = req.body

      if (password !== passwordCheck) {
        throw new Error('Password do not match!')
      }

      // TO-DO: VALIDATE DATA!
      // TO-DO: Encrypt and hash password!
      // TO-DO:
      const insertQuery = 'INSERT INTO members (fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

      const response = await db.execute(insertQuery, [fname, lname, address, city, parseInt(zip), phone, email, password])

      req.session.flash = { type: 'success', text: 'The user was created successfully. Please login to continue' }
      res.redirect('./login')
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        req.session.flash = { type: 'danger', text: 'A member with that email already exists. Please use a different one' }
      } else {
        req.session.flash = { type: 'danger', text: error.message }
      }
      res.redirect('./create')
    }
  }

  /**
   * Renders the user profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  profile (req, res, next) {
    res.render('user/profile')
  }

  /**
   * Handles the login post event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  loginUser (req, res, next) {
    try {
      /*
      const { username, password } = req.body
      */

      // TO-DO: check username and psw against the DB.

      // TO-DO: throw an error if the account does not exist.

      // TO-DO: redirect to user page instead.
      res.redirect('./login')
    } catch (e) {
      req.session.flash = { type: 'danger', text: e.message }
      res.redirect('./login')
    }
  }
}
