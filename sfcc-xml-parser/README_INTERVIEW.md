# Tasks

Let's say you are given a new feature request. The business wants to move the contents from the "Fandom" folder to the "Home" folder. Update this script so that you can fulfill the request.

1. Read through the `README.md`. There are no bugs in the script. You can assume the script will behave as described.

2. Install the node modules by running `npm install`

3. Execute the test scripts in `package.json`  

4. Verify the output was created successfully

5. Extend the codebase so that we can filter the XML file by folder ID (Hint: The XML element for folder ID is `<classification-link>`)

6. Verify that your script can filter for contents where the folder ID is `funko-blog-fandom`

7. Extend the code base so that we can update the folder ID

8. Execute the script such that you obtain an output that is a list of contents that belonged to the `funko-blog-fandom` folder, but is now listed under `funko-blog-home`

## Bonus 

Let's say the business is constantly changing the name of the blog folders. Add a new argument to the script called `target`. If `target` is specified, then replace the value of the action with the value of `target`.

Example:

```cmd
  "getByFolder": "node index.js file=input/test.xml action=folder fid=funko-blog-fandom target=funko-blog-home -d"
```
