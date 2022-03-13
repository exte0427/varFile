const { parse } = require(`node-html-parser`);
const { jsx } = require(`var-jsx`);

const makeVar_save = (str, variables, states) => {
    return `({${variables.join(`,`)}},{${states.join(`,`)}}) => {\n${str}\nreturn {${variables.map(element => `"${element}":${element}`).join(`,`)}}\n}`;
}

const makeRender = (str, variables, states) => {
    return `({${variables.join(`,`)}},{${states.join(`,`)}}) => ${str}`;
}

const tempParser = (str) => {
    const html = parse(str);
    const temphtmls = html.childNodes.filter(element => element.rawTagName === `template`);
    const templates = [];

    temphtmls.map(element => {
        let myTemp = {};
        myTemp.name = element.getAttribute(`target`) ? element.getAttribute(`target`) : "";
        myTemp.state = element.childNodes.find(child => child.rawTagName === `state`) ? element.childNodes.find(child => child.rawTagName === `state`).innerHTML.replace(/ /g, ``).split(`,`) : [];
        myTemp.variables = element.childNodes.find(child => child.rawTagName === `variable`) ? element.childNodes.find(child => child.rawTagName === `variable`).innerHTML.replace(/ /g, ``).split(`,`) : [];
        myTemp.firFunc = element.childNodes.find(child => child.rawTagName === `start`) ? makeVar_save(jsx.translate(element.childNodes.find(child => child.rawTagName === `start`).innerHTML), myTemp.variables, myTemp.state) : "null";
        myTemp.upFunc = element.childNodes.find(child => child.rawTagName === `update`) ? makeVar_save(jsx.translate(element.childNodes.find(child => child.rawTagName === `update`).innerHTML), myTemp.variables, myTemp.state) : "null";
        myTemp.render = makeRender(jsx.translate(`<renderThing>${element.childNodes.find(child => child.rawTagName === `render`).innerHTML}</renderThing>`), myTemp.variables, myTemp.state);

        templates.push(`{\nname:"${myTemp.name}",\nstate:[${myTemp.state.map(element => `"${element}"`).join(',')}],\nvariables:[${myTemp.variables.map(element => `"${element}"`).join(',')}],\nfirFunc:${myTemp.firFunc},\nupFunc:${myTemp.upFunc},\nrender:${myTemp.render}\n}`);
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
        bodyHtml.querySelector(`body`).appendChild(parse(`    <script src="./javascript/${element}.js"></script>\n`));
    });
    bodyHtml.querySelector(`body`).appendChild(parse(`    <script src="./javascript/var.js"></script>\n`));

    return `<!DOCTYPE html>\n<html lang="en">\n${headHtml.innerHTML}\n${bodyHtml.innerHTML}\n</html>`
}

module.exports = { tempParser, makeHtml };