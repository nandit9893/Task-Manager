import express from "express";
import cors from "cors";
import userRouter from "./routes/user.router.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("/public"));

app.use("/user/management", userRouter);

export default app;