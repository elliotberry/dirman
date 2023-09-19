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
