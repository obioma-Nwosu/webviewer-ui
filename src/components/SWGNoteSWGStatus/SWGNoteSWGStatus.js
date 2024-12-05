import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import DataElementWrapper from 'components/DataElementWrapper';

import './SWGNoteSWGStatus.scss';

// Define status and type constants for better maintainability
const STATUS = {
  CLARIFICATION: 'clarification',
  MODIFICATION: 'modification',
  REVISION: 'revision',
  NONE: 'none',
  OPEN: 1,
  WORKED: 2,
  CLOSED: 3,
  IRRELEVANT: 9,
  CREATED: 'created',
  REJECTED: 'rejected',
  WORKED_AS_STRING: 'worked',
};

// Define user roles and their specific configurations
const USER_ROLES = [
  { role: 'swgNoteSWGStatusUserRole2', id: 2 },
  { role: 'swgNoteSWGStatusUserRole3', id: 3 },
  { role: 'swgNoteSWGStatusUserRole4', id: 4 },
  { role: 'swgNoteSWGStatusUserRole5', id: 5 },
];

const propTypes = {
  annotationSWGType: PropTypes.string.isRequired,
  annotationSWGNumber: PropTypes.string.isRequired,
  annotationSWGStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  annotationId: PropTypes.string.isRequired,
  annotationSWGdocumentName: PropTypes.string,
  handleStatusChange: PropTypes.func,
  handleModificationTypeChange: PropTypes.func,
};

