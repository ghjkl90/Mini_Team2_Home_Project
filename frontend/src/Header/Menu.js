import { MAIN_CONTENT } from "../menu/Data";

function Menu() {
  return (
    <nav className="main-menu">
      <ul>
        {Object.entries(MAIN_CONTENT).map(([key, path]) => (
          <li key={key}>
            <a href={path}>{key}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;
