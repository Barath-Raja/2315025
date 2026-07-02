import schedulerRoutes from "./routes/schedulerRoutes.js";
import express from "express";
import dotenv from "dotenv";
import { Log} from "../../logging-middleware/middleware/logger.js";
dotenv.config();
console.log("LOG_API =", process.env.LOG_API);
console.log("ACCESS_TOKEN exists =", !!process.env.ACCESS_TOKEN);


const app=express();
app.use(express.json());
app.use("/api", schedulerRoutes);

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