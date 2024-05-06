import axios, { AxiosRequestConfig } from "axios"
import { region, themes } from "../constants/Config"
import { load } from "cheerio"
import { AkinatorAPIAnswerResponse, ResponseSetupAki } from "../types/Aki"

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest"
}

const axiosConfig: AxiosRequestConfig = {
  validateStatus: () => true
}

export const setupAki = async (region: region, childMode: boolean, config: AxiosRequestConfig): Promise<ResponseSetupAki> => {
  try {
    const [lang, theme] = region.split("_")
    const baseUrl = `https://${lang}.akinator.com`
    const sid = themes[theme] ?? 1
    const { data } = await axios.post(
      `${baseUrl}/game`,
      new URLSearchParams(
        Object.entries({
          cm: childMode === true,
          sid
        })
      ),
      { headers: { ...headers, ...config.headers }, ...config }
    )
    const $ = load(data)
    const session = $("#askSoundlike > #session").attr("value")
    const signature = $("#askSoundlike > #signature").attr("value")
    const question = $("#question-label").text()
    return { session, signature, question, baseUrl, sid }
  } catch (e) {
    console.log(e)
  }
}

export const request = async <data>(url: string, body: any, config: AxiosRequestConfig) =>
  axios.post<number, data>(url, body, {
    headers: { ...headers, ...config.headers },
    ...axiosConfig
  })
