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

export {populateTemplate};
