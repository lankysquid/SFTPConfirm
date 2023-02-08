import { compareTwoStrings } from "string-similarity";
import { error, info, missingRecords, success, warning, customColumn } from "./log.js";

const adminCols = [
  "IS ADMIN",
  "IS_ADMIN",
  "IS SUPER ADMIN",
  "IS_SUPER_ADMIN",
];
const stdCols = [
  "CHANGE_TYPE",
  "EMPLOYEE_ID",
  "EMAIL",
  "FIRST_NAME",
  "LAST_NAME",
  "PHONE_OFFICE",
  "PHONE_CELL",
  "PHONE_FAX",
  "ADDRESS_LINE_1",
  "ADDRESS_LINE_2",
  "CITY",
  "STATE",
  "ZIPCODE",
  "COUNTRY",
  "DEPARTMENT",
  "REGION",
  "APPROVAL_REQUIRED",
  "APPROVING_MANAGER",
  "APPROVING_MANAGER_EMAIL",
  "IS_ADMIN",
  "IS_SUPER_ADMIN",
  "COMPANY_NAME",
];

const COL_FORMAT = (col) => {
  return col?.replaceAll("_", " ").toLowerCase();
};
const uniqueness = (records, col) => {
  const repeatSet = new Set();
  const uniqueSet = new Set();

  records.forEach((r) => {
    uniqueSet.has(r[col]) ? repeatSet.add(r[col]) : uniqueSet.add(r[col]);
  });
  if (repeatSet.size > 0) {
    warning(
      "The following " +
        COL_FORMAT(col) +
        "(s) appear at least twice in the file: <ul><li>" +
        [...repeatSet].join("<li>") +
        "</ul>"
    );
  }
  if (repeatSet.size == 0 && uniqueSet.size === records.length) {
    success(col + " column can be used for uniqueness");
    return true;
  } else {
    info(
      uniqueSet.size +
        " unique " +
        COL_FORMAT(col) +
        "s found for " +
        records.length +
        " total records"
    );
    return false;
  }
};

const checkColumns = async (records) => {
  let reqCols = ["CHANGE_TYPE", "EMAIL", "FIRST_NAME", "LAST_NAME"];
  Object.keys(records[0]).forEach((col) => {
    if (adminCols.includes(col)) {
      checkAdminStatus(records, col);
    } else if (col === "CHANGE_TYPE") {
      checkChangeType(records, col);
    } else {
      checkColumnName(col);
      checkColumnData(records, col, reqCols.includes(col));
    }
    reqCols = reqCols.filter((e) => e !== col);
  });
  if (reqCols.length > 0) {
    error("The following required columns are missing " + reqCols);
  }
};

const checkColumnName = async (col) => {
  if (String(col).includes(" ")) {
    error(
      col +
        " column name contains a space. Should be " +
        String(col).replace(" ", "_")
    );
  }
  var customCol = false;
  if (!stdCols.includes(col)) {
    customCol = true;
    stdCols.forEach((c) => {
      if (compareTwoStrings(c, col) > 0.8 && compareTwoStrings(c, col) != 1) {
        warning(col + " found, did you mean " + c + "?");
        customCol = false;
      }
    });
  }
  if (customCol) {
    customColumn(col);
  }
};

const checkColumnData = async (records, col, reqCol) => {
  var count = 0;
  records.forEach((r) => {
    if (r[col] != "") {
      count += 1;
    }
  });

  if (count < records.length) {
    missingRecords(
      col + " column is missing " + (records.length - count) + " records"
    );
  } else if (reqCol) {
    success("Full records for " + COL_FORMAT(col) + "s.");
  }
};

const checkAdminStatus = async (records, col) => {
  const admins = records.filter((r) => r === 1);
  if (admins.length > 0) {
    success(admins.length + " " + col + " have been set");
  } else {
    error(
      col +
        " column is present but no values set to 1. Recommend removing column"
    );
  }
};

const checkChangeType = async (records, col) => {
  const allowedChanges = { U: 0, A: 0, D: 0 };
  records.forEach((r) => {
    allowedChanges[r[col]] += 1;
  });
  var sum = Object.keys(allowedChanges).forEach(
    (s) => (sum += allowedChanges[s])
  );
  if (sum < records.length) {
    error(
      sum + " changes recorded, but " + records.length + " records in the file"
    );
  } else {
    success(
      records.length +
        " records for " +
        COL_FORMAT(col) +
        " of " +
        Object.keys(allowedChanges)
    );
  }
  Object.keys(allowedChanges).forEach((c) => {
    if (allowedChanges[c] > 0) {
      info(
        allowedChanges[c] +
          " changes of type " +
          c +
          " for " +
          records.length +
          " records"
      );
    }
  });
};

const checkDepartments = async (records) => {
  const col = "DEPARTMENT";
  if (records[0][col] == null) {
    info("No " + col + " column present");
  }
  const deptSet = new Set();
  records.forEach((r) => {
    deptSet.add(r[col]);
  });
  info(
    deptSet.size +
      " unique " +
      COL_FORMAT(col) + (deptSet.size > 1 ? "s" : "")
      +" present: <ul><li>" +
      [...deptSet].join("<li>") +
      "</ul>"
  );
};

export {
  checkColumns,
  checkColumnData,
  uniqueness,
  checkDepartments,
  error as ERROR,
};
