import bcrypt from "bcrypt";

/**
 * Helper utility to hash passwords
 * Use this to generate hashed passwords for database insertion
 * 
 * Usage: 
 * In terminal: npx tsx src/utils/hashPassword.ts <password>
 */
const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const password = process.argv[2];
  
  if (!password) {
    console.error("Usage: npx tsx src/utils/hashPassword.ts <password>");
    process.exit(1);
  }

  hashPassword(password)
    .then((hash) => {
      console.log("\n=================================");
      console.log("Password:", password);
      console.log("Hashed password:");
      console.log(hash);
      console.log("=================================\n");
      console.log("SQL Insert Example:");
      console.log(`INSERT INTO users (username, email, password, name, surname, role)`);
      console.log(`VALUES ('admin', 'admin@example.com', '${hash}', 'Admin', 'User', 'admin');`);
      console.log("\n");
    })
    .catch((error) => {
      console.error("Error hashing password:", error);
      process.exit(1);
    });
}

