import { Client } from "appwrite";

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64b3609a145244944157');
export default client;