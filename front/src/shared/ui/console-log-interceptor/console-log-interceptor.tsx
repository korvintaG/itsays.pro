import React, { useState, useRef, useEffect } from 'react';

export const ConsoleLogInterceptor: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLTextAreaElement>(null);

  // Override console.log to capture logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args: any[]) => {
      originalLog(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setLogs(prev => {
        const newLogs = [...prev, `[LOG] ${new Date().toLocaleTimeString()}: ${logMessage}`];
        // Keep only last 50 logs
        return newLogs.slice(-50);
      });
    };
    
    console.error = (...args: any[]) => {
      originalError(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setLogs(prev => {
        const newLogs = [...prev, `[ERROR] ${new Date().toLocaleTimeString()}: ${logMessage}`];
        return newLogs.slice(-50);
      });
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3>Логи отладки:</h3>
        <button 
          onClick={clearLogs}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#f5f5f5',
            cursor: 'pointer'
          }}
        >
          Очистить
        </button>
      </div>
      <textarea
        ref={logsRef}
        readOnly
        value={logs.join('\n')}
        style={{
          width: '100%',
          minHeight: '200px',
          maxHeight: '400px',
          padding: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          background: '#1e1e1e',
          color: '#d4d4d4',
          border: '1px solid #333',
          borderRadius: '4px',
          resize: 'vertical',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

