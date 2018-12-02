var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/col', function (req, res, next) {
    res.render('collapse');
});

router.post('/col', function(req, res, next) {
    console.log("???????");
    console.log(req.body);
    let graphData = JSON.parse(req.body['dependencyGraph']);
    let classData = JSON.parse(req.body['fileOwnershipMap']);
    let methodData = JSON.parse(req.body['classOwnershipMap']);
    let resData = {nodes: [], links: []};
    const map = {};
    const nameMap = {};
    let cnt = 0;
    for (let k of Object.keys(graphData)) {
        map[k] = cnt++;
        resData.nodes.push({
            x: 0,
            y: 0,
            id: map[k],
            fileName: k,
            classes: [],
            children: [],
        });
    }
    for (let k of Object.keys(graphData)) {
        for (let v of Object.keys(graphData[k])) {
            resData.links.push({
                source: map[v],
                target: map[k],
            });
        }
    }
    for (let k of Object.keys(classData)) {
        for (let c of classData[k]) {
            map[c] = cnt++;
            node = {
                x: 0,
                y: 0,
                id: map[c],
                className: c,
                methods: [],
                children: [],
            };
            resData.nodes.push(node);
            resData.nodes[map[k]].classes.push(c);
            resData.nodes[map[k]].children.push(node.id);
            resData.links.push({
                source: map[k],
                target: map[c],
            });
        }
    }

    console.log(resData);
    for (let k of Object.keys(methodData)) {
        for (let c of methodData[k]) {
            methodName = k + "." + c;
            map[methodName] = cnt++;
            node = {
                x: 0,
                y: 0,
                id: map[methodName],
                className: k,
                methodName: c,
            };
            resData.nodes.push(node);
            resData.nodes[map[k]].methods.push(c);
            resData.nodes[map[k]].children.push(node.id);
            resData.links.push({
                source: map[k],
                target: map[methodName],
            });
        }
    }
    fs.writeFile('../public/data/col.json', JSON.stringify(resData));

    res.json('{}');
});

/* GET home page. */
router.post('/graph', function(req, res, next) {
    console.log("!!!!!!");
    let graphData = JSON.parse(req.body['dependencyGraph']);
    let classData = JSON.parse(req.body['fileOwnershipMap']);
    let resData = {nodes: [], links: []};
    const map = {};
    const nameMap = {};
    let cnt = 0;
    for (let k of Object.keys(graphData)) {
        map[k] = cnt++;
        resData.nodes.push({
            x: 0,
            y: 0,
            fileName: k,
            classes: [],
        });
    }
    for (let k of Object.keys(graphData)) {
        for (let v of Object.keys(graphData[k])) {
            resData.links.push({
                source: map[v],
                target: map[k],
            });
        }
    }
    for (let k of Object.keys(classData)) {
        for (let c of classData[k]) {
            resData.nodes[map[k]].classes.push(c);
        }
    }
    fs.writeFile('public/data/graph.json', JSON.stringify(resData));

    res.json('{}');
});

router.get('/', function (req, res, next) {
   res.render('graph');
});

module.exports = router;
