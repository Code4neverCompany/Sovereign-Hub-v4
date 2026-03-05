'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { OpenClawBridge, IntelMessage } from '@/lib/openclaw-bridge';

import LogicTree from '@/components/LogicTree';
import SentinelTrace from '@/components/SentinelTrace';

export default function MissionControl() {
    const [activeTab, setActiveTab] = useState<'INTEL' | 'TRACE'>('INTEL');
    const [messages, setMessages] = useState<IntelMessage[]>([
        { timestamp: '[01:22:04]', source: 'SYSTEM', content: 'Initializing materialization proof...', color: 'var(--cyan)' },
        { timestamp: '[01:23:15]', source: 'MAYA', content: 'Applying Lux Aesthetic 3.0 tokens...', color: 'var(--gold)' },
        { timestamp: '[01:24:10]', source: 'DEV', content: 'Bypassing Next.js overhead for direct DOM sync...', color: 'var(--gold)' },
        { timestamp: '[01:25:00]', source: 'NOVA', content: 'Dashboard sovereignty restored.', color: 'var(--cyan)' },
    ]);

    const bridgeRef = useRef<OpenClawBridge | null>(null);
    const recorderRef = useRef<any>(null);

    const handleNewMessage = useCallback((msg: IntelMessage) => {
        setMessages((prev) => [...prev, {
            ...msg,
            timestamp: `[${new Date().toLocaleTimeString()}]`
        }].slice(-50)); // Keep last 50

        // SH-1000 Trace Recording Integration
        if (recorderRef.current) {
            recorderRef.current.recordEvent({
                agent_id: msg.source,
                type: 'thought', // Default mapping
                message: msg.content,
                usage: {},
                latency: 0
            });
        }
    }, []);

    useEffect(() => {
        // Initialize Recorder (SH-1000)
        import('@/lib/TraceRecorder').then(({ TraceRecorder }) => {
            recorderRef.current = new TraceRecorder('d290f1ee-6c54-4b01-90e6-d701748f0851');
        });

        const bridge = new OpenClawBridge(handleNewMessage);
        bridge.connect();
        bridgeRef.current = bridge;

        return () => {
            bridge.disconnect();
        };
    }, [handleNewMessage]);

    const dispatchAlex = async () => {
        if (!bridgeRef.current) return;
        try {
            handleNewMessage({
                timestamp: '',
                source: 'USER',
                content: 'Dispatching ALEX [ARCHITECT]...',
                color: 'var(--gold)'
            });
            await bridgeRef.current.dispatch('ACTIVATE_AGENT', { agent: 'ALEX' });
            handleNewMessage({
                timestamp: '',
                source: 'SYSTEM',
                content: 'ALEX [ARCHITECT] ONLINE.',
                color: 'var(--cyan)'
            });
        } catch (e) {
            handleNewMessage({
                timestamp: '',
                source: 'ERROR',
                content: 'Failed to dispatch ALEX.',
                color: 'var(--gold)'
            });
        }
    };

    return (
        <main className="p-10">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-[var(--gold)] pb-6">
                    <div>
                        <h1 className="text-5xl cinzel font-bold text-[var(--gold)] gold-glow tracking-tighter">
                            SOVEREIGN_HUB <span className="text-white opacity-20 font-light">v4.0</span>
                        </h1>
                        <p className="text-[10px] mono uppercase tracking-[0.5em] text-white/40 mt-2">
                            Aureum Void Protocol // Agent-Driven Materialization
                        </p>
                    </div>
                    <div className="text-right mono">
                        <p className="text-xs text-[var(--cyan)] animate-pulse">SENTINEL_GATE: ACTIVE</p>
                        <p className="text-[10px] text-white/20">05 MAR 2026 // 05:48 UTC</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Agent Matrix Proof */}
                    <div className="col-span-4 space-y-6">
                        <button 
                            onClick={dispatchAlex}
                            className="w-full text-left glass p-6 rounded-2xl neural-pulse relative overflow-hidden group hover:bg-white/5 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl">🏗️</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
                            </div>
                            <h3 className="cinzel text-[var(--gold)] text-lg tracking-widest">ALEX [ARCHITECT]</h3>
                            <p className="text-[9px] mono text-[var(--cyan)] opacity-60">MODEL: CLAUDE_OPUS_4.6</p>
                            <div className="mt-4 bg-black/60 p-3 rounded border border-white/5">
                                <p className="text-[10px] italic text-white/60">"Finalizing v4.0 synthesis..."</p>
                            </div>
                            <div className="absolute inset-0 bg-gold opacity-0 group-active:opacity-10 transition-opacity"></div>
                        </button>
                        
                        <div className="glass p-6 rounded-2xl opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl">🛡️</span>
                                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            </div>
                            <h3 className="cinzel text-white/40 text-lg tracking-widest">SAM [SENTINEL]</h3>
                            <p className="text-[9px] mono text-white/20">STATUS: STANDBY</p>
                        </div>
                    </div>

                    {/* Intel Stream Proof */}
                    <div className="col-span-8">
                        <div className="glass h-[600px] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                            <div className="bg-[var(--gold)]/10 px-4 py-2 border-b border-[var(--gold)]/20 flex justify-between items-center">
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setActiveTab('INTEL')}
                                        className={`text-[9px] font-bold mono tracking-[0.2em] px-3 py-1 rounded transition-colors ${activeTab === 'INTEL' ? 'bg-gold/20 text-gold border border-gold/40' : 'text-white/40 hover:text-white/60'}`}
                                    >
                                        INTEL_STREAM
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('TRACE')}
                                        className={`text-[9px] font-bold mono tracking-[0.2em] px-3 py-1 rounded transition-colors ${activeTab === 'TRACE' ? 'bg-cyan/20 text-cyan border border-cyan/40 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'text-white/40 hover:text-white/60'}`}
                                    >
                                        NEURAL_TRACE_V4
                                    </button>
                                </div>
                                <span className="text-[9px] mono text-white/20 uppercase">SECURE_UPLINK // SH-1000</span>
                            </div>

                            {activeTab === 'INTEL' ? (
                                <div className="flex-1 p-6 mono text-[11px] space-y-3 overflow-y-auto opacity-80 scrollbar-hide">
                                    {messages.map((msg, i) => (
                                        <p key={i}>
                                            <span className="text-[var(--gold)]">{msg.timestamp}</span>{' '}
                                            <span className={msg.color && !msg.color.startsWith('var') && !msg.color.startsWith('#') ? msg.color : ''} style={msg.color && (msg.color.startsWith('var') || msg.color.startsWith('#')) ? { color: msg.color } : {}}>
                                                {msg.source}:
                                            </span>{' '}
                                            {msg.content}
                                        </p>
                                    ))}
                                    <div className="animate-pulse inline-block w-2 h-4 bg-[var(--cyan)]"></div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-hidden p-2">
                                    <SentinelTrace />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
