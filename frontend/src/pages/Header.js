import { Link } from "react-router-dom";
import Menu from "../Header/Menu";

function Header() {
  return (
    <>
      <header>
        <Link to="/mains">
          <img src="/logo.png" width={40} height={40} alt="logo" />
        </Link>
        <Menu />
        <p className="header-out">
          <a href="/">Logout</a>
        </p>
      </header>
    </>
  );
}

export default Header;
