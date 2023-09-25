const express = require("express");
const app = express();

const { UserRouter, BoardRouter, CommentRouter } = require("./routes/index.js");
const handleError = require("./handleErr.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRouter);
app.use("/board", BoardRouter);
app.use("/comment", CommentRouter);

app.use(handleError.handleError);

app.listen(3000, () => {
  console.log("Server is running");
});
