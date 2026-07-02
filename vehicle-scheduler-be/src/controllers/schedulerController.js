import {Log} from "../../../logging-middleware/middleware/logger.js";

export const getSchedule=async(req, res)=>{
    try{
        res.status(200).json({
            message:"scheduler Controller working"
        });
         await Log(
            "backend",
            "info",
            "controller",
            "Schedule request completed successfully."
        );
    }
    catch(err){
        await Log(
            "backend",
            "error",
            "controller",
            error.message
        );
        res.status(500).json({
            error: err.message
        });
    }
}