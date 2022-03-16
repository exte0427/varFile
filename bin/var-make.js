#!/usr/bin/env node
const program = require(`commander`);
const request = require('request');
const fs = require(`fs`);
const path = require(`path`);
const { var_main } = require(`var-main`);
const { jsx } = require(`var-jsx`);
const { tempParser, makeHtml } = require(`./tempParser`);

const myPath = process.cwd();

const make_new = (fileName) => {
    const nowPath = path.join(myPath, `${fileName}.var`);

    if (fs.existsSync(nowPath))
        fs.rmSync(nowPath, { recursive: true, force: true });

    fs.mkdirSync(nowPath);

    fs.mkdirSync(path.join(nowPath, `html`));
    fs.writeFileSync(path.join(nowPath, `html`, `head.html`), `<head>\n    <meta charset="UTF-8">\n    <title>Var App</title>\n</head>`);
    fs.writeFileSync(path.join(nowPath, `html`, `body.html`), `<body>\n    <say tex="helloWorld"></say>\n</body>`);

    fs.mkdirSync(path.join(nowPath, `templates`));
    fs.writeFileSync(path.join(nowPath, `templates`, `say.template`), `<template target="say">\n    <state>tex</state>\n    <render>\n        <hi><-tex-></hi>\n    </render>\n</template>`);

    fs.mkdirSync(path.join(nowPath, `javascript`));
    fs.writeFileSync(path.join(nowPath, `javascript`, `setting.json`), `{\n    "load_priority" : [\n        "main"\n    ]\n}`);
    fs.writeFileSync(path.join(nowPath, `javascript`, `main.js`), `//js file`);
    fs.mkdirSync(path.join(nowPath, `css`));
    fs.writeFileSync(path.join(nowPath, `css`, `style.css`), `/*css file*/`);

    fs.mkdirSync(path.join(nowPath, `image`));
};

const build_new = (fileName) => {
    const infoPath = path.join(myPath, `${fileName}.var`);
    const nowPath = path.join(myPath, `${fileName}.com`);

    if (fs.existsSync(nowPath))
        fs.rmSync(nowPath, { recursive: true, force: true });
    fs.mkdirSync(nowPath);

    let myScripts = [];

    fs.mkdirSync(path.join(nowPath, `javascript`));

    const info = fs.readFileSync(path.join(infoPath, `javascript`, `setting.json`), `utf-8`);
    const prio = JSON.parse(info).load_priority;

    prio.map(element => {
        myScripts.push(element.replace(`.js`, ``));
    });

    fs.readdirSync(path.join(infoPath, "javascript")).map((name) => {
        if (name !== `setting.json`) {
            const data = fs.readFileSync(path.join(infoPath, `javascript`, name), `utf-8`);
            fs.writeFileSync(path.join(nowPath, `javascript`, name), jsx.translate(data));

            if (!myScripts.includes(name.replace(`.js`, ``)))
                myScripts.push(name.replace(`.js`, ``));
        }
    });

    let myCss = [];

    fs.mkdirSync(path.join(nowPath, `css`));
    fs.readdirSync(path.join(infoPath, "css")).map((name) => {
        const data = fs.readFileSync(path.join(infoPath, `css`, name), `utf-8`);
        fs.writeFileSync(path.join(nowPath, `css`, name), data);

        myCss.push(name);
    });

    fs.mkdirSync(path.join(nowPath, `image`));
    fs.readdirSync(path.join(infoPath, "image")).map((name) => {
        const data = fs.readFileSync(path.join(infoPath, `image`, name), `utf-8`);
        fs.writeFileSync(path.join(nowPath, `image`, name), data);
    });

    const myTemp = [];
    fs.readdirSync(path.join(infoPath, "templates")).map((name) => {
        const data = tempParser(fs.readFileSync(path.join(infoPath, `templates`, name), `utf-8`));
        myTemp.push(data);
    });
    fs.writeFileSync(path.join(nowPath, `javascript`, `templates.js`), `'self';\n'unsafe-eval';\nconst templates = [\n${myTemp.join(`,\n`)}\n]`);
    fs.writeFileSync(path.join(nowPath, `javascript`, `var.js`), var_main.getCode());

    const head = fs.readFileSync(path.join(infoPath, `html`, `head.html`), `utf-8`);
    const body = fs.readFileSync(path.join(infoPath, `html`, `body.html`), `utf-8`);

    fs.writeFileSync(path.join(nowPath, `index.html`), makeHtml(head, body, [...myScripts, `templates`], myCss));
};

program
    .option(`-new --nfileName <value>`)
    .option(`-build --bfileName <value>`)
    .action((cmd) => {
        if (cmd.nfileName)
            make_new(cmd.nfileName);
        if (cmd.bfileName)
            build_new(cmd.bfileName);
    }).parse(process.argv);