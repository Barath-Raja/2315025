export const Log=async(stack, level, packageName, message)=>{
    try{
        const response=await fetch(process.env.LOG_API, {
            method: "POST",
            headers:{
                Authorization : `Bearer ${process.env.ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stack,
                level,
                package : packageName,
                message
            })
        });
        const logs=await response.json()
        if(!response.ok){
            throw new Error(`Logging failed:${response.status}`);
        }
        return logs;
    }
    catch(error){
        console.error("Logger Error : ", error.message);
        return null;
    }
}