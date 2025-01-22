/**
 * @file Defines the HomeController class.
 * @module HomeController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

/**
 * Encapsulates the home controller.
 */
export class UserController {
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
   *  Handles the login post event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  loginUser (req, res, next) {
    // TO-DO: Implement login handling.
  }

  /**
   *  Handles the user creation post event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  createUser (req, res, next) {
    // TO-DO: Implement user creation.
  }
}
