// Required libraries (include in your HTML before this script):
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");

  fileInput.addEventListener("change", handleFileUpload);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => processData(results.data),
      });
    } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        processData(sheetData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a CSV or Excel file.");
    }
  }

  function processData(data) {
    // Clean numeric values
    data.forEach((row) => {
      row["Cash In"] = Number(row["Cash In"]) || 0;
      row["Cash Out"] = Number(row["Cash Out"]) || 0;
    });

    // Party Summary
    const summaryMap = {};
    data.forEach((row) => {
      const party = row["Party"] || "Unknown";
      if (!summaryMap[party]) summaryMap[party] = { in: 0, out: 0 };
      summaryMap[party].in += row["Cash In"];
      summaryMap[party].out += row["Cash Out"];
    });

    const partySummary = Object.entries(summaryMap).map(([party, v]) => ({
      Party: party,
      "Cash In": v.in,
      "Cash Out": v.out,
      Balance: v.in - v.out,
    }));

    // 2ndShed Filter
    const shedData = data.filter((r) =>
      (r["Remark"] || "").toLowerCase().includes("2ndshed:")
    );

    // Display results
    resultDiv.innerHTML = `
      <h2>Party Summary</h2>
      ${createTable(partySummary)}
      <h2>2ndShed Transactions</h2>
      ${createTable(shedData)}
    `;
  }

  function createTable(rows) {
    if (rows.length === 0) return "<p>No data available.</p>";

    const headers = Object.keys(rows[0]);
    let html = "<table border='1' cellspacing='0' cellpadding='6'><tr>";
    headers.forEach((h) => (html += `<th>${h}</th>`));
    html += "</tr>";

    rows.forEach((r) => {
      html += "<tr>";
      headers.forEach((h) => (html += `<td>${r[h] ?? ""}</td>`));
      html += "</tr>";
    });

    html += "</table>";
    return html;
  }
});
