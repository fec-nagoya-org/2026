document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-job-board-company]").forEach((link) => {
		link.addEventListener("click", () => {
			const company = link.dataset.jobBoardCompany;
			gtag("event", "job_board_click", { company });
		});
	});
});
