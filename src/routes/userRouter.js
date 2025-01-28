/**
 * @file Defines the home router.
 * @module userRouter
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import express from 'express'
import { UserController } from '../controllers/userController.js'

export const router = express.Router()

const controller = new UserController()

router.get('/profile', (req, res, next) => controller.profile(req, res, next))

router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', async (req, res, next) => controller.loginUser(req, res, next))

router.get('/create', (req, res, next) => controller.create(req, res, next))
router.post('/create', async (req, res, next) => controller.createUser(req, res, next))

router.get('/logout', (req, res, next) => controller.logout(req, res, next))
