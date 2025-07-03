import axios, { AxiosRequestConfig } from "axios"

import { region, regions } from "./constants/Config"
import { request, setupAki } from "./functions/Request"
import { AkinatorAnswer, AkinatorAPIAnswerResponse, AkinatorAPICancelAnswerResponse, AkinatorConstructor } from "./types/Aki"

export class Akinator {
  step: number
  region: region
  progress: number
  question: string
  isWin: boolean
  sugestion_name: string
  sugestion_desc: string
  sugestion_photo: string

  private id: string
  private baseUrlServerAPI: string
  private session: string
  private signature: string
  private baseUrl: string
  private sid: number
  private childMode: boolean
  private step_last: number | undefined

  private config: AxiosRequestConfig = {}

  constructor({ region = "en", childMode, baseUrlServerAPI }: AkinatorConstructor) {
    if (!regions.includes(region)) throw new Error("Please insert a correct region!")

    this.step = 0
    this.region = region
    this.childMode = childMode
    this.progress = 0.0
    this.baseUrlServerAPI = baseUrlServerAPI
  }

  async start() {
    const { id, question } = await setupAki(this.region, this.childMode, this.baseUrlServerAPI)
    if (!id || !question) throw new Error("Failed to get id session")

    this.id = id
    this.question = question
  }

  async answer(answ: AkinatorAnswer) {
    const {
      status,
      data: { data: result }
    } = await axios.get<{ data: AkinatorAPIAnswerResponse }>(this.baseUrlServerAPI + `/answer?id=${this.id}&answer=${answ}`)
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
    const {
      status,
      data: { data: result }
    } = await axios.get<{ data: AkinatorAPICancelAnswerResponse }>(this.baseUrlServerAPI + `/cancel-answer?id=${this.id}`)
    if (status != 200) throw new Error("Failed making request, status : " + status)
    this.step = parseInt(result.step)
    this.progress = parseFloat(result.progression)
    this.question = result.question
  }
}
