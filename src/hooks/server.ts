import { Client } from 'pg';

const client = new Client({
	connectionString: 'postgres://postgres:postgres@localhost:5432/postgres'
});
console.log(client, 'client');

client.connect();
