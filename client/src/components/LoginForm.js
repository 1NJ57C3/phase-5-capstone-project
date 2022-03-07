import { useState } from "react";

function LoginForm({ toggleLogin, FETCHUP, setUser, errors }) {
  const [loginfo, setLoginfo] = useState({ username:"", password:"" });

  const handleChange = (e) => {
    setLoginfo({ ...loginfo, [e.target.id]: e.target.value });
  }

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("loginfo: ", loginfo);
    FETCHUP("/login", "POST", loginfo, setUser);
  }

  return (
    <div className="Auth">
      <form className="Auth">
        Log in...
        <input id="username" type="text" onChange={handleChange} value={loginfo.username} placeholder="Username" autoComplete="off" required autoFocus />
        <input id="password" type="password" onChange={handleChange} value={loginfo.password} placeholder="Password" required />
        <button onClick={handleLogin} type="submit">Log In</button>
        <div>
          First time? <span className="Auth-link" onClick={toggleLogin}>Register</span>!
        </div>
        {errors.length > 0 && 
          <div className="auth-errors">
            {errors.map((e, i) => <p className="auth-errors" key={i}>Error: {e}</p>)}
          </div>
        }
      </form>
    </div>
  )
}

export default LoginForm;