const toggle=document.getElementById("toggle"),statusText=document.getElementById("status"),robot=document.getElementById("robot");function setRobotStatus(e,t,s=!0){statusText.innerHTML=e,robot.src=t,toggle.checked=s}function messageActiveTab(e,t=(()=>{})){chrome.tabs.query({active:!0,currentWindow:!0},(function(s){chrome.tabs.sendMessage(s[0].id,e,t)}))}toggle.checked=!0,statusText.innerHTML="Idle",messageActiveTab({type:"isBoardPresent"},(e=>{e?chrome.storage.local.get(["isSolving"],(({isSolving:e})=>{toggle.checked?setRobotStatus(e?"Solving":"Idle",e?"solving.svg":"idle.svg"):setRobotStatus("Disabled","sleeping.svg")})):setRobotStatus("No Board","sleeping.svg",!1)})),chrome.storage.onChanged.addListener((function(e){"isSolving"in e&&toggle.checked&&messageActiveTab({type:"isBoardPresent"},(function(t){t&&(e.isSolving.newValue?(statusText.innerHTML="Solving",robot.src="solving.svg"):(statusText.innerHTML="Idle",robot.src="idle.svg"))})),"enabled"in e&&(toggle.checked=e.enabled.newValue,statusText.innerHTML=e.enabled.newValue?"Solving":"Disabled",robot.src=e.enabled.newValue?"solving.svg":"sleeping.svg")})),toggle.addEventListener("change",(function(){if(this.checked)return chrome.storage.local.set({enabled:!0}),void setRobotStatus("Solving","solving.svg");chrome.storage.local.set({enabled:!1}),setRobotStatus("Idle","idle.svg")}));