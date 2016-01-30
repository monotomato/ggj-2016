
function populateTemplate(string, object){
  let parts = string.split(' ');
  let popl = parts.map(word => {
    if(word[0] === '%'){
      let sli = word.slice(1);
      return object[sli];
    }
    else {
      return word;
    }
  });
  return popl.join(' ');
}

export {populateTemplate};
