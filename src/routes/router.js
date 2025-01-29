/**
 * @file Defines the main router.
 * @module router The router module.
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as userRouter } from './userRouter.js'
import { router as bookRouter } from './bookRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/user', userRouter)
router.use('/books', bookRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
