import { differenceInYears, isValid } from "date-fns"
import { validate as uuidValidate } from 'uuid';

export class ValidatorRequest {

    public validateDataNasc(birthday: string): boolean {
        if ((typeof birthday !== "string")) {
            return false
        }

        let D = parseInt(birthday.split("/")[0])
        let M = parseInt(birthday.split("/")[1])
        let Y = parseInt(birthday.split("/")[2])

        const age = differenceInYears(new Date(), new Date(Y, M, D))

        if (age < 18) {
            return false
        }
        return true
    }

    public validatePhotosArray(array: any): boolean {
        if (!Array.isArray(array)) {
            return false
        }
        if (array.length === 0 || array.length > 6) {
            return false
        }
        return true
    }

    public validateName(name: any): boolean {
        if ((typeof name !== "string")) {
            return false
        }
        if (name.length < 3) {
            return false
        }
        return true
    }

    public validateCPF(cpf: any): boolean {
        if ((typeof cpf !== "string")) {
            return false
        }
        if (cpf.length !== 11) {
            return false
        }
        return true
    }

    public validatePassword(password: any): boolean {
        if ((typeof password !== "string")) {
            return false
        }
        if (password.length < 8) {
            return false
        }
        return true
    }

    public validateEmail(email: any): boolean {

        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


        if ((typeof email !== "string")) {
            return false
        }
        if (!email.toLowerCase().match(regex)) {
            return false
        }
        return true
    }

    public validateCode(code: any): boolean {
        if ((typeof code !== "string")) {
            return false
        }
        if (code.length !== 6) {
            return false
        }
        return true
    }


    public validatePhone(phone: any): boolean {
        if ((typeof phone !== "string")) {
            return false
        }
        if (phone.length < 10 || phone.length > 11) {
            return false
        }
        return true
    }

    public validateArray(array: any): boolean {
        if (typeof array === "string") {
            return false
        }
        if (!Array.isArray(array)) {
            return false
        }
        return true
    }

    public validateFile(file: any): boolean {
        if (typeof file.filename !== "string") {
            return false
        }
        return true
    }

    public validadeLimit(limit: any): boolean {

        if (typeof limit !== "string") {
            return false
        }

        if (typeof parseInt(limit, 10) !== "number") {
            return false
        }

        return true
    }

    public validateAbout(value: any): boolean {
        if (typeof value !== "string") {
            return false
        }
        return true
    }

    public validatePlatform(value: any): boolean {
        if (typeof value !== "string") {
            return false
        }
        if (["desktop", "mobile"].indexOf(value.toString()) < 0) {
            return false
        }
        return true
    }

    public validateRole(role: any): boolean {
        if (typeof role !== "string") {
            return false
        }
        if (["ALUNO", "INSTRUTOR", "ADMIN"].indexOf(role.toString()) < 0) {
            return false
        }
        return true
    }

    public validateEntity(type: any): boolean {
        if (typeof type !== "string") {
            return false
        }
        if (["intro", "newcontent", "library"].indexOf(type.toString()) < 0) {
            return false
        }
        return true
    }


    public validateUser(userId: any): boolean {
        if (typeof userId !== "string" && !uuidValidate(userId)) {
            return false
        }
        return true
    }

    public validateBoolean(value: any): boolean {
        if (typeof value !== "boolean") {
            return false
        }
        return true
    }

    public validateDate(date: any): boolean {
        if ((typeof date !== "string")) {
            return false
        }
        if (!isValid(new Date(date))) {
            return false
        }
        return true
    }

    public validateText(text: any) {

        if (typeof text !== "string") {
            return false
        }

        if (String(text).length === 0) {
            return false
        }

        return true
    }

    public validateTimestamp(timestamp: any) {

        if (typeof timestamp !== "string") {
            return false
        }

        if (isNaN(parseFloat(timestamp))) {
            return false
        }

        return true
    }

    public validateFromAndTo(from: string, to: string) {

        return (from !== to)
    }

    public validateLimit(limit: any) {

        if (typeof limit !== "string") {
            return false
        }

        if (typeof parseInt(limit, 10) !== "number") {
            return false
        }

        return true
    }

    public validateOffset(offset: any) {

        if (typeof offset !== "string") {
            return false
        }

        if (typeof parseInt(offset, 10) !== "number") {
            return false
        }

        return true
    }


}
