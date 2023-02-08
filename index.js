import { parse } from "csv-parse/sync";
import { promises as fs } from "fs"; // 'fs/promises' not available in node 12
import { error, printLog, results, log_reset } from "./log.js";
import { checkColumns, checkDepartments, uniqueness } from "./validator.js";

const start = async (upload) => {
  log_reset();
  const content = await fs.readFile(upload);
  const records = await parse(content, { columns: true });
  if (records[0]["EMPLOYEE_ID"] != null && records[0]["EMAIL"] != null) {
    if (!uniqueness(records, "EMPLOYEE_ID")) {
      error("Duplicate or missing values for EMPLOYEE_ID");
    }
    uniqueness(records, "EMAIL");
  } else if (records[0]["EMAIL"] != null) {
    if (!uniqueness(records, "EMAIL")) {
      error("Duplicate or missing values for EMAIL column");
    }
  } else {
    error("No column for uniqueness found, expecting EMPLOYEE_ID or EMAIL");
  }
  checkDepartments(records);
  checkColumns(records);
  //printLog();
  return results();
};

export {start};