function SWGNoteSWGStatus({
                            annotationSWGType,
                            annotationSWGNumber,
                            annotationSWGStatus,
                            annotationId,
                            handleStatusChange,
                            handleModificationTypeChange,
                          }) {
  const { t } = useTranslation();

  // Handler for status changes
  const handleStatusChangeClick = (e, status, type) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling if necessary
    if (handleStatusChange) {
      handleStatusChange(status, type);
    }
  };

  // Handler for modification type changes
  const handleModificationTypeClick = (e, modifyType) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling if necessary
    if (handleModificationTypeChange) {
      handleModificationTypeChange(annotationId, modifyType);
    }
  };

  if (!annotationSWGStatus) {
    return null;
  }

  // Helper function to clarification render buttons
  const renderClarificationButtonsRole2 = (status) => {
    let buttonLabel;

    // Set the button label based on the status
    switch (status) {
      case STATUS.OPEN:
        buttonLabel = `${t('swg.action.clarification')} / ${annotationSWGNumber} ${t('swg.action.clarificationShow')}`;
        break;
      case STATUS.WORKED:
      case STATUS.NONE:
      case STATUS.WORKED_AS_STRING:
      case STATUS.CLOSED:
      case STATUS.IRRELEVANT:
        buttonLabel = `${t('swg.action.clarification')} ${annotationSWGNumber} ${t('swg.action.clarificationShow')}`;
        break;
    }

    if (status === STATUS.OPEN || status === STATUS.WORKED) {
    return (
      <div>
        <div className="swg-status-buttons">
          <button
            title="Klärung zur Änderungsmitteilung"
            className="swg-status-agree-button"
            onClick={(e) => {
              handleStatusChangeClick(e, STATUS.WORKED, STATUS.CLARIFICATION);
              handleModificationTypeClick(e, 'clarify-work');
            }}
          >
            {t('swg.action.agree')}
          </button>

          <button
            title="Klärung abschließen"
            className="swg-status-disagree-button"
            onClick={(e) => {
              handleStatusChangeClick(e, STATUS.CLOSED, STATUS.CLARIFICATION);
              handleModificationTypeClick(e, 'clarify-reject');
            }}
          >
            {t('swg.action.close')}
          </button>

          <div className="break"></div>

          <button
            title="Klärung zur Revision"
            className="swg-status-change-type-button"
            onClick={(e) => {
              handleModificationTypeClick(e, 'clarify-to-revision');
            }}
          >
            {t('swg.action.clarifyToRevision')}
          </button>

          <button
            title="Klärung anzeigen"
            type="button"
            className="swg-status-clarification-button"
            id={`clarify_${annotationId}`}
            onClick={(e) => {
              handleModificationTypeClick(e, 'clarify-show');
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    );

    } else if (status === STATUS.WORKED_AS_STRING) {
      return (
        <div>
          <div className="swg-status-buttons">
            <button
              title="Klärung zur Änderungsmitteilung"
              className="swg-status-agree-button"
              onClick={(e) => {
                handleStatusChangeClick(e, STATUS.WORKED, STATUS.CLARIFICATION);
                handleModificationTypeClick(e, 'clarify-work');
              }}
            >
              {t('swg.action.agree')}
            </button>

            <button
              title="Klärung abschließen"
              className="swg-status-disagree-button"
              onClick={(e) => {
                handleStatusChangeClick(e, STATUS.CLOSED, STATUS.CLARIFICATION);
                handleModificationTypeClick(e, 'clarify-reject');
              }}
            >
              {t('swg.action.close')}
            </button>
            <div className="break"></div>
            <button
              title="Klärung anzeigen"
              type="button"
              className="swg-status-clarification-button"
              id={`clarify_${annotationId}`}
              onClick={(e) => {
                handleModificationTypeClick(e, 'clarify-show');
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      );
    } else if (status === STATUS.NONE) {
      return (
        <div>
          <div className="swg-status-buttons">
            <button
              title="Klärung zur Änderungsmitteilung"
              className="swg-status-agree-button"
              onClick={(e) => {
                handleStatusChangeClick(e, STATUS.WORKED, STATUS.CLARIFICATION);
                handleModificationTypeClick(e, 'clarify-work');
              }}
            >
              {t('swg.action.agree')}
            </button>

            <button
              title="Klärung abschließen"
              className="swg-status-disagree-button"
              onClick={(e) => {
                handleStatusChangeClick(e, STATUS.CLOSED, STATUS.CLARIFICATION);
                handleModificationTypeClick(e, 'clarify-reject');
              }}
            >
              {t('swg.action.close')}
            </button>

            <button
              title="Klärung anzeigen"
              type="button"
              className="swg-status-clarification-button"
              id={`clarify_${annotationId}`}
              onClick={(e) => {
                handleModificationTypeClick(e, 'clarify-show');
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      );
    }else if (status === STATUS.CLOSED) {
      return (
          <div className="swg-status-buttons">
            <button
              type="button"
              className="swg-status-clarification-button"
              id={`clarify_${annotationId}`}
              onClick={(e) => {
                handleModificationTypeClick(e, 'clarify-show');
              }}
            >
              {buttonLabel}
            </button>
          </div>
      );
    }else if (status === STATUS.IRRELEVANT) {
      return (
          <div className="swg-status-buttons">
            <button
              type="button"
              className="swg-status-clarification-button"
              id={`clarify_${annotationId}`}
              onClick={(e) => {
                handleModificationTypeClick(e, 'clarify-show');
              }}
            >
              {buttonLabel}
            </button>
          </div>
      );
    }
  };

  const renderRevisionButtonsRole2 = (status) => {

    if (status === STATUS.NONE) {
      return (
          <div className="swg-status-buttons">
            <button
              title="Revision erstellen"
              className="swg-status-disagree-button"
              onClick={(e) => {
                handleStatusChangeClick(e, STATUS.REJECTED, STATUS.REVISION);
              }}
            >
              {t('swg.action.disagree')}
            </button>
          </div>
      );
    }
  };

  const renderModificationButtonsRole2 = (status) => {
    if (status === STATUS.NONE) {
      return (
        <div className="swg-status-buttons">
          <button
            type="button"
            className="swg-status-modification-button"
            onClick={(e) => {
              handleModificationTypeClick(e, 'modify-create');
            }}
          >
            `${t('swg.action.modification')} / Nr.`
          </button>
        </div>
      );
    } else if (status === STATUS.OPEN || status === STATUS.CREATED ||
      status === STATUS.WORKED || status === STATUS.CLOSED || status === STATUS.IRRELEVANT) {
      return (
        <div className="swg-status-buttons">
          <button
            type="button"
            className="swg-status-modification-button"
            id={ `modify_show_${annotationId}` }
            onClick={(e) => {
              handleModificationTypeClick(e, 'modify-show');
            }}
          >
            `${t('swg.action.modification')} / ${annotationSWGNumber}`
          </button>
        </div>
      );
    }
  };

  const renderClarificationButtonsRole3 = (status) => {
    const label = `${t('swg.action.clarification')} / ${annotationSWGNumber}`;
    if (status === STATUS.CREATED || status === STATUS.NONE || status === STATUS.OPEN ||
      status === STATUS.WORKED || status === STATUS.REJECTED || status === STATUS.CLOSED ||
      status === STATUS.IRRELEVANT) {
      return (
        <div className="swg-status-buttons">
          <button
            title='Klärung anzeigen'
            type="button"
            className="swg-status-clarification-button"
            id={`clarify_${annotationId}`}
            onClick={(e) => {
              handleModificationTypeClick(e, 'clarify-show');
            }}
          >
            {label}
          </button>
        </div>
      );
    }
  };

  const renderRevisionButtonsRole3 = (status) => {
    if (status === STATUS.NONE) {
      return (
        <div className="swg-status-buttons">
        </div>
      );
    }
  };

  const renderModificationButtonsRole3 = (status) => {
    const label = `${t('swg.action.modification')} / ${annotationSWGNumber}`;
    if (status === STATUS.CREATED || status === STATUS.OPEN || status === STATUS.WORKED || status === STATUS.CLOSED
      || status === STATUS.IRRELEVANT) {
      return (
        <div className="swg-status-buttons">
          <button
            title='Änderungsmitteilung anzeigen'
            type="button"
            id={ `modify_show_${annotationId}` }
            className="swg-status-modification-button"
            onClick={(e) => {
              handleModificationTypeClick(e, 'modify-show');
            }}
          >
            {label}
          </button>
        </div>
      );
    }
  };

  const renderModificationButtonsRole5 = (status) => {
    const label = `${t('swg.action.modification')} / ${annotationSWGNumber}`;
    let title = '';
    switch (status) {
      case STATUS.CREATED:
        title = 'Änderungsmitteilung erstellen';
        break;
      case STATUS.OPEN:
      case STATUS.WORKED:
      case STATUS.IRRELEVANT:
      case STATUS.CLOSED:
        title = 'Änderungsmitteilung anzeigen';
        break;
    }
    if (status === STATUS.CREATED || status === STATUS.OPEN || status === STATUS.WORKED || status === STATUS.CLOSED
      || status === STATUS.IRRELEVANT) {
      return (
        <div className="swg-status-buttons">
          <button
            title={title}
            type="button"
            id={ `modify_show_${annotationId}` }
            className="swg-status-modification-button"
            onClick={(e) => {
              handleModificationTypeClick(e, 'modify-show');
            }}
          >
            {label}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="swgNoteSWGStatusContent">
      {/* UserRole2 */}
      <DataElementWrapper
        className="SWGNoteSWGStatus"
        dataElement="swgNoteSWGStatusUserRole2"
      >
        {/* Clarification */}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.OPEN && renderClarificationButtonsRole2(1)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.WORKED && renderClarificationButtonsRole2(2)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.NONE && renderClarificationButtonsRole2('none')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.WORKED_AS_STRING && renderClarificationButtonsRole2('worked')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CLOSED && renderClarificationButtonsRole2(3)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderClarificationButtonsRole2(9)}

        {/* Revision*/}
        {annotationSWGType === STATUS.REVISION && annotationSWGStatus === STATUS.NONE && renderRevisionButtonsRole2('none')}

        {/* Modification */}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.NONE && renderModificationButtonsRole2('none')}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.OPEN && renderModificationButtonsRole2(1)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CREATED && renderModificationButtonsRole2('created')}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.WORKED && renderModificationButtonsRole2(2)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CLOSED && renderModificationButtonsRole2(3)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderModificationButtonsRole2(9)}

      </DataElementWrapper>

      {/* UserRole3 */}
      <DataElementWrapper
        className="SWGNoteSWGStatus"
        dataElement="swgNoteSWGStatusUserRole3"
      >
        {/* Clarification */}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CREATED && renderClarificationButtonsRole3('created')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.NONE && renderClarificationButtonsRole3('none')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.OPEN && renderClarificationButtonsRole3(1)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.WORKED && renderClarificationButtonsRole3(2)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.REJECTED && renderClarificationButtonsRole3('rejected')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CLOSED && renderClarificationButtonsRole3(3)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderClarificationButtonsRole3(9)}

        {/* Revision */}
        {annotationSWGType === STATUS.REVISION && annotationSWGStatus === STATUS.NONE && renderRevisionButtonsRole3('none')}

        {/* Modification */}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CREATED && renderModificationButtonsRole3('created')}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.OPEN && renderModificationButtonsRole3(1)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.WORKED && renderModificationButtonsRole3(2)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CLOSED && renderModificationButtonsRole3(3)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderModificationButtonsRole3(9)}
      </DataElementWrapper>

      {/* UserRole4 */}
      <DataElementWrapper
        className="SWGNoteSWGStatus"
        dataElement="swgNoteSWGStatusUserRole4"
      >
        {/* Clarification */}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CREATED && renderClarificationButtonsRole3('created')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.NONE && renderClarificationButtonsRole3('none')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.OPEN && renderClarificationButtonsRole3(1)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.WORKED && renderClarificationButtonsRole3(2)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.REJECTED && renderClarificationButtonsRole3('rejected')}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CLOSED && renderClarificationButtonsRole3(3)}
        {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderClarificationButtonsRole3(9)}

        {/* Revision*/}
        {annotationSWGType === STATUS.REVISION && annotationSWGStatus === STATUS.NONE && (
          <div className="swg-status-buttons">
          </div>
        )}

        {/* Modification */}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CREATED && renderModificationButtonsRole3('created')}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.OPEN && renderModificationButtonsRole3(1)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.WORKED && renderModificationButtonsRole3(2)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CLOSED && renderModificationButtonsRole3(3)}
        {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderModificationButtonsRole3(9)}
      </DataElementWrapper>

      {/* UserRole5 */}
      <DataElementWrapper
        className="SWGNoteSWGStatus"
        dataElement="swgNoteSWGStatusUserRole5">
      {/* Clarification */}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CREATED && renderClarificationButtonsRole3('created')}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.NONE && renderClarificationButtonsRole3('none')}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.OPEN && renderClarificationButtonsRole3(1)}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.WORKED && renderClarificationButtonsRole3(2)}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.REJECTED && renderClarificationButtonsRole3('rejected')}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.CLOSED && renderClarificationButtonsRole3(3)}
      {annotationSWGType === STATUS.CLARIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderClarificationButtonsRole3(9)}

      {/* Revision*/}
      {annotationSWGType === STATUS.REVISION && annotationSWGStatus === STATUS.NONE && (
        <div className="swg-status-buttons">
        </div>
      )}

      {/* Modification */}
      {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CREATED && renderModificationButtonsRole5('created')}
      {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.OPEN && renderModificationButtonsRole5(1)}
      {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.WORKED && renderModificationButtonsRole5(2)}
      {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.CLOSED && renderModificationButtonsRole5(3)}
      {annotationSWGType === STATUS.MODIFICATION && annotationSWGStatus === STATUS.IRRELEVANT && renderModificationButtonsRole5(9)}
      </DataElementWrapper>
    </div>
  );
}

SWGNoteSWGStatus.propTypes = propTypes;

export default SWGNoteSWGStatus;
