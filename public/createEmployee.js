let createButton = document.getElementById("createEmployee")
let perID = document.getElementById("perID")
let password = document.getElementById("password")
let taxID = document.getElementById("taxID")
let firstName = document.getElementById("firstName")
let lastName = document.getElementById("lastName")
let birthDate = document.getElementById("birthdate")
let street = document.getElementById("street")
let city = document.getElementById("city")
let state = document.getElementById("state")
let zip = document.getElementById("zip")
let dateJoined = document.getElementById("dateJoined")
let salary = document.getElementById("salary")
let payments = document.getElementById("payments")
let earnings = document.getElementById("earnings")
let message = document.getElementById("message")

function validate(event) {
    // prevent submitting the form until validation occurs
    message.style.display = "hidden"
    event.preventDefault();
    // make sure required fields have values
    if (perID.value !== "" && password.value !== "" && taxID.value !== "") {
        createEmployee();
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = "Please fill out all required fields.";
    }
}

createButton.addEventListener("click", validate)

function createEmployee(event) {
    // setup POST request to server
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query = `perID=${perID.value}&taxID=${taxID.value}&firstName=${firstName.value}&lastName=${lastName.value}&birthdate=${birthDate.value}&street=${street.value}&city=${city.value}&state=${state.value}&zip=${zip.value}&dateJoined=${dateJoined.value}&salary=${salary.value}&payments=${payments.value}&earnings=${earnings.value}&password=${password.value}`
    url = `/create_employee`
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
        // then clear the values
        perID.value = "";
        password.value = "";
        taxID.value = "";
        firstName.value = "";
        lastName.value = "";
        birthDate.value = "";
        street.value = "";
        city.value = "";
        state.value = "";
        zip.value = "";
        dateJoined.value = "";
        salary.value = "";
        payments.value = "";
        earnings.value = "";
    } else {
        message.style.display = "block"
        message.className = "alert alert-danger mt-4"
        message.innerText = this.response.message;
    }
}
