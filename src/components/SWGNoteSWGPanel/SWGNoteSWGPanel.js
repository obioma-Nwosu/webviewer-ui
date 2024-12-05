import React from 'react';
import PropTypes from 'prop-types';

import './SWGNoteSWGPanel.scss';

const SWGNoteSWGPanel = React.memo(function SWGNoteSWGPanel({ annotation }) {
  const swgPanel = annotation.getCustomData('SWGpanel');

  return (
    <div className="author-and-panel">
      {swgPanel}
    </div>
  );
});

SWGNoteSWGPanel.propTypes = {
  annotation: PropTypes.shape({
    getCustomData: PropTypes.func.isRequired,
  }).isRequired,
};

export default SWGNoteSWGPanel;
