const tbody = document.getElementById("accountsTable");
const tableColsCount = 4;

// Helper function for sorting on a given column, with a given comparator
function tableSort(colNum, cmp) {
    let rows = [...tbody.rows];
    rows.sort((a, b) => cmp(a.cells[colNum].textContent, b.cells[colNum].textContent))
        .map(row => tbody.appendChild(row));
}

function tableFilter() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("tableInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("accountsTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

let asc = true;

function sort(col) {
    if (asc) {
        if (col === 2 || col === 3) {
            // number column
            tableSort(col, (a, b) => a - b);
        } else {
            tableSort(col, (a, b) => b.localeCompare(a));
        }
        asc = false;
        // call function to set all invisible
        hideAllArrows();
        // find th by column and set it's UP svg to visible
        document.getElementById("u" + col).style.display = ""
    } else {
        if (col === 2 || col === 3) {
            // number column
            tableSort(col, (a, b) => b - a);
        } else {
            tableSort(col, (a, b) => a.localeCompare(b));
        }
        asc = true;
        // call function to set all invisible
        hideAllArrows();
        // find th by column and set it's DOWN svg to visible
        document.getElementById("d" + col).style.display = ""
    }
}

function hideAllArrows() {
    for (let i = 0; i < tableColsCount; i++) {
        document.getElementById("d" + i).style.display = "none";
        document.getElementById("u" + i).style.display = "none";
    }
}