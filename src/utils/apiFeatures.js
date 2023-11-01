class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  Find() {
    const filter = (requestQuery) => {
      const returnedObj = {};
      const excludedFields = ['page', 'sort', 'fields', 'keyword'];
      for (const field in requestQuery) {
        if (!excludedFields.includes(field)) {
          returnedObj[field] = requestQuery[field];
        }
      }
      return returnedObj;
    };

    let queryObj = filter(this.queryString);
    // filtering with dollar sign

    queryObj = JSON.stringify(queryObj).replace(
      /\b(gt|lt|gte|lte)\b/g,
      (matched) => `$${matched}`
    );
    queryObj = JSON.parse(queryObj);

    // query itself
    this.query = this.query.find(queryObj);
    return this;
  }

  filter() {
    const filter = (requestQuery) => {
      const returnedObj = {};
      const excludedFields = ['page', 'sort', 'fields', 'keyword'];
      for (const field in requestQuery) {
        if (!excludedFields.includes(field)) {
          returnedObj[field] = requestQuery[field];
        }
      }
      return returnedObj;
    };

    let queryObj = filter(this.queryString);
    // 1B) ADVANCED FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gte|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      console.log(this.queryString);
      this.query = this.query.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { name: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },]
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export default APIFeatures;
