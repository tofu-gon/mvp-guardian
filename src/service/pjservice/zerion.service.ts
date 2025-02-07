import { submitGetRequest } from '../apiclient';


export async function getWeb3Services(address: string): Promise<string[]> {
  const url = `https://api.zerion.io/v1/wallets/${address}/positions/`
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Basic ${authToken()}`,
  }

  const params: Record<string, string> = {
    'filter[positions]': 'only_complex',
    'currency': 'usd',
    'filter[trash]': 'only_non_trash',
    'sort': 'value'
  }

  const response = await submitGetRequest(url, headers, params)
  const serviceList = response.jsonBody.data.map((data: {attributes: {fungible_info: {name: string}}}) => data.attributes.fungible_info.name)

  console.log(serviceList)

  return serviceList
}

function authToken(): string{
  if(!process.env.ZERION_BASIC_AUTH){
    throw new Error('ZERION_BASIC_AUTH is not defined in environment variables');
  }
  return process.env.ZERION_BASIC_AUTH
}
