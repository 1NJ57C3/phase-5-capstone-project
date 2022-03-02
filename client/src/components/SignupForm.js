import { useState } from "react";

function SignupForm({ toggleLogin, FETCHUP, setUser, errors }) {
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
        Create a New Account...
        <input id="username" type="text" onChange={handleChange} value={signupData.username} placeholder="Username" autoComplete="off" required autoFocus />
        <input id="password" type="password" onChange={handleChange} value={signupData.password} placeholder="Password" required />
        <input id="password_confirmation" type="password" onChange={handleChange} value={signupData.password_confirmation} placeholder="Confirm Password" required />
        <button onClick={handleSignup} type="submit">Sign Up</button>
        <div>
          Already have an account? <span className="Auth-link" onClick={toggleLogin}>Log In</span> instead!
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

export default SignupForm;