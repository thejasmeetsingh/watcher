const express = require("express");

const app = express();

app.use(express.json())

app.get("/health-check/", async (req, res) => {
    res.status(200).send({
        "message": "ToDo service up & running"
    })
})

app.listen(3000, () => {
    console.log(`Server is up`)
})
