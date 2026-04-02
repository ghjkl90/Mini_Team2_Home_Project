import { MAIN_CONTENT } from "../menu/Data";
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav className="main-menu">
      <ul>
        {Object.entries(MAIN_CONTENT).map(([key, path]) => (
          <li key={key}>
            <Link to={path}>{key}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;
