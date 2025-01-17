const bcrypt = require('bcrypt');

(async () => {
  const hashedPassword = await bcrypt.hash('123', 10);
  console.log(hashedPassword); // Save this hashed password
})();
