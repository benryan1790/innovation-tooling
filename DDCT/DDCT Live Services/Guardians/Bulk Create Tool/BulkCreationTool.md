# Bulk Create Tickets

## Use case
The Guardians team ususally have to create alot of tickets that are the same other than the summary name of the ticket. This is because when we have to create the next wave of dependency updates or platform changes, normally the content of that ticket is the same and the cloning process takes some time.

## Functionality
This script adds a "Bulk Ticket Copy" button to the header navigation of JIRA. This accepts a ticket number and a list of summaries. This will then go off and create all the tickets dependent on the list provided and will copy all the vital information from the parent ticket provided. 
* Takes the ticket number provided calls the JIRA API and retrieves all the data from that parent ticket.
* Using that data from the parent ticket to create the new ticket.
* It takes the summaries provided (example... test service 1, test service 2, test service 3) and will call the JIRA API to create in this example 3 tickets all with same components, project id, issue types, epics links etc as the parent ticket but the summary with have the name of the summary provided. 