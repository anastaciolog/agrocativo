import { Express } from "express"

export interface RouterInterface {

	setupRoutes(server: Express): void

}