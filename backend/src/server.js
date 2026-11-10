import dotenv from "dotenv";

dotenv.config();
import connectDB from "./db.js";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();

        

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log("Express server is listening!");
            console.log(`URL: http://0.0.0.0:${PORT}`);
        });

        server.on("error", (error) => {
            console.error("Express server error:", error);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();