// Mock implementation for drizzle-kit to prevent bundling issues
// drizzle-kit is only needed for migrations, not runtime
module.exports = {
  api: {
    generateSQLiteDrizzleJson: () => { throw new Error('drizzle-kit not available at runtime') },
    generateSQLiteMigration: () => { throw new Error('drizzle-kit not available at runtime') },
    pushSQLiteSchema: () => { throw new Error('drizzle-kit not available at runtime') },
  }
};
