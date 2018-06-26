module.exports = {
  link(post) {
    const { day, month, year } = this.getDateFromPost(post.meta, post.meta.createdAt);
    const nf = n => (n < 10 ? "0" : "") + n;
    return `${year}/${nf(month)}/${nf(day)}/${post.name}`;
  },
  getDateFromPost(metaArticle, lastEditedOn) {
    const createdAt = new Date(metaArticle.createdAt ? metaArticle.createdAt : lastEditedOn);
    const year = createdAt.getUTCFullYear();
    const month = createdAt.getUTCMonth() + 1;
    const day = createdAt.getUTCDate();

    return { day, month, year, createdAt, lastEditedOn };
  },
  datefmt(date) {
    const nf = n => (n < 10 ? `0${n}` : n);
    const x = new Date(date);
    const day = x.getUTCDate();
    const month = x.getUTCMonth() + 1;
    const year = x.getUTCFullYear();
    return `${nf(day)}.${nf(month)}.${year}`;
  }
};
