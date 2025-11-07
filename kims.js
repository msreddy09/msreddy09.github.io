// Required libraries (include in your HTML before this script):
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

const party1 = "Sudhakar Reddy Medagam";
const party2 = "Balakrishna Idamakanti";
const party3 = "Lakshmi Reddy Kypu";

const baseurl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQe3k3p3r9u5jHBhE9cE0yLXqk_WLC_EofcSAETSmkmC_oIA6h8tDjfugc-q_L9XZodfNo3RHjsrW0G/pub?output=csv"
const url = `${baseurl}&nocache=${new Date().getTime()}`;
document.addEventListener("DOMContentLoaded", () => {
  // const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");

  // fileInput.addEventListener("change", handleFileUpload);
  async function fetchGoogleDocData() {
    // const url = 'https://docs.google.com/document/d/e/YOUR_DOC_ID/pub';
    const response = await fetch(url);
    const html = await response.text();
    // If your data is in simple lines, you can extract it easily
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content = doc.body.innerText;
    console.log(content); // or parse it as needed
    // processData(content)
    const rows = content.trim().split('\n');
    const headers = rows[0].split(',');

    const json = rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, i) => {
        obj[header.trim()] = values[i]?.trim();
        return obj;
      }, {});
    });
    // console.log(json)
    processData(json);
    //return content;
  }
  //fetchGoogleDocData();
  const allTheData = {}
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      // console.log(results.data); // clean JSON
      processData(results.data);
      allTheData.data = results.data
    }
  });


  // function handleFileUpload(event) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const fileName = file.name.toLowerCase();

  //   if (fileName.endsWith(".csv")) {
  //     Papa.parse(file, {
  //       header: true,
  //       dynamicTyping: true,
  //       complete: (results) => processData(results.data),
  //     });
  //   } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  //       processData(sheetData);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   } else {
  //     alert("Please upload a CSV or Excel file.");
  //   }
  // }

  function formatTo12Hour(timeStr) {
    // Split hours, minutes, seconds
    let [hour, minute] = timeStr.split(':');
    hour = parseInt(hour, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.

    return `${hour}:${minute.padStart(2, '0')} ${ampm}`;
  }

  window.handleSearch = function (q) {
    console.log('Search for:', q);
    // call API or filter local data
    //let dataReport = [...allTheData.data];
    let returnData = []
    if (q !== '') {
      returnData = [...allTheData.data].filter((r) => r['Cash In'] && r.Remarks?.toLowerCase().includes(q?.toLowerCase()));
    }else {
      returnData = [...dataReport.data];
    }
    partyreportspopupLabel.innerHTML = `<h5>${q}</h5>`
    const sorted = [...returnData].sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return dateB - dateA; // descending order
    });
    trans.innerHTML = `${createCards(sorted, q)}`;
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
      if (party == 'Sudhakar Reddy Medagam' || party == 'Lakshmi Reddy Kypu' || party == 'Balakrishna Idamakanti') { }
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

    const totals = partySummary.reduce(
      (acc, curr) => {
        acc.totalIn += curr["Cash In"] || 0;
        acc.totalOut += curr["Cash Out"] || 0;
        acc.balance += curr.Balance || 0;
        return acc;
      },
      { totalIn: 0, totalOut: 0, balance: 0 }
    );
    cashin.innerHTML = `<b>${totals.totalIn.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    })}</b>`;
    cashout.innerHTML = `<b>${totals.totalOut.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    })}</b>`;
    balance.innerHTML = `<b>${totals.balance.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    })}`;

    // Latest 10 Transactions

    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return dateB - dateA; // descending order
    });

    // Step 2: Take latest 10
    //const latest20 = sorted.slice(0, 20);


    const formatSummary = partySummary.filter(ps => ps.Party === party1 || ps.Party === party2 || ps.Party === party3).sort((a, b) => b["Cash In"] - a["Cash In"]).map(({ Party, "Cash In": CashIn }) => ({
      Party,
      "Cash In": CashIn.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
      })
    }));
    // Display results
    resultDiv.innerHTML = `
      ${createTable(formatSummary)}
    `;
    trans.innerHTML = `${createCards(sorted)}`
  }



  window.openReports = function (party) {
    //console.log('Clicked:', party);
    partyreportspopupLabel.innerHTML = `<h5>${party}</h5>`

    searchInput.value='';

    const partyData = allTheData.data.filter((r) => r.Party === party);
    const sorted = [...partyData].sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return dateB - dateA; // descending order
    });
    trans.innerHTML = `${createCards(sorted, party)}`;
  };

  function createTable(rows) {
    if (rows.length === 0) return "<p>No data available.</p>";
    //data-bs-toggle="modal" data-bs-target="#partyreportspopup"
    let html = '';
    rows.forEach((r) => {
      html += `<div onclick="openReports('${r['Party']}')"    style="background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%);
" class="card shadow-sm p-2 d-flex justify-content-between flex-row align-items-center">
      <span>${r['Party']}</span>
      <strong>${r['Cash In']}</strong>
    </div>`;
    });
    // const headers = Object.keys(rows[0]);
    // let html = "<table class='table table-striped' border='1' cellspacing='0' cellpadding='6'><tr>";
    // headers.forEach((h) => (html += `<th>${h}</th>`));
    // html += "</tr>";

    // rows.forEach((r) => {
    //   html += "<tr>";
    //   headers.forEach((h) => (html += `<td>${r[h] ?? ""}</td>`));
    //   html += "</tr>";
    // });

    // html += "</table>";
    return html;
  }

  function createCards(rows, party = 'All') {
    const totalSum = rows.reduce((sum, item) => sum + item['Cash In'], 0);
    let html = `<div class="mt-2 mb-2 text-center" style="font-size: 0.65rem">View <b>${party}</b> Transactions: ${totalSum.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR"
    })} (${rows.length})</div>`;
    rows.forEach((r) => {
      if (r["Cash In"]) {
        html += `<div class="payment-card in mb-2">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="mb-1">${r.Party}</h6>
            </div>
            <div class="amount_green">${r["Cash In"].toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
        })}</div>
          </div>

          <div class="mt-2 mb-2">
            <div class="due-label">
              <span class="fw-semibold text-dark">${r.Remarks}</span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <span class="tag">${r.Category}</span>
            <span class="status">${r.Mode}</span>
            <span class="party-label">${r.Date}</span>
          </div>
          <div class='border-top pt-1 mt-1' style='font-size: 0.7rem'>Entry By: ${r["Enter By"]} at ${r["Timestamp"] == "" ? r['Time'] : formatTo12Hour(r["Timestamp"].slice(-8))}</div>
        </div>`

      } else {
        html += `<div class="payment-card out mb-2">
        <div class="d-flex justify-content-between align-items-start">
          <div>
             <h6 class="mb-1">${r.Party}</h6>
          </div>
          <div class="amount_red">${r["Cash Out"].toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
        })}</div>
        </div>

       <div class="mt-2 mb-2">
            <div class="due-label">
              <span class="fw-semibold text-dark">${r.Remarks}</span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <span class="tag">${r.Category}</span>
            <span class="status">${r.Mode}</span>
            <span class="party-label">${r.Date}</span>
          </div>
          <div class='border-top pt-1 mt-1' style='font-size: 0.7rem'>Entry By: ${r["Enter By"]} at ${r["Timestamp"] == "" ? r['Time'] : formatTo12Hour(r["Timestamp"].slice(-8))}</div>

      </div>`
      }
    })
    return html;
  }




});
