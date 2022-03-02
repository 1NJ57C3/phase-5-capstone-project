function NavBar({ user, setUser, FETCHDELETE }) {

  const handleClick = (e) => {
    console.log(user);
    FETCHDELETE(`/logout`, user, setUser(null));
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
              <button type="button" onClick={handleClick} >
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