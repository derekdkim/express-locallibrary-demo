var mongoose = require('mongoose');
const { DateTime } = require('luxon');

var Schema = mongoose.Schema;

const formatDate = (date) => {
  if (!date) {
    return '';
  }

  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
}

var AuthorSchema = new Schema (
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for the author's full name
AuthorSchema
  .virtual('name')
  .get(function() {
    return this.family_name + ', ' + this.first_name;
  });

// Virtual for the author's lifespan
AuthorSchema
  .virtual('lifespan')
  .get(function() {
    return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
  });

AuthorSchema
  .virtual('life_timeline')
  .get(function () {
    return this.date_of_birth
      ? `${formatDate(this.date_of_birth)} - ${formatDate(this.date_of_death)}`
      : '';
  });

// Virtual for author's URL
AuthorSchema
  .virtual('url')
  .get(function() {
    return '/catalog/author/' + this._id;
  });

// Export model
module.exports = mongoose.model('Author', AuthorSchema);