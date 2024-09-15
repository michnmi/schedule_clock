function addTaskToClock(task) {
    if (!isTaskCurrent(task)) {
        return; // Skip tasks that are not within the current time range
    }

    let svgNS = "http://www.w3.org/2000/svg";
    let taskPath = document.createElementNS(svgNS, "path");

    let startAngle = timeToAngle(task.start);
    let endAngle = timeToAngle(task.end);

    console.log(`Task: ${task.description} | Start Angle: ${startAngle} | End Angle: ${endAngle}`);

    // Calculate the SVG path data for the task segment
    let pathData = describeArc(50, 50, 50, startAngle, endAngle);
    taskPath.setAttribute("d", pathData);
    taskPath.setAttribute("fill", task.color);

    document.getElementById("clock-tasks").appendChild(taskPath);
}


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
function describeArc(x, y, radius, startAngle, endAngle){
      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);
      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
          "L", x, y,
          "Z"
      ].join(" ");
      return d;       
  }
  

  function timeToAngle(time) {
    let [hours, minutes] = time.split(':').map(n => parseInt(n, 10));

    // Convert 24-hour time to 12-hour time if needed
    if (hours >= 12) {
        hours = hours - 12;
    }

    let hourAngle = (hours % 12) * 30; // 30 degrees per hour
    let minuteAngle = minutes * 6; // 6 degrees per minute
    let totalAngle = hourAngle + (minutes / 60) * 30;

    console.log(`Time: ${time}, Angle: ${totalAngle}`);
    return totalAngle;
}


function isTaskCurrent(task) {
    const now = new Date();
    const [startHours, startMinutes] = task.start.split(':').map(Number);
    const [endHours, endMinutes] = task.end.split(':').map(Number);

    const taskStart = new Date(now);
    taskStart.setHours(startHours, startMinutes, 0, 0);

    const taskEnd = new Date(now);
    taskEnd.setHours(endHours, endMinutes, 0, 0);

    // Only return false if the task is completely in the past.
    return now <= taskEnd;
}




function updateClockTasks() {
    const clockTasks = document.getElementById("clock-tasks");
    clockTasks.innerHTML = ''; // Clear existing tasks
    console.log('Updating clock tasks...');
    tasks.forEach(task => {
        console.log(`Checking task: ${task.description}`);
        addTaskToClock(task); // Add only current tasks
    });
}


let tasks = [
    { start: '07:00', end: '07:30', description: 'Breakfast', color: '#FFD700' },
    { start: '10:10', end: '10:30', description: 'Brush Teeth', color: '#FF4500' },
    { start: '11:00', end: '11:25', description: 'Play', color: '#AB1234' },
    { start: '13:25', end: '14:40', description: 'Get Ready', color: '#BC5678' },
];


tasks.forEach(task => addTaskToClock(task));



function updateClockHands() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds/60) * 6;
    const hourDegrees = ((hours % 12) / 12 ) * 360 + (minutes/60) * 30;

    document.getElementById('second-hand').style.transform = `rotate(${secondDegrees}deg)`;
    document.getElementById('minute-hand').style.transform = `rotate(${minuteDegrees}deg)`;
    document.getElementById('hour-hand').style.transform = `rotate(${hourDegrees}deg)`;
}

function positionNumbers() {
    const clock = document.getElementById('clock');
    const radius = clock.offsetWidth / 2; // Radius of the clock
    const numberElements = document.querySelectorAll('.number');

    numberElements.forEach((number, index) => {
        const angle = (index) * 30; // 30 degrees apart for each number
        const angleRad = angle * (Math.PI / 180); // Convert to radians

        // Calculate position
        const x = radius + radius * Math.sin(angleRad);
        const y = radius - radius * Math.cos(angleRad);

        // Adjust style
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        // Apply rotation: initial rotation + inverse rotation for upright orientation
        number.style.transform = `translate(-50%, -50%) rotate(${angle}deg) rotate(${-angle}deg)`;
    });
}

function populateTaskTable(tasks) {
    const tableBody = document.getElementById('taskTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    tasks.forEach(task => {
        const row = document.createElement('tr');
        
        // Task Name
        const nameCell = document.createElement('td');
        nameCell.textContent = task.description;
        row.appendChild(nameCell);

        // Task Duration
        const durationCell = document.createElement('td');
        durationCell.textContent = `${task.start} - ${task.end}`;
        row.appendChild(durationCell);

        // Task Colour
        const colourCell = document.createElement('td');
        colourCell.style.backgroundColor = task.color;
        row.appendChild(colourCell);

        tableBody.appendChild(row);
    });
}

populateTaskTable(tasks);

// Initial positioning
positionNumbers();

// Update position on resize
window.addEventListener('resize', positionNumbers);


// Update the clock hands every second
setInterval(updateClockHands, 1000);

// Initial update
updateClockHands();

setInterval(updateClockTasks, 60000);
updateClockTasks(); // Initial call


console.log("Added tasks to clock");
