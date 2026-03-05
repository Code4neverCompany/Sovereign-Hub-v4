import fs from 'fs';

const tailscaleSocket = "/home/skywork/workspace/tailscale/tailscaled.sock";
console.log("Checking Tailscale Socket Bridge...");
if (fs.existsSync(tailscaleSocket)) {
    console.log("✅ Tailscale Socket: FOUND (" + tailscaleSocket + ")");
} else {
    console.log("❌ Tailscale Socket: NOT FOUND");
}

console.log("Engine Heart check complete.");
