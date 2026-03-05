# UI Specification: Active Dispatch (Aureum Luxury Edition)

## Overview
The "Active Dispatch" system is the primary interface for summoning Sovereign Agents. It consists of a high-fidelity trigger button and a radial/flyout selection menu that utilizes high-contrast glassmorphism and agent-specific light auras.

## 1. The "Active Dispatch" Trigger
- **Style**: Octagonal brushed obsidian frame with a gold leaf inner trim.
- **State**: Default state features a slow pulsing 'Aureum' gold glow.
- **Hover**: Intensifies glow; subtle mechanical click sound.

## 2. Agent Selection Flyout
When triggered, a semi-transparent 'Void' glass panel slides out. Each agent is represented by a stylized mnemonic icon with a unique color-aura.

### Agent Color Mappings
- **🏗️ Alex**: `#00F2FF` (Electric Blue Pulse)
- **🎨 Maya**: `#FF00FF` (Magenta Resonance)
- **📋 Jordan**: `#50FFAB` (Emerald Flux)
- **💻 Dev**: `#FFD700` (Cyber Gold)
- **🛡️ Sam**: `#FF2A2A` (Crimson Aegis)

---

## 3. Specification (React Pseudo-Code)

```jsx
import React, { useState } from 'react';
import './Dispatch.css';

const agents = [
  { id: 'alex', name: 'Alex', icon: '🏗️', color: 'blue' },
  { id: 'maya', name: 'Maya', icon: '🎨', color: 'magenta' },
  { id: 'jordan', name: 'Jordan', icon: '📋', color: 'emerald' },
  { id: 'dev', name: 'Dev', icon: '💻', color: 'gold' },
  { id: 'sam', name: 'Sam', icon: '🛡️', color: 'crimson' },
];

export const DispatchSystem = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="aureum-dispatch-container">
      <button 
        className={`dispatch-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="label">ACTIVE DISPATCH</span>
      </button>

      {isOpen && (
        <div className="agent-flyout">
          {agents.map(agent => (
            <button key={agent.id} className={`agent-btn aura-${agent.color}`}>
              <span className="icon">{agent.icon}</span>
              <span className="name">{agent.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 4. Aesthetic CSS (The Aureum Standard)

```css
/* Dispatch.css */
:root {
  --gold-leaf: #D4AF37;
  --obsidian: #0A0A0B;
  --void-glass: rgba(10, 10, 11, 0.85);
}

.dispatch-trigger {
  background: var(--obsidian);
  border: 1px solid var(--gold-leaf);
  color: var(--gold-leaf);
  padding: 12px 24px;
  font-family: 'Cinzel', serif; /* Or similar luxury serif */
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
}

.agent-flyout {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  backdrop-filter: blur(20px);
  background: var(--void-glass);
  padding: 20px;
  border-left: 2px solid var(--gold-leaf);
}

.agent-btn {
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}

/* Agent Color-Auras */
.aura-blue:hover   { filter: drop-shadow(0 0 12px #00F2FF); transform: scale(1.1); }
.aura-magenta:hover { filter: drop-shadow(0 0 12px #FF00FF); transform: scale(1.1); }
.aura-emerald:hover { filter: drop-shadow(0 0 12px #50FFAB); transform: scale(1.1); }
.aura-gold:hover    { filter: drop-shadow(0 0 12px #FFD700); transform: scale(1.1); }
.aura-crimson:hover { filter: drop-shadow(0 0 12px #FF2A2A); transform: scale(1.1); }

.agent-btn .icon {
  font-size: 2rem;
  margin-bottom: 5px;
}
```
