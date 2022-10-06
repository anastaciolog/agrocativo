import { Knex } from "knex"
import Session from "../models/Session"
import SessionDatabaseInterface from "./SessionDatabaseInterface"

export default class SessionDatabase implements SessionDatabaseInterface {

	private database: Knex

	constructor(database: Knex = require("../../../../db/knex")) {
		this.database = database
	}

	public async createSession(session: Session): Promise<Session | Error> {

		const query = this.database("tb_session")
			.insert(session)
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async readSession(token?: string, user?: string): Promise<Session | Error> {

		const query = this.database("tb_session").first()

		if (token) {
			query.where("token", token)
		}

		if (user) {
			query.where("user", user)
		}

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readSessions(user: string): Promise<Session[] | Error> {

		const query = this.database("tb_session").where("user", user)

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async updateSession(session: Session): Promise<Session | Error> {

		const query = this.database("tb_session")
			.where("id", session.id)
			.update(session)
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async deleteSession(token: string): Promise<Session | Error> {

		const query = this.database("tb_session")
			.where("token", token)
			.del()
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async deleteSessionByDeviceId(deviceId: string): Promise<Session | Error> {

		const query = this.database("tb_session")
			.where("deviceId", deviceId)
			.del()
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async readDeviceIds(user: string): Promise<any[]> {

		const query = this.database("tb_session")
			.select("deviceId")
			.where("user", user)

		try {
			const result = await query
			return result
		} catch (error: any) {
			return error
		}
	}

	public async deleteUserSessions(user: string): Promise<number | Error> {

		const query = this.database("tb_session")
			.where("user", user)
			.del()

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

}
