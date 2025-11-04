const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra'); // Still needed for initial migration

let db;

async function initializeDatabase() {
  try {
    db = await open({
      filename: './synapscript.db',
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS automations (
        id TEXT PRIMARY KEY,
        name TEXT,
        trigger TEXT,
        actions TEXT,
        generated_code TEXT,
        created_at INTEGER,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS api_tokens (
        token TEXT PRIMARY KEY,
        description TEXT,
        created_at INTEGER
      );
    `);

    console.log('SQLite database initialized and tables created.');

    // Migrate data from automations.json if it exists and automations table is empty
    const automationsCount = await db.get('SELECT COUNT(*) as count FROM automations');
    if (automationsCount.count === 0) {
      const jsonFilePath = './automations.json';
      const fileExists = await fs.pathExists(jsonFilePath);
      if (fileExists) {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const automations = JSON.parse(data);
        for (const automation of automations) {
          await createAutomation(automation);
        }
        console.log(`Migrated ${automations.length} automations from automations.json`);
        await fs.remove(jsonFilePath); // Remove the old JSON file after migration
        console.log('Removed automations.json after successful migration.');
      }
    }
  } catch (error) {
    console.error('Error initializing SQLite database:', error.message);
    process.exit(1);
  }
}

async function createAutomation(automation) {
  const now = Date.now();
  const newAutomation = {
    id: automation.id || uuidv4(),
    name: automation.name,
    trigger: JSON.stringify(automation.trigger),
    actions: JSON.stringify(automation.actions),
    generated_code: JSON.stringify(automation.generated_code),
    created_at: now,
    updated_at: now,
  };
  await db.run(
    `INSERT INTO automations (id, name, trigger, actions, generated_code, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    newAutomation.id,
    newAutomation.name,
    newAutomation.trigger,
    newAutomation.actions,
    newAutomation.generated_code,
    newAutomation.created_at,
    newAutomation.updated_at
  );
  return newAutomation;
}

async function getAutomationById(id) {
  const automation = await db.get('SELECT * FROM automations WHERE id = ?', id);
  if (automation) {
    automation.trigger = JSON.parse(automation.trigger);
    automation.actions = JSON.parse(automation.actions);
    automation.generated_code = JSON.parse(automation.generated_code);
  }
  return automation;
}

async function getAllAutomations() {
  const automations = await db.all('SELECT * FROM automations');
  return automations.map(automation => ({
    ...automation,
    trigger: JSON.parse(automation.trigger),
    actions: JSON.parse(automation.actions),
    generated_code: JSON.parse(automation.generated_code),
  }));
}

async function updateAutomation(id, updates) {
  const now = Date.now();
  const fields = [];
  const values = [];

  for (const key in updates) {
    if (['name', 'trigger', 'actions', 'generated_code'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(updates[key]));
    }
  }
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  if (fields.length === 1 && fields[0] === 'updated_at = ?') { // Only updated_at changed
    const existingAutomation = await getAutomationById(id);
    if (existingAutomation) {
      return { ...existingAutomation, updated_at: now };
    }
    return null;
  }

  const result = await db.run(
    `UPDATE automations SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  if (result.changes > 0) {
    return getAutomationById(id);
  }
  return null;
}

async function deleteAutomation(id) {
  const result = await db.run('DELETE FROM automations WHERE id = ?', id);
  return result.changes > 0;
}

async function createApiToken(token, description) {
  const now = Date.now();
  await db.run(
    `INSERT INTO api_tokens (token, description, created_at)
     VALUES (?, ?, ?)`,
    token,
    description,
    now
  );
  return { token, description, created_at: now };
}

async function getApiToken(token) {
  return db.get('SELECT * FROM api_tokens WHERE token = ?', token);
}

async function deleteApiToken(token) {
  const result = await db.run('DELETE FROM api_tokens WHERE token = ?', token);
  return result.changes > 0;
}

module.exports = {
  initializeDatabase,
  createAutomation,
  getAutomationById,
  getAllAutomations,
  updateAutomation,
  deleteAutomation,
  createApiToken,
  getApiToken,
  deleteApiToken,
};