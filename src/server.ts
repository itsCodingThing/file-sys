import express from "express";
import https from "https";
import temp from "temp";

const app = express();
const port: number | string = process.env.PORT || 1729;

app.use(express.json());

app.post("/file", (req, res) => {
    const { url } = req.body;

    temp.track();
    const tempfile = temp.createWriteStream({ suffix: ".pdf" });

    https.get(url, (result) => {
        result.pipe(tempfile);

        result.on("close", () => {
            if (typeof tempfile.path === "string") res.download(tempfile.path);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
