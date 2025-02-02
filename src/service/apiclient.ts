const DEFAULT_TIMEOUT_MS = 60000

export async function submitGetRequest(
  url: string,
  headers: Record<string, string>,
  query?: Record<string, string>,
  timeoutMs?: number
) {
  return submitRequest('GET', url, headers, null, query, timeoutMs)
}

export async function submitPostRequest<B>(
  url: string,
  headers: Record<string, string>,
  body: B,
  query?: Record<string, string>,
  timeoutMs?: number
) {
  return submitRequest('POST', url, headers, body, query, timeoutMs)
}

export async function submitDeleteRequest<B>(
  url: string,
  headers: Record<string, string>,
  body: B,
  query?: Record<string, string>,
  timeoutMs?: number
) {
  return submitRequest('DELETE', url, headers, null, query, timeoutMs)
}

export async function submitPatchRequest<B>(
  url: string,
  headers: Record<string, string>,
  body: B,
  query?: Record<string, string>,
  timeoutMs?: number
) {
  return submitRequest('PATCH', url, headers, body, query, timeoutMs)
}

async function submitRequest<B>(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: B | null,
  query?: Record<string, string>,
  timeoutMs?: number
): Promise<{ statusCode: number; jsonBody?: any; textBody?: string }> {
  const apiUrl = new URL(`${url}`)

  if (query) {
    Object.keys(query).forEach((key) => apiUrl.searchParams.append(key, query[key]))
  }

  const init: RequestInit = {
    // headers: {
    //   'content-type': 'application/json',
    // },
    headers: headers,
    method: method,
  }

  if (body) {
    if (headers['content-type'] === 'application/x-www-form-urlencoded') {
      init.body = new URLSearchParams(body as Record<string, string>).toString()
    } else {
      init.body = JSON.stringify(body)
    }
  }

  const response = await withTimeout(fetch(apiUrl.toString(), init), timeoutMs)
  const responseText = await response.text()
  const status = response.status
  console.debug('call external API: ', method, apiUrl.href, 'status', status)
  try {
    const json = JSON.parse(responseText)
    // console.debug('--------result is json--------')
    // console.debug(json)
    return {
      statusCode: status,
      jsonBody: json,
    }
  } catch (e) {
    // console.debug('--------result is not json--------')
    // console.debug(responseText)
    return {
      statusCode: status,
      textBody: responseText,
    }
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, timeoutMs)

    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}
