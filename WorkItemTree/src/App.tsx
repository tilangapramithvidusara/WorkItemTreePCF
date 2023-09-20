import React from 'react';
import { Trans, useTranslation } from "react-i18next";

import "./utils/i18n";
import TreeViewComponent from './components/TreeViewComponent';

interface MyComponentProps {
  imageUrl: any;
}
const  App: React.FC<MyComponentProps> = ({ imageUrl }) => {
  useTranslation(); // Configures i18n over the entire app
  return (
    <div>
      {/* <p>Work Items Tree</p> */}
      <TreeViewComponent imageUrl={imageUrl} />
    </div>
  )
}

export default App;
