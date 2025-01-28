/**
 * @file Defines the HomeController class.
 * @module HomeController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import { db } from '../config/dbsettings.js'
import bcrypt from 'bcrypt'

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

      // Check if the password matches the check and if it is atleast 10 characters long.
      if (password !== passwordCheck) {
        throw new Error('Password do not match!')
      } else if (password.length < 10) {
        throw new Error('Password is too short, please use atleast 10 characters!')
      }

      // Check if the email is a valid format:
      // starts with any number of characters then an @, then any number of characters again before it ends with a . and more characters.
      if (!/^\D+[@]\D+[.]\D+$/.test(email)) {
        throw new Error('Invalid email adress!')
      }

      // Check if all the other neccessary attributes are present.
      const minlength = 2
      if (fname.length < minlength || lname.length < minlength ||
          address.length < minlength || city.length < minlength ||
          zip.length < minlength) {
        throw new Error('A required input is missing!')
      }

      // Hash and salt password before saving!
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create a query string and query the database to create a new user (automatically checks for doublicate users in the db based on email).
      const query = 'INSERT INTO members (fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      await db.execute(query, [fname, lname, address, city, parseInt(zip), phone, email, hashedPassword])

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
}
