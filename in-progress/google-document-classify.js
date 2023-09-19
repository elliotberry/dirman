// Imports the Google Cloud client library
import language from "@google-cloud/language";
const main = async () => {
// Creates a client
const client = new language.LanguageServiceClient();

/**
 * TODO(developer): Uncomment the following line to run this code.
 */
const text = 'Your text to analyze, e.g. Hello, world!';

// Prepares a document, representing the provided text
const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

const classificationModelOptions = {
  v2Model: {
    contentCategoriesVersion: 'V2',
  },
};

// Classifies text in the document
const [classification] = await client.classifyText({
  document,
  classificationModelOptions,
});
console.log('Categories:');
classification.categories.forEach(category => {
  console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
});
};

main().catch(console.error);