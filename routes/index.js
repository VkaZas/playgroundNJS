var express = require('express');
var router = express.Router();
var fs = require('fs');


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
