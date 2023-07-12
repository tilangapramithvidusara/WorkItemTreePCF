import React from 'react';
import TreeViewComponent from './components/TreeViewComponent';

export default function App({ imageUrl }: {imageUrl: any}) {
  return (
    <div>
      {/* <p>Work Items Tree</p> */}
      <TreeViewComponent imageUrl={imageUrl} />
    </div>
  )
}
