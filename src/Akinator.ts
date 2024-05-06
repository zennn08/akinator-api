import { AxiosRequestConfig } from "axios"
import { region, regions } from "./constants/Config"
import { AkinatorAPIAnswerResponse, AkinatorAPICancelAnswerResponse, AkinatorAnswer, AkinatorConstructor } from "./types/Aki"
import { request, setupAki } from "./functions/Request"

export class Akinator {
  step: number
  region: region
  progress: number
  question: string
  isWin: boolean
  sugestion_name: string
  sugestion_desc: string
  sugestion_photo: string

  private session: string
  private signature: string
  private baseUrl: string
  private sid: number
  private childMode: boolean
  private step_last: number | undefined

  private config: AxiosRequestConfig = {}

  constructor({ region = "en", childMode, config }: AkinatorConstructor) {
    if (!regions.includes(region)) throw new Error("Please insert a correct region!")

    this.step = 0
    this.region = region
    this.childMode = childMode
    this.progress = 0.0

    if (config) this.config = config
  }

  async start() {
    const { session, signature, question, baseUrl, sid } = await setupAki(this.region, this.childMode, this.config)
    if (!session || !signature || !question) throw new Error("Failed to get session and signature")

    this.session = session
    this.signature = signature
    this.baseUrl = baseUrl
    this.sid = sid
    this.question = question
  }

  async answer(answ: AkinatorAnswer) {
    const data = {
      step: this.step,
      progression: this.progress,
      sid: this.sid,
      cm: this.childMode === true,
      answer: answ,
      step_last_proposition: this.step_last ?? "",
      session: this.session,
      signature: this.signature
    }
    const { status, data: result } = await request<AkinatorAPIAnswerResponse>(this.baseUrl + "/answer", data, this.config)
    if (status != 200 || result.completion !== "OK") throw new Error("Failed making request, status : " + status)
    if (result.id_proposition) {
      this.sugestion_name = result.name_proposition
      this.sugestion_desc = result.description_proposition
      this.sugestion_photo = result.photo
      this.isWin = true
    } else {
      this.step = parseInt(result.step)
      this.progress = parseFloat(result.progression)
      this.question = result.question
    }
  }

  async cancelAnswer() {
    const data = {
      step: this.step,
      progression: this.progress,
      sid: this.sid,
      cm: this.childMode === true,
      session: this.session,
      signature: this.signature
    }
    const { status, data: result } = await request<AkinatorAPICancelAnswerResponse>(this.baseUrl + "/cancel_answer", data, this.config)
    if (status != 200) throw new Error("Failed making request, status : " + status)
    this.step = parseInt(result.step)
    this.progress = parseFloat(result.progression)
    this.question = result.question
  }
}
