import getRootNode from 'helpers/getRootNode';

export default (element, overlay, isTabletAndMobile, selector = 'data-element') => {
  const isApryseWebViewerWebComponent = window.isApryseWebViewerWebComponent;
  const innerWidth = isApryseWebViewerWebComponent ? getRootNode().host.clientWidth : window.innerWidth;
  const innerHeight = isApryseWebViewerWebComponent ? getRootNode().host.clientHeight : window.innerHeight;
  const button = getRootNode().querySelector(`[${selector}="${element}"]`);

  let left = 0;
  let right = 'auto';

  // by default the button is visible in the header
  // but it can be removed from the DOM by calling viewerInstance.disableElement(...);
  // in this case we are not able to position the overlay correctly so we just "hide" the overlay
  if (!button || !overlay.current) {
    return { left: -9999, right };
  }

  const {
    bottom: buttonBottom,
    left: buttonLeft,
  } = button.getBoundingClientRect();
  const rootLeft = isApryseWebViewerWebComponent ? getRootNode().host.getBoundingClientRect().left : 0;
  const rootTop = isApryseWebViewerWebComponent ? getRootNode().host.getBoundingClientRect().top : 0;
  const relativeButtonBottom = buttonBottom - rootTop;
  const relativeButtonLeft = buttonLeft - rootLeft;

  const { width: overlayWidth, height: overlayHeight } = overlay.current.getBoundingClientRect();
  if (relativeButtonLeft + overlayWidth > innerWidth) {
    const rightMargin = 6;
    left = innerWidth - rightMargin - overlayWidth;
    right = 'auto';
  } else {
    left = relativeButtonLeft;
    right = 'auto';
  }

  const verticalGap = isTabletAndMobile ? 14 : 6;
  let top = relativeButtonBottom + verticalGap;
  if (relativeButtonBottom > 100) {
    // if the buttons are not on the top of the page, the popup can adjust its position to "pass" them, otherwise the popup should always be below them
    if (relativeButtonBottom + overlayHeight > innerHeight) {
      const calculatedTop = innerHeight - overlayHeight - verticalGap;
      top = calculatedTop > 0 ? calculatedTop : 0;
    }
  }

  return {
    left: !isNaN(left) ? Math.max(left, 0) : left,
    right,
    top,
  };
};
