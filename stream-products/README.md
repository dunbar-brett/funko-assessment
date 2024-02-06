# Stream Products

This tool is meant to be used for processing through large amounts of XML product data. Given an input file, the script filters and transforms the XML data to an output file.

## Tasks
Historically, the business only wanted product with all of the following properties:

 - product-id
 - upc
 - funkoItemNumber 
 - funkoComponent
 - purchasable

If any of the above properties were missing, then that product was excluded from the output.

___

Let's say you are given a new feature request. The business wants to remove the 'purchasable' requirement and replace it with the property 'isMobile'. Update this script so that you can fulfill their request.

1. Review the codebase. You can assume the script will behave as described

2. Install the node modules by running `npm install`

3. Execute the test script in `package.json`

4. Verify the output was created successfully

5. Update the codebase by removing the 'purchasable' requirement and replacing it with 'isMobile' (isMobile must be true)

6. Currently, the 'Stream finished' print statement is printing before the stream has ended. Update the code so that we can 'await' the stream and synchronously execute the print statement.

## Bonus

Let's say the business is frequently changing the output requirements. Refactor the code so that the business logic live in an easy-to-update constants/utils file.
