import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import indexRoutes from "./routes/index.routes.js";
import loginRoutes from "./routes/login.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(cors()); // permite que el front (otro puerto/origen) llame a la API
app.use(express.json()); // necesario para leer req.body (JSON)

app.use(indexRoutes);
app.use(loginRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("http://localhost:" + PORT));
