// Gestor de temas (claro/oscuro)
export function createThemeManager() {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem("theme")
    // Verificar la preferencia del sistema
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  
    // Estado inicial del tema
    let isDarkMode = savedTheme ? savedTheme === "dark" : prefersDarkMode
  
    // Aplicar el tema inicial
    applyTheme(isDarkMode)
  
    // Función para aplicar el tema
    function applyTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add("dark-theme")
        document.documentElement.classList.remove("light-theme")
      } else {
        document.documentElement.classList.add("light-theme")
        document.documentElement.classList.remove("dark-theme")
      }
  
      // Guardar preferencia
      localStorage.setItem("theme", isDark ? "dark" : "light")
      isDarkMode = isDark
    }
  
    // Función para alternar el tema
    function toggleTheme() {
      applyTheme(!isDarkMode)
      return isDarkMode // Retorna el nuevo estado
    }
  
    // Función para obtener el estado actual
    function isDarkTheme() {
      return isDarkMode
    }
  
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      // Solo cambiar automáticamente si el usuario no ha establecido una preferencia
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches)
      }
    })
  
    return {
      toggleTheme,
      isDarkTheme,
      applyTheme,
    }
  }
  
  