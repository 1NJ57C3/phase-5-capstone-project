import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Login({ FETCHUP, setUser, errors, setErrors }) {
    const [showLogin, setShowLogin] = useState(true)

    const toggleLogin = () => {
        setErrors([]);
        setShowLogin(!showLogin);
    }

    return (
        <div className="Auth">
            {showLogin ? <LoginForm toggleLogin={toggleLogin} FETCHUP={FETCHUP} setUser={setUser} errors={errors} /> : <SignupForm toggleLogin={toggleLogin} FETCHUP={FETCHUP} setUser={setUser} errors={errors} />}
        </div>
    )
}

export default Login;