export default class Session {

	public id: string
	public user_id: string
	public token: string
	public platform?: string
	public startedOn: Date
	public lastInteraction: Date
	public deviceId?: string

	constructor(id: string, user: string, token: string, startedOn: Date, lastInteraction: Date,
		platform?: string, deviceId?: string) {
		this.id = id
		this.user_id = user
		this.token = token
		this.platform = platform
		this.startedOn = startedOn
		this.lastInteraction = lastInteraction
		this.deviceId = deviceId
	}

}
