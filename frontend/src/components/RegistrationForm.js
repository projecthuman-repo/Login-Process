import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const RegistrationForm = ({
    handleRegistration,
    firstName,
    lastName,
    username,
    password,
    email,
    phoneNumber,
    setFirstName,
    setLastName,
    setUsername,
    setPassword,
    setEmail,
    setPhoneNumber
}) => {

    return (
        <form onSubmit={handleRegistration}>
            <div>
                first name
                <input
                    type='text'
                    value={firstName}
                    name='FirstName'
                    onChange={({ target }) => setFirstName(target.value)}
                />
            </div>
            <div>
                last name
                <input
                    type='text'
                    value={lastName}
                    name='LastName'
                    onChange={({ target }) => setLastName(target.value)}
                />
            </div>
            <div>
                username
                <input
                    type='text'
                    value={username}
                    name='Username'
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type='password'
                    value={password}
                    name='Password'
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <div>
                email
                <input
                    type='email'
                    value={email}
                    name='Email'
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>
            <div>
                <PhoneInput
                    placeholder='phone number'
                    value={phoneNumber}
                    name='PhoneNumber'
                    onChange={setPhoneNumber}
                />
            </div>
            <button type='submit'>register</button>
        </form>
    )
}

export default RegistrationForm