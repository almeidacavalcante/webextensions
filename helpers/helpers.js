//Return the element that was found
function findElementsByTagNameAndTextContent(tag, text) {
  var aTags = document.getElementsByTagName(tag);
  var searchText = text;
  var found;

  for (var i = 0; i < aTags.length; i++) {
    if (aTags[i].textContent == searchText) {
      found = aTags[i];
      break;
    }
  }

  return found;
}

//Change feature name function
function changeFeatureName(tag, name, innerHTML) {
  tagFound = findElementsByTagNameAndTextContent(tag, name);
  tagFound.innerHTML = innerHTML;
}

export function print() {
  console.log('LOGGING!!!');
}
