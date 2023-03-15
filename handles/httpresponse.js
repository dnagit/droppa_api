import express from 'express';
const app = express();

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 404).json({
    message: "No such route exists",
  });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: "Error Message",
  });
});

export default app;
