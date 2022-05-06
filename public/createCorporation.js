let createButton = document.getElementById("createCorporation")
let id = document.getElementById("id")
let longName = document.getElementById("longName")
let shortName = document.getElementById("shortName")
let resAssets = document.getElementById("resAssets")
let message = document.getElementById("message")

function validate(event) {
  // prevent submitting the form until validation occurs
  message.style.display = "hidden"
  event.preventDefault();
  // make sure required fields have values
  if (id.value !== "" && shortName.value !== "" && longName.value !== "") {
    addCorporation();
  } else {
    message.style.display = "block"
    message.className = "alert alert-danger mt-4"
    message.innerText = "Please fill out all required fields.";
  }
}

createButton.addEventListener("click", validate)

function addCorporation(event) {
  // setup POST request to server
  let xhr = new XMLHttpRequest
  xhr.addEventListener("load", responseHandler)
  query = `id=${id.value}&shortName=${shortName.value}&longName=${longName.value}&resAssets=${resAssets.value}`
  url = `/add_corporation`
  xhr.responseType = "json";
  xhr.open("POST", url)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  xhr.send(query)
  // then clear the values
}

// handle server response
function responseHandler() {
  if (this.response.success === true) {
    message.style.display = "block"
    message.className = "alert alert-success mt-4"
    message.innerText = this.response.message;
    id.value = "";
    shortName.value = "";
    longName.value = "";
    resAssets.value = "";
  } else {
    message.style.display = "block"
    message.className = "alert alert-danger mt-4"
    message.innerText = this.response.message;
  }
}
