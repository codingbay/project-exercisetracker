const express = require("express");
const router = express.Router();
const moment = require("moment");

const UserModel = require("../schemas/User");
const ExerciseModel = require("../schemas/Exercise");

router
  .route("/")
  .get(async (req, res, next) => {
    const result = await UserModel.find();
    res.send(result);
    next(null, result);
  })
  .post(async (req, res, next) => {
    const { username } = req.body;
    const result = await UserModel.findOne({
      username,
    });

    if (!result) {
      const user = UserModel({
        username,
      });
      const saveResult = await user.save();
      res.send({
        username: saveResult.username,
        _id: saveResult._id,
      });
      next(null, saveResult);
    } else {
      res.send({ errorMessage: `${username} already exists` });
    }
  });

router.post("/:userId/exercises", async (req, res, next) => {
  const { userId } = req.params;
  const { description, duration, date = new Date() } = req.body;
  const exercise = new ExerciseModel({
    userId,
    description,
    duration,
    date,
  });

  const saveResult = await exercise.save();

  const user = await UserModel.findById(userId);
  res.send({
    ...(user
      ? {
          _id: user._id,
          username: user.username,
        }
      : {}),
    description: saveResult.description,
    duration: saveResult.duration,
    date: parseDate(date),
  });
  next(null, saveResult);
});

router.get("/:userId/logs", async (req, res, next) => {
  const { userId } = req.params;
  const { from, to, limit } = req.query;
  console.log(limit);
  const user = await UserModel.findById(userId);

  let exercises = await ExerciseModel.find({
    userId,
    ...(from && to
      ? {
          date: {
            $gte: from,
            $lte: to,
          },
        }
      : {}),
  }).limit(parseInt(limit) || 0);

  exercises = exercises.map((exercise) => ({
    description: exercise.description,
    duration: exercise.duration,
    date: parseDate(exercise.date),
  }));

  res.send({
    _id: user ? user._id : "",
    username: user ? user.username : "",
    count: exercises.length,
    log: exercises,
  });

  next();
});

const parseDate = (date) =>
  moment(new Date(date)).utc().format("ddd MMM DD YYYY");

module.exports = router;
