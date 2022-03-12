import { useState } from "react";

function SignupForm({ toggleLogin, FETCHUP, setUser, errors, animateLabelUp, animateLabelDown, labelUp }) {
  const [signupData, setSignupData] = useState({ username:"", password:"", password_confirmation:"" });

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value });
  }

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("signupData: ", signupData);
    FETCHUP("/signup", "POST", signupData, setUser)
  }

  return (
    <div className="Auth">
      <form className="Auth">
        <h1>Untitled Phase 5 Capstone Project</h1>
        <h2>(Temporarily Referred to as "Text-based RPG Engine")</h2>
        <h3>Create a New Account...</h3>
        <div className="Auth-input">
          <label htmlFor="username" className={labelUp.username}>username</label>
          <input id="username" type="text" onChange={handleChange} onFocus={animateLabelUp} onBlur={animateLabelDown} value={signupData.username} /* placeholder="Username" */autoComplete="off" required autoFocus />
        </div>
        <div className="Auth-input">
          <label htmlFor="password" className={labelUp.password}>password</label>
          <input id="password" type="password" onChange={handleChange} onFocus={animateLabelUp} onBlur={animateLabelDown} value={signupData.password} /* placeholder="Password" */ required />
        </div>
        <div className="Auth-input">
          <label htmlFor="password_confirmation" className={labelUp.password_confirmation}>confirm password</label>
          <input id="password_confirmation" type="password" onChange={handleChange} onFocus={animateLabelUp} onBlur={animateLabelDown} value={signupData.password_confirmation} /* placeholder="Confirm Password" */ required />
        </div>
        <button onClick={handleSignup} type="submit">Sign Up</button>
        <div>
          Already have an account? <span className="Auth-link" onClick={toggleLogin}>Log In</span> instead!
        </div>
        {!!errors.length &&
          <div className="auth-errors">
            {errors.map((e, i) => <p className="auth-errors" key={i}>Error: {e}</p>)}
          </div>
        }
      </form>
    </div>
  )
}

export default SignupForm;