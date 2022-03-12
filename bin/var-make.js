#!/usr/bin/env node
const program = require(`commander`);
const fs = require(`fs`);
const path = require(`path`);
const { tempParser, makeHtml } = require(`./tempParser`);

const myPath = process.cwd();

const make_new = (fileName) => {
    const nowPath = path.join(myPath, `${fileName}.var`);

    if (fs.existsSync(nowPath))
        fs.rmSync(nowPath, { recursive: true, force: true });

    fs.mkdirSync(nowPath);

    fs.mkdirSync(path.join(nowPath, `html`));
    fs.writeFileSync(path.join(nowPath, `html`, `head.html`), `<head>\n    <meta charset="UTF-8">\n    <language>en</language>\n    <title>Var App</title>\n</head>`);
    fs.writeFileSync(path.join(nowPath, `html`, `body.html`), `<body>\n    <say helloWorld></say>\n</body>`);

    fs.mkdirSync(path.join(nowPath, `templates`));
    fs.writeFileSync(path.join(nowPath, `templates`, `say.template`), `<var say tex>\n    <hi><-tex-></hi>\n</var>`);

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
    fs.readdirSync(path.join(infoPath, "javascript")).map((name) => {
        if (name === `setting.json`) {
            const info = fs.readFileSync(path.join(infoPath, `javascript`, name), `utf-8`);
            const prio = JSON.parse(info).load_priority;

            prio.map(element => {
                myScripts.push(element);
            });
        }
        else {
            const data = fs.readFileSync(path.join(infoPath, `javascript`, name), `utf-8`);
            fs.writeFileSync(path.join(nowPath, `javascript`, name), data);

            if (!myScripts.includes(name))
                myScripts.push(name);
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

    fs.readdirSync(path.join(infoPath, "templates")).map((name) => {
        const data = tempParser(fs.readFileSync(path.join(infoPath, `templates`, name), `utf-8`));
        fs.writeFileSync(path.join(nowPath, `templates.json`), data);
    });

    const head = fs.readFileSync(path.join(infoPath, `html`, `head.html`), `utf-8`);
    const body = fs.readFileSync(path.join(infoPath, `html`, `body.html`), `utf-8`);

    fs.writeFileSync(path.join(nowPath, `index.html`), makeHtml(head, body, myScripts, myCss));
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