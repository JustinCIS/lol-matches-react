import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MatchHistory from './MatchHistory';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MatchHistory />, div);
  ReactDOM.unmountComponentAtNode(div);
});
