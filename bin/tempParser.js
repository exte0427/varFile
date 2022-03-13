const { parse } = require(`node-html-parser`);
const { jsx } = require(`var-jsx`);

const tempParser = (str) => {
    const html = parse(str);
    const temphtmls = html.childNodes.filter(element => element.rawTagName === `template`);
    const templates = [];

    temphtmls.map(element => {
        let myTemp = {};
        myTemp.name = element.getAttribute(`target`) ? element.getAttribute(`target`) : "";
        myTemp.state = element.childNodes.find(child => child.rawTagName === `state`) ? element.childNodes.find(child => child.rawTagName === `state`).innerHTML.replace(/ /g, ``).split(`,`) : [];
        myTemp.variables = element.getAttribute(`variable`) ? element.getAttribute(`variable`).replace(/ /g, ``).split(`,`) : "";
        myTemp.firFunc = element.childNodes.find(child => child.rawTagName === `start`) ? jsx.translate(element.childNodes.find(child => child.rawTagName === `start`).innerHTML) : "";
        myTemp.upFunc = element.childNodes.find(child => child.rawTagName === `update`) ? jsx.translate(element.childNodes.find(child => child.rawTagName === `update`).innerHTML) : "";
        myTemp.render = jsx.translate(element.childNodes.find(child => child.rawTagName === `render`).innerHTML);

        templates.push(myTemp);
    });

    return templates;
};

const makeHtml = (head, body, myScripts, myCss) => {
    const headHtml = parse(head);
    const bodyHtml = parse(body);

    myCss.map(element => {
        headHtml.querySelector(`head`).appendChild(parse(`    <link rel="stylesheet" href="./css/${element}">\n`));
    });

    myScripts.map(element => {
        bodyHtml.querySelector(`body`).appendChild(parse(`    <script src="./javascript/${element}"></script>\n`));
    });
    bodyHtml.querySelector(`body`).appendChild(parse(`    <script src="https://cdn.jsdelivr.net/gh/exte0427/var/v2/parser.js"></script>\n`));

    return `<!DOCTYPE html>\n<html>\n${headHtml.innerHTML}\n${bodyHtml.innerHTML}\n</html>`
}

module.exports = { tempParser, makeHtml };