import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://api.bingwalls.com/v1') // Replace with your endpoint
    .setProject('64d367e9b745667a63eb'); // Replace with your project ID

const databases = new Databases(client);

export { databases };