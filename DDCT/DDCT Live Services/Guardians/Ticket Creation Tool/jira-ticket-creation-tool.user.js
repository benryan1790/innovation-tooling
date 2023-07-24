// ==UserScript==
// @name         Guardians Create
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

                            uniqueKeyList.push(key);

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
    <div id="epicnameContainer">
  <label for="epicname">Epic Name</label>
<span style="color: grey;
  font-style: italic;">If your creating an Epic this field is needed if not leave it blank.</span><br>
  <input type="text" id="epicname" class="form-input"><br>
</div>

   <label for="issuetype">Issue Type:</label>
<select id="issuetype" class="form-input">
  <option value="7">Story</option>
  <option value="5">Sub-task</option>
  <option value="12">Spike</option>
  <option value="1">Bug</option>
  <option value="6">Epic</option>
  <option value="11200">Live Service Request</option>
</select><br>

<div id="subtaskInputContainer">
  <label for="subtaskInput">Issue you want to link to</label>
<span style="color: grey;
  font-style: italic;">Enter the story you want the sub-task added to or the Epic number you want the story added to, leave blank for anything else.</span><br>
  <input type="text" id="subtaskInput" class="form-input" placeholder="DL-1111 (example)"><br>
</div>

    <label for="priority">Priority:</label>
    <select id="priority" class="form-input">
      <option value="10001">Minor</option>
      <option value="10101">Major</option>
      <option value="10100">Critical</option>
    </select><br>

       <label>Labels:</label>
    <div>
      <label for="maintenance">
        <input type="checkbox" id="maintenance" name="labels" value="EPSLS_Maintenance"> Maintenance
      </label>
      <br>
      <label for="improvement">
        <input type="checkbox" id="improvement" name="labels" value="EPSLS_Improvement"> Improvement
      </label>
      <br>
      <label for="incident">
        <input type="checkbox" id="incident" name="labels" value="EPSLS_Incident"> Incident
      </label>
    </div>

    <label for="components">Service:</label>
    <select id="components" class="form-input">
      <option value="BTA">BTA</option>
      <option value="cve">Claim Vat Enrolment</option>
      <option value="CJRS">CJRS</option>
      <option value="VATVANDC">VAT View & Change</option>
      <option value="SoftwareChoices">Software Choices</option>
      <option value="VatAPI">Vat API</option>
      <option value="VRS">Vat Registration</option>
      <option value="SCRS">SCRS</option>

    </select><br>
    <button type="submit" class="form-submit-button">Create</button>
    <button type="button" class="form-close-button">Close</button>
  `;


        // Retrieve user inputs and send the JSON request to the endpoint
        function submitForm(event) {
            event.preventDefault();

            // Retrieve user inputs
            var summary = document.getElementById('summary').value;
            var issuetype = document.getElementById('issuetype').value;
            var priority = document.getElementById('priority').value;
            var component = document.getElementById('components').value;
            var keyToAddTo = document.getElementById('subtaskInput').value || undefined;
            var epicName = document.getElementById('epicname').value || undefined;

            let labelsChecklist = document.querySelectorAll('input[name="labels"]:checked');
            let selectedLabels = Array.from(labelsChecklist).map(label => label.value);

            let guardians = '23806';
            let guardiansVol1 = '57700';
            let guardiansVol2 = '57701';
            let bta = '23807';
            let cve = '52900';
            let CJRS = '45600';
            let VATVANDC = '57003';
            let SoftwareChoices = '53001';
            let VatAPI = '43700';
            let VRS = '53600';
            let SCRS = '48400';


            // Define the label arrays for different selections
            var BTA = [{ id: bta }, { id: guardians }, { id: guardiansVol1 }];
            var CVE = [{ id: cve }, { id: guardians }, { id: guardiansVol1 }];
            var cjrs = [{ id: CJRS }, { id: guardians }, { id: guardiansVol2 }];
            var vatvandc = [{ id: VATVANDC }, { id: guardians }, { id: guardiansVol2 }];
            var schoices = [{ id: SoftwareChoices }, { id: guardians }, { id: guardiansVol1 }];
            var vatAPI = [{ id: VatAPI }, { id: guardians }, { id: guardiansVol2 }];
            var vrs = [{ id: VRS }, { id: guardians }, { id: guardiansVol1 }];
            var scrs = [{ id: SCRS }, { id: guardians }, { id: guardiansVol1 }];


            var improvementLabels = [{ id: "test3" }, { id: "test4" }];
            var components = [];

            if (component === "BTA") {
                components = BTA;
            } else if (component === "cve") {
                components = CVE;
            } else if (component === "CJRS") {
                components = cjrs;
            } else if (component === "VATVANDC") {
                components = vatvandc;
            } else if (component === "SoftwareChoices") {
                components = schoices;
            } else if (component === "VatAPI") {
                components = vatAPI;
            } else if (component === "VRS") {
                components = vrs;
            } else if (component === "SCRS") {
                components = scrs;
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
                    "priority": {
                        "id": priority
                    },
                    "labels": selectedLabels,
                    "description": " \r\n{panel:title=User Story / Information}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Design Acceptance Criteria}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Developer Acceptance Criteria}\r\nSome text with a title\r\n{panel}\r\n ",
                    "components": components
                }
            };

            var requestEpic = {
                "fields": {
                    "project": {
                        "id": "14812"
                    },
                    "customfield_10009": epicName,
                    "summary": summary,
                    "issuetype": {
                        "id": issuetype
                    },
                    "priority": {
                        "id": priority
                    },
                    "labels": selectedLabels,
                    "description": "{panel:title=User Story / Information}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Requirement }\r\nSome text with a title\r\n{panel}\r\n{panel:title=Additional Information}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Stakeholders}\r\nSome text with a title\r\n{panel}",
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
                    "priority": {
                        "id": priority
                    },
                    "labels": selectedLabels,
                    "description": " \r\n{panel:title=User Story / Information}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Design Acceptance Criteria}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Developer Acceptance Criteria}\r\nSome text with a title\r\n{panel}\r\n ",
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
                    "priority": {
                        "id": priority
                    },
                    "labels":selectedLabels,
                    "description": " \r\n{panel:title=User Story / Information}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Design Acceptance Criteria}\r\nSome text with a title\r\n{panel}\r\n{panel:title=Developer Acceptance Criteria}\r\nSome text with a title\r\n{panel}\r\n ",
                    "components": components
                }
            };


            var requestLiveIssueEpicLink = {
                "fields": {
                    "project": {
                        "id": "14812"
                    },
                    "customfield_10008": keyToAddTo,
                    "summary": summary,
                    "issuetype": {
                        "id": issuetype
                    },
                    "priority": {
                        "id": priority
                    },
                    "labels": selectedLabels,
                    "description":  "{panel:title=Information}\r\nDeskpro:\r\n\r\nSession ID:\r\n\r\nReferrer ID:\r\n\r\nDate and time:\r\n\r\nDSM:\r\n{panel}\r\n{panel:title=Current/Potential Impact:}\r\n*What did you expect to happen?*\r\n\r\n\r\n*What did happen?*\r\n\r\n\r\n*Individual cases references to support investigation:*\r\n{panel}",
                    "components": components
                }
            };

            var requestLiveIssue = {
                "fields": {
                    "project": {
                        "id": "14812"
                    },
                    "summary": summary,
                    "issuetype": {
                        "id": issuetype
                    },
                    "priority": {
                        "id": priority
                    },
                    "labels": selectedLabels,
                    "description":  "{panel:title=Information}\r\nDeskpro:\r\n\r\nSession ID:\r\n\r\nReferrer ID:\r\n\r\nDate and time:\r\n\r\nDSM:\r\n{panel}\r\n{panel:title=Current/Potential Impact:}\r\n*What did you expect to happen?*\r\n\r\n\r\n*What did happen?*\r\n\r\n\r\n*Individual cases references to support investigation:*\r\n{panel}",
                    "components": components
                }
            };
            // Send the JSON request to the endpoint with authentication token
            if (issuetype === "6") {
                sendRequest(requestEpic, summary);
            } else if (issuetype === "11200" && typeof keyToAddTo !== "undefined") {
                sendRequest(requestLiveIssueEpicLink, summary);
            } else if (issuetype === "11200" && typeof keyToAddTo === "undefined") {
                sendRequest(requestLiveIssue, summary);
            } else if (issuetype === "5" && typeof keyToAddTo !== "undefined") {
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

        button.textContent = 'Guardians Create';
        button.addEventListener('click', showForm);
        liElement.appendChild(button);
        ulElement.appendChild(liElement);
    }

    window.addEventListener('load', function() {
        addButton();
    });
})();

