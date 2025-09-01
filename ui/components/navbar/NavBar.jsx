import "./NavBar.css";
function NavBar({ uuid }) {
  return (
    <nav>
      <h3>node connected as {uuid}</h3>
      <button
        onClick={() => {
          window.open(window.location.href);
        }}
      >
        connect new node
      </button>
    </nav>
  );
}

export default NavBar;
