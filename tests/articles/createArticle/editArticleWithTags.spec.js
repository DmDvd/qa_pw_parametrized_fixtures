import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { test } from '../../_fixtures/fixtures';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tags' },
];

testParameters.forEach(({ tagsNumber, testNameEnding}) => {
  test.describe('Edit article with tags', () => {
    test.beforeEach(async ({ page, user }) => {
      await signUpUser(page, user);
    });

    test(`User is able to remove all tags from previously created article` + 
      `with ${testNameEnding}`, 
      async ({
        homePage,
        createArticlePage,
        viewArticlePage,
        editArticlePage,
        articleWithoutTags,
        logger,
    }) => {
      const article = generateNewArticleData(logger, tagsNumber);
      
      await homePage.clickNewArticleLink();

      await createArticlePage.fillTitleField(article.title);
      await createArticlePage.fillDescriptionField(article.description);
      await createArticlePage.fillTextField(article.text);
      await createArticlePage.fillTagsField(article.tags);
      await createArticlePage.clickPublishArticleButton();
      await editArticlePage.clickEditArticleButton();
      await createArticlePage.removeTags(article.tags);
      await editArticlePage.clickUpdateArticleButton();
      
      await viewArticlePage.assertArticleTagsAreNotVisible(article.tags);

    });

    test(`User is able to add tags on edit to the previously created article`
      + `with ${testNameEnding}`,
      async ({
        homePage,
        createArticlePage,
        viewArticlePage,
        editArticlePage,
        logger,
      }) => {
        const article = generateNewArticleData(logger, tagsNumber);
        await homePage.clickNewArticleLink();

        await createArticlePage.fillTitleField(article.title);
        await createArticlePage.fillDescriptionField(article.description);
        await createArticlePage.fillTextField(article.text);
        await createArticlePage.clickPublishArticleButton();
        await editArticlePage.clickEditArticleButton();
        await createArticlePage.fillTagsField(article.tags);
        await editArticlePage.clickUpdateArticleButton();

        await editArticlePage.waitForEditArticleButtonIsVisible();
        await editArticlePage.reload();

        await viewArticlePage.assertArticleTagsAreVisible(article.tags);
      });
  });
});
