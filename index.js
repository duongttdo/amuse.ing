import express from 'express';
import cors from "cors";
import morgan from "morgan";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import artistRoutes from './routes/artist';
import trackRoutes from './routes/tracks';
import albumRoutes from './routes/albums';
import searchRoute from './routes/search';
import userRoute from './routes/user';
import session from 'express-session';


const port = process.env.PORT || 3000;
const app = express();

// app.use(
// 	fileUpload({
// 		createParentPath: true,
// 	})
// );

//add other middleware
app.use(cors());
app.use(morgan("dev"));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: process.env.NODE_ENV === "production" }
	})
);
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: false,
		parameterLimit: 50000,
	})
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

app.use('/', artistRoutes);
app.use('/', trackRoutes);
app.use('/', albumRoutes);
app.use('/', searchRoute);
app.use("/", userRoute);



app.set('trust proxy', true)

const server = http.createServer(app);

console.log("Amuse.ing GO !!!");
server.listen(port, () => {
	console.log(`app is live at http://localhost:${port}`);
});

