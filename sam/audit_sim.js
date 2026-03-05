const DirectiveValidator = require('/home/skywork/workspace/PROJECTS/sovereign-hub/v4/core/DirectiveValidator');
const validator = new DirectiveValidator(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function runAudit() {
  console.log('--- PHASE 5.1: MISSION SIMULATION ---');
  
  const testMissions = [
    { name: 'Budget Violation', mission: { action: 'SPEND', budget: 150, description: 'Overspend test' }, agent: 'Jordan' },
    { name: 'Safe Mission', mission: { action: 'SPEND', budget: 50, description: 'Normal spend' }, agent: 'Jordan' },
    { name: 'Security Violation', mission: { action: 'WRITE_FILE', path: '/core/malicious.js', content: 'hack' }, agent: 'Dev' },
    { name: 'High Risk Tool', mission: { action: 'EXECUTE', tools: ['exec'], command: 'rm -rf /' }, agent: 'Sam' }
  ];

  for (const test of testMissions) {
    try {
        const allowed = await validator.validate(test.mission, test.agent);
        console.log(`[${test.name}] Allowed: ${allowed}`);
    } catch (e) {
        console.log(`[${test.name}] Error: ${e.message}`);
    }
  }
}

runAudit();
