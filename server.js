import express from "express";
import {start} from './index.js';
import formidable from "formidable";

const app = express()

app.get('/', function (req, res) {
    res.send( '<div class="container"><form action="fileupload" method="post" enctype="multipart/form-data">' +
    '<input type="file" name="filetoupload"><br>' +
    '<input type="submit">' +
    '</form></div>'
    )
})

app.post('/fileupload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        let result = await start(files.filetoupload.filepath);
        res.send(result);
    })
});

app.listen(3000);