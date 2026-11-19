document.addEventListener("DOMContentLoaded", function() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function() {
      mobileMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll(".mobile-link").forEach(function(link) {
    link.addEventListener("click", function() {
      if (mobileMenu) {
        mobileMenu.classList.add("hidden");
      }
    });
  });

  document.querySelectorAll(".faq-toggle-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector(".fa-chevron-down");
      if (!content) return;
      const isOpen = !content.classList.contains("hidden");
      if (isOpen) {
        content.classList.add("hidden");
        if (icon) icon.style.transform = "rotate(0deg)";
      } else {
        content.classList.remove("hidden");
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
});
