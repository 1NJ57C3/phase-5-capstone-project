import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import logo from "./logo.svg";
import "./styles/App.css";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Game from "./components/Game";
import GameMenu from "./components/GameMenu";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [worldmaps, setWorldmaps] = useState([])

  // ! [DEPRECATED] - INITIAL SETUP TESTING
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   fetch("/hello")
  //     .then(r => r.json())
  //     .then(d => setCount(d.count));
  // }, [])

  useEffect(() => {
    FETCHDOWN("/me", setUser, "skipErr")
  }, [])

  // useEffect(() => {
  //   FETCHDOWN("/worldmaps", setWorldmaps, "skipErr")
  // }, [])

  // useEffect(() => {
  //   initFetch()
  // }, [])

  // const initFetch = () => {
  //   setLoading(true)
  //   fetch("/me")
  //   .then(r => {
  //     if(r.ok){
  //       r.json()
  //       .then(setUser)
  //       .then(FETCHDOWN("/worldmaps", setWorldmaps))
  //     } else {
  //       r.json()
  //       .then(e => {
  //         console.error("GET ERROR: ", e)
  //       })
  //     }
  //   })
  //   .finally(() => setLoading(false))
  // }

  // const initFetch = () => {
  //   setLoading(true)
  //   fetch("/me")
  //   .then(r => {
  //     if(r.ok){
  //       r.json()
  //       .then(setUser)
  //       .then(fetch("/worldmaps")
  //         .then(r => {
  //           if(r.ok){
  //             r.json()
  //             .then(setWorldmaps)
  //             .then(setErrors([]))
  //           } else {
  //             r.json()
  //             .then(e => {
  //               console.error("GET ERROR: ", e)
  //               setErrors(e.errors)
  //             })
  //           }
  //         }))
  //     } else {
  //       r.json()
  //       .then(e => {
  //         console.error("GET ERROR: ", e)
  //         setErrors(e.errors)
  //       })
  //     }
  //   })
  //   .finally(() => setLoading(false))
  // }
  
  const FETCHDOWN = (URL, ACTION, SKIPERRORHANDLING=false) => {
    setLoading(true);
    fetch(URL)
    .then(r => {
      if(r.ok){
        r.json()
        .then(ACTION)
        .then(setErrors([]))
      } else if (!SKIPERRORHANDLING) {
        r.json()
        .then(e => {
          console.error("GET Error: ", e);
          setErrors(e.errors)
        })
      }
    })
    .finally(() => setLoading(false))
  }

  const FETCHUP = (URL, METHOD, OBJ, ACTION=false, SKIPERRORHANDLING=false) => {
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
      } else if (!SKIPERRORHANDLING) {
        r.json()
        .then(e => {
          console.error("POST/UPDATE Error: ", e);
          setErrors(e.errors);
        })
      }
    })
    .finally(() => setLoading(false))
  }

  const FETCHDELETE = (URL, ACTION) => {
    setLoading(true);
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
          setErrors(e.errors);
        })
      }
    })
    .finally(() => setLoading(false))
  }

  if (!user) {return <Login FETCHDOWN={FETCHDOWN} FETCHUP={FETCHUP} user={user} setUser={setUser} errors={errors} setErrors={setErrors} setWorldmaps={setWorldmaps} />}

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar user={user} setUser={setUser} FETCHDELETE={FETCHDELETE} />
        <Routes>
          <Route path="menu" element={<GameMenu FETCHDOWN={FETCHDOWN} FETCHUP={FETCHUP} FETCHDELETE={FETCHDELETE} user={user} setUser={setUser} worldmaps={worldmaps} setWorldmaps={setWorldmaps} />} />
          <Route path="/" element={<Game FETCHDOWN={FETCHDOWN} FETCHUP={FETCHUP} FETCHDELETE={FETCHDELETE} user={user} setUser={setUser} worldmaps={worldmaps} setWorldmaps={setWorldmaps} />} />
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
