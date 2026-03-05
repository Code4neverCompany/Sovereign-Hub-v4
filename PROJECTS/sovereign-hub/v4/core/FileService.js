/**
 * Nexus File Service (SH-1600-H)
 * Hardened Virtual FS Bridge for the Sovereign Hub Dashboard.
 * 
 * SECURITY: Strict path resolution & Jail enforcement.
 * INTEGRITY: Hash-based collision detection & Save validation.
 * PERFORMANCE: Non-recursive, asynchronous lazy-loading scanner.
 */
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileService {
    constructor(root = '/home/skywork/workspace/') {
        // SECURITY: Ensure root is absolute and normalized
        this.root = path.resolve(root);
        if (!this.root.endsWith(path.sep)) {
            this.root += path.sep;
        }
        
        this.allowedExtensions = ['.md', '.yaml', '.json', '.txt', '.js', '.html', '.css'];
        this.ignoreDirs = ['node_modules', '.git', '.cache', 'temp', 'nexus'];
    }

    /**
     * SECURE PATH RESOLUTION (SH-1600-H1)
     * Resolves relative path to absolute and ensures it's within the jail.
     */
    _resolvePath(relPath) {
        const fullPath = path.resolve(this.root, relPath);
        if (!fullPath.startsWith(this.root)) {
            throw new Error("SECURITY_VIOLATION: Attempted escape from /workspace/ jail.");
        }
        return fullPath;
    }

    /**
     * ASYNCHRONOUS NON-RECURSIVE SCANNER (SH-1600-H3)
     * Implements shallow scanning for lazy-loading UI trees.
     */
    async scan(relDir = '.') {
        const dir = this._resolvePath(relDir);
        
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            const items = [];

            for (const entry of entries) {
                // Ignore hidden files and restricted directories
                if (entry.name.startsWith('.') || this.ignoreDirs.includes(entry.name)) continue;

                const fullPath = path.join(dir, entry.name);
                const relItemPath = path.relative(this.root, fullPath);

                if (entry.isDirectory()) {
                    items.push({
                        name: entry.name,
                        type: 'directory',
                        path: relItemPath,
                        hasChildren: true // UI hint for lazy-loading
                    });
                } else {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (this.allowedExtensions.includes(ext)) {
                        const stats = await fs.stat(fullPath);
                        const hash = await this.getFileHash(fullPath);
                        items.push({
                            name: entry.name,
                            type: 'file',
                            path: relItemPath,
                            size: stats.size,
                            lastModified: stats.mtime,
                            hash: hash // Used for integrity checks on save
                        });
                    }
                }
            }

            // Sort: Directories first, then alphabetically
            return items.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'directory' ? -1 : 1;
            });

        } catch (err) {
            console.error(`Nexus_FS_Error: Failed to scan ${relDir}`, err);
            throw new Error(`FS_SCAN_FAILED: ${err.message}`);
        }
    }

    /**
     * FILE HASHING (SH-1600-H2)
     * Generates SHA-256 hash for collision detection.
     */
    async getFileHash(fullPath) {
        try {
            const content = await fs.readFile(fullPath);
            return crypto.createHash('sha256').update(content).digest('hex');
        } catch (err) {
            return null;
        }
    }

    /**
     * SECURE READ (SH-1600-H1)
     */
    async readFile(relPath) {
        const fullPath = this._resolvePath(relPath);

        const ext = path.extname(fullPath).toLowerCase();
        if (!this.allowedExtensions.includes(ext)) {
            throw new Error(`ACCESS_DENIED: Extension ${ext} restricted.`);
        }

        const content = await fs.readFile(fullPath, 'utf8');
        const hash = crypto.createHash('sha256').update(content).digest('hex');

        return {
            content,
            hash,
            path: relPath
        };
    }

    /**
     * HARDENED SAVE WITH COLLISION DETECTION (SH-1600-H2)
     */
    async saveFile(relPath, content, expectedHash = null) {
        const fullPath = this._resolvePath(relPath);
        const backupDir = path.join(this.root, 'nexus/backups');

        // 1. INTEGRITY CHECK: Optimistic Locking
        if (expectedHash) {
            const currentHash = await this.getFileHash(fullPath);
            if (currentHash && currentHash !== expectedHash) {
                throw new Error("COLLISION_DETECTED: File has been modified by another process.");
            }
        }

        // 2. CREATE BACKUP
        try {
            await fs.mkdir(backupDir, { recursive: true });
            const backupPath = path.join(backupDir, `${path.basename(relPath)}.${Date.now()}.bak`);
            
            // Try to backup existing file
            try {
                await fs.copyFile(fullPath, backupPath);
            } catch (e) {
                // File might be new
            }

            // 3. ATOMIC-ISH WRITE
            await fs.writeFile(fullPath, content, 'utf8');
            
            const newHash = crypto.createHash('sha256').update(content).digest('hex');

            return {
                success: true,
                path: relPath,
                hash: newHash,
                timestamp: new Date().toISOString()
            };
        } catch (err) {
            throw new Error(`SAVE_FAILED: ${err.message}`);
        }
    }
}

module.exports = FileService;
