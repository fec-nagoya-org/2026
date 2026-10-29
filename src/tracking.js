document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-job-board-company]").forEach((link) => {
		link.addEventListener("click", () => {
			window.dataLayer.push({
				event: "job_board_click",
				company: link.dataset.jobBoardCompany,
			});
		});
	});

	document.querySelectorAll("[data-sponsor-company]").forEach((link) => {
		link.addEventListener("click", () => {
			window.dataLayer.push({
				event: "sponsor_click",
				company: link.dataset.sponsorCompany,
			});
		});
	});

	document.querySelectorAll("[data-sns-platform]").forEach((link) => {
		link.addEventListener("click", () => {
			window.dataLayer.push({
				event: "sns_click",
				platform: link.dataset.snsPlatform,
			});
		});
	});
});
