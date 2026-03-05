/**
 * 🔱 SOVEREIGN STEERING v1.0
 * BMad Cycle 3: Phase 1
 */
export const Steering = {
    async sendCommand(command) {
        console.log(`%c🔱 STEERING: ${command}`, "color: #D4AF37; font-weight: bold;");
        
        // Log to Intel Stream immediately (Local Echo)
        window.renderLogLine({
            agent_name: 'SYSTEM',
            message: `Steering Command Received: ${command}`,
            created_at: new Date().toISOString()
        });

        // 🚀 THE BRIDGE: Insert into agent_logs for the Hive to "hear"
        const { error } = await window.supabase
            .from('agent_logs')
            .insert([{ 
                agent_name: 'SOVEREIGN', 
                message: `DIRECTIVE: ${command}`,
                log_level: 'COMMAND'
            }]);

        if (error) console.error("Steering Bridge Error:", error);
    }
};

// Attach to Input
document.getElementById('command-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = e.target.value;
        if (cmd) {
            Steering.sendCommand(cmd);
            e.target.value = '';
        }
    }
});
