import React, { useState, useRef, useEffect } from 'react';

export default function AntigravityTerminal() {
  const [stream, setStream] = useState([
    {
      type: 'telemetry',
      text: '[+] REALTIME TELEMETRY: Node #07 orbital sync nominal. Memory delta: -0.04%',
      time: '09:14:03',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setStream([]);
      setInputValue('');
      return;
    }

    const time = new Date().toISOString().substring(11, 19);
    let output = '';

    switch (trimmed) {
      case 'status':
        output = `[${time}] STATUS: All 128 orbital nodes synchronized. Mean latency: 0.94ms. Zero-G gravity compensators 100% active.`;
        break;
      case 'tensor':
      case '--tensor-check':
        output = `[${time}] TENSOR: PyTorch 2.6 CUDA/ROCm memory allocated: 12.4GB / 32GB. Quantization: 4-bit INT active. Inference ready.`;
        break;
      case 'ping':
      case '--ping-nodes':
        output = `[${time}] PING: geo-orbit-alpha: 0.12ms | leo-gateway-04: 0.44ms | earth-relay-delhi: 3.82ms. 0% packet loss.`;
        break;
      case 'projects':
        output = `[${time}] FLAGSHIP SYSTEMS:\n  • 01: AETHER-PY (Distributed Asynchronous Physics & Vector Engine)\n  • 02: CHRONOS HUD (3D Autonomous AI Agent Command Center)\n  • 03: NEURO-GRAVITY (Quantum-Resistant Neural API Gateway)`;
        break;
      case 'skills':
        output = `[${time}] CORE STACK: Python 3.14t (No-GIL), Django 5, FastAPI, LangGraph, PyTorch 2.6, WebGPU/Three.js, React 19, Milvus, Redis, Docker, K8s.`;
        break;
      case 'contact':
        output = `[${time}] DIRECT TRANSMISSION: suryakiranpjineesh@gmail.com | Location: 28.6139 N, 77.2090 E | Domain: www.suryakiranpj.com`;
        break;
      case 'help':
        output = `[${time}] AVAILABLE COMMANDS: status, tensor, ping, projects, skills, contact, clear, help`;
        break;
      default:
        output = `[${time}] COMMAND_UNKNOWN: '${trimmed}'. Available: status, tensor, ping, projects, skills, contact, clear, help`;
    }

    setStream((prev) => [
      ...prev,
      {
        type: 'command',
        cmd: trimmed,
        output,
        time,
      },
    ]);

    setInputValue('');
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [stream]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(inputValue);
    }
  };

  return (
    <section id="terminal-section" className="position-relative w-100 py-5" style={{ background: '#0e0e12' }}>
      <div className="container-fluid" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 font-label-hud mb-2" style={{ color: '#00f0ff' }}>
              <span>// SECTION 04</span>
              <span>•</span>
              <span style={{ letterSpacing: '0.14em' }}>CLI RUNTIME SIMULATOR</span>
            </div>
            <h2 className="font-headline-lg text-uppercase text-light m-0">
              Python <span style={{ color: '#00f0ff' }}>Antigravity Console</span>
            </h2>
          </div>
          <div className="d-flex align-items-center gap-2 font-label-hud text-secondary">
            <span
              className="rounded-circle animate-ag-pulse"
              style={{ width: '8px', height: '8px', backgroundColor: '#65f2b5', display: 'inline-block' }}
            ></span>
            <span style={{ color: '#65f2b5', fontWeight: 600 }}>SOCKET CONNECTED:</span>
            <span>/dev/ttyS0.orbital</span>
          </div>
        </div>

        {/* Holographic CLI Console Window */}
        <div className="terminal-window">
          
          {/* Console Window Top Bar */}
          <div className="terminal-header">
            <div className="d-flex align-items-center gap-2">
              <span className="terminal-dot" style={{ backgroundColor: '#ff5f56' }}></span>
              <span className="terminal-dot" style={{ backgroundColor: '#ffbd2e' }}></span>
              <span className="terminal-dot" style={{ backgroundColor: '#27c93f' }}></span>
              <span className="font-label-hud text-secondary ms-2" style={{ fontSize: '11px' }}>
                zsh — suryakiran@orbital-node-2027:~
              </span>
            </div>
            <div className="d-flex align-items-center gap-3 font-label-hud text-secondary">
              <span className="d-none d-sm-inline">PYTHON 3.14.0t (main, Oct 24 2027)</span>
              <span style={{ color: '#00f0ff', fontWeight: 600 }}>NO-GIL ACTIVE</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalBodyRef}
            className="terminal-body"
            onClick={() => inputRef.current?.focus()}
          >
            {/* System Boot Sequence */}
            <div className="text-muted mb-1">
              [2027-10-24 09:14:02 UTC] SYSTEM INITIALIZATION • ARCH: AARCH64_ORBITAL
            </div>
            <div className="text-muted mb-3">
              Loading tensor weights: [====================] 100% (4.2GB in 0.08s)
            </div>

            <div className="mb-1" style={{ color: '#00f0ff' }}>
              <span style={{ color: '#65f2b5', fontWeight: 600 }}>&gt; import</span>{' '}
              <span style={{ color: '#7df4ff' }}>antigravity</span>
            </div>
            <div className="text-secondary ps-3 mb-3" style={{ fontSize: '12px' }}>
              • AntiGravity module loaded via C-Extension wrapper.<br />
              • Earth Gravitational Constant adjusted: 9.80665 m/s² → <span style={{ color: '#00f0ff' }}>0.00000 m/s²</span>.<br />
              • Vector field mesh deployed: [32, 32, 32] tensors stabilized.
            </div>

            <div className="mb-1" style={{ color: '#00f0ff' }}>
              <span style={{ color: '#65f2b5', fontWeight: 600 }}>&gt; python3</span>{' '}
              <span style={{ color: '#7df4ff' }}>cluster_telemetry.py</span>{' '}
              <span className="text-secondary">--mode=autonomous --target=leo_alpha</span>
            </div>
            <div className="ps-3 mb-3" style={{ color: '#d0bcff', fontSize: '12px' }}>
              [+] Initiating asynchronous FastAPI swarm (16 workers)...<br />
              [+] Connecting to Milvus High-Dim cluster: ping 0.42ms.<br />
              [+] Model status: LangGraph Agent Router ONLINE.<br />
              [+] System throughput: 2,410,290 requests/sec. Latency: 1.2ms.
            </div>

            {/* Dynamic Output Stream */}
            {stream.map((item, i) => (
              <div key={i} className="mb-2">
                {item.type === 'telemetry' ? (
                  <div className="ps-3" style={{ color: '#65f2b5' }}>
                    {item.text}
                  </div>
                ) : (
                  <div className="ps-2">
                    <div style={{ color: '#7df4ff' }}>&gt; {item.cmd}</div>
                    <div className="text-secondary whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }}>
                      {item.output}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Interactive CLI Input Line */}
            <div className="d-flex align-items-center gap-2 mt-3" style={{ color: '#00f0ff' }}>
              <span style={{ color: '#65f2b5', fontWeight: 700 }}>suryakiran@orbital:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type 'status', 'tensor', 'ping', 'projects', or 'clear'..."
                autoComplete="off"
                spellCheck="false"
                className="bg-transparent border-0 outline-none text-light flex-grow-1 font-code-terminal"
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  color: '#7df4ff',
                  caretColor: '#00f0ff',
                }}
              />
              <span className="terminal-cursor"></span>
            </div>
          </div>

          {/* Terminal Quick Action Preset Triggers */}
          <div
            className="px-3 py-2 d-flex flex-wrap align-items-center justify-content-between gap-2 font-label-hud"
            style={{ background: '#131317', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary">QUICK PRESETS:</span>
              <button
                type="button"
                onClick={() => runCommand('status')}
                className="btn btn-sm py-0 px-2 font-label-hud border-0 text-light"
                style={{ background: '#1f1f24' }}
              >
                [ --status ]
              </button>
              <button
                type="button"
                onClick={() => runCommand('tensor')}
                className="btn btn-sm py-0 px-2 font-label-hud border-0 text-light"
                style={{ background: '#1f1f24' }}
              >
                [ --tensor-check ]
              </button>
              <button
                type="button"
                onClick={() => runCommand('ping')}
                className="btn btn-sm py-0 px-2 font-label-hud border-0 text-light"
                style={{ background: '#1f1f24' }}
              >
                [ --ping-nodes ]
              </button>
              <button
                type="button"
                onClick={() => runCommand('clear')}
                className="btn btn-sm py-0 px-2 font-label-hud border-0 text-secondary"
                style={{ background: '#1f1f24' }}
              >
                [ clear ]
              </button>
            </div>
            <span style={{ color: '#7df4ff' }}>SESSION ENCRYPTED // CURVE25519</span>
          </div>

        </div>

      </div>
    </section>
  );
}
