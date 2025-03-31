export function createThemeManager() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  let isDarkMode = savedTheme ? savedTheme === "dark" : prefersDarkMode;

  applyTheme(false);

  setTimeout(() => {
      applyTheme(isDarkMode);
  }, 100);

  function applyTheme(isDark) {
      if (isDark) {
          document.documentElement.classList.add("dark-theme");
          document.documentElement.classList.remove("light-theme");
      } else {
          document.documentElement.classList.add("light-theme");
          document.documentElement.classList.remove("dark-theme");
      }

      localStorage.setItem("theme", isDark ? "dark" : "light");
      isDarkMode = isDark;
  }

  function toggleTheme() {
      applyTheme(!isDarkMode);
      return isDarkMode;
  }

  function isDarkTheme() {
      return isDarkMode;
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
          applyTheme(e.matches);
      }
  });

  return {
      toggleTheme,
      isDarkTheme,
      applyTheme,
  };
}