import { useState } from "react"
import { apiLoginRequest } from "../services/authService"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const formSubmitted = (e: React.SubmitEvent) => {
    e.preventDefault()
    apiLoginRequest(username, password).then(data => console.log(data))
  }


  return (
    <div>
        <h1>Login</h1>

        <form onSubmit={formSubmitted}>
            <label>Username:<br/><input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" /></label><br/>
            <label>Password:<br/><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" /></label><br/>
            <button type="submit">LOGIN</button><br/>
        </form>
    </div>
  )
}

export default Login