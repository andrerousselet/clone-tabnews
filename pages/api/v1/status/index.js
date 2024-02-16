function status(req, res) {
  res.status(200).json({ status: "Status health check" });
}

export default status;
