# Guardians Jira Ticket Creation

## Use case
The Guardians Team have alot of common components, labels and descriptions. We needed away to automate this process a little bit and allow for all members of the team to have the confidence to create tickets without missing this vital reporting information. 

## Functionality
This script adds a "Guardians Create" button to the header navigation of JIRA. This gives you a new create overlay that uses the JIRA API and creates a ticket with the added bits you need. Core attributes it adds:
* Components (adds multiple components dependent on the service you select)
* Labels 
* Issue Type
* Priority
* Summary name
* Links to epics and sub-task to stories
* Adds in a template description (no more copy and paste)
* Creates a list of links once created (that opens up in a new tab) to the knew tickets. This means you can add multiple sub-tasks to a story for example and have a trace of the ticket numbers you have created.