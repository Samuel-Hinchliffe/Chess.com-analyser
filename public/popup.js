const toggle = document.getElementById("toggle");
const statusText = document.getElementById("status");
const robot = document.getElementById("robot");

chrome.storage.local.get(["enabled"], ({ enabled }) => {
	if(enabled) toggle.checked = true;
	else toggle.checked = false;
});


messageActiveTab({ type: "isBoardPresent" }, (response) => {
	
	if (!response){
		setRobotStatus("No Board", "sleeping.svg");
		toggle.checked = false;
	}
	else
		chrome.storage.local.get(["isSolving"], ({ isSolving }) => {
			if (!toggle.checked){
				setRobotStatus("Disabled", "sleeping.svg");	
				return;
			}

			if (!isSolving){
				setRobotStatus('Idle', "idle.svg")
				return;
			}

			if (isSolving){
				setRobotStatus('Solving', "solving.svg")
				return
			}
		});
});

chrome.storage.onChanged.addListener(function (changes) {
	if ("isSolving" in changes && toggle.checked) {
		messageActiveTab({ type: "isBoardPresent" }, function (response) {
			if (response) {
				if (changes.isSolving.newValue) {
					statusText.innerHTML = "Solving";
					robot.src = "solving.svg";
				} else {
					statusText.innerHTML = "Idle";
					robot.src = "idle.svg";
				}
			}
		});
	}
	if ("enabled" in changes) {
		toggle.checked = changes.enabled.newValue;
		statusText.innerHTML = changes.enabled.newValue ? "Solving" : "Disabled";
		robot.src = changes.enabled.newValue ? "solving.svg" : "sleeping.svg";
	}
});

toggle.addEventListener("change", function () {
	if (toggle.checked) {
		chrome.storage.local.set({ enabled: true });
		setRobotStatus("Idle", "idle.svg");
		return;
	} else {
		chrome.storage.local.set({ enabled: false });
		setRobotStatus("Idle", "sleeping.svg");
	}
});

function setRobotStatus(t, robotSrc) {
	statusText.innerHTML = t;
	robot.src = robotSrc;
}

function messageActiveTab(message, callback = () => {}) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, callback);
	});
}
