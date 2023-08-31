/**
 * Returns true if the percentage of matching tags between two arrays is greater than or equal to the given percentage.
 * @param {number} percentage - The minimum percentage of matching tags required for the function to return true.
 * @param {Array} aTags - The first array of tags to compare.
 * @param {Array} bTags - The second array of tags to compare.
 * @returns {boolean} - True if the percentage of matching tags is greater than or equal to the given percentage, false otherwise.
 */
const matchTagArraysByPercentage = (percentage = 50, aTags, bTags) => {
  const aTagsLength = aTags.length;
  const bTagsLength = bTags.length;
  const minLength = Math.min(aTagsLength, bTagsLength);
  const maxLength = Math.max(aTagsLength, bTagsLength);
  let matches = 0;
  for (let i = 0; i < minLength; i++) {
    if (bTags.includes(aTags[i])) {
      matches++;
    }
  }
  const matchPercentage = Math.round((matches / maxLength) * 100);
  return matchPercentage >= percentage;
};

export default matchTagArraysByPercentage;
