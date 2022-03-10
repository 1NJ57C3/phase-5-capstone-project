function NavBar({ user, setUser, FETCHDELETE }) {

  const handleSave = (e) => {
    console.log("NAVSAVE: ")
  }

  const handleLoad = (e) => {
    console.log("NAVLOAD: ")
  }

  const handleLogout = (e) => {
    console.log("LOGGING OUT: ",user);
    FETCHDELETE(`/logout`, () => setUser(null));
  }

  return(
    <div className="NavBar">
      <div className="nav-header">
        <big>Phase 5 Project</big>
      </div>
      <div className="nav-controls">
        {user &&
          <>
            <span>
              <button type="button">
                Dummy
              </button>
            </span> 
            <span>
              <button type="button">
                Dummy
              </button>
            </span> 
            <span>
              <button type="button" onClick={handleLogout} >
                Logout
              </button>
            </span>
          </>
        }
      </div>
    </div>
  )
}

export default NavBar;