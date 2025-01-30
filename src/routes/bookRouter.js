/**
 * @file Defines the book router.
 * @module bookRouter
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import express from 'express'
import { BookController } from '../controllers/bookController.js'

export const router = express.Router()

const controller = new BookController()

// Check if a user is logged in first.
router.use((req, res, next) => {
  if (!req.session.user) {
    const error = new Error('Unauthorized access')
    error.status = 403

    return next(error)
  } else {
    next()
  }
})

// Provide req.doc to the route if :subject or :search is present in the route path.
router.param('subject', async (req, res, next) => controller.loadSubject(req, res, next, req.params.subject, req.params.page))
router.param('search', async (req, res, next) => controller.loadSearch(req, res, next, req.params.search, req.params.page))

router.get('/browse', async (req, res, next) => controller.browse(req, res, next))
router.get('/browse/:subject/:page', (req, res, next) => controller.browseSubject(req, res, next))

router.get('/search', async (req, res, next) => controller.search(req, res, next))
router.get('/search/:search/:page', (req, res, next) => controller.searchBooks(req, res, next))
router.post('/search/:search/:page', (req, res, next) => controller.searchBooks(req, res, next))

router.post('/addToCart', async (req, res, next) => controller.addToCart(req, res, next))

router.get('/checkout', async (req, res, next) => controller.checkout(req, res, next))
router.get('/checkout/confirmation', async (req, res, next) => controller.confirmCheckout(req, res, next))
