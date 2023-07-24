// ==UserScript==
// @name         BrotherHood Create
// @description  Build and send JSON requests using a pop-up form
// @include      https://jira.tools.tax.service.gov.uk/*
// ==/UserScript==

(function() {


    function sendRequest(request, summary) {
        var endpoint = 'https://jira.tools.tax.service.gov.uk/rest/api/2/issue';
        var baseUrl = 'https://jira.tools.tax.service.gov.uk/browse/';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
            .then(function (response) {
                if (response.status === 201) {
                    // Extract the key from the response
                    return response.json().then(function (data) {
                        var key = data.key; // Assuming the response contains a key property
                        if (key) {
                            // Add the key to the list
                            var uniqueKeys = new Set(keyList);
                            var uniqueKeyList = Array.from(uniqueKeys);

                            uniqueKeyList.push(key + ":" + summary);

                            // Append the link to the form
                            var form = document.getElementById('guardians-form');

                            // Update the list of keys on the form
                            var keyListElement = document.createElement('ul');
                            uniqueKeyList.forEach(function (keyItem) {
                                var listItem = document.createElement('li');
                                var linkUrl = baseUrl + keyItem;
                                var linkElement = document.createElement('a');
                                linkElement.href = linkUrl;
                                linkElement.textContent = keyItem;
                                linkElement.target = "_blank";

                                listItem.appendChild(linkElement);
                                keyListElement.appendChild(listItem);
                            });

                            form.appendChild(keyListElement);
                        } else {
                            console.error('Key not found in the response.');
                        }
                    });
                } else {
                    // Handle other responses as needed
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }

// Initialize the key list
    var keyList = [];

// Show the pop-up form when the user clicks a button or triggers an event
    function showForm() {
        // Create the pop-up form
        var form = document.createElement('form');
        form.id = 'guardians-form';
        form.innerHTML = `
    <label for="summary">Summary:</label>
    <input type="text" id="summary" class="form-input" required><br>
    <label for="description">Description:</label>
    <textarea id="description" class="form-textarea" placeholder="Leave this blank for template..."></textarea><br>
   <label for="issuetype">Issue Type:</label>
<select id="issuetype" class="form-input">
  <option value="7">Story</option>
  <option value="5">Sub-task</option>
  <option value="12">Spike</option>
  <option value="1">Bug</option>
</select><br>

<div id="subtaskInputContainer">
  <label for="subtaskInput">Issue you want to link to</label>
<span style="color: grey;
  font-style: italic;">Enter the story you want the sub-task added to or the Epic number you want the story added to, leave blank for anything else.</span><br>
  <input type="text" id="subtaskInput" class="form-input" placeholder="DL-1111 (example)"><br>
</div>

    <label for="labels">Labels:</label>
    <select id="labels" class="form-input">
      <option value="EPSLS_Maintenance">Maintenance</option>
      <option value="EPSLS_Improvement">Improvement</option>
      <option value="EPSLS_Incident">Incident</option>
      <option value="EPSLS_Problem">Problem</option>
      <option value="EPSLS_Impacting">Impacting</option>
      <option value="EPSLS_Accessibility">Accessibility</option>


    </select><br>
    <label for="components">Service:</label>
    <select id="components" class="form-input">
      <option value="Ated">ATED</option>
      <option value="Awrs">AWRS</option>
      <option value="SndS">S & S</option>
      <option value="Ssp">SSP</option>
      <option value="Nicalc">Ni Calc</option>
      <option value="Cest">CEST</option>
      <option value="Externalg">External Guidance</option>
      <option value="Businesscus">Business Customer</option>
      <option value="Sdltc">SDLTC</option>
    </select><br>
    <button type="submit" class="form-submit-button">Create</button>
    <button type="button" class="form-close-button">Close</button>
  `;


        // Retrieve user inputs and send the JSON request to the endpoint
        function submitForm(event) {
            event.preventDefault();

            // Retrieve user inputs
            var summary = document.getElementById('summary').value;
            var description = document.getElementById('description').value;
            var issuetype = document.getElementById('issuetype').value;
            var labelsChoice = document.getElementById('labels').value;
            var component = document.getElementById('components').value;
            var keyToAddTo = document.getElementById('subtaskInput').value || undefined;

            let brotherhood = '19171';
            let ated = '19163';
            let awrs = '19047';
            let sands = '29106';
            let ssp = '26124';
            let nicalc = '33700';
            let cest = '17618';
            let externalg = '30406';
            let businesscus = '19172';
            let sdltc = '17612';

            // Define the label arrays for different selections
            var ATED = [{ id: ated }, { id: brotherhood }];
            var AWRS = [{ id: awrs }, { id: brotherhood }];
            var SNS = [{ id: sands }, { id: brotherhood }];
            var SSP = [{ id: ssp }, { id: brotherhood }];
            var NICALC = [{ id: nicalc }, { id: brotherhood }];
            var CEST = [{ id: cest }, { id: brotherhood }];
            var EXTG = [{ id: externalg }, { id: brotherhood }];
            var BUSCUS = [{ id: businesscus }, { id: brotherhood }];
            var SDLTC = [{ id: sdltc }, { id: brotherhood }];

            var components = [];

            if (component === "Ated") {
                components = ATED;
            } else if (component === "Awrs") {
                components = AWRS;
            } else if (component === "SndS") {
                components = SNS;
            } else if (component === "Ssp") {
                components = SSP;
            } else if (component === "Nicalc") {
                components = NICALC;
            } else if (component === "Cest") {
                components = CEST;
            } else if (component === "Externalg") {
                components = EXTG;
            } else if (component === "Businesscus") {
                components = BUSCUS;
            } else if (component === "Sdltc") {
                components = SDLTC;
            }

            // Build the JSON request using user inputs
            var requestNorm = {
                "fields": {
                    "project": {
                        "id": "14812"
                    },
                    "summary": summary,
                    "issuetype": {
                        "id": issuetype
                    },
                    "labels": [
                        labelsChoice
                    ],
                    "description": "h1. Information\r\nh3. Additional Information\r\nh2. Acceptance Criteria\r\n\r\n ",
                    "components": components
                }
            };

            var requestSubTask = {
                "fields": {
                    "parent": {
                        "id": keyToAddTo
                    },
                    "project": {
                        "id": "14812"
                    },
                    "summary": summary,
                    "issuetype": {
                        "id": issuetype
                    },
                    "labels": [
                        labelsChoice
                    ],
                    "description": "h1. Information\r\nh3. Additional Information\r\nh2. Acceptance Criteria\r\n\r\n ",
                    "components": components
                }
            };

            var requestEpicLink = {
                "fields": {
                    "project": {
                        "id": "14812"
                    },
                    "customfield_10008": keyToAddTo,
                    "summary": summary,
                    "issuetype": {
                        "id": issuetype
                    },
                    "labels": [
                        labelsChoice
                    ],
                    "description": "h1. Information\r\nh3. Additional Information\r\nh2. Acceptance Criteria\r\n\r\n ",
                    "components": components
                }
            };
            // Send the JSON request to the endpoint with authentication token
            if (issuetype === "5" && typeof keyToAddTo !== "undefined") {
                sendRequest(requestSubTask, summary);
            } else if (typeof keyToAddTo !== "undefined") {
                sendRequest(requestEpicLink, summary);
            } else {
                sendRequest(requestNorm, summary);
            }
        }

        // Function to close the overlay
        function closeOverlay() {
            document.body.removeChild(overlay);
        }

        // Attach the event listeners
        form.addEventListener('submit', submitForm);
        form.querySelector('.form-close-button').addEventListener('click', closeOverlay);

        // Create the overlay
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999'; // Set a high z-index to ensure it appears on top

        // Style the form
        form.style.background = '#fff';
        form.style.padding = '20px';
        form.style.borderRadius = '8px';
        form.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        form.style.maxWidth = '400px';

        // Style form inputs
        var formInputs = form.querySelectorAll('.form-input');
        for (var i = 0; i < formInputs.length; i++) {
            formInputs[i].style.width = '100%';
            formInputs[i].style.padding = '8px';
            formInputs[i].style.border = '1px solid #ddd';
            formInputs[i].style.borderRadius = '4px';
            formInputs[i].style.marginBottom = '10px';
            formInputs[i].style.boxSizing = 'border-box';
            formInputs[i].style.fontSize = '14px';
        }

        // Style form textarea
        var formTextarea = form.querySelector('.form-textarea');
        formTextarea.style.width = '100%';
        formTextarea.style.padding = '8px';
        formTextarea.style.border = '1px solid #ddd';
        formTextarea.style.borderRadius = '4px';
        formTextarea.style.marginBottom = '10px';
        formTextarea.style.boxSizing = 'border-box';
        formTextarea.style.fontSize = '14px';

        // Style form submit button
        var formSubmitButton = form.querySelector('.form-submit-button');
        formSubmitButton.style.background = '#4285f4';
        formSubmitButton.style.color = '#fff';
        formSubmitButton.style.border = 'none';
        formSubmitButton.style.borderRadius = '4px';
        formSubmitButton.style.padding = '10px 20px';
        formSubmitButton.style.fontSize = '16px';
        formSubmitButton.style.cursor = 'pointer';

        var formCloseButton = form.querySelector('.form-close-button');
        formCloseButton.style.background = '#D3D3D3';
        formCloseButton.style.color = '#fff';
        formCloseButton.style.border = 'none';
        formCloseButton.style.borderRadius = '4px';
        formCloseButton.style.padding = '8px 18px';
        formCloseButton.style.fontSize = '14px';
        formCloseButton.style.cursor = 'pointer';
        formCloseButton.style.marginLeft = '120px';
        formCloseButton.style.marginTop = '30px'



        // Display the pop-up form to the user
        overlay.appendChild(form);
        document.body.appendChild(overlay);
    }


    function addButton() {
        var ulElement = document.querySelector('ul.aui-nav');
        if (!ulElement) {
            return;
        }

        var liElement = document.createElement('li');
        var button = document.createElement('button');
        button.style.background = '#4285f4';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.fontSize = '12px';
        button.style.margin = '5px';
        button.style.cursor = 'pointer';

        button.textContent = 'Brotherhood Create';
        button.addEventListener('click', showForm);
        liElement.appendChild(button);
        ulElement.appendChild(liElement);
    }

    window.addEventListener('load', function() {
        addButton();
    });
})();