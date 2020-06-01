module.exports = (reqPage, reqPerPage, filtered) => {
  var page = parseInt(reqPage) || 1;
    var perPage = parseInt(reqPerPage) || 10;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  var maxPage = Math.ceil(filtered.length/perPage);

  filtered = filtered.slice(start, end);

  var pagination = {};
  pagination.page = page;
  pagination.total = maxPage;
  if (page < maxPage) pagination.next = page + 1;
  if (page > 1) pagination.prev = page - 1;
  
  return { pagination, filtered };
}