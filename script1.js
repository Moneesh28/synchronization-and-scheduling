let burst_time = [];
let arrival_time = [];
let completion_time = [];
let turnaround_time = [];
let waiting_time = [];
let id_num = 1;
let pid = [];

function adddata() {
  let AT= parseInt(document.sample.at.value);
  let BT= parseInt(document.sample.bt.value);
  arrival_time.push(AT);
  burst_time.push(BT);
  pid.push(id_num+1);
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

let pid1 = [];
let arrival_time1 = [];
let burst_time1 = [];
let completion_time1 = [];
let turnaround_time1 = [];
let waiting_time1 = [];

function submitdata() {
    let indices = arrival_time.map((_, index) => index);
    indices.sort((a, b) => arrival_time[a] - arrival_time[b]);
    arrival_time = indices.map(index => arrival_time[index]);
    burst_time = indices.map(index => burst_time[index]);
    pid = indices.map(index => pid[index]);

    let current_time = 0;
    let n = burst_time.length;
    for (let i = 0; i < n; i++) {
        if (current_time < arrival_time[i]) {
            current_time = arrival_time[i];
        }

        completion_time[i] = current_time + burst_time[i];
        turnaround_time[i] = completion_time[i] - arrival_time[i];
        waiting_time[i] = turnaround_time[i] - burst_time[i];

        current_time = completion_time[i];
    }

    for (let i = 0; i < n; i++) {
        pid1.push(pid[i]);
        arrival_time1.push(arrival_time[i]);
        burst_time1.push(burst_time[i]);
        completion_time1.push(completion_time[i]);
        turnaround_time1.push(turnaround_time[i]);
        waiting_time1.push(waiting_time[i]);
    }

    funCall();
    drawGanttChart(completion_time1, pid1);

}

function funCall(){
  let html = '';
  let num_flows = burst_time1.length;
  setTimeout(() => {
    for (let i = 0; i < num_flows; i++) {
      html += '<tr>';
      html += '<td>' + pid1[i] + '</td>';
      html += '<td>' + arrival_time1[i] + '</td>';
      html += '<td>' + burst_time1[i] + '</td>';
      html += '<td>' + completion_time1[i] + '</td>';
      html += '<td>' + turnaround_time1[i] + '</td>';
      html += '<td>' + waiting_time1[i] + '</td>';
      html += '</tr>';
    }
    document.getElementById("tb2").innerHTML += html;
  }, 1000);
}
function drawGanttChart(completion_times, pids) {
    let html = '';
    let num_processes = completion_times.length;
    let start_time = 0;
    let end_time = completion_times[num_processes - 1];
  
    html += '<div class="gantt-chart">';
    for (let i = 0; i < num_processes; i++) {
      let width = (completion_times[i] - start_time) / (end_time - start_time) * 100;
      html += '<div class="gantt-block" style="width:' + width + '%">';
      html += '<span class="gantt-text">' + pids[i] + '</span>';
      html += '</div>';
      start_time = completion_times[i];
    }
    html += '</div>';
  
    document.getElementById("gantt-chart").innerHTML += html;
  }

