const express = require('express');
const path = require('path');
const port = 8000;


const app = express();

app.listen(port, function(err) {
    if (err)
        console.log(`Error running the server: ${err}`);
    console.log(`Server is runinng on port ${port}`);
});