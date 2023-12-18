import columnify from "columnify";

const displaySimpleList = function ({ isInDir2, isNotInDir2 }, format=text) {
 if (format === "json") {
    console.log(JSON.stringify({ files: isNotInDir2 }, null, 2));
    return;
  }
  else {
  console.log("Files not in dir2 but in dir1:");
  console.log(
    isNotInDir2.map((item) => {
      return item.absolutePath;
    }).join("\n")
  );
  }
};
export default  displaySimpleList;
