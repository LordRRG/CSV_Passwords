
function generatePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(){}[]<>?/";
  let pass = "";
  for (let i = 0; i < length; i++) {
    // pick a character randomly from charset
    pass += charset[Math.floor(Math.random() * charset.length)];
  }
  return pass;
}

function getCSV() {
  // First, the data must be turned into an array. 
  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tr");

  const data = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    const rowData = [];

    cells.forEach(cell => {
      rowData.push(cell.textContent.trim());
    })

    data.push(rowData);
  })

  const lines = data.map(row => row.join(","));
  const csv = lines.join("\n");
  return csv;
}

let csvData = [];
document.getElementById("csvFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.name.endsWith(".csv")) {
    alert("Please upload a valid CSV file.");
    return;
  }
  if (document.getElementById("csvFile")) {
    document.getElementById("generatepasswords").disabled = false;
    document.getElementById("downloadcsv").disabled = false;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.trim().split("\n").map(row => row.split(","));
    csvData = rows;
    displayTable(rows);
  };
  reader.readAsText(file);
});

function displayTable(data) {
  const table = document.createElement("table");

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement(rowIndex === 0 ? "th" : "td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  const output = document.getElementById("tableOutput");
  output.innerHTML = "";
  output.appendChild(table);
}

document.getElementById("generatepasswords").addEventListener("click", () => {
  // Modify csvData

  const hasPasswordColumn = csvData[0].includes("Password");
  if (hasPasswordColumn) {
    alert("Password column already exists!")
    return;
  }
  csvData[0].push("Password");
  for (let i = 1; i < csvData.length; i++) {
    let password = generatePassword();
    csvData[i].push(password);
  }
  displayTable(csvData);
});

document.getElementById("downloadcsv").addEventListener("click", () => {
  const fileData = getCSV();
  let blob = new Blob([fileData], {type: 'text/csv'});
  let url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "your-data.csv";
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);

})
