export interface UserInterface {
    id: string
    fullname: string
    image: string
    role: "ALUNO" |"INSTRUTOR" | "ADMIN"
    active: boolean
    confirmed: boolean
    confirmation_code: string
    cpf: string
    birthday: string
	phone: string
    email: string
    password: string
    courses: string[]
	profile: string[]
    token?: string
}