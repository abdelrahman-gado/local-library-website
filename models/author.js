const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have a first name or a family name
  // We will handle these cases by returning an empty string
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.first_name + ", " + this.family_name;
  }

  if (!this.first_name || !this.family_name) {
    fullname = "";
  }

  return fullname;
});

// Virtual for author lifespan
AuthorSchema.virtual("lifespan").get(function () {
  let lifetime_string = "";
  if (this.date_of_birth) {
    lifetime_string = this.date_of_birth.getYear().toString();
  }

  lifetime_string += " - ";

  if (this.date_of_death) {
    lifetime_string += this.date_of_death.getYear();
  }

  return lifetime_string;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Virtual for formatted date_of_birth
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return (this.date_of_birth)
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

// Virtual for formatted date_of_death
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return (this.date_of_death)
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : '';
});

// Export Model
module.exports = mongoose.model("Author", AuthorSchema);
