import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import cors from "cors";
import path from "path";

dotenv.config({ path: ".env" });
databaseConnection();

const app = express();
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' })); 
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3002", 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  req.secureCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost"
  };
  next();
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  fallthrough: false 
}));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
