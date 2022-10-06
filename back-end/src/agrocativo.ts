import http from "http"
import newServer from "./Server"
import setupRoutes from "./SetupRoutes"
require('dotenv').config()

const server = newServer()

const httpServer = http.createServer(server);

/**
 * Rotas excluídas do middleware de autenticação
 */
const whitelistRoutes = [
	"POST:/api/auth/login",
	"POST:/api/auth/login/confirmed",
	"POST:/api/auth/register",
	"GET:/api/auth/emailAvailability",
	"POST:/api/auth/password/reset",
	"POST:/api/auth/password/code",
	"POST:/api/auth/password/new",
	"POST:/api/auth/code"
]

setupRoutes(server, true, whitelistRoutes)
const httpPort = process.env.HTTP_PORT

httpServer.listen(httpPort, () => {
	console.log(`[SERVER] Running at http://localhost:${httpPort}`)
})
