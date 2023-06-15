let num_process = 0;
let num_resource = 3;
let num = 0;

let available_vector = [];
let allocation_matrix = [];
let max_matrix = [];
let need_matrix = [];

function availabledata() {
  let A = parseInt(document.sample0.a0.value);
  let B = parseInt(document.sample0.b0.value);
  let C = parseInt(document.sample0.c0.value);

  if (isNaN(A) || isNaN(B) || isNaN(C)) {
    alert("Enter inputs");
  } else {
    available_vector.push(A);
    available_vector.push(B);
    available_vector.push(C);

    alert("Submitted");
  }
}

function adddata() {
  let A = parseInt(document.sample.a.value);
  let B = parseInt(document.sample.b.value);
  let C = parseInt(document.sample.c.value);
  let N = "P";

  if (!allocation_matrix[num_process]) {
    allocation_matrix[num_process] = [];
  }

  if (isNaN(A) || isNaN(B) || isNaN(C)) {
    alert("Enter inputs");
  } else {
    allocation_matrix[num_process].push(A);
    allocation_matrix[num_process].push(B);
    allocation_matrix[num_process].push(C);

    num_process++;

    let tr = document.createElement('tr');
    let td0 = tr.appendChild(document.createElement('td'));
    let td1 = tr.appendChild(document.createElement('td'));
    let td2 = tr.appendChild(document.createElement('td'));
    let td3 = tr.appendChild(document.createElement('td'));

    td0.innerHTML = N + (num_process - 1);
    td1.innerHTML = A;
    td2.innerHTML = B;
    td3.innerHTML = C;

    document.getElementById("tb1").appendChild(tr);
  }
}

function adddata1() {
  let N = "P";

  if (num < num_process) {
    let A = parseInt(document.sample1.a1.value);
    let B = parseInt(document.sample1.b1.value);
    let C = parseInt(document.sample1.c1.value);
    
    let currentAllocation = allocation_matrix[num];

    if (isNaN(A) || isNaN(B) || isNaN(C)) {
      alert("Enter inputs");
    } 
    else {
      if (A >= currentAllocation[0] && B >= currentAllocation[1] && C >= currentAllocation[2]) {
        max_matrix[num] = [];
        max_matrix[num].push(A);
        max_matrix[num].push(B);
        max_matrix[num].push(C);

        let tr = document.createElement('tr');
        let td0 = tr.appendChild(document.createElement('td'));
        let td1 = tr.appendChild(document.createElement('td'));
        let td2 = tr.appendChild(document.createElement('td'));
        let td3 = tr.appendChild(document.createElement('td'));

        td0.innerHTML = N + num;
        td1.innerHTML = A;
        td2.innerHTML = B;
        td3.innerHTML = C;

        document.getElementById("tb2").appendChild(tr);

        num++;
      } else {
        alert("Maximum resource requirement should be greater than or equal to the current allocation");
      }
    }

  } else {
    alert("More than the number of processes");
  }
}

function calculate() {
  for (let i = 0; i < num_process; i++) {
    need_matrix[i] = [];
    for (let j = 0; j < num_resource; j++) {
      need_matrix[i][j] = max_matrix[i][j] - allocation_matrix[i][j];
    }
  }
}

function getdata() {
  calculate();
  setTimeout(() => {
    let html = '';
    for (let i = 0; i < num_process; i++) {
      html += '<tr>';
      html += '<td>' + 'P' + i + '</td>';
      for (let j = 0; j < num_resource; j++) {
        html += '<td>' + need_matrix[i][j] + '</td>';
      }
      html += '</tr>';
    }
    document.getElementById("tb3").innerHTML += html;
  }, 1000);
  retrieve();
}

function retrieve() {
  let finish = [];

  for (let i = 0; i < num_process; i++) {
    finish.push(false);
  }

  let safeSeq = [];
  let work = [];

  for (let i = 0; i < num_resource; i++) {
    work.push(available_vector[i]);
  }

  let count = 0;
  while (count < num_process) {
    let found = false;
    for (let p = 0; p < num_process; p++) {
      if (finish[p] == false) {
        let j;
        for (j = 0; j < num_resource; j++) {
          if (need_matrix[p][j] > work[j]) {
            break;
          }
        }
        if (j == num_resource) {
          for (let k = 0; k < num_resource; k++) {
            work[k] += allocation_matrix[p][k];
          }
          safeSeq[count] = p;
          count++;

          finish[p] = true;

          found = true;
        }
      }
    }
    if (found == false) {
      document.getElementById("safe-sequence").textContent =
        "System is not in a safe state";
      return;
    }
  }

  
  let sequence = "Safe sequence: ";
  for (let i = 0; i < num_process; i++) {
    sequence += "P" + safeSeq[i] + " ";
  }
  document.getElementById("safe-sequence").textContent = sequence;
}