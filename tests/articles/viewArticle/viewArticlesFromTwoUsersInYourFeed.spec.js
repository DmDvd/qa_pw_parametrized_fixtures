import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage'; 
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({ contextsNumber: 3, usersNumber: 3 });

let secondArticle;

test.beforeEach(async ({ pages, users, articleWithoutTags, logger }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await signUpUser(pages[2], users[2], 3);
  secondArticle = generateNewArticleData(logger);
  await createArticle(pages[0], articleWithoutTags, 1);
  await createArticle(pages[1], secondArticle, 2);
});

test('User can see in your feeds articles from two different users', async ({
  articleWithoutTags,
  pages,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[2], 3);
  const homePage = new HomePage(pages[2], 3);

  await viewArticlePage.open(articleWithoutTags.url);
  await viewArticlePage.clickFollowAuthorButton();

  await viewArticlePage.open(secondArticle.url);
  await viewArticlePage.clickFollowAuthorButton();

  await expect(async () => {
    await homePage.open();
    await homePage.clickYourFeedTab();
    await homePage.assertArticleIsVisibleInFeed(articleWithoutTags.title);
    await homePage.assertArticleIsVisibleInFeed(secondArticle.title);
  }).toPass({ timeout: 30000 });
});
