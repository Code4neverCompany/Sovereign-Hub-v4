/**
 * 🔱 Sovereign Hub: Static Skill Auditor
 * Scans skill manifests and code for high-risk patterns (malware detection).
 */

import fs from 'fs';
import path from 'path';

const HIGH_RISK_PATTERNS = [
    /exec\s*\(/,
    /spawn\s*\(/,
    /child_process/,
    /http\.request/,
    /https\.request/,
    /axios/,
    /node-fetch/,
    /fs\.writeFile/,
    /fs\.rmSync/,
    /message\.send\s*\(.*(http|www|ssh)/,
    /process\.env/
];

function auditSkill(skillPath) {
    console.log(`🔱 AUDITING SKILL: ${skillPath}`);
    const files = fs.readdirSync(skillPath, { recursive: true });
    let findings = [];

    files.forEach(file => {
        const filePath = path.join(skillPath, file);
        if (fs.statSync(filePath).isFile() && (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.md'))) {
            const content = fs.readFileSync(filePath, 'utf8');
            HIGH_RISK_PATTERNS.forEach(pattern => {
                if (pattern.test(content)) {
                    findings.push({ file, pattern: pattern.toString() });
                }
            });
        }
    });

    return findings;
}

// Example usage
// const report = auditSkill('/home/skywork/workspace/skills/some-new-skill');
// console.log(JSON.stringify(report, null, 2));
