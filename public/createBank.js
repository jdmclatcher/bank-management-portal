let createButton = document.getElementById("createBank")
let bankID = document.getElementById("bankID")
let name = document.getElementById("name")
let street = document.getElementById("street")
let city = document.getElementById("city")
let state = document.getElementById("state")
let zip = document.getElementById("zip")
let resAssets = document.getElementById("resAssets")
let corpID = document.getElementById("corpID")
let managerID = document.getElementById("managerID")
let employeeID = document.getElementById("employeeID")
let message = document.getElementById("message")

function validate(event) {
  // prevent submitting the form until validation occurs
  message.style.display = "hidden"
  event.preventDefault();
  // make sure required fields have values
  if (bankID.value !== "" && corpID.value !== "" && managerID.value !== "" && employeeID.value !== "") {
    addBank();
  } else {
    message.style.display = "block"
    message.className = "alert alert-danger mt-4"
    message.innerText = "Please fill out all required fields.";
  }
}

createButton.addEventListener("click", validate)

function addBank(event) {
  // setup POST request to server
  let xhr = new XMLHttpRequest
  xhr.addEventListener("load", responseHandler)
  query = `bankID=${bankID.value}&name=${name.value}&street=${street.value}&city=${city.value}&state=${state.value}&zip=${zip.value}&resAssets=${resAssets.value}&corpID=${corpID.value}&managerID=${managerID.value}&employeeID=${employeeID.value}`
  url = `/add_bank`
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
    bankID.value = "";
    name.value = "";
    street.value = "";
    city.value = "";
    state.value = "";
    zip.value = "";
    resAssets.value = "";
    corpID.value = "";
    managerID.value = "";
    employeeID.value = "";
  } else {
    message.style.display = "block"
    message.className = "alert alert-danger mt-4"
    message.innerText = this.response.message;
  }
}
