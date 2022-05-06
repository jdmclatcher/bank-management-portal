let confirmButton = document.getElementById("payEmployees")
let message = document.getElementById("message")

confirmButton.addEventListener("click", payEmployees)

function payEmployees(event) {
    // setup POST request to server
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = ``
    url = `/pay_employees`
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
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
