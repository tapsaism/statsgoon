
const parseDate = (date) => {
    let str = String(date)
    let y = str.substr(0,4),
        m = str.substr(4,2),
        d = str.substr(6,2);
    return new Date(y,m,d);
}

const dynamicSort = (property) => {
    let sortOrder = 1;
    if(property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a,b) => {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

module.exports = {
  parseDate: parseDate,
  dynamicSort: dynamicSort
}
