const express = require("express");
const app = express();
const mongo = require("./config/mongo.connect");
const cloudinary = require("./config/cloudinary.connect");
const citizenRoutes = require("./routes/citizen.routes");
const adminRoutes = require("./routes/admin.routes");
const commonRoutes = require("./routes/common.routes");
const fileUpload = require("express-fileupload");
const cors = require("cors");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

mongo();
cloudinary();

app.use("/api/v1/citizen", citizenRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/common", commonRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
