// app.get("/test", async (req, res) => {
//     await Log(
//         "backend",
//         "info",
//         "route",
//         "Logger working successfully"
//     );
//     res.status(200).json({
//         message: "Logger test successful"
//     });
// });

import express from "express";
import dotenv from "dotenv";
import { Log} from "../../logging-middleware/middleware/logger.js";
dotenv.config();

const app=express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Server is Running");
});

app.get("/test", async (req, res) => {
    await Log(
        "backend",
        "info",
        "route",
        "Logger working successfully"
    );
    res.status(200).json({
        message: "Logger test successful"
    });
});

const PORT =process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`);
});