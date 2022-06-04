import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Login({ FETCHUP, setUser, errors, setErrors }) {
    const [showLogin, setShowLogin] = useState(true)
    const [labelUp, setLabelUp] = useState({username: "", password: "", password_confirmation: ""})

    const toggleLogin = () => {
        setErrors([]);
        resetLabels();
        setShowLogin(!showLogin);
    }

    const animateLabelUp = (e) => {
        setLabelUp({...labelUp, [e.target.id]: "active"})
    }

    const animateLabelDown = (e) => {
        e.target.value === "" && setLabelUp({...labelUp, [e.target.id]: "down"})
    }
    
    const resetLabels = () => {
        setLabelUp({username:"", password:"", password_confirmation: ""})
    }

    return (
        <div className="Auth">
            {showLogin ? <LoginForm toggleLogin={toggleLogin} FETCHUP={FETCHUP} setUser={setUser} errors={errors} animateLabelUp={animateLabelUp} animateLabelDown={animateLabelDown} labelUp={labelUp} /> : <SignupForm toggleLogin={toggleLogin} FETCHUP={FETCHUP} setUser={setUser} errors={errors} animateLabelUp={animateLabelUp} animateLabelDown={animateLabelDown} labelUp={labelUp} />}
        </div>
    )
}

export default Login;