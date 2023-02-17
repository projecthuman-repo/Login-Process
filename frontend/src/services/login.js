import axios from 'axios'
const baseUrl = '/api/login'

const login = async info => {
  const credentials = {
    username: info.loginUsername,
    password: info.loginPassword
  }
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }