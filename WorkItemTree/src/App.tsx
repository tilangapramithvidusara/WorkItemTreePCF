import React from 'react';
import TreeViewComponent from './components/TreeViewComponent';

interface MyComponentProps {
  imageUrl: any;
}
const  App: React.FC<MyComponentProps> = ({ imageUrl }) => {
  return (
    <div>
      {/* <p>Work Items Tree</p> */}
      <TreeViewComponent imageUrl={imageUrl} />
    </div>
  )
}

export default App;
