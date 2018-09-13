const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(require('morgan')('dev'));
app.use(express.static('public'));
app.use(express.static('dist'));

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});