module.exports = class {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];

    excludedFields.forEach((el) => delete queryObject[el]);
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(lt|gt|lte|gte)\b/g,
      (match) => `$${match}`
    );
    // filter by minimum experience
    if (queryObject.minExperience) {
      queryObject.experience = { $gte: Number(queryObject.minExperience) };
      delete queryObject.minExperience;
      queryString = JSON.stringify(queryObject);
    }

    // filter by city
    if (queryObject.city) {
      queryString = queryString.replace('city', 'workAddres.city');
    }

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }
  paginate() {
    if (this.queryString.page) {
      const limit = +this.queryString.limit;
      const page = +this.queryString.page;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }
};
