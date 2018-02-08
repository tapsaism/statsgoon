import React from 'react';
import ReactDOM from 'react-dom';
import Statsgoon from './Statsgoon';
import registerServiceWorker from './registerServiceWorker';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

//Amplify.configure(aws_exports)

ReactDOM.render(<Statsgoon />, document.getElementById('root'));
registerServiceWorker();
