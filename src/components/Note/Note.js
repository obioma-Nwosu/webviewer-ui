import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';
import ReplyArea from 'components/Note/ReplyArea';
import NoteGroupSection from 'components/Note/NoteGroupSection';
import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import AnnotationNoteConnectorLine from 'components/AnnotationNoteConnectorLine';
import useDidUpdate from 'hooks/useDidUpdate';
import DataElements from 'constants/dataElement';
import getRootNode from 'helpers/getRootNode';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import { OfficeEditorEditMode, OFFICE_EDITOR_TRACKED_CHANGE_KEY } from 'constants/officeEditor';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  isMultiSelected: PropTypes.bool,
  isMultiSelectMode: PropTypes.bool,
  isInNotesPanel: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
};

let currId = 0;

const Note = ({
                annotation,
                isMultiSelected,
                isMultiSelectMode,
                isInNotesPanel,
                handleMultiSelect,
                isCustomPanelOpen,
                shouldHideConnectorLine,
              }) => {
  const {
    isSelected,
    resize,
    pendingEditTextMap,
    isContentEditable,
    isDocumentReadOnly,
    isExpandedFromSearch,
    setCurAnnotId,
  } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();
  const [isEditingMap, setIsEditingMap] = useState({});
  const ids = useRef([]);
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const unreadReplyIdSet = new Set();

  const [
    noteTransformFunction,
    customNoteSelectionFunction,
    unreadAnnotationIdSet,
    shouldExpandCommentThread,
    isRightClickAnnotationPopupEnabled,
    documentViewerKey,
    isOfficeEditorMode,
    officeEditorEditMode,
  ] = useSelector(
    (state) => [
      selectors.getNoteTransformFunction(state),
      selectors.getCustomNoteSelectionFunction(state),
      selectors.getUnreadAnnotationIdSet(state),
      selectors.isCommentThreadExpansionEnabled(state),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.getActiveDocumentViewerKey(state),
      selectors.getIsOfficeEditorMode(state),
      selectors.getOfficeEditorEditMode(state),
    ],
    shallowEqual,
  );

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  replies.filter((r) => unreadAnnotationIdSet.has(r.Id)).forEach((r) => unreadReplyIdSet.add(r.Id));

  // Custom logic addition begins here
  let isAnnotationKLorAM = annotation.getCustomData("SWGtype") === "changeNotification" ? true : annotation.getCustomData("SWGtype") === "clarification";
  let swgStatusOpen = isAnnotationKLorAM ? annotation.getCustomData("SWGstatus") === 1 ? "swg-status-open" : "" : "";
  let swgStatusWorked = isAnnotationKLorAM ? annotation.getCustomData("SWGstatus") === 2 ? "swg-status-worked" : "" : "";
  let swgStatusDone = isAnnotationKLorAM ? annotation.getCustomData("SWGstatus") === 3 ? "swg-status-done" : "" : "";
  // Custom logic addition ends here

  useEffect(() => {
    const annotationChangedListener = (annotations, action) => {
      if (action === 'delete') {
        annotations.forEach((annot) => {
          if (unreadAnnotationIdSet.has(annot.Id)) {
            dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: annot.Id }));
          }
        });
      }
    };
    core.addEventListener('annotationChanged', annotationChangedListener, undefined, documentViewerKey);

    return () => {
      core.removeEventListener('annotationChanged', annotationChangedListener, documentViewerKey);
    };
  }, [unreadAnnotationIdSet]);

  useEffect(() => {
    const prevHeight = containerHeightRef.current;
    const currHeight = containerRef.current.getBoundingClientRect().height;
    containerHeightRef.current = currHeight;

    if (prevHeight && Math.round(prevHeight) !== Math.round(currHeight)) {
      resize();
    }
  });

  const hasUnreadReplies = unreadReplyIdSet.size > 0;

  const noteClass = classNames({
    Note: true,
    expanded: isSelected,
    'is-multi-selected': isMultiSelected,
    unread: unreadAnnotationIdSet.has(annotation.Id) || hasUnreadReplies,
    'disabled': isOfficeEditorMode && officeEditorEditMode === OfficeEditorEditMode.PREVIEW,
  });

  const repliesClass = classNames({
    replies: true,
    hidden: !isSelected,
  });

  // Updated className to include swgStatus classes
  const combinedClassName = noteClass + " " + swgStatusOpen + " " + swgStatusWorked + " " + swgStatusDone;

  return (
    <div
      ref={containerRef}
      className={combinedClassName}  // Apply the combined class name
      id={`note_${annotation.Id}`}
    >
      <Button
        className='note-button'
        onClick={(e) => handleNoteClick(e)}
        ariaLabelledby={`note_${annotation.Id}`}
        ariaCurrent={isSelected}
        dataElement="expandNoteButton"
      />
      <NoteContent
        noteIndex={0}
        annotation={annotation}
        setIsEditing={setIsEditing}
        isEditing={isEditingMap[0]}
        isNonReplyNoteRead={!unreadAnnotationIdSet.has(annotation.Id)}
        isUnread={unreadAnnotationIdSet.has(annotation.Id) || hasUnreadReplies}
        handleMultiSelect={(e) => {
          setCurAnnotId(annotation.Id);
          handleMultiSelect(e);
        }}
        isMultiSelected={isMultiSelected}
        isMultiSelectMode={isMultiSelectMode}
      />
      {(isSelected || isExpandedFromSearch || shouldExpandCommentThread) && !isTrackedChange && (
        <>
          {replies.length > 0 && (
            <div className={repliesClass}>
              {hasUnreadReplies && (
                <Button
                  dataElement="markAllReadButton"
                  className="mark-all-read-button"
                  label={t('action.markAllRead')}
                  onClick={markAllRepliesRead}
                />
              )}
              {replies.map((reply, i) => (
                <div className="reply" id={`note_reply_${reply.Id}`} key={`note_reply_${reply.Id}`}>
                  <NoteContent
                    noteIndex={i + 1}
                    key={reply.Id}
                    annotation={reply}
                    setIsEditing={setIsEditing}
                    isEditing={isEditingMap[i + 1]}
                    onReplyClicked={handleReplyClicked}
                    isUnread={unreadAnnotationIdSet.has(reply.Id)}
                    handleMultiSelect={handleMultiSelect}
                    isMultiSelected={isMultiSelected}
                    isMultiSelectMode={isMultiSelectMode}
                  />
                </div>
              ))}
            </div>
          )}
          {isGroup &&
            <NoteGroupSection
              groupAnnotations={groupAnnotations}
              isMultiSelectMode={isMultiSelectMode}
            />}
          {showReplyArea && !isMultiSelectMode && (
            <ReplyArea
              isUnread={lastReplyId && unreadAnnotationIdSet.has(lastReplyId)}
              onPendingReplyChange={markAllRepliesRead}
              annotation={annotation}
            />
          )}
        </>
      )}
      {isSelected && (isInNotesPanel || isCustomPanelOpen) && !shouldHideConnectorLine && (
        <AnnotationNoteConnectorLine
          annotation={annotation}
          noteContainerRef={containerRef}
          isCustomPanelOpen={isCustomPanelOpen}
        />
      )}
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;
