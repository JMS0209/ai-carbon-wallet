const Database = require('better-sqlite3');
const path = require('path');

// Use the same path as the API route
const dbPath = path.join(process.cwd(), 'data', 'zklogin.db');
console.log('数据库路径:', dbPath);
const db = new Database(dbPath);

try {
  console.log('数据库连接成功');
  
  // 手动创建zk_proofs表（如果不存在）
  db.exec(`
    CREATE TABLE IF NOT EXISTS zk_proofs (
      id TEXT PRIMARY KEY,
      jwt_hash TEXT NOT NULL,
      extended_ephemeral_public_key TEXT NOT NULL,
      max_epoch TEXT NOT NULL,
      jwt_randomness TEXT NOT NULL,
      salt TEXT NOT NULL,
      key_claim_name TEXT NOT NULL,
      proof TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
  console.log('表创建检查完成');
  
  // 查看所有表
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('数据库中的表:', tables);
  
  // 查看zk_proofs表的结构和内容
  if (tables.some(t => t.name === 'zk_proofs')) {
    const schema = db.prepare("PRAGMA table_info(zk_proofs)").all();
    console.log('\nzk_proofs表结构:', schema);
    
    const count = db.prepare("SELECT COUNT(*) as count FROM zk_proofs").get();
    console.log('\nzk_proofs表中记录数:', count.count);
    
    if (count.count > 0) {
      const recent = db.prepare("SELECT id, created_at FROM zk_proofs ORDER BY created_at DESC LIMIT 5").all();
      console.log('\n最近的5条记录:', recent);
    }
  }
  
  // 查看users表的内容
  if (tables.some(t => t.name === 'users')) {
    const users = db.prepare("SELECT * FROM users").all();
    console.log('\nusers表内容:', users);
  }
  
} catch (error) {
  console.error('数据库操作错误:', error);
} finally {
  db.close();
}
