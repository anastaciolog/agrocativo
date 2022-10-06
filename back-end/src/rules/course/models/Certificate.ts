import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

export default class Certificate {

  public student: string
  public teacher: string
  public course: string
  public duration: string
  public date: string
  public id: string

  constructor(id: string, student: string, teacher: string, course: string, duration: number, date: Date) {
    this.id = id
    this.student = student
    this.teacher = teacher
    this.course = course
    this.duration = duration.toString()
    this.date = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

}