function getTransitionEndName(dom) {
  const cssTransition = ["transition", "webkitTransition"];
  const transitionEnd = {
    "transition": "transitionend",
    "webkitTransition": "webkitTransitionEnd"
  };
  for (let i = 0; i < cssTransition.length; i++) {
    if (dom.style[cssTransition[i]] !== undefined) {
      return transitionEnd[cssTransition[i]];
    }
  }
  return undefined;
}

export { getTransitionEndName }