import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'primereact/resources/themes/luna-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './lib/primeflex.css'; 


ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
