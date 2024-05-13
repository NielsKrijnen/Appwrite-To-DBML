#!/usr/bin/env node
const { Client, Databases, Query } = require('node-appwrite');

require('dotenv').config({ path: `./.env` });
const fs = require('fs');
const prompts = require("@clack/prompts");

console.log("Getting .env variables...");
const endpoint = process.env.PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.PUBLIC_APPWRITE_PROJECT;
const key = process.env.APPWRITE_KEY;

console.log("Creating client...");
const client = new Client();
client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(key)
;

console.log("Setting up services...");
const database = new Databases(client);

console.log("Getting databases...");
database.list().then(response => {
  let databaseOptions = [];
  for (const database of response.databases) {
    databaseOptions.push({
      label: database.name,
      value: {
        name: database.name.toLowerCase(),
        id: database.$id
      }
    });
  }

  prompts.select({
    message: "Select the wanted database",
    options: databaseOptions
  }).then(db => {
    const path = `./${db.name}.dbml`;

    database.listCollections(db.id, [Query.limit(99999999)]).then(response => {
      let tables = [];
      let relations = [];

      const getCollectionName = id => {
        return response.collections.find(value => value.$id === id).name.replaceAll(' ', '');
      }

      for (const collection of response.collections) {
        let tableString = `Table ${collection.name.replaceAll(' ', '')} {\n`;

        tableString += "\tid string [pk]\n";
        for (const attribute of collection.attributes) {
          if (attribute.type !== 'relationship') {
            tableString += `\t${attribute.key} ${attribute.type}${attribute.array ? '[]' : ''}${attribute.required ? ' [not null]' : ''}\n`;
          } else {
            tableString += `\t${attribute.key} ${getCollectionName(attribute.relatedCollection)}\n`;
            relations.push(`Ref: ${collection.name.replaceAll(' ', '')}.${attribute.key} > ${getCollectionName(attribute.relatedCollection)}.id`);
          }
        }

        tableString += '}';

        tables.push(tableString);
      }

      let data = "";
      for (const table of tables) {
        data += table + '\n\n';
      }
      for (const relation of relations) {
        data += relation + '\n';
      }
      fs.writeFileSync(path, data);
    })    
  })
})

function getCollectionName(collections, id) {
  
}