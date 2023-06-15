class Process {
  constructor(pid, bt, art) {
    this.pid = pid;
    this.bt = bt;
    this.art = art;
  }
}

let total = 0;
let proc = [];
let id_num = 1;
let avg_waiting_time;
let avg_turnaround_time;
let waiting_time = [];
let turnaroundtime = [];

function adddata() {
  let AT= parseInt(document.sample.at.value);
  let BT = parseInt(document.sample.bt.value); 
  if(isNaN(BT)){
      alert("Enter burst time")
  }
  else if(isNaN(AT)){
      alert("Enter the arrival time")
  }
  else{
      proc.push(new Process(id_num,BT,AT));
      let tr = document.createElement('tr');
      let td0 = tr.appendChild(document.createElement('td'));
      let td1 = tr.appendChild(document.createElement('td'));
      let td2 = tr.appendChild(document.createElement('td'));
      td0.innerHTML = id_num;
      td1.innerHTML = AT;
      td2.innerHTML = BT;
      id_num++
      document.getElementById("tb1").appendChild(tr);
  }
}

function submitdata() {
  let i, pos, j, temp;
  let n = proc.length;
  for (i = 0; i < n; i++) {
    pos = i;
    for (j = i + 1; j < n; j++) {
      if (proc[j].bt < proc[pos].bt) {
        pos = j;
      }
    }
    temp = proc[i].bt;
    proc[i].bt = proc[pos].bt;
    proc[pos].bt = temp;
    temp = proc[i].pid;
    proc[i].pid = proc[pos].pid;
    proc[pos].pid = temp;
  }
  waiting_time[0] = 0;
  for (i = 1; i < n; i++) {
    waiting_time[i] = 0;
    for (j = 0; j < i; j++) {
      waiting_time[i] += proc[j].bt;
    }
    total += waiting_time[i];
  }
  avg_waiting_time = total / n;
  total = 0;
  for (i = 0; i < n; i++) {
    turnaroundtime[i] = proc[i].bt + waiting_time[i];
    total += turnaroundtime[i];
  }
  avg_turnaround_time = total / n;
  funCall();
}

function funCall() {
  let html = '';
  let num = proc.length;
  for (let i = 0; i < num; i++) {
    html += '<tr>';
    html += '<td>' + proc[i].pid + '</td>';
    html += '<td>' + proc[i].art + '</td>';
    html += '<td>' + proc[i].bt + '</td>';
    html += '<td>' + waiting_time[i] + '</td>';
    html += '<td>' + turnaroundtime[i] + '</td>';
    html += '</tr>';
  }
  document.getElementById("tb2").innerHTML += html;
  document.getElementById("avgwait1").innerHTML = avg_waiting_time;
  document.getElementById("avgturn1").innerHTML = avg_turnaround_time;
  drawChart();
}
  
google.charts.load('current', { 'packages': ['gantt'] });
google.charts.setOnLoadCallback(drawChart);

function daysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000;
}

function drawChart() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Resource');
    data.addColumn('date', 'Start Date');
    data.addColumn('date', 'End Date');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Percent Complete');
    data.addColumn('string', 'Dependencies');
  
    let rows = []; 

    let currentDate = new Date();
    for(let i = 0; i < proc.length; i++){
        let processId = proc[i].pid;
        let turnaroundTime = turnaroundtime[i];
        let startDate = new Date(currentDate.getTime());
        let endDate = new Date(startDate.getTime() + daysToMilliseconds(turnaroundTime));
        let duration = daysToMilliseconds(turnaroundTime);
        let percentComplete = 100;
        let dependency = (i > 0) ? proc[i-1].pid.toString() : null;

        rows.push([
            processId.toString(),
            'Process ' + processId,
            '',
            startDate,
            endDate,
            null,
            percentComplete,
            dependency
          ]);
      
          currentDate = new Date(endDate.getTime() + 1);    
    }
    data.addRows(rows);

    var options = {
        height: 275
    };

    var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

    chart.draw(data, options);
}
