# Stream Products

This tool is meant to be used for processing through large amounts of XML product data. Given an input file, the script filters and transforms the XML data to an output file.

## Note to reviewer
The tool runs, however with the `test-products-big.xml` file there seems to be an issue with the File Stream library with large files. I keep getting this error below, I've verified that it occurs without my changes.

```
Error [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed
    at node:internal/fs/streams:426:23
    at FSReqCallback.wrapper [as oncomplete] (node:fs:829:5) {
  code: 'ERR_STREAM_DESTROYED'
}
node:events:492
      throw er; // Unhandled 'error' event
      ^

Error [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed
    at node:internal/fs/streams:426:23
    at FSReqCallback.wrapper [as oncomplete] (node:fs:829:5)
Emitted 'error' event on WriteStream instance at:
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: 'ERR_STREAM_DESTROYED'
}
```

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
