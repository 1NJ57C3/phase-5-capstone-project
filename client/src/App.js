import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/App.css";

import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Game from "./components/Game";
// import GameMenu from "./components/GameMenu";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({ down: false, up: false, del: false });
  const [errors, setErrors] = useState([]);
  const [worldmaps, setWorldmaps] = useState([]);
  
  const FETCHDOWN = useCallback(({ URL, ACTION, SKIPERRORHANDLING=false }) => {
    setLoading( loading => ({ ...loading, down: true }) );
    fetch(URL)
    .then(r => {
      if (r.ok) {
        r.json()
        .then(ACTION)
        .then(setErrors([]))
      } else if (!SKIPERRORHANDLING) {
        r.json()
        .then(e => {
          console.error("GET Error: ", e);
          setErrors(Object.values(e));
        })
      }
    })
    .finally(() => setLoading( loading => ({ ...loading, down: false }) ))
  }, []);

  const FETCHUP = ({ URL, METHOD, OBJ, ACTION, SKIPERRORHANDLING=false }) => {
    setLoading( loading => ({ ...loading, up: true}) );
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
      } else if (!SKIPERRORHANDLING) {
        r.json()
        .then(e => {
          console.error("POST/UPDATE Error: ", e);
          setErrors(Object.values(e));
        })
      }
    })
    .finally(() => setLoading( loading => ({ ...loading, up: false }) ))
  };

  const FETCHDELETE = ({ URL, ACTION }) => {
    setLoading({ ...loading, del: true });
    fetch(URL, {
      method: "DELETE"
    })
    .then(r => {
      if (r.ok) {
        (ACTION)
        (setErrors([]))
      } else {
        r.json()
        .then(e => {
          console.error("DELETE Error: ", e);
          setErrors(Object.values(e));
        })
      }
    })
    .finally(() => setLoading({ ...loading, del: false }))
  };

  useEffect(() => {
    FETCHDOWN({ URL: "/me", ACTION: setUser, SKIPERRORHANDLING: true })
  }, [FETCHDOWN]);

  if (!user) {return <Login FETCHDOWN={FETCHDOWN} FETCHUP={FETCHUP} user={user} setUser={setUser} errors={errors} setErrors={setErrors} setWorldmaps={setWorldmaps} />}

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar user={user} setUser={setUser} FETCHDELETE={FETCHDELETE} />
        <Routes>
          {/* <Route path="menu" element={<GameMenu FETCHDOWN={FETCHDOWN} FETCHUP={FETCHUP} FETCHDELETE={FETCHDELETE} user={user} setUser={setUser} worldmaps={worldmaps} setWorldmaps={setWorldmaps} />} /> */}
          <Route path="/" element={<Game FETCHDOWN={FETCHDOWN} FETCHUP={FETCHUP} FETCHDELETE={FETCHDELETE} user={user} setUser={setUser} worldmaps={worldmaps} setWorldmaps={setWorldmaps} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
};

export default App;
