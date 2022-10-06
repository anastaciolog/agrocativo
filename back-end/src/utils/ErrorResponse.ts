export default class ErrorResponse {

	public code: number
	public message: string
	public status: number
	public timestamp?: string

	constructor(code: number, message: string, status: number, timestamp?: string) {
		this.code = code
		this.message = message
		this.status = status
		this.timestamp = timestamp || new Date().toISOString()
	}

}
