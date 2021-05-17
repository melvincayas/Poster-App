const feature = document.querySelectorAll(".feature-btn");
const heartNum = document.querySelectorAll(".heart-num");
const logout = document.getElementById("logout");

if (logout) {
	feature.forEach((btn, i) =>
		btn.addEventListener("click", () => {
			if (btn.innerHTML === '<i id="heart" class="fas fa-heart"></i>') {
				btn.innerHTML = '<i class="far fa-heart"></i>';
				heartNum[i].innerText = parseInt(heartNum[i].innerText) - 1;
			} else {
				btn.innerHTML = '<i id="heart" class="fas fa-heart"></i>';
				heartNum[i].innerText = parseInt(heartNum[i].innerText) + 1;
			}
		})
	);
}
