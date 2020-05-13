router = express.Router();

router.get("/", (req, res) => {
  res.send({ hp: 1 });
});

module.exports = router;
