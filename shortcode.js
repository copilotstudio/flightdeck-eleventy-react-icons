require("intl-list-format");
require("intl-list-format/locale-data/en");

const fs = require("fs");
const path = require("path");
const decamelize = require("decamelize");
const allReactIcons = require("react-icons");
const React = require("react");
const reactDomServer = require("react-dom/server");

const TYPES = allReactIcons.IconsManifest.map((m) => m.id);

let sets = {};
let symbols = {};

function _getAttrs(obj) {
  let attrs = ``;
  const attrKeys = Object.keys(obj);

  if (attrKeys.length > 0) {
    attrs = `${attrKeys.map((key) => ` ${key}="${obj[key]}"`).join("")}`;
  }
  return attrs;
}

let outputFolder =
  require(`${process.cwd()}/package.json`).config.reactIconOutputFolder ||
  "./dist";

let iconPath =
  require(`${process.cwd()}/package.json`).config.reactIconPath || "/";

if (!fs.existsSync(path.resolve(process.cwd(), outputFolder))) {
  console.warn(
    `ReactIcon:: the output folder "${outputFolder}" does not exist. Creating it.`
  );
  fs.mkdirSync(path.resolve(process.cwd(), outputFolder));

  outputFolder = "./dist";
}

function writeSvg() {
  const outputPath = `${path.resolve(
    process.cwd(),
    outputFolder
  )}/react-icons.svg`;
  const symbolsHtml = `${Object.keys(symbols)
    .map((iconId) => symbols[iconId])
    .join(`\n`)}`;
  const output = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" style="display: none;">${symbolsHtml}</svg>`;
  fs.writeFileSync(outputPath, output, `utf-8`);
}

const LIST_FORMATTER = new Intl.ListFormat("en", {
  style: "short",
  type: "disjunction",
});

function makeSymbol(icon, id) {
  // whether to add aria-role="img"
  const addAriaRole = icon.indexOf("role=") === -1;
  // remove an existing id attribute from the svg
  icon = icon.replace(/\s*id=(["'])(.*?)\1/gim, "");

  // switch the svg to a symbol and add aria-attributes
  icon = icon.replace(
    "<svg",
    `<symbol id="${id}" ${addAriaRole ? `role="img"` : ``} aria-hidden="true"`
  );
  icon = icon.replace("</svg>", `</symbol>`);

  return icon;
}

function ReactIcon({ name, tag = "i", ...rest }) {
  // if the symbol already exists we don't need to create it.
  if (!symbols[name]) {
    const dc = decamelize(name, {
      preserveConsecutiveUppercase: true,
      separator: "-",
    });
    const dcArr = dc.split("-");
    let type = dcArr[0].toLowerCase().replace(/[0-9]/g, "");

    if (!TYPES.includes(type)) {
      console.warn(
        `ReactIcon:: The "type" parameter must be one of: ${LIST_FORMATTER.format(
          TYPES
        )}`
      );
      return `No icon found for ${name}`;
    }
    let iconSet = sets[type] || require(`react-icons/${type}`);
    let icon;
    try {
      icon = iconSet[name];
      if (!icon && type === "io") {
        type = "io5";
        iconSet = sets[type] || require(`react-icons/${type}`);
        icon = iconSet[name];
      }
    } catch (e) {
      console.log(
        `ReactIcon:: no icon exists for ${name}. (set:${type}, name:${name})`
      );
      return `No icon for ${name}.`;
    }
    sets[type] = iconSet;
    let reactIcon = reactDomServer.renderToStaticMarkup(
      React.createElement(icon)
    );
    let svgSymbol;
    svgSymbol = makeSymbol(reactIcon, name);
    symbols[name] = svgSymbol;
    writeSvg();
  }

  let attrClass = rest.class ? ` ${rest.class}` : ``;
  delete rest.class;
  let attrs = _getAttrs(rest);

  return `<${tag} class="icon${attrClass}"${attrs}><svg width="1em" height="1em" preserveAspectRatio="none"><use xlink:href="${iconPath}react-icons.svg#${name}"></use></svg></${tag}>`;
}

module.exports = { ReactIcon };
