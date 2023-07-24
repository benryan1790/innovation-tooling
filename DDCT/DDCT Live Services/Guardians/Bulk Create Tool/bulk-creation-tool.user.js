// ==UserScript==
// @name         Bulk Copy
// @description  Build and send JSON requests using a pop-up form
// @include      https://jira.tools.tax.service.gov.uk/*
// ==/UserScript==

(function() {


    function sendRequest(summaries, inputKey) {
        var endpoint = 'https://jira.tools.tax.service.gov.uk/rest/api/2/issue';
        var baseUrl = 'https://jira.tools.tax.service.gov.uk/browse/';
        var getEndpoint = 'https://jira.tools.tax.service.gov.uk/rest/api/2/issue/' + inputKey;

        fetch(getEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch issue details. Status: ' + response.status);
                }
            })
            .then(function (data) {
                var request = {
                    "fields": {
                        "project": {
                            "id": data.fields.project.id
                        },
                        "issuetype": {
                            "id": data.fields.issuetype.id
                        },
                        "priority": {
                            "id":  data.fields.priority.id
                        },
                        "labels": data.fields.labels,
                        "components": []
                    }
                };

                if (data.fields.description) {
                    request.fields.description = data.fields.description;
                }

                if(data.fields.customfield_10008) {
                    request.fields.customfield_10008 = data.fields.customfield_10008;
                }

                for (var i = 0; i < data.fields.components.length; i++) {
                    var component = data.fields.components[i];
                    var componentIdName = {
                        id: component.id,
                    };
                    request.fields.components.push(componentIdName);
                }

                summaries.forEach((summary) => {
                    var postRequest = request;

                    postRequest.fields.summary = summary;

                    // Send the individual request for this summary
                    fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(postRequest)
                    })
                        .then(function (response) {
                            if (response.status === 201) {
                                return response.json().then(function (data) {
                                    var key = data.key;
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
                                            var linkUrl = baseUrl + key;
                                            console.log(keyItem);
                                            console.log(key);
                                            var linkElement = document.createElement('a');
                                            linkElement.href = linkUrl;
                                            linkElement.textContent = keyItem;
                                            linkElement.target = "_blank";

                                            listItem.appendChild(linkElement);
                                            keyListElement.appendChild(listItem);
                                        });

                                        form.appendChild(keyListElement);
                                    } else {
                                        throw new Error('Failed to fetch issue details. Status: ' + response.status);
                                    }
                                })
                                    .catch(function (error) {
                                        console.error('Error:', error);
                                    });
                            } else {
                                // Handle other responses as needed
                            }
                        })
                        .catch(function (error) {
                            console.error('Error:', error);
                        });
                });

                var form = document.getElementById('guardians-form');
                var button = form.querySelector('.form-submit-button')
                button.disabled = false;
                button.textContent = 'Create';
                button.style.cursor = 'pointer';
                var waitSymbol = document.createElement('span');

                button.removeChild(waitSymbol)
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }


// Initialize the key list
    var keyList = [];
    var isButtonDisabled = false;


// Show the pop-up form when the user clicks a button or triggers an event
    function showForm() {
        // Create the pop-up form
        var form = document.createElement('form');
        form.id = 'guardians-form';
        form.innerHTML = `
  <label for="key">Story Key for Bulk Cloning...</label>
<input type="text" id="key" class="form-input"><br>

    <label for="summary">Summary:</label>
<input type="text" id="summary" class="form-input"><br>
  <span style="color: grey;
  font-style: italic;">Split the multiple summaries with a comma to add multiple. Example.... Test Summary 1, Test Summary 2, Test Summary 3</span><br>
    <button type="submit" class="form-submit-button">Create</button>
    <button type="button" class="form-close-button">Close</button>
  `;


        // Retrieve user inputs and send the JSON request to the endpoint
        function submitForm(event) {
            event.preventDefault();

            // Retrieve user inputs
            var keyInput = document.getElementById('key').value;
            var summaryInput = document.getElementById('summary');
            var summary = summaryInput.value;
            var submitButton = form.querySelector('.form-submit-button');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating...';
            submitButton.style.cursor = 'wait';



            // Create the wait symbol (loading spinner)
            var waitSymbol = document.createElement('span');
            waitSymbol.classList.add('wait-symbol');
            submitButton.appendChild(waitSymbol);

            var issueSummaries = summary.split(",").map(item => item.trim()); // Split input list by comma and trim each item


            sendRequest(issueSummaries, keyInput);
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

        var waitSymbolStyle = document.createElement('style');
        waitSymbolStyle.textContent = `
    .wait-symbol {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ccc;
      border-top-color: #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
        document.head.appendChild(waitSymbolStyle);

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

        button.textContent = 'Bulk Ticket Copy';
        button.addEventListener('click', showForm);
        liElement.appendChild(button);
        ulElement.appendChild(liElement);
    }

    window.addEventListener('load', function() {
        addButton();
    });
})();
