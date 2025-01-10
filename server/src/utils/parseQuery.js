const parseQuery = query => {
  const parsedQuery = {};
  for (const key in query) {
    if (Object.hasOwnProperty.call(query, key)) {
      const value = query[key];
      if (value === 'true') {
        parsedQuery[key] = true;
      } else if (value === 'false') {
        parsedQuery[key] = false;
      } else if (!isNaN(value) && value.trim() !== '') {
        parsedQuery[key] = Number(value);
      } else {
        parsedQuery[key] = value;
      }
    }
  }
  return parsedQuery;
};

module.exports = parseQuery;
