import jwt from "jsonwebtoken";

const createToken = (res, userId) => {
  try {
    const token = jwt.sign({userId}, "karan");
    res.cookie("jwt", token, {
      // expires: 60*30*22,
      httpOnly: true,
    });
  } catch (error) {
    res.send("token not created");
  }
};

export default createToken;
