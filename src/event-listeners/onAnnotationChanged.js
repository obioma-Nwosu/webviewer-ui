import getHashParameters from 'helpers/getHashParameters';
import core from 'core';


export default (documentViewerKey) => (annotations, action, info) => {
  if (action === 'delete') {
    deleteReplies(annotations, documentViewerKey, info);
  }

  const selectAnnotationOnCreation = getHashParameters('selectAnnotationOnCreation', false);
  if (selectAnnotationOnCreation) {
    if (action === 'add' && !info.imported) {
      if (annotations.length > 0 && !annotations[0].InReplyTo) {
        core.selectAnnotation(annotations[0], documentViewerKey);
      }
    }
  }
};

const deleteReplies = (annotations, documentViewerKey, info) => {
  annotations.forEach((annotation) => {
    core.getAnnotationManager(documentViewerKey).trigger('notificationChanged', [annotation.getReplies()], "notification-delete-replies", {});
    //core.deleteAnnotations(annotation.getReplies(), { 'imported': false, 'force': true, 'isUndoRedo': info?.isUndoRedo }, documentViewerKey);
  });
};
