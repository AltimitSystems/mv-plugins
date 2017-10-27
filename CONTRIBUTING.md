## Copyright

Copyright is held under the name "Altimit Community Contributors". Altimit Community Contributors includes Altimit Systems LTD and all accepted Pull requests to the **AltimitSystems/mv-plugins/master** branch.

## Pull requests

To make the review process simple and to help with understanding the nature of your changes please adhere to the following guidelines:

- Work on the latest possible state of the **AltimitSystems/mv-plugins/master** branch.
- Create a branch dedicated to your change and named appropriately.
- Keep bug fixes and features as separate branches.
- Explain changes in detail and be prepared to answer questions and further concerns.

## Coding style

Coding style used is based on the RPG Maker MV default style with some key modifications.

- 2 space indentations.
- Spacing between all parenthesis.
- Function prototype overrides replaces member-access operators underscores, omitting the prototype access.
- Anonymous functions are used to scope/encapsulate file contents, objects, overrides and extensions.
- PluginManager parameters should be defined within the file-level anonymous function as constants (capitalised, underscored variables).
- Variables that cross scope without an object use lower-case, underscored naming convention.
