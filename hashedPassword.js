const bcrypt = require("bcryptjs");

async function hashPassword() {
  const saltRounds = 10;
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hashedPassword);
}

hashPassword();
