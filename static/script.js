function addTaskToClock(task) {
    let svgNS = "http://www.w3.org/2000/svg";
    let taskPath = document.createElementNS(svgNS, "path");

    let startAngle = timeToAngle(task.start);
    let endAngle = timeToAngle(task.end);

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
    let hourAngle = (hours % 12) * 30; // 30 degrees per hour
    let minuteAngle = minutes * 0.5; // 0.5 degrees per minute
    return hourAngle + minuteAngle; // Total angle
}



let tasks = [
    { start: '07:00', end: '07:30', description: 'Breakfast', color: '#FFD700' },
    { start: '08:00', end: '08:45', description: 'Study', color: '#FF4500' },
    // ... other tasks
];


tasks.forEach(task => addTaskToClock(task));



function updateClockHands() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDegrees = (seconds / 60) * 360; // Add 90 to offset the initial 90 degrees
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

// Initial positioning
positionNumbers();

// Update position on resize
window.addEventListener('resize', positionNumbers);


// Update the clock hands every second
setInterval(updateClockHands, 1000);

// Initial update
updateClockHands();

console.log("Added tasks to clock");
