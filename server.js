const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
require("express-async-error");
app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

app.use("/api/manager", require("./routes/manager"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/adv", require("./routes/adv"));
app.use("/api/admin_permissions", require("./routes/admin_permissions"));
app.use("/api/adv_permissions", require("./routes/adv_permissions"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/case", require("./routes/case"));
app.use("/api/case_admin", require("./routes/case_admin"));
app.use("/api/case_advocate", require("./routes/case_advocate"));
app.use("/api/phone", require("./routes/phone"));
app.use("/api/attachment", require("./routes/attachment"));
app.use("/api/note", require("./routes/note"));
//Error middleware
app.use(require("./middlewares/error"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
