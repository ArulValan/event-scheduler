import "./styles.css";

const sizeForADay = 2400;
function timeToPixel(amOrPm, hour, minutes) {
  let yPosition = 0;
  yPosition += (sizeForADay / 24) * hour;
  yPosition += (sizeForADay / (24 * 60)) * minutes;
  if (amOrPm === "pm") {
    yPosition += sizeForADay / 2;
  }
  return yPosition;
}
function generateTimeLabels(datalabelContainer, markerContainer) {
  for (let hour = 1; hour <= 12; hour++) {
    const y = timeToPixel("am", hour, 0);
    addTimeLines(y, markerContainer);
    addTimeLabel(y, `${hour} : 00 am`, datalabelContainer);
  }
  for (let hour = 1; hour <= 12; hour++) {
    const y = timeToPixel("pm", hour, 0);
    addTimeLines(y, markerContainer);

    addTimeLabel(y, `${hour} : 00 pm`, datalabelContainer);
  }
}

function addTimeLabel(yPosition, label, datalabelContainer) {
  const labelDOM = document.createElement("span");
  labelDOM.innerText = label;
  labelDOM.style.position = "absolute";
  labelDOM.style.top = yPosition - 10 + "px";
  datalabelContainer.appendChild(labelDOM);
}

function addTimeLines(yPosition, markerContainer) {
  const lineDOM = document.createElement("div");
  lineDOM.style.background = "black";
  lineDOM.style.position = "absolute";
  lineDOM.style.height = "1px";
  lineDOM.style.width = "100%";
  lineDOM.style.top = yPosition + "px";
  markerContainer.appendChild(lineDOM);
}

const usedIntervals = [];

function generateTaskMarker(task, markerContainer) {
  const startY = getYfromTimeString(task.startTime);
  const endY = getYfromTimeString(task.endTime);
  const xPosition = getXposition(usedIntervals, startY, endY);
  const marker = document.createElement("div");
  marker.className = "task-marker";
  marker.innerText = task.label;
  marker.style.top = startY + "px";
  marker.style.left = xPosition + "px";
  marker.style.height = endY - startY + "px";
  marker.style.backgroundColor = task.color;
  markerContainer.appendChild(marker);
  usedIntervals.push([startY, endY]);
}

function getXposition(usedIntervals, startY, endY) {
  let xPosition = 0;
  usedIntervals.forEach(([intervalStart, intervalEnd]) => {
    if (startY > intervalStart && startY < intervalEnd) {
      xPosition += 40;
    } else if (endY > intervalStart && endY < intervalEnd) {
      xPosition += 40;
    }
  });
  return xPosition + 70;
}

function getYfromTimeString(timeString) {
  const [hour, minutes] = timeString
    .split(":")
    .map((str) => +str.match("([0-9]+)")[0]);
  const [amOrPm] = timeString.match("am|pm");
  return timeToPixel(amOrPm, hour, minutes);
}

const containers = {};
containers.parent = document.getElementById("app");
containers.datalabelContainer = document.createElement("div");
containers.markerContainer = document.createElement("div");

containers.parent.appendChild(containers.datalabelContainer);
containers.parent.appendChild(containers.markerContainer);

generateTimeLabels(containers.datalabelContainer, containers.markerContainer);

const tasks = [
  {
    label: "thoongu da",
    startTime: "1:00 am",
    endTime: "5:30 pm",
    color: "blue"
  },
  {
    label: "coffee break",
    startTime: "2:00 pm",
    endTime: "3:30 pm",
    color: "red"
  },
  {
    label: "tea break",
    startTime: "2:00 pm",
    endTime: "2:30 pm",
    color: "blue"
  }
];
for (let taskIdx in tasks) {
  generateTaskMarker(tasks[taskIdx], containers.markerContainer);
}
