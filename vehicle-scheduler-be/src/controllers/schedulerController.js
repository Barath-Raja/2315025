import { Log } from "../../../logging-middleware/middleware/logger.js";

function knapsack(vehicles, capacity) {

    const n = vehicles.length;

    const dp = Array.from({ length: n + 1 }, () =>
        Array(capacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {

        const weight = vehicles[i - 1].Duration;
        const value = vehicles[i - 1].Impact;

        for (let w = 0; w <= capacity; w++) {

            if (weight <= w) {

                dp[i][w] = Math.max(
                    value + dp[i - 1][w - weight],
                    dp[i - 1][w]
                );

            } else {

                dp[i][w] = dp[i - 1][w];

            }

        }

    }

    let w = capacity;
    const selectedTasks = [];

    for (let i = n; i > 0; i--) {

        if (dp[i][w] !== dp[i - 1][w]) {

            selectedTasks.push(vehicles[i - 1]);
            w -= vehicles[i - 1].Duration;

        }

    }

    selectedTasks.reverse();

    return {
        totalImpact: dp[n][capacity],
        selectedTasks
    };

}

export const getSchedule = async (req, res) => {

    try {

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
            "Fetching depots and vehicles"
        );

        const [depotResponse, vehicleResponse] = await Promise.all([
            fetch(process.env.DEPOTS_API, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }),
            fetch(process.env.VEHICLES_API, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            })
        ]);

        const depotData = await depotResponse.json();
        const vehicleData = await vehicleResponse.json();

        await Log(
            "backend",
            "info",
            "handler",
            "Fetched depots and vehicles successfully"
        );

        const schedules = depotData.depots.map((depot) => {

            const schedule = knapsack(
                vehicleData.vehicles,
                depot.MechanicHours
            );

            return {
                depotId: depot.ID,
                mechanicHours: depot.MechanicHours,
                totalImpact: schedule.totalImpact,
                selectedTasks: schedule.selectedTasks
            };

        });

        await Log(
            "backend",
            "info",
            "handler",
            "Scheduling completed successfully"
        );

        res.status(200).json({
            schedules
        });

    }
    catch (err) {

        await Log(
            "backend",
            "error",
            "handler",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }

};