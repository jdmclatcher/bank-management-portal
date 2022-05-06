let confirmButton = document.getElementById("stopEmployee")
let employeeID = document.getElementById("employeeID")
let message = document.getElementById("message")

confirmButton.addEventListener("click", validate)

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    if (employeeID.value !== "") {
        stopEmployee();
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields."
    }
}
function stopEmployee(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `id=${employeeID.value}`
    url = `/stop_employee`
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
        employeeID.value = "";
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
