window.WebFontConfig = {
  google: {
      families: ['Indie Flower', 'Arvo:700italic', 'Podkova:700']
  },

  active: function() {
      // do something
      init();
  }
};

function populateTemplate(string, object){
  let parts = string.split(' ');
  let popl = parts.map(word => {
    if(word[0] === '%'){
      let li = word.lastIndexOf('%');
      let sli = word.slice(1, li);
      return word.replace(/%.*%/, object[sli]);
    }
    else {
      return word;
    }
  });
  return popl.join(' ');
}

function testWhite(x) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

function wordWrap(str, maxWidth) {
  let newLineStr = '\n'; let done = false; let res = '';
  do {
    let found = false;
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

    if (str.length < maxWidth)
      done = true;
  } while (!done);

  return res + str;
}

export {populateTemplate, wordWrap};
