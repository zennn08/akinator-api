import axios, { AxiosRequestConfig } from "axios"
import { load } from "cheerio"

import { region, themes } from "../constants/Config"
import { AkinatorAPIAnswerResponse, ResponseSetupAki } from "../types/Aki"

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest"
}

const axiosConfig: AxiosRequestConfig = {
  validateStatus: () => true
}

export const setupAki = async (region: region, childMode: boolean, baseUrlServerAPI: string): Promise<ResponseSetupAki> => {
  try {
    const {
      data: { data }
    } = await axios.get(`${baseUrlServerAPI}/start?region=${region}&child_mode=${childMode}`)
    return data
  } catch (e) {
    console.log(e)
  }
}

/**
 *
 * @deprecated
 */
export const request = async <data>(url: string, body: any, config: AxiosRequestConfig) =>
  axios.post<number, data>(url, body, {
    headers: { ...headers, ...config.headers },
    ...axiosConfig
  })
