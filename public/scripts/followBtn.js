const followBtn = document.querySelectorAll(".user-card-btn");

if (logout) {
	followBtn.forEach(btn => {
		btn.addEventListener("click", () => {
			if (btn.innerText === "Following") {
				btn.innerText = "Follow";
				btn.classList.remove("btn-secondary");
				btn.classList.add("btn-primary");
			} else {
				btn.innerText = "Following";
				btn.classList.remove("btn-primary");
				btn.classList.add("btn-secondary");
			}
		});
	});
}
