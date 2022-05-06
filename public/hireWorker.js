let confirmButton = document.getElementById("hireWorker")
let bankID = document.getElementById("bankID")
let employeeID = document.getElementById("employeeID")
let salary = document.getElementById("salary")
let message = document.getElementById("message")

confirmButton.addEventListener("click", validate)

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    if (bankID.value !== "" && employeeID.value !== "" && salary.value !== "") {
        hireWorker();
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields.";
    }
}
function hireWorker(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `bankID=${bankID.value}&employeeID=${employeeID.value}&salary=${salary.value}`
    url = `/hire_worker`
    xhr.responseType = "json";
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(query)
}

// handle server response
function responseHandler() {
    if (this.response.success === true) {
        message.style.display = "block"
        message.className = "alert alert-success mt-4"
        message.innerText = this.response.message;
        bankID.value = "";
        employeeID.value = "";
        salary.value = "";
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
