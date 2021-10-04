const express = require('express');
const cors = require('cors')

const app = express();
//app.use(cors({origin : "*"}));
app.use(require('./src/routes'))



app.listen(8080, () => console.log('Server is running on http://localhost:8080'));