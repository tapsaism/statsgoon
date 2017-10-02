import React from 'react';
import ReactDOM from 'react-dom';
import Statsgoon from './Statsgoon';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Statsgoon />, document.getElementById('root'));
registerServiceWorker();
