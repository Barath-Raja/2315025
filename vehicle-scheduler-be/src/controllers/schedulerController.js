import { Log } from "../../../logging-middleware/middleware/logger.js";

export const getSchedule = async (req, res) => {

    try{

        await Log(
            "backend",
            "info",
            "handler",
            "Schedule request received"
        );

        await Log(
            "backend",
            "info",
            "handler",
            "Fetching depots"
        );

        const depotResponse = await fetch(process.env.DEPOTS_API,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${process.env.ACCESS_TOKEN}`
            }
        });

        const depotData = await depotResponse.json();

        await Log(
            "backend",
            "info",
            "handler",
            "Depots fetched successfully"
        );

        res.status(200).json(depotData);

    }
    catch(err){

        await Log(
            "backend",
            "error",
            "handler",
            err.message
        );

        res.status(500).json({
            error:err.message
        });

    }

}

