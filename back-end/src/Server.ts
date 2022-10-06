import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { Express } from "express"
import fs from "fs"

export default function newServer(): Express {

	const server = express()
	server.use(cors())
	server.use(express.json({ limit: '50mb' }))
	server.use(express.urlencoded({ extended: true }))


	server.use(cookieParser())


	const dir = "./public"
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}

	server.use('/public', express.static('public'))

	return server

}
