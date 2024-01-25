let sessions = { currentCSRF: null };

const csfrInsert = (req, res, next) => {
  const csrfToken = crypto.randomUUID();
  sessions.currentCSRF = csrfToken;
  res.json({ csrfToken, message: "required" });
  next();
};

const csfrCheck = (req, res, next) => {
  const { csrfToken } = req.body;
  const sessionCsrfToken = sessions.currentCSRF;
  if (csrfToken && sessionCsrfToken && csrfToken === sessionCsrfToken) {
    next();
  } else {
    res.status(400).send("Invalid CSRF token");
  }
};

const csfrCheckUploads = (req, res, next) => {
  const csrfToken = req.headers["x-csrf-token"];
  const sessionCsrfToken = sessions.currentCSRF;
  if (csrfToken && sessionCsrfToken && csrfToken === sessionCsrfToken) {
    next();
  } else {
    res.status(400).send("Invalid CSRF token");
  }
};

module.exports = { csfrCheck, csfrCheckUploads, csfrInsert };
