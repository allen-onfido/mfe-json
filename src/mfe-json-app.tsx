import { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

import './mfe-json-app.css';

function MfeJsonApp() {
  const [value, setValue] = useState('{"a": 123}');

  /* Send message to host app that the mfe is ready to accept values*/
  const sendReadyMessage = useCallback(() => {
    window?.parent.postMessage({ type: 'mfe.ready', payload: { style: { height: '640px' } } }, '*');
  }, []);
  useEffect(sendReadyMessage, [sendReadyMessage]);

  /* handle messages sent from the host */
  useEffect(() => {
    const handleMessage = (msg: MessageEvent) => {
      const { data: action } = msg;

      if (action.type === 'host.setState') {
        const { payload } = action;
        const stringValue = JSON.stringify(payload.value, null, 2);

        if (value !== stringValue) {
          setValue(stringValue || '{}');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [value, setValue]);

  return (
    <div className="app">
      <CodeMirror value={value} height="640px" extensions={[json()]} theme="dark" width="100%" />
    </div>
  );
}

export default MfeJsonApp;
