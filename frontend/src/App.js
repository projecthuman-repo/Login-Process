import { useState } from 'react'
import registrationService from './services/registration'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import RegistrationForm from './components/RegistrationForm'

const App = () => {
  const [lUsername, setLUsername] = useState('')
  const [lPassword, setLPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rUsername, setRUsername] = useState('')
  const [rPassword, setRPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        lUsername, lPassword,
      })
      setUser(user)
      setLUsername('')
      setLPassword('')
    } catch (exception) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRegistration = async (event) => {
    event.preventDefault()
    try {
      const response = await registrationService.register({
        firstName, lastName, rUsername, rPassword, email, phoneNumber
      })
      setRUsername('')
      setRPassword('')
    } catch (exception) {
      setErrorMessage('Some fields are incomplete or have errors')  // not very user-friendly, make more verbose in future
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      {user === null ?
        <div>
          <div>
            <Notification message={errorMessage} />
            <h1>Login</h1>
            <LoginForm
              handleLogin={handleLogin}
              username={lUsername}
              password={lPassword}
              setUsername={setLUsername}
              setPassword={setLPassword}
            />
          </div>
          <hr />
          <div>
            <h1>Register</h1>
            <RegistrationForm
              handleRegistration={handleRegistration}
              firstName={firstName}
              lastName={lastName}
              username={rUsername}
              password={rPassword}
              email={email}
              phoneNumber={phoneNumber}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setUsername={setRUsername}
              setPassword={setRPassword}
              setEmail={setEmail}
              setPhoneNumber={setPhoneNumber}
            />
          </div>
        </div> :
        <div>
          <p>hello {user.firstName}</p>
        </div>
      }
    </div>
  )
}

export default App