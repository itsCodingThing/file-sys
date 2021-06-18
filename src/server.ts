import express from "express";
import https from "https";
import temp from "temp";
import cors from "cors";

const app = express();
const port: number | string = process.env.PORT || 1729;

app.use(express.json());
app.use(cors());

app.get("/file", (req, res) => {
    const { url } = req.body;

    temp.track();
    const tempfile = temp.createWriteStream({ suffix: ".pdf" });

    https
        .get(url, (result) => {
            result.pipe(tempfile);

            result.on("close", () => {
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=paper.pdf");

                if (typeof tempfile.path === "string") res.sendFile(tempfile.path);
            });

            result.on("error", () => {
                res.status(500).send("unable to write file on the system");
            });
        })
        .on("error", () => {
            res.status(500).send("unable to download file from url");
        });
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
