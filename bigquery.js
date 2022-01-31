/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
// Import the Google Cloud client library
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BigQuery } = require('@google-cloud/bigquery');
const jsonSchemaBigquery = require('jsonschema-bigquery')

const bigQueryMetadata = require('./src/common/schemas/bigquery.metadata.json')
const documentMetadata = require('./src/common/schemas/document.metadata.json')
const userSchema = require('./src/common/schemas/user.schema.json')
console.log(JSON.stringify({
    ...bigQueryMetadata,
    content: {
        metadata: documentMetadata,
        data: userSchema
    }
}))
const bigquerySchema = {
    ...(jsonSchemaBigquery.run(bigQueryMetadata, {}).schema),
    content: {
        metadata: jsonSchemaBigquery.run(documentMetadata, {}),
        data: jsonSchemaBigquery.run(userSchema, {})
    }
}
console.log(JSON.stringify(bigquerySchema))

const bigquery = new BigQuery();

// async function createTablePartitioned() {
//     // Creates a new partitioned table named "my_table" in "my_dataset".

//     /**
//      * TODO(developer): Uncomment the following lines before running the sample.
//      */
//     // const datasetId = "my_dataset";
//     // const tableId = "my_table";
//     const schema = 'Name:string, Post_Abbr:string, Date:date';

//     // For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
//     const options = {
//         schema: schema,
//         location: 'US',
//         timePartitioning: {
//             type: 'DAY',
//             expirationMS: '7776000000',
//             field: 'publishTime',
//         },
//     };

//     // Create a new table in the dataset
//     const [table] = await bigquery
//         .dataset(datasetId)
//         .createTable(tableId, options);
//     console.log(`Table ${table.id} created with partitioning: `);
//     console.log(table.metadata.timePartitioning);
// }