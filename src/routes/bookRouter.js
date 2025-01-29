/**
 * @file Defines the book router.
 * @module bookRouter
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import express from 'express'
import { BookController } from '../controllers/bookController.js'

export const router = express.Router()

const controller = new BookController()

router.get('/browse', (req, res, next) => controller.browse(req, res, next))

router.get('/search', (req, res, next) => controller.search(req, res, next))

router.get('/checkout', (req, res, next) => controller.checkout(req, res, next))
