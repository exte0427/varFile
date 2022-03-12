#!/usr/bin/env node
const program = require(`commander`);
const fs = require(`fs`);
const path = require(`path`);
const myPath = process.cwd();

const make_new = (fileName) => {
    const nowPath = path.join(myPath, `${fileName}.var`);

    if (fs.existsSync(nowPath))
        fs.removeSync(nowPath);

    fs.mkdirSync(nowPath);

    fs.mkdirSync(path.join(nowPath, `html`));
    fs.writeFileSync(path.join(nowPath, `html`, `head.html`), `<head>\n    <meta charset="UTF-8">\n    <language>en</language>\n    <title>Var App</title>\n</head>`);
    fs.writeFileSync(path.join(nowPath, `html`, `body.html`), `<body>\n    <say helloWorld></say>\n</body>`);

    fs.mkdirSync(path.join(nowPath, `templates`));
    fs.writeFileSync(path.join(nowPath, `templates`, `say.template`), `<var say tex>\n    <hi><-tex-></hi>\n</var>`);

    fs.mkdirSync(path.join(nowPath, `javascript`));
    fs.writeFileSync(path.join(nowPath, `javascript`, `main.js`), `//js file`);
    fs.mkdirSync(path.join(nowPath, `css`));
    fs.writeFileSync(path.join(nowPath, `css`, `style.css`), `/*css file*/`);

    fs.mkdirSync(path.join(nowPath, `img`));
};

const build_new = (fileName) => {
    const nowPath = path.join(myPath, `${fileName}.com`);

    if (fs.existsSync(nowPath))
        fs.removeSync(nowPath);

    fs.mkdirSync(nowPath);


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