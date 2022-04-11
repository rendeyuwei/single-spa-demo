import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import singleSpaReact from 'single-spa-react';

// 子应用独立运行
if(!window.singleSpaNavigate) {
  ReactDOM.render(<App />, document.getElementById('root'));
}

// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );

const reactLifeCycle = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err, info, props) {
    return (
      <div>error occurs</div>
    )
  }
})

export const bootstrap = async props => {
  return reactLifeCycle.bootstrap(props);
}
export const mount = async props => {
  return reactLifeCycle.mount(props);
}
export const unmount = async props => {
  return reactLifeCycle.unmount(props);
}
