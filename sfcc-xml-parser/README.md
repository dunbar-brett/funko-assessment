# XML Tool for SFCC
This tool is meant to be used and extended to be used for parsing, processing, and filtering through large amounts of XML data. This is helpful to use to filter through content IDs or types, as well as the ability to automaticaly find and output deep-linked content via `<content-link />` elements.

This tool is built for NodeJS and leverages the `fast-xml-parser` Node package, and is custom written to filter through SFCC exported XML.

- [Find content by ID](#find-content-by-id)
- [Find content by type](#find-content-by-type)
  - [Using type=null](#using-typenull)
- [Extending functionality](#extending-functionality)


## Find content by ID

Command format

```cmd
node index.js file=path/to/file.xml {action=id|-a id} cid=content-id {deep=true|-d}
```

Example: Find a single content element with ID 'homepage-archived':

```cmd
node index.js file=path/to/file.xml action=id cid=homepage-archived
```

Example: Find the content element with ID 'blog-march-16-2020' and all the linked content elements as well:

```cmd
node index.js file=path/to/file.xml action=id cid=blog-march-16-2020 -d
```

## Find content by type

Command format

```cmd
node index.js file=path/to/file.xml {action=type|-a type} type=typeString {deep=true|-d}
```


Example: Get all blog articles

```cmd
node index.js file=path/to/file.xml action=type type=page.blogContentPage
```

### Using type=null
'null' is a keyword for type that triggers special functionality to find all elements without this property. 

Example: Get all content assets. 

```cmd
node index.js file=path/to/file.xml action=type type=null
```
## Extending functionality

This tool is easily extendable to be used for any XML related operations, so it's not just limited to content. I could even see this being used in conjunction with `sfcc-ci` to filter content XML directly from an instance.

1. Add a new action type in `index.js` to the `actions` declaration object. The key of your new action is what you add to the command line arguments, i.e. `folder: require('scripts/getContentsByFolder)` would be triggered via:
```cmd
node index.js file=input.xml action=folder
```
2. Write the logic for your action in a new JS file in `./scripts`. Look at the existing script examples for the expected format, and working examples of how to load, parse, and iterate over the xml elements. 
*Note: shared functionality should be added to `./scripts/utils.js` as a named function and exported at the bottom in `module.exports`.*