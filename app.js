const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
 
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');
const filesPayloadExists = require('./middleware/filesPayloadExists');

const PORT = process.env.PORT || 3500;

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload', 
    fileUpload({createParentPath: true}),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files;

        Object.keys(files).forEach(key => {
            const filePath = path.join(__dirname, 'files', files[key].name);
            files[key].mv(filePath, (err) => {
                if(err) {
                    return res.status(500).json({"status": "error", "message": err});
                }
            }); 
        });

        console.log(files);

        return res.json({status: "Success ", message: Object.keys(files).toString()});
    }
);

app.listen(PORT, () => console.log(`Server running on port 3500`));