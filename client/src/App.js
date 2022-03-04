import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import logo from "./logo.svg";
import "./styles/App.css";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Game from "./components/Game";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [maps, setMaps] = useState([])

  // ! [DEPRECATED] - INITIAL SETUP TESTING
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   fetch("/hello")
  //     .then(r => r.json())
  //     .then(d => setCount(d.count));
  // }, [])

  useEffect(() => {
    fetch("/me")
    .then(r => {
      if(r.ok){
        r.json()
        .then(setUser)
      }
    })
  }, [])
  
  useEffect(() => {
    FETCHDOWN("/maps", setMaps, "skipErrors")
  }, [])
  
  const FETCHDOWN = (URL, ACTION, SKIPERRORHANDLING=false) => {
    setLoading(true);
    fetch(URL)
    .then(r => {
      if(r.ok){
        r.json()
        .then(ACTION)
        .then(setErrors([]))
      } else if (SKIPERRORHANDLING === false) {
        r.json()
        .then(e => {
          console.error("GET Error: ", e);
          setErrors(e.errors)
        })
      }
    })
    .finally(() => setLoading(false))
  }

  const FETCHUP = (URL, METHOD, OBJ, ACTION) => {
    setLoading(true);
    fetch(URL, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(OBJ)
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(ACTION)
        .then(setErrors([]))
      } else {
        r.json()
        .then(e => {
          console.error("POST/UPDATE Error: ", e);
          setErrors(e.errors);
        })
      }
    })
    .finally(() => setLoading(false))
  }

  const FETCHDELETE = (URL, ACTION, OBJ="") => {
    setLoading(true);
    fetch(URL+`/${OBJ}`, {
      method: "DELETE"
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(ACTION)
        .then(setErrors([]))
      } else {
        r.json()
        .then(e => {
          console.error("DELETE Error: ", e);
          setErrors(e.errors);
        })
      }
    })
    .finally(() => setLoading(false))
  }

  if (!user) {return <Login FETCHUP={FETCHUP} setUser={setUser} errors={errors} setErrors={setErrors} />}

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar user={user} setUser={setUser} FETCHDELETE={FETCHDELETE} />
        <Routes>
          <Route path="testing" element={<h1>Test Route</h1>} />
          <Route path="/" element={<Game maps={maps} user={user} />} />
          {/* // ! [DEPRECATED] - INITIAL SETUP TESTING */}
          {/* <Route path="/" element={<h1>Page Count: {count}</h1>} /> */}
        </Routes>
        {/* // ! create-react-app logo */}
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
