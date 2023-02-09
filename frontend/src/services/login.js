import axios from 'axios'
const baseUrl = '/api/login'

const login = async info => {
  const credentials = {
    username: info.lUsername,
    password: info.lPassword
  }
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }