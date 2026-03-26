import Menu from "../Header/Menu";

function Header() {
  return (
    <>
      <header>
        <Menu />
        <p className="header-out">
          <a href="/" onClick={() => localStorage.removeItem("institution")}>
            Logout
          </a>
        </p>
      </header>
    </>
  );
}

export default Header;
