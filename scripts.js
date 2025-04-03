function toggleMode() {
  // Toggle HTML theme
  const html = document.documentElement
  html.classList.toggle("light")

  // Select avatar
  const img = document.querySelector(".avatar img")
  if (html.classList.contains("light")) {
    // Light theme avatar
    img.setAttribute("src", "./assets/avatarpsy.png")
  } else {
    // Dark theme avatar
    img.setAttribute("src", "./assets/avatar.png")
  }

  var elemento = document.querySelector("button")
  if (html.classList.contains("light"))
    elemento.onanimationstart = function () {
      this.getElementsByTagName("img")[light].src =
        "assets/brasaoimperiobrzerodegrade.png"
    }
  if (html.classList.contains("dark"))
    this.getElementsByTagName("img")[dark].src = "assets/brasilimperiobr.png"
}
