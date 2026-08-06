const paginate = (page, limit) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

const buildPaginationMeta = (total, pageNum, limitNum) => ({
  page: pageNum,
  limit: limitNum,
  total,
  pages: Math.ceil(total / limitNum),
});

module.exports = { paginate, buildPaginationMeta };
