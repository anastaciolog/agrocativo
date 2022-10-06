import Knex = require("knex")
import Session from "../models/Session"

export default interface SessionDatabaseInterface {

	createSession(session: Session): Promise<Session | Error>

	readSession(token?: string, user?: string): Promise<Session | Error>

	readSessions(user: string): Promise<Session[] | Error>

	updateSession(session: Session): Promise<Session | Error>

	deleteSession(token: string): Promise<Session | Error>

	deleteSessionByDeviceId(token: string): Promise<Session | Error>

	readDeviceIds(user: string): Promise<any[]>

	deleteUserSessions(user: string): Promise<number | Error>

}
