const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res
        .status(401)
        .send({ message: "Authorization header missing", success: false });
    }

    // Log the raw Authorization header for debugging (first 100 chars)
    try {
      console.log('Authorization header:', authorizationHeader.substring(0, 100));
    } catch (e) {
      // ignore
    }

    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        console.warn('Invalid token provided:', err && err.message);
        return res
          .status(401)
          .send({ message: "Token is not valid", success: false });
      } else {
        // Attach decoded token info to req.user for downstream handlers
        req.user = decode;
        console.log('Token verified, decoded id:', decode && decode.id);
        next();
      }
    });
  } catch (error) {
    console.error(error); // Handle or log the error appropriately
    res.status(500).send({ message: "Internal server error", success: false });
  }
};
