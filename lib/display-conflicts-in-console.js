const displayFolderFileConflicts = (compared, dir1, dir2, compareOptions) => {
    console.log(`##########`);
    console.log(`listing files found in ${dir1} but not in ${dir2}`);
    console.log(`comparing by ${Object.keys(compareOptions).filter(key => compareOptions[key]).join(', ')}`);
    console.log(`##########`);
    console.log(compared.isNotInTargetFolder.map(file => file.absolutePath).join('\n'));
}
export default displayFolderFileConflicts;