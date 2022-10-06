import { User } from "../models/User"

export interface UserDatabaseInterface {

	createUser(user: User): Promise<User | Error>

	readUser(id?: string, email?: string, name?: string, code?: string): Promise<any | Error>

	searchUser(search: string): Promise<User[] | Error>

	readUsers(): Promise<User[] | Error>

	updateUser(user: User): Promise<User | Error>

	toggleBlockedUser(userId: string, blocked: boolean): Promise<User | Error>

}
