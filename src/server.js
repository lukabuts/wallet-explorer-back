import "dotenv/config";
import { buildApp } from "@/app";
const PORT = process.env.BACKEND_PORT || 3000;
const start = async () => {
    const app = await buildApp();
    try {
        await app.listen({ port: Number(PORT) });
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(app.printRoutes());
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
