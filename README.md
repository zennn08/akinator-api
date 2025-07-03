# Akinator API

## ⚠️ Important Notice

This npm module is designed to work with the server API from [https://github.com/zennn08/akinator-server-api](https://github.com/zennn08/akinator-server-api).

Since scraping akinator.com now requires Puppeteer for proper functionality, I have created a separate server API using Puppeteer. This client library connects to that server API to provide a clean, simple interface for interacting with Akinator.

**You need to deploy your own server using the code from the GitHub repository above**

## Install

```bash
npm install @aqul/akinator-api
```

## Usage

### Simple Usage

```js
const { Akinator, AkinatorAnswer } = require("@aqul/akinator-api")

const run = async () => {
  const region = "en"
  const baseUrlServerAPI = "http://localhost:3000/api/v1"
  const api = new Akinator({ baseUrlServerAPI, region, childMode: false })
  await api.start()
  console.log(`Question: ${api.question}, progress: ${api.progress}`)

  // To answer
  await api.answer(AkinatorAnswer.Yes) // or you can use 0-4
  console.log(`Question: ${api.question}, progress: ${api.progress}`)

  // To check is win or not
  while (!api.isWin) {
    await api.answer(Math.floor(Math.random() * 5)) // random 0-5
    console.log(`Question: ${api.question}, progress: ${api.progress}`)

    // To back last question
    if (Math.floor(Math.random() * 10) + 1 < 4) {
      await api.cancelAnswer()
      console.log(`Question: ${api.question}, progress: ${api.progress}`)
    }
  }

  // if is win
  if (api.isWin) {
    console.log(api.sugestion_name)
    console.log(api.sugestion_desc)
    console.log(api.sugestion_photo)
  }
}

run()
```

### To check region

```js
const { regions } = require("@aqul/akinator-api")
console.log(regions)
```

## Direct Scraping Version

If you prefer to use the version that directly scrapes akinator.com without requiring a separate server API, you can install version 1.0.1:

```bash
npm install @aqul/akinator-api@1.0.1
```

**Note**: The direct scraping version (1.0.1) may be less reliable due to anti-bot measures and may require additional configuration for proper functionality.

## Server API

This library requires a server API to handle the Puppeteer-based scraping. You need to:

**Deploy your own server**: Clone and deploy from [https://github.com/zennn08/akinator-server-api](https://github.com/zennn08/akinator-server-api)

## Why a separate server?

Modern web scraping of akinator.com requires:

- Puppeteer with real browser simulation
- Complex session management
- Browser resource handling
- Anti-bot detection circumvention

By separating the server API, we can:

- Keep the client library lightweight
- Handle complex browser operations on the server
- Provide a simple API interface
- Allow for better scalability and maintenance
