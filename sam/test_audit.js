const path = require('path');
const fs = require('fs');

const root = '/home/skywork/workspace/';

function checkPath(relPath) {
    const fullPath = path.join(root, relPath);
    const startsWithRoot = fullPath.startsWith(root);
    console.log(`Rel: ${relPath} -> Full: ${fullPath} | StartsWithRoot: ${startsWithRoot}`);
    return startsWithRoot;
}

console.log("--- Security Tests ---");
checkPath('test.txt');
checkPath('../etc/passwd');
checkPath('PROJECTS/../../etc/passwd');
checkPath('../workspace-extra/test.txt');

// Test with root NOT ending in slash
const rootNoSlash = '/home/skywork/workspace';
function checkPathNoSlash(relPath) {
    const fullPath = path.join(rootNoSlash, relPath);
    const startsWithRoot = fullPath.startsWith(rootNoSlash);
    console.log(`[NoSlash] Rel: ${relPath} -> Full: ${fullPath} | StartsWithRoot: ${startsWithRoot}`);
    return startsWithRoot;
}

console.log("\n--- NoSlash Root Security Tests ---");
checkPathNoSlash('../workspace-backup/secret.txt');
checkPathNoSlash('test.txt');

console.log("\n--- Performance Check ---");
// Simulate 1000 nodes rendering
const nodes = Array.from({length: 1000}, (_, i) => ({
    name: `file_${i}.md`,
    type: 'file',
    path: `file_${i}.md`
}));

const startTime = Date.now();
// Mock rendering loop
nodes.forEach(node => {
    const el = { innerHTML: `<div>${node.name}</div>` };
});
const endTime = Date.now();
console.log(`Simulated rendering of 1000 nodes took ${endTime - startTime}ms (Main Thread)`);
