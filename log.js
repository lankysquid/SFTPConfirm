const BRIGHT = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const MAGENTA = "\x1b[35m";
const RESET = "\x1b[0m";

let errors, infos, warnings, successes, missing_records, custom_columns;

const log_reset = async () => {
   errors = [];
   infos = [];
   warnings = [];
   successes = [];
   missing_records = [];
   custom_columns = [];
}

const error = async (message) => {
  errors.push(message);
};

const info = async (message) => {
  infos.push(message);
};

const warning = async (message) => {
  warnings.push(message);
};

const success = async (message) => {
  successes.push(message);
};

const missingRecords = async (message) => {
  missing_records.push(message);
};

const customColumn = async (message) => {
  custom_columns.push(message);
}

const results = () => {
  let results = "";
  if (errors.length > 0) {
    results += "<h2>This file CANNOT BE PROCESSED</h2><p>See errors for more information</p>";
  }
  results +=("<h3>Finishied Alayzing with:</h3><ul>");
  if (successes.length > 0) {
    results += "<li>" +
      successes.length +
        " Success" +
        (successes.length > 1 ? "es" : "")
    ;
  }
  if (missing_records.length > 0) {
    results += "<li>" +
      missing_records.length +
        " Column" +
        (missing_records.length > 1 ? "s" : "") +
        " with missing data"
    ;
  }
  if (custom_columns.length > 0) { 
    results += "<li>" +
      custom_columns.length +
      " Custom Column" + (custom_columns.length > 1 ? "s" : "")
    ;
  }
  if (warnings.length > 0) {
    results += "<li>" +
      warnings.length +
        " Warning" +
        (warnings.length > 1 ? "s" : "")
    ;
  } else {
    results += "<li>" +
      "0 Warnings"
  }
  if (errors.length > 0) {
    results +="<li>"
        errors.length +
        " Error" +
        (errors.length > 1 ? "s" : "")
    ;
  } else {
    results += "<li>" +
      "0 Errors"
  }
  results += "</ul>"
  if (errors.length > 0) {
    results += "<h2>Errors</h2><ul><li>";
    results += errors.join("</li><li>");
    results += "</ul>"
  }
  if (warnings.length > 0) {
    results += "<h3>Warnings</h3><ul><li>";
    results += warnings.join("</li><li>");
    results += "</ul>"
  }
  if (custom_columns.length > 0) {
    results += "<h3>Custom Columns</h3><ul><li>"
    results += custom_columns.join("</li><li>");
    results += "</ul>"
  }
  if (successes.length > 0) {
    results += "<h3>Successes</h3><ul><li>";
    results += successes.join("</li><li>");
    results += "</ul>"
  }
  if (missing_records.length > 0) {
    results += "<h3>Missing Records</h3><ul><li>";
    results += missing_records.join("</li><li>");
    results += "</ul>"
  }
  if (infos.length > 0) {
    results += "<h3>Information</h3><ul><li>";
    results += infos.join("</li><li>");
    results += "</ul>"
  }
  return results;
}


const printLog = () => {
  successes.forEach((s) => console.log(s));
  infos.forEach((i) => console.log(i));
  custom_columns.forEach((c) => console.log(c));
  missing_records.forEach((m) => console.log(m));
  warnings.forEach((w) => console.error(w));
  errors.forEach((e) => console.error(e));

  if (errors.length > 0) {
    console.log(
      RED +
        BRIGHT +
        "\n\n===\nThis file CANNOT BE PROCESSED, see errors for more information\n===" +
        RESET
    );
  }

  console.log("Finishied Alayzing with:");
  if (successes.length > 0) {
    console.log(
      successes.length +
        GREEN +
        " SUCCESS" +
        (successes.length > 1 ? "ES" : "") +
        RESET
    );
  }
  if (missing_records.length > 0) {
    console.log(
      missing_records.length +
        " Column" +
        (missing_records.length > 1 ? "s" : "") +
        " with missing data"
    );
  }
  if (custom_columns.length > 0) { 
    console.log(custom_columns.length +
      " Custom Column" + (custom_columns.length > 1 ? "s" : "")
    );
  }
  if (warnings.length > 0) {
    console.log(
      warnings.length +
        YELLOW +
        " WARNING" +
        (warnings.length > 1 ? "S" : "") +
        RESET
    );
  }
  if (errors.length > 0) {
    console.log(
      RED +
        BRIGHT +
        errors.length +
        " ERROR" +
        (errors.length > 1 ? "S" : "") +
        RESET
    );
  }
};

export { error, info, warning, success, missingRecords, printLog, customColumn, results, log_reset };
