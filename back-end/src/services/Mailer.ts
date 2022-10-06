import nodemailer from "nodemailer"
import TemplateMail from "./../utils/TemplateMail"
import { User } from "./../rules/user/models/User"
require("dotenv").config()

export async function sendResetPasswordEmail(user: User, code: string, ip: any) {
	try {
		const message = new TemplateMail(code, user.fullname.split(' ')[0], ip)
		const send = await mail(user.email, message.forgotPassword(), "AgroCATIVO - Redefinir Senha")
		console.log("Email sent: %s", send.messageId)
		return send
	} catch (error) {
		console.log("Error sending email:", error)
		return error
	}
}

export async function sendWelcomeEmail(user: User) {
	try {
		const message = new TemplateMail(user.confirmation_code, user.fullname.split(' ')[0])
		const send = await mail(user.email, message.register(), `AgroCATIVO - Boas vindas`)
		console.log("Email sent: %s", send.messageId)
		return send
	} catch (error) {
		console.log("Error sending email:", error)
		return error
	}
}

export async function sendNewCode(user: User, ip: any) {
	try {
		const message = new TemplateMail(user.confirmation_code, user.fullname.split(' ')[0], ip)
		const send = await mail(user.email, message.newCode(), `AgroCATIVO - Código de ativação`)
		console.log("Email sent: %s", send.messageId)
		return send
	} catch (error) {
		console.log("Error sending email:", error)
		return error
	}
}

async function mail(email: string, message: any, subject: string) {
	const transporter = nodemailer.createTransport(
		{
			service: "gmail",
			auth: {
				user: process.env.SMTP_EMAIL, // generated ethereal user
				pass: process.env.SMTP_EMAIL_PASSWORD, // generated ethereal password
			},
		})

	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: '"AgroCATIVO" <no-reply@agrocativo.com.br>', // sender address
		to: email, // list of receivers
		subject: subject, // Subject line
		html: message
	})

	return info
}
