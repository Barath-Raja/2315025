import { Log } from "../../../logging-middleware/middleware/logger.js";

function knapsack(tasks, capacity) {

    const n = tasks.length;

    const dp = Array.from({ length: n + 1 }, () =>
        Array(capacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {

        const duration = tasks[i - 1].Duration;
        const impact = tasks[i - 1].Impact;

        for (let hours = 0; hours <= capacity; hours++) {

            if (duration <= hours) {

                dp[i][hours] = Math.max(
                    impact + dp[i - 1][hours - duration],
                    dp[i - 1][hours]
                );

            } else {

                dp[i][hours] = dp[i - 1][hours];

            }

        }

    }

    const selectedTasks = [];
    let hours = capacity;

    for (let i = n; i > 0; i--) {

        if (dp[i][hours] !== dp[i - 1][hours]) {

            selectedTasks.push(tasks[i - 1]);
            hours -= tasks[i - 1].Duration;

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
            "Received scheduling request"
        );

        const [depotResponse, vehicleResponse] = await Promise.all([
            fetch(process.env.DEPOTS_API, {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }),
            fetch(process.env.VEHICLES_API, {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            })
        ]);

        const depotData = await depotResponse.json();
        const vehicleData = await vehicleResponse.json();

        console.log("Depots:", depotData);
        console.log("Vehicles:", vehicleData);

        const depots = depotData.depots || [];
        const vehicles = vehicleData.vehicles || vehicleData;

        const schedules = depots.map((depot) => {

            const result = knapsack(
                vehicles,
                depot.MechanicHours
            );

            const usedHours = result.selectedTasks.reduce(
                (sum, task) => sum + task.Duration,
                0
            );

            return {
                depotId: depot.ID,
                mechanicHours: depot.MechanicHours,
                usedHours,
                totalImpact: result.totalImpact,
                selectedTasks: result.selectedTasks.map(task => task.TaskID)
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

    } catch (err) {

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