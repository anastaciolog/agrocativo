import { Knex } from "knex"
import { User } from "../models/User"
import { UserDatabaseInterface } from "./UserDatabaseInterface"

export default class UserDatabase implements UserDatabaseInterface {

	private database: Knex

	constructor(database: Knex = require("../../../../db/knex")) {
		this.database = database
	}

	public async createUser(user: User): Promise<User | Error> {

		const query = this.database("tb_user")
			.insert(user)
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async readUser(id?: string, email?: string, code?: string): Promise<User | Error> {

		const query = this.database("tb_user").first()

		if (id) {
			query.where("id", id)
		}

		if (email) {
			query.where("email", email)
		}

		if (code) {
			query.where("confirmationCode", code)
		}

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async searchUser(search: string): Promise<User[] | Error> {

		const query = this.database('tb_user as u')

		if (search) {
			query.whereRaw('LOWER(unaccent(u.firstname)) LIKE ?', [`%${search}%`])
		}

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readUsers(): Promise<User[] | Error> {

		const query = this.database("tb_user").orderBy("name", "asc")

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async updateUser(user: User): Promise<User | Error> {

		const query = this.database("tb_user")
			.where("id", user.id)
			.update(user)
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async toggleBlockedUser(userId: string, blocked: boolean): Promise<User | Error> {

		const query = this.database("tb_user")
			.update({ blocked: !blocked })
			.where('id', userId)
			.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}


}
