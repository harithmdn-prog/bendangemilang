
const links = document.querySelectorAll(".nav-link");
const underline = document.getElementById("underline");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu(e) {
  mobileMenu.classList.toggle("hidden");
  menuBtn.classList.toggle("text-blue-500");
  menuBtn.classList.toggle("rotate-90");
}

// underline movement 
  function move(el) {
    underline.style.width = el.offsetWidth + "px";
    underline.style.left = el.offsetLeft + "px";
  }

  // detect current page
  const current = window.location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("text-blue-500");
      move(link);
    }

    link.addEventListener("click", () => {
      move(link);
    });
});
