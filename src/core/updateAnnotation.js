import core from 'core';

export default (annotation, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().updateAnnotation(annotation);
}