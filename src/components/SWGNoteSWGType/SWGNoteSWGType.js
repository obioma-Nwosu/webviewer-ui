import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';

import './SWGNoteSWGType.scss';

const propTypes = {
  annotationSWGType: PropTypes.string,
  annotationSWGStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  annotationId: PropTypes.string.isRequired,
  openOnInitialLoad: PropTypes.bool,
  handleStatusChange: PropTypes.func,
  handleModificationTypeChange: PropTypes.func,
};

const USER_ROLES = [
  { role: 3, dataElement: 'swgNoteSWGTypeUserRole3' },
  { role: 4, dataElement: 'swgNoteSWGTypeUserRole4' },
  { role: 5, dataElement: 'swgNoteSWGTypeUserRole5' },
  { role: 2, dataElement: 'swgNoteSWGTypeUserRole2' },
  { role: 1, dataElement: 'swgNoteSWGTypeUserRole1' },
];

const SWGNoteSWGType = ({
                          annotationSWGType,
                          annotationSWGStatus,
                          annotationId,
                          openOnInitialLoad = false,
                          handleStatusChange,
                          handleModificationTypeChange,
                        }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(openOnInitialLoad);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => setIsOpen(false));

  const togglePopup = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const onTypeOptionsButtonClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const createOnTypeOptionButtonClickHandler = useCallback(
    (modifyId, status, type, action) => () => {
      if (handleStatusChange && action !== 'clarify-create') {
        handleStatusChange(status, type);
      }
      if (handleModificationTypeChange) {
        handleModificationTypeChange(modifyId, action);
      }
    },
    [handleStatusChange, handleModificationTypeChange]
  );

  if (!annotationSWGType) {
    return null;
  }

  const selectedType = `swg.option.type.${annotationSWGType}`;
  const isAnnotationNC = annotationSWGType === 'modification';

  // Helper function to determine the correct icon
  const getIcon = () => {
    if (annotationSWGStatus === 'rejected') {
      return <Icon glyph="icon-annotation-status-cancelled" />;
    }
    if (!isAnnotationNC && annotationSWGStatus === 3) {
      return <Icon glyph="icon-annotation-status-cancelled" />;
    }
    if (isAnnotationNC && annotationSWGStatus === 3) {
      return <Icon glyph="icon-annotation-status-completed" />;
    }
    if (!isAnnotationNC && ['worked', 2].includes(annotationSWGStatus)) {
      return <Icon glyph="icon-annotation-status-edit" />;
    }
    if (annotationSWGStatus === 9) {
      return <Icon glyph="icon-close" />;
    }
    return null;
  };

  // Render options based on annotationSWGType
  const renderOptions = () => (
    <button
      ref={popupRef}
      className="note-type-options"
      onClick={onTypeOptionsButtonClick}
    >
      <DataElementWrapper dataElement="notePopupType">
        {annotationSWGType !== 'revision' && (
          <DataElementWrapper
            dataElement="notePopupTypeRevision"
            className="note-type-option"
            onClick={createOnTypeOptionButtonClickHandler(
              annotationId,
              'none',
              'revision',
              'revision-create'
            )}
          >
            {t('swg.option.type.revision')}
          </DataElementWrapper>
        )}
        {annotationSWGType !== 'clarification' && (
          <DataElementWrapper
            dataElement="notePopupTypeClarification"
            className="note-type-option"
            onClick={createOnTypeOptionButtonClickHandler(
              annotationId,
              'none',
              'clarification',
              'clarify-create'
            )}
          >
            {t('swg.option.type.clarification')}
          </DataElementWrapper>
        )}
        {annotationSWGType !== 'modification' && (
          <DataElementWrapper
            dataElement="notePopupTypeModification"
            className="note-type-option"
            onClick={createOnTypeOptionButtonClickHandler(
              annotationId,
              'none',
              'modification',
              'modify-create'
            )}
          >
            {t('swg.option.type.modification')}
          </DataElementWrapper>
        )}
      </DataElementWrapper>
    </button>
  );

  return (
    <div className="swgNoteSWGTypeContent">
      {USER_ROLES.map(({ role, dataElement }) => (
        <DataElementWrapper
          key={role}
          className="SWGNoteSWGType"
          dataElement={dataElement}
          onClick={togglePopup}
        >
          <div className="overflow">
            {getIcon()}
            {t(selectedType)}
          </div>
          {isOpen &&
            annotationSWGType !== 'modification' &&
            annotationSWGStatus !== 'rejected' &&
            (role === 1 ? renderOptions() : null)}
          {isOpen &&
            annotationSWGType !== 'modification' &&
            annotationSWGStatus !== 'rejected' &&
            ['3', '4', '5'].includes(String(role)) && (
              <button
                ref={popupRef}
                className="note-type-options"
                onClick={onTypeOptionsButtonClick}
              >
                <DataElementWrapper dataElement="notePopupType">
                  {annotationSWGType !== 'clarification' && (
                    <DataElementWrapper
                      dataElement="notePopupTypeClarification"
                      className="note-type-option"
                      onClick={createOnTypeOptionButtonClickHandler(
                        annotationId,
                        'none',
                        'clarification',
                        'clarify-create'
                      )}
                    >
                      {t('swg.option.type.clarification')}
                    </DataElementWrapper>
                  )}
                </DataElementWrapper>
              </button>
            )}
        </DataElementWrapper>
      ))}
    </div>
  );
};

SWGNoteSWGType.propTypes = propTypes;

export default SWGNoteSWGType;
