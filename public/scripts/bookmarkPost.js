const bookmarkBtn = document.querySelectorAll(".bookmark-btn");

if (logout) {
	bookmarkBtn.forEach(btn =>
		btn.addEventListener("click", () => {
			if (btn.innerHTML === '<i class="fas fa-bookmark"></i>') {
				btn.innerHTML = '<i class="far fa-bookmark"></i>';
			} else {
				btn.innerHTML = '<i class="fas fa-bookmark"></i>';
			}
		})
	);
}
