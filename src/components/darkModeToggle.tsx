import '../styles/darkModeToggle.scss';

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  darkMode,
  setDarkMode,
}) => {
  return (
    <div className="dark-mode-toggle">
      <input
        type="checkbox"
        id="dark-mode-checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <label htmlFor="dark-mode-checkbox">
        <div className="toggle-track">
          <div className="toggle-indicator">
            <div className="checkMark">{darkMode ? '🌙' : '☀️'}</div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;
