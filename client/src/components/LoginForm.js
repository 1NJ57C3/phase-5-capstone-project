import { useState } from "react";

function LoginForm({ toggleLogin, FETCHUP, setUser, errors, animateLabelUp, animateLabelDown, labelUp }) {
  const [loginfo, setLoginfo] = useState({ username:"", password:"" });

  const handleChange = (e) => {
    setLoginfo({ ...loginfo, [e.target.id]: e.target.value });
  }

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("login: ", loginfo.username);
    FETCHUP({ URL: "/login", METHOD: "POST", OBJ: loginfo, ACTION: setUser });
  }

  return (
    <div className="Auth">
      <form className="Auth">
        <h1>Untitled Phase 5 Capstone Project</h1>
        <h2>(Temporarily Referred to as "Text-based RPG Engine")</h2>
        <h3>Log in...</h3>
        <div className="Auth-input">
          <label htmlFor="username" className={labelUp.username}>username</label>
          <input id="username" type="text" onChange={handleChange} onFocus={animateLabelUp} onBlur={animateLabelDown} value={loginfo.username} /* placeholder="Username" */autoComplete="off" required autoFocus />
        </div>
        <div className="Auth-input">
          <label htmlFor="username" className={labelUp.password}>password</label>
          <input id="password" type="password" onChange={handleChange} onFocus={animateLabelUp} onBlur={animateLabelDown} value={loginfo.password} /* placeholder="Password" */ required />
        </div>
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