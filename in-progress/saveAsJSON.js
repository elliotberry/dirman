const saveAsJSON = (compared) => {
  fs.writeFileSync('compared.json', JSON.stringify(compared, null, 2));
};
export default saveAsJSON;