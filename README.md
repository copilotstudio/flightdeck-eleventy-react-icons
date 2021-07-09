# Eleventy React Icons

A configurable Eleventy shortcode that outputs React Icons icon svgs in a custom svg sprite.

## Usage

### Installation

`npm install --save-dev @cavu/eleventy-react-icons`

### Adding to Eleventy

In .eleventy.js:

```js
// require
const { ReactIcon } = require("@cavu/eleventy-react-icons");
module.exports = function (config) {
  // Shortcode
  config.addNunjucksShortcode("ReactIcon", ReactIcon);
  //
};
```

#### In package.json, you can configure the folder where the SVG Sprite will be output:

```json
{...
  "config": {
    "reactIconOutputFolder": "./foo/bar",
  },
...}
```

### In any nunjucks template file:

#### Use the shortcode:

```
{% ReactIcon name = "FaBeer" %}
```

#### Props:

- **name:** the icon name

\*\* other properties will get applied to the wrapper tag as attributes

```
{% ReactIcon name="FaBeer", class="text-2xl lg:text-3xl", style="margin-left:20px" %}
```

### CSS

Default styles for an icon can be imported from `@cavu/eleventy-react-icons/icon.css`;
They are pretty bare bones, so feel free to use them or not:

```css
.icon svg {
  display: block;
  width: 1em;
  height: 1em;
}
```
