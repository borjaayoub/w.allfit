import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import workoutLogRoutes from "./routes/workoutLogRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// Configure CORS - allow all origins in development, specific origin in production
// Note: When credentials: true, we cannot use origin: '*', so we use a function to allow all
const corsOptions = {
  origin: process.env.FRONTEND_URL || function (origin, callback) {
    // Allow all origins when FRONTEND_URL is not set (development)
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/workout-logs", workoutLogRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", healthRoutes);

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
