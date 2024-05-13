# Appwrite to DBML
Appwrite to DBML is used to create a DBML file from the chosen database of an Appwrite endpoint. After that, you can use it to showcase your database model.

## Installation
Install the package via NPM using this command

`npm install -g appwrite-to-dbml`

## Usage
You can use the package by executing `appwrite-to-dbml` in the project directory.
This searches for the .env file and extracts the following information:
- PUBLIC_APPWRITE_ENDPOINT
- PUBLIC_APPWRITE_PROJECT
- APPWRITE_KEY

The CLI tool will ask you to select a database, which it found in the endpoint.
The following file will be created with the correct information: `[database-name].dbml`
