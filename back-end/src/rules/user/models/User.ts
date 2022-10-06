import { confirmationCode, generateId } from "../../../utils/idGenerator"

export class User {

	public id: string
    public fullname: string
    public image: string
    public role: string
    public active: boolean
    public confirmed: boolean
    public confirmation_code: string
    public cpf?: string
    public birthday?: string
	public phone?: string
    public email: string
    public password: string
	public courses?: string[]
	public profile?: string[]
	public token?: string

	constructor(fullname: string, role: string, email: string, password: string, image: string) {
			this.id = generateId()
			this.fullname = fullname
			this.role = role
			this.active = true
			this.confirmed = false
			this.confirmation_code = confirmationCode()
			this.email = email
			this.password = password
			this.image = image
	}

}
